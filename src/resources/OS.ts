import Color from "color";
import { ContentBlock } from "./Content";
import { Stream } from "./Stream";
import { FontWeight, TextStyle } from "./TextStyle";
import { FileSystem } from "./fs/FileSystem";
import { AsciiRenderer3D } from "./AsciiRenderer3D/AsciiRenderer3D";
import { Scene } from "./AsciiRenderer3D/Scene";
import { AsciiObject, Edge, Vertex } from "./AsciiRenderer3D/AsciiObject";
import { Vec3 } from "./AsciiRenderer3D/Vec3";
import { bootLog, shutdownLog } from "../assets/bootLog";
import { Display } from "./Display";
import { sleep } from "../utils/sleep";
import { ExecutableFile } from "./fs/ExecutableFile";
import { Directory } from "./fs/Directory";

export const PASSWORD = "0000"

export class OS {
  constructor(
    private readonly stream: Stream = new Stream(),
    public readonly fs: FileSystem = new FileSystem()
  ) {}

  async run() {
    const storedStartupState = localStorage.getItem('startupState')
    let startupState: Record<string, boolean> & {
      last?: number
    } = {}
    try {
      startupState = JSON.parse(storedStartupState || '{}')
    } catch (e) {
      localStorage.removeItem('startupState')
    }

    // If the last boot was more than 10 minutes ago, reset the startup state
    if (startupState.last && Date.now() - startupState.last > 10 * 60_000) {
      startupState = {
        last: Date.now()
      } as any
      localStorage.setItem('startupState', JSON.stringify(startupState))
    } else {
      startupState.last = Date.now()
      localStorage.setItem('startupState', JSON.stringify(startupState))
    }

    if (!startupState.booted) {
      await sleep(500)
      const start = Date.now()

      for (const log of bootLog) {
        this.stream.writeLn([
          new ContentBlock('[ ', new TextStyle({
            color: new Color('#666'),
            weight: 500
          })),
          new ContentBlock(((Date.now() - start) / 1000).toFixed(3), new TextStyle({
            color: new Color('#333'),
            weight: 500
          })),
          new ContentBlock(' ] ', new TextStyle({
            color: new Color('#666'),
            weight: 500
          })),
          log(),
        ])
        await sleep(Math.random() > 0.87
          ? (Math.random() * 15) ** 2
          : 0)
      }

      await sleep(500)
      this.stream.clear()
      await sleep(500)

      await this.startupSequence()

      await sleep(1000)

      startupState.booted = true
      localStorage.setItem('startupState', JSON.stringify(startupState))
    }

    if (!startupState.loggedIn) {
      this.stream.clear()

      await this.askForCredentials()
      startupState.loggedIn = true
      localStorage.setItem('startupState', JSON.stringify(startupState))
    }

    this.stream.clear()

    await this.commandLineLoop()
  }

