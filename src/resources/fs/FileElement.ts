import { Directory } from "./Directory"

export abstract class FileElement {
  abstract name: string
  abstract type: 'file' | 'directory'
  parent: Directory | null = null

  toString(): string {
    return ''
  }

  getSize(): number {
    return this.toString().length
  }

  toPath(): string {
    if (this.parent === null) {
      return this.name
    } else {
      return `${this.parent.toPathFromChild()}/${this.name}`
    }
  }

  toPathFromChild(): string {
    if (this.parent === null) {
      return this.name
    } else {
      return `${this.parent.toPathFromChild()}/${this.name}`
    }
  }
}