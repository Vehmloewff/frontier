import { presetAutoprefix, presetTailwind, twind } from './deps.ts'

export type Color = [number, number, number]
export type SelectionMode = 'opt-out' | 'opt-in'

export interface DynamicTheme {
	/** The color pallette to use when browser is the preferred color scheme is light */
	lightPallette: Pallette

	/** The color pallette to use when browser is the preferred color scheme is dark */
	darkPallette: Pallette

	/** Other theme options that can be configured */
	options?: ThemeOptions
}

export interface ThemeOptions {
	/** If `true`, the body will be transparent, and root will be slightly rounded */
	roundBase?: boolean

	/** How text selection is to be handled */
	selectionMode?: SelectionMode
}

export interface Theme {
	/** The color pallette to use when browser is the preferred color scheme is light */
	pallette: Pallette

	/** Other theme options that can be configured */
	options?: ThemeOptions
}

export interface Pallette {
	fore: Color
	base: Color
	primary: Color
	secondary: Color
	danger: Color
	warn: Color
	success: Color
	notice: Color
}

export function setupDynamicTheme(theme: DynamicTheme) {
	const schema = globalThis.window.matchMedia('(prefers-color-scheme: dark)')

	setupTheme({ pallette: schema.matches ? theme.darkPallette : theme.lightPallette, options: theme.options })

	schema.onchange = (event) => {
		setupTheme({ pallette: event.matches ? theme.darkPallette : theme.lightPallette, options: theme.options })
	}
}

export function setupTheme(theme: Theme): void {
	const colors = makeColors(theme.pallette)
	const spacing = makeSpacing()
	const options = theme.options || {}

	twind.setup(twind.defineConfig({
		presets: [presetAutoprefix(), presetTailwind()],
		darkMode: 'media',
		theme: {
			colors: colors,
			spacing: spacing,
			fontFamily: {
				sans: ['Source Sans Pro', 'sans-serif'],
				fancy: ['Josefin Sans', 'sans-serif'],
			},
			borderWidth: {
				'DEFAULT': '2px',
				'sm': '2px',
				'md': '4px',
				'lg': '6px',
			},
			gap: spacing,
			hash: false,
		},
	}))

	const roundBaseStyles = `
		html, body { background-color: transparent }

		#root {
			border: 1px solid gray;
			border-radius: 6px;
		}
	`

	const selectModeOptInStyles = `
		* {
			user-select: none;
			-webkit-user-select: none;
		}
		input {
			user-select: auto;
			-webkit-user-select: auto;
		}
	`

	const rootStyle = getStyleElement()
	rootStyle.textContent = `
		html, body { background-color: rgb(${theme.pallette.base[0]}, ${theme.pallette.base[1]}, ${theme.pallette.base[2]}) }

		${options.roundBase ? roundBaseStyles : ''}
		${options.selectionMode === 'opt-in' ? selectModeOptInStyles : ''}

		html,
		body,
		#root {
			height: 100%;
		}
		input {
			background: transparent;
		}
	`

	const reactRoot = document.getElementById('root')
	if (!reactRoot) throw new Error('Expected to find a #root element')

	reactRoot.classList.add('!block')
}

function getStyleElement() {
	const id = 'root-styles'
	const existingElement = document.getElementById(id)
	if (existingElement) return existingElement

	const newElement = document.createElement('style')
	newElement.id = id
	document.head.appendChild(newElement)

	return newElement
}

function makeVariants(red: number, green: number, blue: number) {
	const variants: Record<string, string> = {
		DEFAULT: `rgb(${red}, ${green}, ${blue})`,
	}

	for (let i = 1; i <= 100; i++) variants[`${i}`] = `rgba(${red}, ${green}, ${blue}, ${i / 100})`

	return variants
}

function makeColors(pallette: Pallette) {
	return {
		transparent: 'transparent',
		base: makeVariants(...pallette.base),
		fore: makeVariants(...pallette.fore),
		primary: makeVariants(...pallette.primary),
		secondary: makeVariants(...pallette.secondary),
		danger: makeVariants(...pallette.danger),
		warn: makeVariants(...pallette.warn),
		success: makeVariants(...pallette.success),
		notice: makeVariants(...pallette.notice),
	}
}

function makeSpacing() {
	const spacing: Record<string, string> = {
		full: '100%',
	}

	for (let i = 0; i <= 10000; i++) spacing[`${i}`] = `${i / 16}rem`

	return spacing
}
