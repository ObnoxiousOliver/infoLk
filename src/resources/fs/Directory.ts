import { FileElement } from "./FileElement";

export class Directory extends FileElement {
  name: string
  type: 'directory' = 'directory'
  children: FileElement[]

  constructor(name: string, children: FileElement[] = []) {
    super()
    this.name = name
    this.children = children
  }
}