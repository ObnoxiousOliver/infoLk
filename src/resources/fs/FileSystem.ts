import { files } from "../../assets/files"
import { Directory, RootDirectory } from "./Directory"
import { FileElement } from "./FileElement"

export class FileSystem {
  root: Directory

  constructor() {
    this.root = new RootDirectory(files)
  }

  get(path: string): FileElement | null {
    let currentDir = this.root
    const pathParts = path.split('/').filter(part => part !== '')

    for (const part of pathParts) {
      if (part === '~') {
        currentDir = this.get('home/pc') as Directory
        continue
      }

      if (part === '..') {
        if (currentDir.parent) {
          currentDir = currentDir.parent
          continue
        } else {
          continue
        }
      }

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