  /**
   * The startup sequence of the OS.
   */
  startupSequence() {
    return new Promise<void>((resolve) => {
      const obj = new AsciiObject(
        [
          new Vertex(-2, -2, -2),
          new Vertex(2, -2, -2),
          new Vertex(-2, 2, -2),
          new Vertex(2, 2, -2),
          new Vertex(-2, -2, 2),
          new Vertex(2, -2, 2),
          new Vertex(-2, 2, 2),
          new Vertex(2, 2, 2),
          
          new Vertex(-1.1, -1.1, -1.1),
          new Vertex(1.1, -1.1, -1.1),
          new Vertex(-1.1, 1.1, -1.1),
          new Vertex(1.1, 1.1, -1.1),
          new Vertex(-1.1, -1.1, 1.1),
          new Vertex(1.1, -1.1, 1.1),
          new Vertex(-1.1, 1.1, 1.1),
          new Vertex(1.1, 1.1, 1.1)
        ],
        [
          new Edge(0, 1, () => '*'),
          new Edge(1, 3, () => '*'),
          new Edge(3, 2, () => '*'),
          new Edge(2, 0, () => '*'),
          new Edge(4, 5, () => '*'),
          new Edge(5, 7, () => '*'),
          new Edge(7, 6, () => '*'),
          new Edge(6, 4, () => '*'),
          new Edge(0, 4, () => '*'),
          new Edge(1, 5, () => '*'),
          new Edge(2, 6, () => '*'),
          new Edge(3, 7, () => '*'),

          new Edge(8, 9, () => '*'),
          new Edge(9, 11, () => '*'),
          new Edge(11, 10, () => '*'),
          new Edge(10, 8, () => '*'),
          new Edge(12, 13, () => '*'),
          new Edge(13, 15, () => '*'),
          new Edge(15, 14, () => '*'),
          new Edge(14, 12, () => '*'),
          new Edge(8, 12, () => '*'),
          new Edge(9, 13, () => '*'),
          new Edge(10, 14, () => '*'),
          new Edge(11, 15, () => '*'),

          new Edge(0, 8, () => '*'),
          new Edge(1, 9, () => '*'),
          new Edge(2, 10, () => '*'),
          new Edge(3, 11, () => '*'),
          new Edge(4, 12, () => '*'),
          new Edge(5, 13, () => '*'),
          new Edge(6, 14, () => '*'),
          new Edge(7, 15, () => '*')
        ],
        new Vec3(0, 0, 0),
        new Vec3(0, 0, 0)
      )

      const asciiRenderer = new AsciiRenderer3D(
        new Scene([
          obj
        ])
      )

      const logo = `____________________     _________________________
|_____|______  |   |_____|_____|_____/     |______
|     |______  |   |     |_____|    \\|_____|_____|`.split('\n')

      let start = Date.now()
      let last = Date.now()
      const step = () => {
        const now = Date.now()
        const elapsed = now - start
        const delta = (now - last) / 1000
        last = now

        const w = Display.width()
        const h = Display.height()

        if (elapsed > 5000) {
          this.stream.clear()
          this.stream.writeLn(new ContentBlock('\n'.repeat(Math.floor(h / 2)) + ' '.repeat(w / 2 - 10) + 'AetherOS is ready!', new TextStyle({
            color: new Color('#fff'),
            weight: FontWeight.EXTRA_BOLD
          })))
          resolve()
          return
        }

        obj.euler = obj.euler.add(new Vec3(.5 * delta, 1 * delta, 0))
        const frame = asciiRenderer.render({
          camEulerRot: Vec3.zero,
          camPos: new Vec3(0, 0, -5),
          resolution: {
            width: Math.floor(w / 2),
            height: Math.floor(w / 4)
          }
        })

        this.stream.clear()
        this.stream.writeLn(new ContentBlock((
          frame.data.split('\n').map(line => {
            return ' '.repeat(Math.max(0, Math.floor((w - line.length) / 2))) + line
          }).join('\n')
        ), new TextStyle({
          color: new Color('#5dfcff'),
          weight: 500
        })))

        if (w < logo[0].length) {
          this.stream.writeLn(new ContentBlock('AetherOS'.padStart(w / 2 + 6, ' ') + '\n\n', new TextStyle({
            color: new Color('#ff79e4'),
          })))
        } else {
          this.stream.writeLn(new ContentBlock(logo.map(x => x.padStart(w / 2 + x.length / 2, ' ')).join('\n') + '\n\n', new TextStyle({
            color: new Color('#ff79e4'),
          })))
        }

        const loadingText = 'Starting System '
        const dottedLoading = loadingText + '.'.repeat(Math.floor(elapsed / 500) % 4)

        this.stream.writeLn(new ContentBlock(dottedLoading.padStart(w / 2 + dottedLoading.length - loadingText.length / 2, ' '), new TextStyle({
          color: new Color('#fff'),
          weight: FontWeight.EXTRA_BOLD
        })))

        requestAnimationFrame(step)
      }
      step()
    })
  }

