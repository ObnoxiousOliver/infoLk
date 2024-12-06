import Color from "color";
import { ContentBlock } from "./Content";
import { Stream } from "./Stream";
import { TextStyle } from "./TextStyle";
import { FileSystem } from "./fs/FileSystem";

export class OS {
  constructor(
    private readonly stream: Stream = new Stream(),
    public readonly fs: FileSystem = new FileSystem()
  ) {}

  async boot() {
    const input = await this.stream.ask([
      ContentBlock.from('pc@ASSxLS ', new TextStyle({
        color: Color('#2EEAFF')
      })),
      ContentBlock.from('~/Dokumente/Informatik ', new TextStyle({
        color: Color('#FD91FF')
      })),
      ContentBlock.from('» ', new TextStyle({
        color: Color('#FFE9B2')
      }))
    ], {
      formatLine: (input) => {
        const splitted = input.split(' ')

        return [
          ContentBlock.from(splitted[0], new TextStyle({
            color: Color('#60FFBF')
          })),
          ...(splitted.slice(1).length === 0 ? [] : [' ']),
          ...splitted.slice(1).flatMap((s, i, arr) => [
            ContentBlock.from(s, new TextStyle({
              color: Color('#FFE9B2')
            })),
            ...(i < arr.length - 1 ? [' '] : [])
          ]),
        ]
      },
      suggestion: (input) => {
        if (input === '') return []

        if ('help'.startsWith(input)) {
          return [
            { replaceString: 'help ', content: 'help', description: 'Zeigt alle verfügbaren Befehle an' },
            { replaceString: 'help ', content: 'help <command>', description: 'Zeigt Informationen zu einem Befehl an' },
            { replaceString: 'help ', content: 'help <command> --flags', description: 'Zeigt alle verfügbaren Flags für einen Befehl an' }
          ]
        }
      }
    })

    this.stream.writeLn(`Hello, ${input}!`)
  }
}