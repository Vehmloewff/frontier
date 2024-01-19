import { React } from '../deps.ts'
import { attachSymbolToComponent, nodeHasSymbol } from '../react.ts'

const sectionSymbol = Symbol()

export interface SegmentProps {
	gap?: number
	dividers?: boolean
	children: React.ReactNode[]
}

const segment = (props: SegmentProps, isColumn: boolean) => {
	return (
		<div
			className={`
				flex items-stretch ${isColumn ? 'flex-col' : ''} ${props.gap ? `gap-${props.gap}` : ''}
				w-full h-full
			`}
		>
			{props.children.map((section, index) => {
				if (!nodeHasSymbol(section, sectionSymbol)) {
					throw new Error('Only <Section> components are allowed to be direct children of <SegmentRow> and <SegmentColumn>')
				}

				return (
					<>
						{index !== 0 && props.dividers ? <div className={`bg-dark-10 dark:bg-light-10 ${isColumn ? 'h' : 'w'}-2`} /> : <></>}
						{section}
					</>
				)
			})}
		</div>
	)
}

export function SegmentRow(props: SegmentProps): React.ReactNode {
	return segment(props, false)
}

export function SegmentColumn(props: SegmentProps): React.ReactNode {
	return segment(props, true)
}

export interface SectionProps {
	grow?: boolean | number
	children?: React.ReactNode
}

export function Section(props: SectionProps): React.ReactNode {
	return <div className={props.grow ? 'flex-grow' : ''}>{props.children}</div>
}

attachSymbolToComponent(Section, sectionSymbol)
