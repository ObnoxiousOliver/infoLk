import { toBinaryString } from "../../utils/toBinaryString";
import { Stream } from "../Stream";
import { Directory } from "./Directory";
import { FileElement } from "./FileElement";
import { FileSystem } from "./FileSystem";

export interface ExecutableFileContext {
  stream: Stream,
  workingDirectory: Directory,
  setWorkingDirectory: (dir: Directory) => void,
  args: string[],
  fs: FileSystem,
}

export class ExecutableFile extends FileElement {
  type: 'file' = 'file'

  constructor(
    public readonly name: string,
    public readonly description: string | {
      description: string,
      usage?: string
    } | null,
    public readonly execute: (ctx: ExecutableFileContext) => Promise<void>
  ) {
    super()
  }

  toString(): string {
    return toBinaryString(this.execute.toString())
  }
}
