import { AliasDirectory, Directory } from "./Directory"
import { FileElement } from "./FileElement"

export class FileSystem {
  root: Directory

  constructor(files: FileElement[]) {
    this.root = new AliasDirectory('home', '~', files)
  }

  get(path: string): FileElement | null {
    let currentDir = this.root
    const pathParts = path.split('/')
      .filter(part => part !== '')

    if(pathParts[0] === '~') {
      pathParts.shift()
    }

    for (const part of pathParts) {
      const child = currentDir.children.find(child => child.name.toLowerCase() === part.toLowerCase())

      if (!child) {
        return null
      } else if (child.type === 'directory') {
        currentDir = child as Directory
      } else if (pathParts.indexOf(part) === pathParts.length - 1) {
        return child
      } else {
        return null
      }
    }

    return currentDir
  }
}