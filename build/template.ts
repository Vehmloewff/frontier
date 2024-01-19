import { HtmlTemplate } from './server.ts'

export interface BuildTemplateOptions {
	/** The title that this page is to bear in the <title> element */
	title: string
	/** The path to an to be used as the page favicon. If empty, no icon is specified */
	icon?: string
	/** Any additional content to be injected into template head */
	additionalHead?: string
	/** The id of the root div element. Defaults to `root` */
	rootElementId?: string
}

export function buildTemplate(options: BuildTemplateOptions): HtmlTemplate {
	const additionalHead = options.additionalHead ?? ''
	const rootElementId = options.rootElementId ?? 'root'
	const iconLink = options.icon ? getIconLink(options.icon) : ''

	return ({ jsPath }) => `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${options.title}</title>

				${iconLink}
				${additionalHead}

				<script defer src="${jsPath}"></script>
			</head>
			<body>
				<div id="${rootElementId}"></div>
			</body>
		</html>`
}

function getIconLink(iconPath: string): string {
	const mimeType = 'image/png'

	return `<link rel="icon" type="${mimeType}" href="${iconPath}">`
}
