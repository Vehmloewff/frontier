import { presetAutoprefix, presetTailwind, twind } from './deps.ts'

export type Color = [number, number, number]

export interface Pallette {
	light: Color
	dark: Color
	primary: Color
	secondary: Color
	danger: Color
	success: Color
}

export function setupTheme(pallette: Pallette): void {
	const colors = makeColors(pallette)
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

	document.body.classList.add('bg-light', 'dark:bg-dark', 'text-dark', 'dark:text-light')
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
