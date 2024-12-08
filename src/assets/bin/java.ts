import Color from "color";
import { ContentBlock } from "../../resources/Content";
import { ExecutableFile } from "../../resources/fs/ExecutableFile";
import { TextStyle } from "../../resources/TextStyle";
import { JavaFile } from "../../resources/fs/JavaFile";

export const java = new ExecutableFile('java', 'Führt eine Java-Datei aus.', async (ctx) => {
  const target = ctx.args[0]

  if (target === undefined || target === '') {
    ctx.stream.writeLn(new ContentBlock('java: fehlendes Argument\n\nVerwendung: java <Datei>\n', new TextStyle({
      color: Color('#ff5555')
    })))
    return
  }

  const file = ctx.fs.get(ctx.workingDirectory.toPath() + '/' + target)

  if (file === null) {
    ctx.stream.writeLn(new ContentBlock(`java: ${target}: Datei nicht gefunden\n`, new TextStyle({
      color: Color('#ff5555')
    })))
  } else if (file.type === 'directory') {
    ctx.stream.writeLn(new ContentBlock(`java: ${target}: Ist ein Verzeichnis\n`, new TextStyle({
      color: Color('#ff5555')
    })))
  } else if (file instanceof JavaFile) {
    try {
      await file.execute(ctx)
    } catch (e: any) {
      ctx.stream.writeLn(new ContentBlock(`java: ${target}: ${e.message}\n`, new TextStyle({
        color: Color('#ff5555')
      })))
    }
  }
})