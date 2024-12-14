import { Directory } from "./Directory"

export abstract class FileElement {
  abstract name: string
  abstract type: 'file' | 'directory'
  parent: Directory | null = null

  toPath(): string {
    if (this.parent === null) {
      return this.name
    } else {
      return `${this.parent.toPath()}/${this.name}`
    }
  }
}