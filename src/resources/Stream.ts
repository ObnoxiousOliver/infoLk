import { isMac } from "../utils/platfrom";
import { Content, ContentBlock } from "./Content";
import { mergeTextStyles, TextStyle } from "./TextStyle";
import { Trap } from "./Trap";

export type StreamEvents = 'data' | 'write' | 'clear' | 'input'

export type StreamData = (Content | Content[] | StreamData)[]

export class Stream {
  private data: StreamData = []

  constructor() {}

  public read(): Content[] {
    function read(data: StreamData): Content[] {
      return data.flatMap((content) => {
        if (typeof content === 'string') {
          return ContentBlock.from(content)
        } else if (Array.isArray(content)) {
          return read(content)
        } else {
          return content
        }
      })
    }

    return read(this.data)
  }

  public write(content: Content | Content[]): void {
    this.data.push(content)
    this.emit('data', this.copy())
    this.emit('write', this.copy())
  }

  public copy(): Content[] {
    function copy(data: StreamData): Content[] {
      return data.flatMap((content) => {
        if (typeof content === 'string') {
          return content
        } else if (Array.isArray(content)) {
          return copy(content)
        } else {
          return content.copy()
        }
      })
    }

    return copy(this.data)
  }

  public writeLn(content?: Content | Content[]): void {
    content && this.write(content)
    this.write('\n')
  }

  public input() {
    let inputString = ''
    let cursor = {
      x: 0,
      y: 0
    }
    const setCursor = (value: {x?: number, y?: number}) => {
      cursor = {
        x: value.x ?? cursor.x,
        y: value.y ?? cursor.y
      }

      cursorListeners.forEach((listener) => {
        listener(cursor)
      })
    }
    const inputEl = document.createElement('textarea')

    document.body.appendChild(inputEl)
    inputEl.focus()
    inputEl.style.position = 'absolute'
    inputEl.style.top = '0'
    inputEl.style.left = '0'
    inputEl.style.width = '0'
    inputEl.style.height = '0'
    inputEl.style.opacity = '0'
    inputEl.style.pointerEvents = 'none'
    inputEl.autocapitalize = 'off'
    inputEl.autocomplete = 'off'
    inputEl.spellcheck = false

    Trap.focus(inputEl)

    const handleInput = () => {
      const input = inputEl.value
      inputEl.value = ''

      const spittedString = inputString.split('\n')
      spittedString[cursor.y] = inputString.split('\n')[cursor.y].slice(0, cursor.x) + input + inputString.split('\n')[cursor.y].slice(cursor.x)

      inputString = spittedString.join('\n')

      if (input === '\n') {
        setCursor({ y: cursor.y + 1, x: 0 })
      } else {
        setCursor({ x: cursor.x + input.length })
      }

      inputListeners.forEach((listener) => {
        listener(inputString)
      })
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault()

        const splittedString = inputString.split('\n')

        setCursor({ x: Math.min(cursor.x, splittedString[cursor.y].length) })

        if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
          if (cursor.y === 0 && cursor.x === 0) return

          if (cursor.x === 0) {
            setCursor({ y: cursor.y - 1, x: splittedString[cursor.y - 1].length })
            splittedString[cursor.y] += splittedString[cursor.y + 1]
            splittedString.splice(cursor.y + 1, 1)
          } else {
            splittedString[cursor.y] = splittedString[cursor.y].slice(cursor.x)
            setCursor({ x: 0 })
          }
        } else if (e.altKey || e.ctrlKey) {
          if (cursor.x === 0) {
            if (cursor.y === 0) return
            setCursor({ y: cursor.y - 1, x: splittedString[cursor.y - 1].length })
            splittedString[cursor.y] += splittedString[cursor.y + 1]
            splittedString.splice(cursor.y + 1, 1)
          } else {
            const line = splittedString[cursor.y]
            let x = Math.min(cursor.x, line.length) - 1
            while (line[x] === ' ' && x > 0) {
              x--
              console.log(x, '"'+line[x]+'"', line)
            }

            const prevSpace = line.lastIndexOf(' ', x)

            if (prevSpace === -1) {
              splittedString[cursor.y] = ''
            } else {
              splittedString[cursor.y] = splittedString[cursor.y].slice(0, prevSpace)
            }
          }
        } else {
          if (cursor.x === 0) {
            if (cursor.y === 0) return
            setCursor({ y: cursor.y - 1, x: splittedString[cursor.y - 1].length })
            splittedString[cursor.y] += splittedString[cursor.y + 1]
            splittedString.splice(cursor.y + 1, 1)
          } else {
            splittedString[cursor.y] = splittedString[cursor.y].slice(0, cursor.x - 1) + splittedString[cursor.y].slice(cursor.x)
            setCursor({ x: cursor.x - 1 })
          }
        }

        inputString = splittedString.join('\n')

        inputListeners.forEach((listener) => {
          listener(inputString)
        })
      }
      if (e.key === 'Delete') {
        e.preventDefault()

        const splittedString = inputString.split('\n')

        if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
          if (cursor.y === splittedString.length - 1 && cursor.x === splittedString[cursor.y].length) return

          if (cursor.x === splittedString[cursor.y].length) {
            splittedString[cursor.y] += splittedString[cursor.y + 1]
            splittedString.splice(cursor.y + 1, 1)
          } else {
            splittedString[cursor.y] = splittedString[cursor.y].slice(0, cursor.x)
          }
        } else {
          if (cursor.x === splittedString[cursor.y].length) {
            if (cursor.y === splittedString.length - 1) return
            splittedString[cursor.y] += splittedString[cursor.y + 1]
            splittedString.splice(cursor.y + 1, 1)
          } else {
            splittedString[cursor.y] = splittedString[cursor.y].slice(0, cursor.x) + splittedString[cursor.y].slice(cursor.x + 1)
          }
        }

