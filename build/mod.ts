import { dtils } from './deps.ts'
import { startPreviewServer } from './server.ts'

export async function dev(): Promise<void> {
	await startPreviewServer({
		entry: new URL('../main.tsx', import.meta.url),
		reload: true,
		async template(jsHead) {
			const html = await dtils.readText('devops/index.html')

			return html.replace('{head}', jsHead)
		},
	})
}
