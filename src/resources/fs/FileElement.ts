export abstract class FileElement {
  abstract name: string
  abstract type: 'file' | 'directory'
}