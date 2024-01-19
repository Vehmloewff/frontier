import { colors } from './deps.ts'

export function log(message: string): void {
	console.log(colors.cyan(colors.bold('devops')), message)
}
