import { ExecutableFileContext } from "./ExecutableFile"
import { FileElement } from "./FileElement"

export class JavaFile extends FileElement {
  type: 'file' = 'file'

  public readonly name: string

  constructor(
    name: string,
    public readonly javaCode: string,
    public readonly execute: (ctx: ExecutableFileContext) => Promise<void>
  ) {
    super()
    this.name = name.endsWith('.java') ? name : name + '.java'
  }

  toString(): string {
    return this.javaCode
  }
}