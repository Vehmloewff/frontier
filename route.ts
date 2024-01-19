import { React } from './deps.ts'

interface Listener<T> {
	trigger(): void
}

let currentData = new Map<string, unknown>()
const listeners = new Set<Listener<unknown>>()

function parseValue(value: string) {
	try {
		const text = atob(value)
		try {
			return JSON.parse(text)
		} catch (_) {
			console.warn('Failed to decode json from url')
			return null
		}
	} catch (_) {
		console.warn('Failed to decode base64 from url')
		return null
	}
}

function getCurrentData() {
	const currentHash = globalThis.window.location.hash
	const path = currentHash.slice(1)
	const sections = path.split('/').map((section) => section.trim()).filter((section) => section.length)

	const map = new Map<string, unknown>()

	while (true) {
		const key = sections.shift()
		const valueString = sections.shift()

		if (!key || !valueString) break

		map.set(key, parseValue(valueString))
	}

	return map
}

function updateHash() {
	const segments: string[] = []

	for (const [key, value] of currentData) {
		segments.push(key)

		const text = JSON.stringify(value)
		const base64 = btoa(text)

		segments.push(base64)
	}

	globalThis.window.location.hash = `/${segments.join('/')}`
}

export function initRouting(): void {
	currentData = getCurrentData()

	globalThis.window.addEventListener('hashchange', () => {
		currentData = getCurrentData()

		for (const listener of listeners) {
			listener.trigger()
		}
	})
}

export function useRouteKey<T>(key: string, defaultValue: T): [T, React.SetStateAction<T>] {
	const [state, setState] = React.useState(currentData.get(key) as T || defaultValue)

	React.useEffect(() => {
		const listener: Listener<T> = {
			trigger() {
				setState(currentData.get(key) as T || defaultValue)
			},
		}

		listeners.add(listener)

		return () => listeners.delete(listener)
	}, [])

	const publicSetState = React.useCallback((value: T | ((current: T) => T)) => {
		// @ts-ignore TODO
		const newValue = typeof value === 'function' ? value(currentData.get(key) || defaultValue) : value

		currentData.set(key, newValue)
		updateHash()
	}, [])

	return [state, publicSetState]
}
