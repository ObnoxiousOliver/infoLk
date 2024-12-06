import { FileElement } from "./FileElement"

export class RichTextFile extends FileElement {
  name: string
  type: 'file' = 'file'
  content: HTMLElement

  constructor(name: string, content: HTMLElement) {
    super()
    this.name = name
    this.content = content
  }

  getContent() {
    return this.content.outerHTML
  }
}