import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

export function renderMarkdown(source) {
  return marked.parse(String(source ?? ''))
}
