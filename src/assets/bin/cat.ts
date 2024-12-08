import Color from "color"
import { ContentBlock } from "../../resources/Content"
import { ExecutableFile } from "../../resources/fs/ExecutableFile"
import { TextStyle } from "../../resources/TextStyle"

export const cat = new ExecutableFile('cat', {
  description: 'Dateien zusammenfügen und auf die Standardausgabe drucken',
  usage: 'cat <Datei> [<Datei> ...]'
}, async ({ stream, workingDirectory, args, fs }) => {
  args = args.filter(arg => arg !== '')
  if (args.length === 0) {
    stream.writeLn([
      new ContentBlock('cat: fehlendes Argument\n\nVerwendung: cat <Datei> [<Datei> ...]\n', new TextStyle({
        color: Color('#ff5555')
      }))
    ])
    return
  }

  for (const arg of args) {
    const file = fs.get(workingDirectory.toPath() + '/' + arg)

    if (file === null) {
      stream.writeLn(new ContentBlock(`cat: ${arg}: Datei nicht gefunden\n`, new TextStyle({
        color: Color('#ff5555')
      })))
    } else if (file.type === 'directory') {
      stream.writeLn(new ContentBlock(`cat: ${arg}: Ist ein Verzeichnis\n`, new TextStyle({
        color: Color('#ff5555')
      })))
    } else {
      stream.writeLn(file.toString())
    }
  }

  stream.writeLn()
})