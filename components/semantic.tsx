import { React } from '../deps.ts'

export interface PaddingProps {
	amount?: number
	children?: React.ReactNode
}

export function Padding(props: PaddingProps) {
	return <div class={`p-${props.amount || 15}`}>{props.children}</div>
}

export interface PanelProps {
	/** If `true` background set to the current theme's non-transparent background */
	resetBackground?: boolean
	children?: React.ReactNode
}

/** Creates a visually distinct panel. If it will be overlaying other content, pass the `resetBackground` prop */
export function Panel(props: PanelProps) {
	const color = props.resetBackground ? 'bg-light dark:bg-dark' : 'bg-dark-5 dark:bg-light-5'

	return <div className={`w-full h-full ${color}`}>{props.children}</div>
}

export interface CenterProps {
	children?: React.ReactNode
}

export function Center(props: CenterProps) {
	return <div class='w-full h-full flex items-center justify-center'>{props.children}</div>
}

export interface LoaderProps {
	size: number
}

export function Loader(props: LoaderProps) {
	return <img src='/lightcast_loader.gif' className={`w-${props.size} h-${props.size}`} />
}

export interface SizedBoxProps {
	width?: number
	height?: number
	children?: React.ReactNode
}

export function SizedBox(props: SizedBoxProps) {
	return (
		<div class={`${props.width ? `w-${props.width}` : 'w-full'} ${props.height ? `h-${props.height}` : 'h-full'}`}>
			{props.children}
		</div>
	)
}

// const lightBulb = await getHeroicon('light-bulb')

// export interface InformativeProps {
// 	text: React.ReactNode
// }

// export function Informative(props: InformativeProps): React.ReactNode {
// 	return (
// 		<div class='flex flex-col gap-10 items-center'>
// 			<div class='text-dark-10 dark:text-light-10'>
// 				<IconView icon={lightBulb} size={50} />
// 			</div>

// 			<div class='text-dark-30 dark:text-light-30 font-semibold text-center'>{props.text}</div>
// 		</div>
// 	)
// }
