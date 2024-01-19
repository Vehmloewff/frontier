// import { React } from '~/deps'
// import { Icon, IconView } from './icon.tsx'

// export interface UnionButtonBarButton {
// 	icon: Icon
// 	onPressed(): void
// 	hoverColor?: string
// }

// export interface UnionButtonBarProps {
// 	buttons: UnionButtonBarButton[]
// }

// export function UnionButtonBar(props: UnionButtonBarProps): React.ReactNode {
// 	return (
// 		<div className='h-50 flex items-stretch'>
// 			{props.buttons.map((button) => (
// 				<button
// 					onClick={() => button.onPressed()}
// 					className={`
// 						transition-colors
// 						flex w-50 justify-center items-center
// 						bg-dark-0 dark:bg-light-0 hover:bg-dark-5 dark:hover:bg-light-5
// 						text-dark-30 dark:text-light-30 hover:text-${button.hoverColor || 'primary'}
// 					`}
// 				>
// 					<IconView icon={button.icon} size={30} />
// 				</button>
// 			))}
// 		</div>
// 	)
// }