  async askForCredentials() {
    this.stream.writeLn(['Willkommen in ', new ContentBlock('AetherOS', new TextStyle({
      color: new Color('#ffb0de'),
      weight: FontWeight.EXTRA_BOLD
    })), '!\n\n'])
  
    await sleep(10)

    this.stream.writeLn(['Anmeldung als ', new ContentBlock('pc@ASSxLS\n', new TextStyle({
      color: new Color('#54e1e3'),
      weight: FontWeight.EXTRA_BOLD
    }))])

    await sleep(10)

    while (true) {
      const password = await this.stream.ask('Bitte geben Sie Ihr Passwort ein: ', {
        formatLine: (input) => ['*'.repeat(input.length)], 
      }).promise

      if (password === PASSWORD) {
        this.stream.writeLn()
        this.stream.writeLn(new ContentBlock('Anmeldung erfolgreich.', new TextStyle({
          color: new Color('#5dfcff'),
          weight: FontWeight.EXTRA_BOLD
        })))
        break
      } else {
        this.stream.writeLn()
        this.stream.writeLn(new ContentBlock('Falsches Passwort.', new TextStyle({
          color: new Color('#ff5555'),
          weight: FontWeight.EXTRA_BOLD
        })))
      }
    }
  }

  async shutdown () {
    localStorage.removeItem('startupState')
    localStorage.removeItem('workingDirectory')
    this.stream.clear()

    const start = Date.now()

    for (const log of shutdownLog) {
      this.stream.writeLn([
        new ContentBlock('[ ', new TextStyle({
          color: new Color('#666'),
          weight: 500
        })),
        new ContentBlock(((Date.now() - start) / 1000).toFixed(3), new TextStyle({
          color: new Color('#333'),
          weight: 500
        })),
        new ContentBlock(' ] ', new TextStyle({
          color: new Color('#666'),
          weight: 500
        })),
        log(),
      ])
      await sleep(Math.random() > 0.7
        ? (Math.random() * 15) ** 2
        : 0)
    }

    await sleep(3000)

    this.stream.clear()

    await sleep(1000)

    const ask = this.stream.ask('Press any key to start the system...')
    ask.input.onKeydown(() => ask.input.close())
    await ask.promise

    this.stream.clear()
  }

