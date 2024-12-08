import Color from "color"
import { ContentBlock } from "../../resources/Content"
import { ExecutableFile } from "../../resources/fs/ExecutableFile"
import { TextStyle } from "../../resources/TextStyle"
import { Directory } from "../../resources/fs/Directory"

export const cd = new ExecutableFile(
  'cd',
  {
    description: 'Wechselt in ein anderes Verzeichnis.',
    usage: 'cd <Verzeichnis>'
  },
  async (ctx) => {
  const target = ctx.args[0]

  if (target === undefined || target === '') {
    ctx.stream.writeLn(new ContentBlock('cd: fehlendes Argument\n\nVerwendung: cd <Verzeichnis>\n', new TextStyle({
      color: Color('#ff5555')
    })))
    return
  }

  const file = ctx.fs.get(ctx.workingDirectory.toPath() + '/' + target)

  if (file === null) {
    ctx.stream.writeLn(new ContentBlock(`cd: ${target}: Verzeichnis nicht gefunden\n`, new TextStyle({
      color: Color('#ff5555')
    })))
  } else

  if (file instanceof Directory) {
    ctx.setWorkingDirectory(file)
  } else {
    ctx.stream.writeLn(new ContentBlock(`cd: ${target}: Kein Verzeichnis\n`, new TextStyle({
      color: Color('#ff5555')
    })))
  }
})