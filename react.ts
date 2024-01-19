import { React } from './deps.ts'

export function attachSymbolToComponent(component: unknown, symbol: symbol): void {
	// @ts-ignore no way ts will like this
	component.__SYMBOL = symbol
}

export function isComponent(node: React.ReactNode): boolean {
	// @ts-ignore classic detector function
	return typeof node?.type === 'function'
}

export function nodeHasSymbol(node: React.ReactNode, symbol: symbol): boolean {
	if (!isComponent(node)) return false

	// @ts-ignore shouldn't ever error because of the check above
	return node.type.__SYMBOL === symbol
}
