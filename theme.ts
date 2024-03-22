import { presetAutoprefix, presetTailwind, twind } from './deps.ts'

export type Color = [number, number, number]

export interface ThemeOptions {
	/** The color pallette to use */
	pallette: Pallette

	/** If `true`, the body will be transparent, and root will be slightly rounded */
	roundBase?: boolean
}

export interface Pallette {
	light: Color
	dark: Color
	primary: Color
	secondary: Color
	danger: Color
	warn: Color
	success: Color
	notice: Color
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
			gap: spacing,
			hash: false,
		},
	}))

	const backgroundColor = `
		html, body { background-color: rgb(${options.pallette.light[0]}, ${options.pallette.light[1]}, ${options.pallette.light[2]}) }

		@media (prefers-color-scheme: dark) {
			html, body { background-color: rgb(${options.pallette.dark[0]}, ${options.pallette.dark[1]}, ${options.pallette.dark[2]}) }
		}
	`

	const backgroundTransparent = `
		html, body { background-color: transparent }
	`

	// background needs to be transparent if we are beveling the root so that the corners actually look rounded
	const background = options.roundBase ? backgroundTransparent : backgroundColor

	const rootStyle = document.createElement('style')
	rootStyle.textContent = `
		${background}	

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
	document.head.appendChild(rootStyle)

	const reactRoot = document.getElementById('root')
	if (!reactRoot) throw new Error('Expected to find a #root element')

	reactRoot.classList.add('bg-light', 'dark:bg-dark', 'text-dark', 'dark:text-light', '!block')
	if (options.roundBase) reactRoot.classList.add('border-1', 'border-light-10', 'rounded-lg')
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
