import { FileElement } from "./FileElement";

export class Directory extends FileElement {
  name: string
  type: 'directory' = 'directory'
  children: FileElement[]
  parent: Directory | null = null

  constructor(name: string, children: FileElement[] = []) {
    super()
    this.name = name
    this.children = children
    children.forEach(child => {
      child.parent = this
    })
  }

  getSize(): number {
    return this.children.reduce((acc, child) => acc + child.getSize(), 0)
  }
}

export class AliasDirectory extends Directory {
  constructor(name: string, public readonly alias: string, children: FileElement[] = []) {
    super(name, children)
  }

  toPath(): string {
    return this.alias
  }

  toPathFromChild() {
    return this.alias
  }
}

export class RootDirectory extends Directory {
  constructor(children: FileElement[] = []) {
    super('root', children)
  }

  toPath(): string {
    return '/'
  }

  toPathFromChild() {
    return ''
  }
}