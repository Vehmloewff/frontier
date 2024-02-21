import { denoCache } from './deps.ts'
import { dtils, emit } from './deps.ts'

export interface Bundle {
	/** The generated JS code */
	code: string
	/** The generated source map */
	map: string
	/** A list of all the local files that were resolve from `entry` */
	localFiles: string[]
}

/** Bundle `entryUrl` into a single file with a corresponding sourcemap. Additionally, returns all the local files that were resolved from `entry` */
export async function bundle(entry: URL): Promise<Bundle> {
	const config = new dtils.SafeUnknown(await dtils.readJson('deno.jsonc'))
	const localFiles: string[] = []

	const unknownJsxFactory = config.asObject().get('compilerOptions', 'jsxFactory')
	const jsxFactory = unknownJsxFactory.isNull() ? 'React.createElement' : unknownJsxFactory.asString()

	const unknownJsxFragmentFactory = config.asObject().get('compilerOptions', 'jsxFragmentFactory')
	const jsxFragmentFactory = unknownJsxFragmentFactory.isNull() ? 'React.Fragment' : unknownJsxFactory.asString()

	const result = await emit.bundle(entry, {
		importMap: config.data as emit.ImportMap,
		compilerOptions: {
			jsxFactory,
			jsxFragmentFactory,
			sourceMap: true,
		},
		async load(specifier) {
			const cache = denoCache.createCache({ allowRemote: true })
			const url = new URL(specifier)

			if (url.protocol === 'file:') {
				localFiles.push(url.pathname)
			}

			return await cache.load(specifier)
		},
	})

	return { code: result.code, map: result.map!, localFiles }
}
