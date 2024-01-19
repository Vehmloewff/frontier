import { presetAutoprefix, presetTailwind, twind } from './deps.ts'

export function setupTheme(): void {
	const colors = makeColors()
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
}

function makeVariants(red: number, green: number, blue: number) {
	const variants: Record<string, string> = {
		DEFAULT: `rgb(${red}, ${green}, ${blue})`,
	}

	for (let i = 1; i <= 100; i++) variants[`${i}`] = `rgba(${red}, ${green}, ${blue}, ${i / 100})`

	return variants
}

function makeColors() {
	return {
		transparent: 'transparent',
		light: makeVariants(255, 255, 255),
		dark: makeVariants(22, 22, 24),
		secondary: makeVariants(245, 70, 98),
		primary: makeVariants(62, 109, 204),
		danger: makeVariants(184, 0, 0),
		success: makeVariants(44, 151, 17),
	}
}

function makeSpacing() {
	const spacing: Record<string, string> = {
		full: '100%',
	}

	for (let i = 0; i <= 10000; i++) spacing[`${i}`] = `${i / 16}rem`

	return spacing
}
