import { FileElement } from "./FileElement"

export class TextFile extends FileElement {
  name: string
  type: 'file' = 'file'
  content: string

  constructor(name: string, content: string) {
    super()
    this.name = name
    this.content = content
  }

  toString(): string {
    return this.content
  }
}