        inputString = splittedString.join('\n')

        inputListeners.forEach((listener) => {
          listener(inputString)
        })
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()

        if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
          if (cursor.x === 0) {
            if (cursor.y === 0) return
            setCursor({ y: cursor.y - 1, x: inputString.split('\n')[cursor.y - 1].length })
          } else {
            setCursor({ x: 0 })
          }
        } else if (e.altKey || e.ctrlKey) {
          const line = inputString.split('\n')[cursor.y]
          let x = cursor.x
          
          while (line[x] === ' ' && x > 0) { x-- }

          const nextSpace = line.lastIndexOf(' ', x)

          if (nextSpace === -1) {
            setCursor({ x: 0 })
          } else {
            setCursor({ x: nextSpace })
          }
        } else {
          if (cursor.x === 0) {
            if (cursor.y === 0) return
            setCursor({ y: cursor.y - 1, x: inputString.split('\n')[cursor.y - 1].length })
          } else {
            cursor.x = Math.min(inputString.split('\n')[cursor.y].length, cursor.x)
            setCursor({ x: Math.max(0, cursor.x - 1) })
          }
        }
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()

        if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
          if (cursor.x >= inputString.split('\n')[cursor.y].length) {
            if (cursor.y >= inputString.split('\n').length - 1) return
            setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1), x: 0 })
          } else {
            setCursor({ x: inputString.split('\n')[cursor.y].length })
          }
        } else if (e.altKey || e.ctrlKey) {
          if (cursor.x >= inputString.split('\n')[cursor.y].length) {
            if (cursor.y >= inputString.split('\n').length - 1) return
            setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1), x: 0 })
          } else {
            const line = inputString.split('\n')[cursor.y]
            let x = cursor.x

            while (line[x] === ' ') { x++ }

            const nextSpace = line.indexOf(' ', x + 1)

            if (nextSpace === -1) {
              setCursor({ x: inputString.split('\n')[cursor.y].length })
            } else {
              setCursor({ x: nextSpace })
            }
          }
        } else {
          if (cursor.x >= inputString.split('\n')[cursor.y].length) {
            if (cursor.y >= inputString.split('\n').length - 1) return

            setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1), x: 0 })
          } else {
            cursor.x = Math.min(inputString.split('\n')[cursor.y].length, cursor.x)
            setCursor({ x: cursor.x + 1 })
          }
        }
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()

        setCursor({ y: Math.max(0, cursor.y - 1) })
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()

        setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1) })
      }
    }

    inputEl.addEventListener('input', handleInput)
    inputEl.addEventListener('keydown', handleKeydown)

    const close = () => {
      inputEl.removeEventListener('keydown', handleKeydown)
      inputEl.removeEventListener('input', handleInput)

      for (const listener of keydownListeners) {
        inputEl.removeEventListener('keydown', listener)
      }

      document.body.removeChild(inputEl)

      inputObj = null
    }

    const keydownListeners: ((e: KeyboardEvent) => void)[] = []
    const inputListeners: ((input: string) => void)[] = []
    const cursorListeners: ((cursor: { x: number, y: number }) => void)[] = []

    let inputObj: {
      onKeydown: (callback: (e: KeyboardEvent) => void) => void
      onInput: (callback: (input: string) => void) => void
      onCursor: (callback: (cursor: { x: number, y: number }) => void) => void
      cursor: () => { x: number, y: number }
      input: () => string
      setInput: (value: string) => void
      close: () => void
    } | null = {
      onKeydown: (callback: (e: KeyboardEvent) => void) => {
        keydownListeners.push(callback)
        inputEl.addEventListener('keydown', callback)
      },
      onInput: (callback: (input: string) => void) => {
        inputListeners.push(callback)
      },
      onCursor: (callback: (cursor: { x: number, y: number }) => void) => {
        cursorListeners.push(callback)
      },
      cursor() {
        return cursor
      },
      input() {
        return inputString
      },
      setInput(value: string) {
        inputString = value
        inputListeners.forEach((listener) => {
          listener(inputString)
        })
        setCursor({ x: inputString.split('\n')[cursor.y].length })
      },
      close
    }

    return inputObj
  }

  public ask(question?: Content | Content[] | null, options?: {
    formatLine?: (input: string) => Content[],
    suggestion?: (input: string) => ({
      content: string,
      replaceString?: string,
      description?: string,
      replace?: (input: string) => string
      preview?: (input: string) => string
    } | string)[] | void
  }): Promise<string> {
    return new Promise((resolve) => {
      question && this.write(question)

      const input = this.input()

      this.writeLn()

      let suggestions: ({
        content: string,
        replaceString?: string,
        description?: string,
        replace?: (input: string) => string
        preview?: (input: string) => string
      })[] = []
      let suggestionIndex = -1
      const updateBlock = (i: string) => {
        const splittedString = i.split('\n')
        const cursor = input.cursor()
        const cursorIndex = (cursor.y === 0 ? 0 : splittedString.map(x => x + ' ').slice(0, cursor.y).join('x').length + 1) + (Math.min(cursor.x, splittedString[cursor.y].length))

        const block: ContentBlock[] = splittedString.flatMap((line) => [options?.formatLine?.(line).map(x => typeof x === 'string' ? ContentBlock.from(x) : x) ?? ContentBlock.from(line), ContentBlock.from(' \n')]).flat(1)

        this.data = this.data.slice(0, this.data.length - 1)

        let cursorIndexCounter = 0
        for (let i = 0; i < block.length; i++) {
          if (cursorIndexCounter + block[i].length() - 1 >= cursorIndex && cursorIndexCounter - 1 <= cursorIndex) {
            if (block[i].length() === 1) {
              block.splice(i, 1, ContentBlock.from(block[i].text().slice(0, cursorIndex - cursorIndexCounter) || ' ', mergeTextStyles(new TextStyle({
                blink: true,
                id: 'cursor'
              }), block[i].style)))
            }

            block.splice(i, 1, ContentBlock.from(block[i].text().slice(0, cursorIndex - cursorIndexCounter), block[i].style),
              ContentBlock.from(block[i].text().slice(cursorIndex - cursorIndexCounter, cursorIndex - cursorIndexCounter + 1), mergeTextStyles(new TextStyle({
                blink: true,
                id: 'cursor'
              }), block[i].style)),
              ContentBlock.from(block[i].text().slice(cursorIndex - cursorIndexCounter + 1), block[i].style)
          )
            break
          } else {
            cursorIndexCounter += block[i].length()
          }
        }

        this.data.push(block)
        this.emit('data', this.copy())

        suggestions = options?.suggestion?.(i)?.map((suggestion) => {
          if (typeof suggestion === 'string') {
            return {
              content: suggestion
            }
          } else {
            return suggestion
          }
        }) ?? []

        const cursorEl = document.querySelector('#cursor') as HTMLSpanElement | null

        if (!cursorEl) return

        let suggestionsMenu = document.querySelector('#suggestions-menu') as HTMLDivElement

        if (suggestions.length === 0) {
          suggestionsMenu?.remove()
          suggestionIndex = -1
          return
        }

        suggestionIndex = -1

        if (!suggestionsMenu) {
          suggestionsMenu = document.createElement('div')
          suggestionsMenu.id = 'suggestions-menu'
          document.querySelector("#terminalWindow")?.appendChild(suggestionsMenu)
        }

        suggestionsMenu.style.top = `${cursorEl.getBoundingClientRect().top + cursorEl.getBoundingClientRect().height}px`
        suggestionsMenu.style.left = `${cursorEl.getBoundingClientRect().left}px`

        suggestionsMenu.innerHTML = ''

        suggestions.forEach((suggestion) => {
          const suggestionEl = document.createElement('div')
          suggestionEl.classList.add('suggestion')

          suggestionEl.innerText = suggestion.content

          suggestionEl.addEventListener('click', () => {
            input.setInput((suggestion.replace ?? ((input) => {
              const splittedString = input.split(' ')
              const newString = splittedString.slice(0, splittedString.length - 1).join(' ') + (splittedString.length > 1 ? ' ' : '') + (suggestion.replaceString ?? suggestion.content)
              return newString
            }))(input.input()))
            suggestionsMenu.innerHTML = ''

            document.querySelector('#suggestions-menu')?.remove()
            suggestionIndex = -1
          })

          suggestionsMenu.appendChild(suggestionEl)
        })
      }
      updateBlock('')

      input.onKeydown((e) => {
        const showPreview = () => {
          const suggestion = suggestions[suggestionIndex]

          if (!suggestion) return

          const preview = (suggestion.preview ?? ((input) => {
            const splittedString = input.split(' ')
            const newString = splittedString.slice(0, splittedString.length - 1).join(' ') + (splittedString.length > 1 ? ' ' : '') + suggestion.content
            return newString
          }))(input.input())
          const block: ContentBlock[] = preview.split('\n').flatMap((line) => [options?.formatLine?.(line).map(x => typeof x === 'string' ? ContentBlock.from(x) : x) ?? ContentBlock.from(line), ContentBlock.from(' \n')]).flat(1)
          this.data = this.data.slice(0, this.data.length - 1)
          this.data.push(block)
          this.emit('data', this.copy())

          const suggestionsMenu = document.querySelector('#suggestions-menu') as HTMLDivElement
          if (!suggestionsMenu) return

          const suggestionEls = suggestionsMenu.querySelectorAll('.suggestion')

          suggestionEls.forEach((el, i) => {
            if (i === suggestionIndex) {
              el.classList.add('selected')
            } else {
              el.classList.remove('selected')
            }
          })
        }

        if (e.key === 'Tab' && !e.shiftKey) {
          if (suggestions.length === 0) return
          e.preventDefault()

          suggestionIndex = (suggestionIndex + 1) % suggestions.length
          showPreview()
        }
        if (e.key === 'Tab' && e.shiftKey) {
          if (suggestions.length === 0) return
          e.preventDefault()

          suggestionIndex = (suggestionIndex - 1 + suggestions.length) % suggestions.length
          showPreview()
        }
        if (e.key === 'Enter') {
          e.preventDefault()

          if (suggestions.length > 0 && suggestionIndex != -1) {
            input.setInput((suggestions[suggestionIndex].replace ?? ((input) => {
              const splittedString = input.split(' ')
              const newString = splittedString.slice(0, splittedString.length - 1).join(' ') + (splittedString.length > 1 ? ' ' : '') + (suggestions[suggestionIndex].replaceString ?? suggestions[suggestionIndex].content)
              return newString
            }))(input.input()))

            document.querySelector('#suggestions-menu')?.remove()
            suggestionIndex = -1
          } else {
            input.close()
            document.querySelector('#suggestions-menu')?.remove()
            suggestionIndex = -1

            this.data = this.data.slice(0, this.data.length - 1)

            const splittedString = input.input().split('\n')
            const block: ContentBlock[] = splittedString.flatMap((line) => [options?.formatLine?.(line).map(x => typeof x === 'string' ? ContentBlock.from(x) : x) ?? ContentBlock.from(line), ContentBlock.from(' \n')]).flat(1)

            this.data.push(block)

            this.emit('data', this.copy())

            resolve(input.input())
          }
        }
        if (e.key === 'Escape') {
          e.preventDefault()

          document.querySelector('#suggestions-menu')?.remove()
          suggestionIndex = -1

          updateBlock(input.input())
        }
      })

      input.onInput(updateBlock)
      input.onCursor(() => updateBlock(input.input()))
    })
  }

  public clear(): void {
    this.data = []
    this.emit('data', this.copy())
    this.emit('clear', this.copy())
  }

  public length(): number {
    function length(data: StreamData): number {
      return data.reduce((acc, cur) => {
        if (typeof cur === 'string') {
          return acc + cur.length
        } else if (Array.isArray(cur)) {
          return acc + length(cur)
        } else {
          return acc + cur.text().length
        }
      }, 0)
    }

    return length(this.data)
  }

  private listerners: {
    [event in StreamEvents]?: ((data: Content[]) => void)[]
  } = {}
  public on(event: StreamEvents, callback: (data: Content[]) => void) {
    if (!this.listerners[event]) {
      this.listerners[event] = []
    }

    this.listerners[event].push(callback)

    return () => {
      this.off(event, callback)
    }
  }

  public off(event: StreamEvents, callback: (data: Content[]) => void): void {
    if (this.listerners[event]) {
      this.listerners[event] = this.listerners[event].filter((cb) => cb !== callback)
    }
  }

  public once(event: StreamEvents, callback: (data: Content[]) => void) {
    const off = this.on(event, (data) => {
      off()
      callback(data)
    })

    return off
  }

  public emit(event: StreamEvents, data: Content[]): void {
    if (this.listerners[event]) {
      this.listerners[event].forEach((callback) => {
        callback(data)
      })
    }
  }
}