  async commandLineLoop() {
    const savedWorkingDirectory = localStorage.getItem('workingDirectory')
    let currentDirectory = this.fs.get(savedWorkingDirectory || '/home/pc') as Directory || this.fs.get('/home/pc') as Directory

    let commandHistory: string[] = []
    
    while (true) {
      const validCommands = (this.fs.get('bin') as Directory).children.filter(x => x instanceof ExecutableFile).map(x => x.name)
      
      const ask = this.stream.ask([
        new ContentBlock('pc@ASSxLS ', new TextStyle({
          color: new Color('#2EEAFF'),
        })),
        new ContentBlock(currentDirectory.toPath(), new TextStyle({
          color: new Color('#FD91FF'),
        })),
        new ContentBlock(' » ', new TextStyle({
          color: new Color('#EFFFA2'),
        }))
      ], {
        formatLine: (input) => {
          const [commandName, ...args] = input.split(' ')

          const executable = this.fs.get('bin/' + commandName) || this.fs.get(currentDirectory.toPath() + '/' + commandName)

          if (executable instanceof ExecutableFile) {
            return [
              new ContentBlock(commandName, new TextStyle({
                color: new Color('#60FFBF')
              })),
              ' ',
              ...args.map(x => {
                const file = this.fs.get(currentDirectory.toPath() + '/' + x)
                if (file) {
                  return new ContentBlock(x + ' ', new TextStyle({
                    color: new Color('#FFE9B2')
                  }))
                } else {
                  return x + ' '
                }
              }),
            ]
          }

          return input.split(' ').map(x => {
            const file = this.fs.get(currentDirectory.toPath() + '/' + x)

            if (file) {
              return new ContentBlock(x + ' ', new TextStyle({
                color: new Color('#FFE9B2')
              }))
            } else {
              return x + ' '
            }
          })
        },
        suggestion: (input) => {
          const [commandName, ...args] = input.split(' ')

          let commandSuggestions: { content: string, replaceString: string, description?: string }[] = []
          if (commandName.length > 0 && args.length === 0 && !commandName.includes('/')) {
            commandSuggestions = [...validCommands, 'exit'].filter(x => x.toLowerCase().startsWith(commandName.toLowerCase())).map(x => {
              if (x === 'exit') {
                return {
                  content: x + ' ',
                  replaceString: x + ' ',
                  description: 'Beendet das System.'
                }
              }
              
              const executable = this.fs.get('bin/' + x) as ExecutableFile

              return {
                content: (typeof executable.description === 'string' ? x : (executable.description?.usage ?? x)) + ' ',
                replaceString: x + ' ',
                description: typeof executable.description === 'string' ? executable.description : executable.description?.description,
              }
            })
          }

          const splitted = input.split(' ')
          const last = splitted[splitted.length - 1]

          let dir: Directory | null = currentDirectory

          if (last.includes('/')) {
            const parts = last.split('/').filter(x => x !== '')

            console.log(parts)

            for (let i = 0; i < parts.length; i++) {
              const part = parts[i]
              const file = this.fs.get(dir.toPath() + '/' + part)

              console.log(part, file)

              if (file instanceof Directory) {
                dir = file
              } else {
                break
              }
            }
          }

          const lastPart = last.split('/')[last.split('/').length - 1]
          console.log(lastPart, last)

          return {
            hidden: lastPart.length === 0 && !last.includes('/') && !input.startsWith('cd '),
            suggestions: [...commandSuggestions, ...dir ? [
              ...dir.children.sort((a, b) => a.name.localeCompare(b.name)).map(x => x.name),
              '..', '~'
            ].filter(x => lastPart ? x.toLowerCase().startsWith(lastPart.toLowerCase()) : true)
              .map(x => {
                const isDirectory = this.fs.get(dir.toPath() + '/' + x) instanceof Directory

                return{
                  content: x + (isDirectory ? '/' : ' '),
                  preview: (input: string) => {
                    const splitted = input.split(' ')
                    const last = splitted[splitted.length - 1]

                    const parts = last.split('/')
                    parts[parts.length - 1] = x + (isDirectory ? '/' : ' ')
                    return splitted.slice(0, splitted.length - 1).join(' ') + (splitted.length > 1 ? ' ' : '') + parts.join('/')
                  },
                  replace: (input: string) => {
                    const splitted = input.split(' ')
                    const last = splitted[splitted.length - 1]

                    const parts = last.split('/')
                    parts[parts.length - 1] = x + (isDirectory ? '/' : ' ')
                    return splitted.slice(0, splitted.length - 1).join(' ') + (splitted.length > 1 ? ' ' : '') + parts.join('/')
                  }
                }
              }) : []]
          }
        },
        
      })

      let commandHistoryIndex = 0
      let lastCommand = ''
      ask.input.onKeydown((e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault()

          if (commandHistoryIndex === 0) {
            lastCommand = ask.input.input()
          }

          if (commandHistoryIndex < commandHistory.length) {
            commandHistoryIndex++
            ask.input.setInput(commandHistory[commandHistory.length - commandHistoryIndex])
          }
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault()

          if (commandHistoryIndex > 0) {
            commandHistoryIndex--

            if (commandHistoryIndex === 0) {
              ask.input.setInput(lastCommand)
            } else {
              ask.input.setInput(commandHistory[commandHistory.length - commandHistoryIndex])
            }
          }
        }
      })
      const command = await ask.promise

      // Don't add the same command to the history multiple times
      if (commandHistory[commandHistory.length - 1] !== command) {
        commandHistory.push(command)
      }

      if (command.trim() === 'exit') {
        await this.shutdown()
        break
      }

      if (command.trim() === '') {
        await sleep(100)
        continue
      }

      const [commandName, ...args] = command.split(' ')

      const executable = this.fs.get('bin/' + commandName) || this.fs.get(currentDirectory.toPath() + '/' + commandName)

      if (executable instanceof ExecutableFile) {
        try {
          await executable.execute({
            stream: this.stream,
            workingDirectory: currentDirectory,
            setWorkingDirectory: (dir) => {
              currentDirectory = dir
              localStorage.setItem('workingDirectory', dir.toPath())
            },
            args,
            fs: this.fs
          })
        } catch (e) {
          this.stream.writeLn(new ContentBlock(`Ein Fehler ist aufgetreten: ${e}\n`, new TextStyle({
            color: new Color('#ff5555')
          })))
        }

        await sleep(10)
        continue
      }

      this.stream.writeLn(new ContentBlock(`Befehl nicht gefunden: ${commandName}\n\nVerwenden Sie 'help', um eine Liste der verfügbaren Befehle anzuzeigen.\n`, new TextStyle({
        color: new Color('#ff5555')
      })))

      await sleep(10)
    }
  }
}