import { ExecutableFile } from "../../resources/fs/ExecutableFile"

export const ls = new ExecutableFile(
  'ls',
  'Listet alle Dateien und Verzeichnisse im aktuellen Verzeichnis auf.',
  async (ctx) => {

    ctx.stream.writeLn()

    const maxNameLength = ctx.workingDirectory.children.reduce((max, child) => Math.max(max, (child.name + (child.type === 'directory' ? '/' : '')).length), 0)

    ctx.workingDirectory.children
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(child => {
        const size = child.getSize()
        ctx.stream.writeLn([
          child.name + (child.type === 'directory' ? '/' : '') + ' '.repeat(maxNameLength + 3 - child.name.length) +
          toByteString(size)
        ])
      })

    ctx.stream.writeLn()
})

function toByteString(bytes: number) {
  if (bytes === 1) {
    return '1 Byte'
  }

  const steps = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  let step = 0

  while (bytes >= 1024 && step < steps.length - 1) {
    bytes /= 1024
    step++
  }

  return (step === 0 ? bytes.toFixed(0) : bytes.toFixed(2)) + ' ' + steps[step]
}