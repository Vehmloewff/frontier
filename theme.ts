import { presetAutoprefix, presetTailwind, twind } from './deps.ts'

export type Color = [number, number, number]
export type SelectionMode = 'opt-out' | 'opt-in'

export interface DynamicTheme {
	/** The color palette to use when browser is the preferred color scheme is light */
	lightPalette: Palette

	/** The color palette to use when browser is the preferred color scheme is dark */
	darkPalette: Palette

	/** Other theme options that can be configured */
	options?: ThemeOptions
}

export interface ThemeOptions {
	/** If `true`, the body will be transparent, and root will be slightly rounded */
	roundBase?: boolean

	/** How text selection is to be handled */
	selectionMode?: SelectionMode

	/** If `true`, the body with fit it's content and scroll in the window if it is too large */
	windowScrolling?: boolean
}

export interface Theme {
	/** The color palette to use when browser is the preferred color scheme is light */
	palette: Palette

	/** Other theme options that can be configured */
	options?: ThemeOptions
}

export interface Palette {
	fore: Color
	base: Color
	decorationFore: Color
	primary: Color
	secondary: Color
	danger: Color
	warn: Color
	success: Color
	notice: Color
}

export function setupDynamicTheme(theme: DynamicTheme) {
	const schema = globalThis.window.matchMedia('(prefers-color-scheme: dark)')

	setupTheme({ palette: schema.matches ? theme.darkPalette : theme.lightPalette, options: theme.options })

	schema.onchange = (event) => {
		setupTheme({ palette: event.matches ? theme.darkPalette : theme.lightPalette, options: theme.options })
	}
}

export function setupTheme(theme: Theme): void {
	const colors = makeColors(theme.palette)
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

	const pinBodyStyles = `
		html,
		body,
		#root {
			height: 100%;
			overflow: hidden;
		}
	`

	const rootStyle = getStyleElement()
	rootStyle.textContent = `
		html, body { background-color: rgb(${theme.palette.base[0]}, ${theme.palette.base[1]}, ${theme.palette.base[2]}) }

		${options.roundBase ? roundBaseStyles : ''}
		${options.selectionMode === 'opt-in' ? selectModeOptInStyles : ''}

		${options.windowScrolling ? '' : pinBodyStyles}

		#root {
			color: rgb(${theme.palette.fore[0]}, ${theme.palette.fore[1]}, ${theme.palette.fore[2]});
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

function makeColors(palette: Palette) {
	return {
		transparent: 'transparent',
		base: makeVariants(...palette.base),
		fore: makeVariants(...palette.fore),
		'decoration-fore': makeVariants(...palette.fore),
		primary: makeVariants(...palette.primary),
		secondary: makeVariants(...palette.secondary),
		danger: makeVariants(...palette.danger),
		warn: makeVariants(...palette.warn),
		success: makeVariants(...palette.success),
		notice: makeVariants(...palette.notice),
	}
}

function makeSpacing() {
	const spacing: Record<string, string> = {
		full: '100%',
	}

	for (let i = 0; i <= 10000; i++) spacing[`${i}`] = `${i / 16}rem`

	return spacing
}
