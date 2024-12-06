import { Directory } from "./Directory"

export class FileSystem {
  root: Directory

  constructor() {
    this.root = {
      name: '/',
      type: 'directory',
      children: []
    }
  }
}