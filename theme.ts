import { presetAutoprefix, presetTailwind, twind } from './deps.ts'

export type Color = [number, number, number]

export interface ThemeOptions {
	/** The color pallette to use */
	pallette: Pallette

	/** If `true`, the react root will be slightly rounded and the body will be transparent */
	desktop?: boolean
}
export interface Pallette {
	light: Color
	dark: Color
	primary: Color
	secondary: Color
	danger: Color
	success: Color
}

export function setupTheme(options: ThemeOptions): void {
	const colors = makeColors(options.pallette)
	const spacing = makeSpacing()

	twind.install(twind.defineConfig({
		presets: [presetAutoprefix(), presetTailwind()],
		darkMode: 'media',
		theme: {
			colors: colors,
			spacing: spacing,
			fontFamily: {
				sans: ['Source Sans Pro', 'sans-serif'],
				fancy: ['Josefin Sans', 'sans-serif'],
			},
			borderWidth: spacing,
			gap: spacing, // Fix for twind issue that has become apparent
		},
	}))

	twind.injectGlobal`
		html, body { background-color: transparent }

		html,
		body,
		#root {
			height: 100%;
		}
		* {
			user-select: none;
			-webkit-user-select: none;
		}
		input {
			background: transparent;
			-webkit-user-select: auto;
		}
	`

	const reactRoot = document.getElementById('root')
	if (!reactRoot) throw new Error('Expected to find a #root element')

	reactRoot.classList.add('bg-light', 'dark:bg-dark', 'text-dark', 'dark:text-light')
	if (options.desktop) reactRoot.classList.add('border-1', 'border-light-10', 'rounded-lg')
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
		light: makeVariants(...pallette.light),
		dark: makeVariants(...pallette.dark),
		primary: makeVariants(...pallette.primary),
		secondary: makeVariants(...pallette.secondary),
		danger: makeVariants(...pallette.danger),
		success: makeVariants(...pallette.success),
	}
}

function makeSpacing() {
	const spacing: Record<string, string> = {
		full: '100%',
	}

	for (let i = 0; i <= 10000; i++) spacing[`${i}`] = `${i / 16}rem`

	return spacing
}
