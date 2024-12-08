import { ExecutableFile } from "./ExecutableFile";

export class LinkFile extends ExecutableFile {
  type: 'file' = 'file'

  constructor(
    name: string,
    public readonly target: string
  ) {
    super(
      name.endsWith('.lnk') ? name : name + '.lnk', null, async ({
      stream,
      workingDirectory,
      setWorkingDirectory,
      args,
      fs
    }) => {
      const file = fs.get(this.target)

      if (file instanceof ExecutableFile) {
        await file.execute({
          stream,
          workingDirectory,
          setWorkingDirectory,
          args,
          fs
        })
      } else {
        window.open(this.target, '_blank')
      }
    })
  }

  toString(): string {
    return this.target
  }
}
