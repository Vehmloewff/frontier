import { dtils, httpUtils } from './deps.ts'
import { log } from './log.ts'
import { bundle } from './bundle.ts'

const livereloadSnippet = `
<script>
	;(function() {
		connect()

		function connect() {
			const isSecure = location.protocol === 'https:'
			const socket = new WebSocket(\`\${isSecure ? 'wss' : 'ws'}:\${location.host}/livereload.ws\`)

			socket.onclose = () => {
				console.log('[livereload] server closed, checking status in 1 second...')

				setTimeout(() => connect(), 1000)
			}

			socket.onmessage = ({ data }) => {
				if (data === 'reload') {
					console.log('[livereload] reloading...')
					location.reload()
				} else {
					console.log('[livereload] showing error message...')

					// while (document.body.children.length) document.body.children[0].remove()

					document.body.innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px">A compile error has occurred. Waiting for changes to reload...</div>'
				}
			}
		}
	})();
</script>
`

export interface HtmlTemplateParams {
	/** The absolute path to where the JS file is served */
	jsPath: string
}

export type HtmlTemplate = (params: HtmlTemplateParams) => string

export interface StartPreviewServerParams {
	template(headTags: string): Promise<string>
	reload: boolean
	entry: URL
	signal?: AbortSignal
}

export async function startPreviewServer(params: StartPreviewServerParams): Promise<void> {
	const sockets = new Set<WebSocket>()
	let build = await bundle(params.entry)

	log('Built app successfully')

	if (params.reload) {
		const watcher = dtils.createWatcher({
			onUpdate: async () => {
				log('A file has been updated. Rebuilding app...')

				try {
					build = await bundle(params.entry)
					log('Successfully rebuilt app')

					for (const socket of sockets) {
						socket.send('reload')
					}

					log(`Reloaded ${sockets.size} active client(s)`)

					watcher.addFiles(build.localFiles)
				} catch (error) {
					log('An error occurred while building app')
					log(error.message || error)

					for (const socket of sockets) {
						socket.send('error')
					}

					log(`Notified ${sockets.size} active client(s) of this error`)
				}
			},
			signal: params.signal,
		})

		watcher.addFiles(build.localFiles)
	}

	const handler = async (request: Request): Promise<Response> => {
		const jsHead = `<script src="/bundle.js" defer></script>`
		const headTags = params.reload ? `${jsHead}\n${livereloadSnippet}` : jsHead
		const url = new URL(request.url)

		if (params.reload && url.pathname === '/livereload.ws') {
			const { socket, response } = Deno.upgradeWebSocket(request)

			sockets.add(socket)

			socket.onclose = () => sockets.delete(socket)

			return response
		}

		if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 })

		if (url.pathname === '/') {
			return new Response(await params.template(headTags), {
				headers: { 'Content-Type': 'text/html' },
			})
		}

		if (url.pathname === '/bundle.js') {
			return new Response(build.code, {
				headers: { 'Content-Type': 'application/js', 'SourceMap': '/bundle.js.map' },
			})
		}

		if (url.pathname === '/bundle.js.map') {
			return new Response(build.map, { headers: { 'Content-Type': 'application/json' } })
		}

		return await httpUtils.serveDir(request, { quiet: true, fsRoot: 'public' })
	}

	await Deno.serve({
		port: 3000,
		onError(error) {
			console.error(error)
			return new Response('Internal server error')
		},
		signal: params.signal,
		onListen({ port }) {
			log(`Listening at http://localhost:${port}`)
		},
	}, handler).finished

	// Close all of the sockets
	for (const socket of sockets) {
		socket.close()
	}

	log('aborted')
}
