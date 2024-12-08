import Color from "color";
import { ContentBlock } from "../../resources/Content";
import { Directory } from "../../resources/fs/Directory";
import { ExecutableFile } from "../../resources/fs/ExecutableFile";
import { FontWeight, TextStyle } from "../../resources/TextStyle";

export const help = new ExecutableFile('help', 'Zeigt eine Liste aller Befehle an.', async (ctx) => {
  ctx.stream.writeLn('\nFolgende Befehle sind verfügbar:\n')
  const bin = ctx.fs.get('/bin') as Directory
  
  bin.children.forEach((child) => {
    if (child instanceof ExecutableFile) {
      ctx.stream.writeLn([
        new ContentBlock(child.name, new TextStyle({ weight: FontWeight.EXTRA_BOLD, color: Color('#60FFBF') })),
        '\n',
        ...child.description
          ? (typeof child.description === 'string'
            ? [child.description]
            : [
              child.description.description,
              '\n\n',
              ...child.description.usage
                ? [
                  new ContentBlock('Verwendung:', new TextStyle({ color: Color('#888'), italic: true })),
                  '\n',
                  child.description.usage
                ]
                : []
            ]
          )
          : [new ContentBlock('Keine Beschreibung vorhanden.', new TextStyle({ color: Color('#888'), italic: true }))],
        '\n'
      ])
    }
  })
})