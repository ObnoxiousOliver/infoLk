import Color from "color";
import { Content, ContentBlock } from "./Content";
import { mergeTextStyles, TextStyle } from "./TextStyle";
import { createFocusTrap } from "focus-trap";
import { Display } from "./Display";
import { createSignal, Signal } from "solid-js";

export type StreamEvents = 'data' | 'write' | 'clear' | 'input'

export type StreamData = (Content | Content[] | StreamData)[]

export class Stream {
  private data: Signal<StreamData> = createSignal<StreamData>([])

  public get dataSignal() {
    return this.data
  }

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

    return read(this.data[0]())
  }

  public write(content: Content | Content[]): void {
    const data = this.data[0]()
    const newData = [...data, content]
    this.data[1](newData)
    // this.emit('data', this.copy())
    // this.emit('write', this.copy())
  }

  // public copy(): Content[] {
  //   // function copy(data: StreamData): Content[] {
  //   //   return data.flatMap((content) => {
  //   //     if (typeof content === 'string') {
  //   //       return content
  //   //     } else if (Array.isArray(content)) {
  //   //       return copy(content)
  //   //     } else {
  //   //       return content.copy()
  //   //     }
  //   //   })
  //   // }

  //   // return copy(this.data)
  //   return [...this.read()]
  // }

  public writeLn(content?: Content | Content[]): void {
    content && this.write(content)
    this.write('\n')
  }

  public input() {
    let inputString = ''
    let cursor: {
      selectionStart: number,
      selectionEnd: number,
      selectionDirection: 'forward' | 'backward',
    } = {
      selectionStart: 0,
      selectionEnd: 0,
      selectionDirection: 'forward',
    }
    const setCursor = (value: typeof cursor) => {
      cursor = {
        ...cursor,
        ...value
      }

      cursorListeners.forEach((listener) => {
        listener(cursor)
      })
    }
    const inputEl = document.createElement('textarea')

    ;(document.querySelector('#terminalWindow') ?? document.body).append(inputEl)
    inputEl.focus()
    inputEl.id = 'input'
    inputEl.style.position = 'fixed'
    inputEl.style.zIndex = '100000'
    inputEl.style.top = '0'
    inputEl.style.left = '0'
    inputEl.style.width = '100%'
    inputEl.style.height = '0'
    inputEl.style.opacity = '0'
    inputEl.style.pointerEvents = 'none'
    inputEl.style.fontFamily = 'monospace'
    inputEl.autocapitalize = 'off'
    inputEl.autocomplete = 'off'
    inputEl.spellcheck = false
    inputEl.autofocus = true

    let positionTextAreaAnimationFrame: number
    function positionTextArea() {
      const cursorEl = document.querySelector('#cursor') as HTMLSpanElement | null
      positionTextAreaAnimationFrame = requestAnimationFrame(positionTextArea)

      if (!cursorEl) return

      inputEl.style.top = `${cursorEl.getBoundingClientRect().top}px`
      inputEl.style.left = `${cursorEl.getBoundingClientRect().left}px`
      inputEl.style.height = `${cursorEl.getBoundingClientRect().height}px`

    }
    positionTextArea()

    const trap = createFocusTrap(inputEl);

    const setInput = (value: string) => {
      inputString = value
      inputEl.value = value
      inputListeners.forEach((listener) => {
        listener(inputString)
      })
      setCursor({
        selectionStart: inputEl.selectionStart,
        selectionEnd: inputEl.selectionEnd,
        selectionDirection: inputEl.selectionDirection === 'backward' ? 'backward' : 'forward',
      })
    }

    const handleInput = () => {
      const input = inputEl.value
      inputString = input || ''

      setCursor({
        selectionStart: inputEl.selectionStart,
        selectionEnd: inputEl.selectionEnd,
        selectionDirection: inputEl.selectionDirection === 'backward' ? 'backward' : 'forward'
      })

      inputListeners.forEach((listener) => {
        listener(inputString)
      })
    }

    // const handleKeydown = (e: KeyboardEvent) => {
    //   if (e.key === 'Backspace') {
    //     e.preventDefault()

    //     const splittedString = inputString.split('\n')

    //     setCursor({ x: Math.min(cursor.x, splittedString[cursor.y].length) })

    //     if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
    //       if (cursor.y === 0 && cursor.x === 0) return

    //       if (cursor.x === 0) {
    //         setCursor({ y: cursor.y - 1, x: splittedString[cursor.y - 1].length })
    //         splittedString[cursor.y] += splittedString[cursor.y + 1]
    //         splittedString.splice(cursor.y + 1, 1)
    //       } else {
    //         splittedString[cursor.y] = splittedString[cursor.y].slice(cursor.x)
    //         setCursor({ x: 0 })
    //       }
    //     } else if (e.altKey || e.ctrlKey) {
    //       if (cursor.x === 0) {
    //         if (cursor.y === 0) return
    //         setCursor({ y: cursor.y - 1, x: splittedString[cursor.y - 1].length })
    //         splittedString[cursor.y] += splittedString[cursor.y + 1]
    //         splittedString.splice(cursor.y + 1, 1)
    //       } else {
    //         const line = splittedString[cursor.y]
    //         let x = Math.min(cursor.x, line.length) - 1
    //         while (line[x] === ' ' && x > 0) {
    //           x--
    //           console.log(x, '"'+line[x]+'"', line)
    //         }

    //         const prevSpace = line.lastIndexOf(' ', x)

    //         if (prevSpace === -1) {
    //           splittedString[cursor.y] = ''
    //         } else {
    //           splittedString[cursor.y] = splittedString[cursor.y].slice(0, prevSpace)
    //         }
    //       }
    //     } else {
    //       if (cursor.x === 0) {
    //         if (cursor.y === 0) return
    //         setCursor({ y: cursor.y - 1, x: splittedString[cursor.y - 1].length })
    //         splittedString[cursor.y] += splittedString[cursor.y + 1]
    //         splittedString.splice(cursor.y + 1, 1)
    //       } else {
    //         splittedString[cursor.y] = splittedString[cursor.y].slice(0, cursor.x - 1) + splittedString[cursor.y].slice(cursor.x)
    //         setCursor({ x: cursor.x - 1 })
    //       }
    //     }

    //     inputString = splittedString.join('\n')

    //     inputListeners.forEach((listener) => {
    //       listener(inputString)
    //     })
    //   }
    //   if (e.key === 'Delete') {
    //     e.preventDefault()

    //     const splittedString = inputString.split('\n')

    //     if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
    //       if (cursor.y === splittedString.length - 1 && cursor.x === splittedString[cursor.y].length) return

    //       if (cursor.x === splittedString[cursor.y].length) {
    //         splittedString[cursor.y] += splittedString[cursor.y + 1]
    //         splittedString.splice(cursor.y + 1, 1)
    //       } else {
    //         splittedString[cursor.y] = splittedString[cursor.y].slice(0, cursor.x)
    //       }
    //     } else {
    //       if (cursor.x === splittedString[cursor.y].length) {
    //         if (cursor.y === splittedString.length - 1) return
    //         splittedString[cursor.y] += splittedString[cursor.y + 1]
    //         splittedString.splice(cursor.y + 1, 1)
    //       } else {
    //         splittedString[cursor.y] = splittedString[cursor.y].slice(0, cursor.x) + splittedString[cursor.y].slice(cursor.x + 1)
    //       }
    //     }

    //     inputString = splittedString.join('\n')

    //     inputListeners.forEach((listener) => {
    //       listener(inputString)
    //     })
    //   }

    //   if (e.key === 'ArrowLeft') {
    //     e.preventDefault()

    //     if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
    //       if (cursor.x === 0) {
    //         if (cursor.y === 0) return
    //         setCursor({ y: cursor.y - 1, x: inputString.split('\n')[cursor.y - 1].length })
    //       } else {
    //         setCursor({ x: 0 })
    //       }
    //     } else if (e.altKey || e.ctrlKey) {
    //       const line = inputString.split('\n')[cursor.y]
    //       let x = cursor.x
          
    //       while (line[x] === ' ' && x > 0) { x-- }

    //       const nextSpace = line.lastIndexOf(' ', x)

    //       if (nextSpace === -1) {
    //         setCursor({ x: 0 })
    //       } else {
    //         setCursor({ x: nextSpace })
    //       }
    //     } else {
    //       if (cursor.x === 0) {
    //         if (cursor.y === 0) return
    //         setCursor({ y: cursor.y - 1, x: inputString.split('\n')[cursor.y - 1].length })
    //       } else {
    //         cursor.x = Math.min(inputString.split('\n')[cursor.y].length, cursor.x)
    //         setCursor({ x: Math.max(0, cursor.x - 1) })
    //       }
    //     }
    //   }
    //   if (e.key === 'ArrowRight') {
    //     e.preventDefault()

    //     if ((e.metaKey && isMac) || (e.ctrlKey && !isMac)) {
    //       if (cursor.x >= inputString.split('\n')[cursor.y].length) {
    //         if (cursor.y >= inputString.split('\n').length - 1) return
    //         setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1), x: 0 })
    //       } else {
    //         setCursor({ x: inputString.split('\n')[cursor.y].length })
    //       }
    //     } else if (e.altKey || e.ctrlKey) {
    //       if (cursor.x >= inputString.split('\n')[cursor.y].length) {
    //         if (cursor.y >= inputString.split('\n').length - 1) return
    //         setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1), x: 0 })
    //       } else {
    //         const line = inputString.split('\n')[cursor.y]
    //         let x = cursor.x

    //         while (line[x] === ' ') { x++ }

    //         const nextSpace = line.indexOf(' ', x + 1)

    //         if (nextSpace === -1) {
    //           setCursor({ x: inputString.split('\n')[cursor.y].length })
    //         } else {
    //           setCursor({ x: nextSpace })
    //         }
    //       }
    //     } else {
    //       if (cursor.x >= inputString.split('\n')[cursor.y].length) {
    //         if (cursor.y >= inputString.split('\n').length - 1) return

    //         setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1), x: 0 })
    //       } else {
    //         cursor.x = Math.min(inputString.split('\n')[cursor.y].length, cursor.x)
    //         setCursor({ x: cursor.x + 1 })
    //       }
    //     }
    //   }
    //   if (e.key === 'ArrowUp') {
    //     e.preventDefault()

    //     setCursor({ y: Math.max(0, cursor.y - 1) })
    //   }
    //   if (e.key === 'ArrowDown') {
    //     e.preventDefault()

    //     setCursor({ y: Math.min(inputString.split('\n').length - 1, cursor.y + 1) })
    //   }
    // }

    const handleSelectionChange = () => {
      setCursor({
        selectionStart: inputEl.selectionStart,
        selectionEnd: inputEl.selectionEnd,
        selectionDirection: inputEl.selectionDirection === 'backward' ? 'backward' : 'forward',
      })
    }

    inputEl.addEventListener('input', handleInput)
    inputEl.addEventListener('selectionchange', handleSelectionChange)
    // inputEl.addEventListener('keydown', handleKeydown)

    const close = () => {
      // inputEl.removeEventListener('keydown', handleKeydown)
      inputEl.removeEventListener('input', handleInput)
      inputEl.removeEventListener('selectionchange', handleSelectionChange)

      trap.deactivate()
      cancelAnimationFrame(positionTextAreaAnimationFrame)

      for (const listener of keydownListeners) {
        inputEl.removeEventListener('keydown', listener)
      }

      inputEl.remove()
      closeListeners.forEach((listener) => {
        listener()
      })
    }

    const keydownListeners: ((e: KeyboardEvent) => void)[] = []
    const inputListeners: ((input: string) => void)[] = []
    const cursorListeners: ((c: typeof cursor) => void)[] = []
    const closeListeners: (() => void)[] = []

    let inputObj: {
      onKeydown: (callback: (e: KeyboardEvent) => void) => void
      onInput: (callback: (input: string) => void) => void
      onCursor: (callback: (c: typeof cursor) => void) => void
      cursor: () => typeof cursor
      input: () => string
      setInput: (value: string) => void
      close: () => void
      focus: () => void
      onClose: (callback: () => void) => void
    } | null = {
      onKeydown: (callback: (e: KeyboardEvent) => void) => {
        keydownListeners.push(callback)
        inputEl.addEventListener('keydown', callback)
      },
      onInput: (callback: (input: string) => void) => {
        inputListeners.push(callback)
      },
      onCursor: (callback: (c: typeof cursor) => void) => {
        cursorListeners.push(callback)
      },
      cursor() {
        return cursor
      },
      input() {
        return inputString
      },
      setInput,
      close,
      focus: () => {
        inputEl.focus()
      },
      onClose: (callback: () => void) => {
        closeListeners.push(callback)
      }
    }

    return inputObj
  }

  public ask(question?: Content | Content[] | null, options?: {
    formatLine?: (input: string) => Content[],
    suggestion?: (input: string) => {
      suggestions: ({
        content: string,
        replaceString?: string,
        description?: string,
        replace?: (input: string) => string
        preview?: (input: string) => string
      } | string)[]
      hidden?: boolean
    } | void,
  }) {
    question && this.write(question)

    const input = this.input()

    return {
      input,
      promise: new Promise<string>((resolve) => {

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
          const cursorIndex = cursor.selectionDirection === 'forward' ? cursor.selectionEnd : cursor.selectionStart

          let block: ContentBlock[] = splittedString.flatMap((line) => [options?.formatLine?.(line).map(x => typeof x === 'string' ? ContentBlock.from(x) : x) ?? ContentBlock.from(line), ContentBlock.from(' \n')]).flat(1)

          this.data[1](this.data[0]().slice(0, this.data[0]().length - 1))

          const newBlock: ContentBlock[] = []
          for (let i = 0; i < block.length; i++) {
            const selectionCounter = newBlock.reduce((acc, cur) => acc + cur.length(), 0)

            if (selectionCounter + block[i].length() - 1 >= cursor.selectionStart && selectionCounter <= cursor.selectionEnd) {
              newBlock.push(
                ContentBlock.from(block[i].text().slice(0, Math.max(0, cursor.selectionStart - selectionCounter)), block[i].style),
                ContentBlock.from(block[i].text().slice(Math.max(0, cursor.selectionStart - selectionCounter), cursor.selectionEnd - selectionCounter), mergeTextStyles(new TextStyle({
                  backgroundColor: Color('blue'),
                }), block[i].style)),
                ContentBlock.from(block[i].text().slice(cursor.selectionEnd - selectionCounter), block[i].style)
              )
            } else {
              newBlock.push(block[i])
            }
          }

          block = newBlock

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

          // this.data.push(block)
          this.data[1]([...this.data[0](), block])
          // this.emit('data', this.copy())

          // #region Suggestions
          const suggestionOptions = options?.suggestion?.(i.slice(0, cursor.selectionStart))
          suggestions = suggestionOptions?.suggestions.map((suggestion) => {
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

          if (suggestions.length === 0 || suggestionOptions?.hidden) {
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

          const positionSuggestionsMenu = () => {
            // stop animation frame when suggestions menu is removed
            if (!document.querySelector('#suggestions-menu')) return

            const cursorEl = document.querySelector('#cursor') as HTMLSpanElement | null
            if (cursorEl) {
              const cursorRect = cursorEl.getBoundingClientRect()
              const suggestionsMenuRect = suggestionsMenu.getBoundingClientRect()
              
              const padding = Display.getRem() * 0.5

              if (cursorRect.bottom + suggestionsMenuRect.height > window.innerHeight - padding) {
                suggestionsMenu.style.bottom = `${window.innerHeight - cursorRect.top + padding}px`
                suggestionsMenu.style.top = 'auto'
              } else {
                suggestionsMenu.style.top = `${cursorRect.top + cursorRect.height}px`
                suggestionsMenu.style.bottom = 'auto'
              }

              if (cursorRect.left + suggestionsMenuRect.width > window.innerWidth - padding) {
                suggestionsMenu.style.right = `${padding}px`
                suggestionsMenu.style.left = 'auto'
              } else {
                suggestionsMenu.style.left = `${cursorRect.left}px`
                suggestionsMenu.style.right = 'auto'
              }
            }

            requestAnimationFrame(positionSuggestionsMenu)
          }
          positionSuggestionsMenu()

          suggestionsMenu.innerHTML = ''

          suggestions.forEach((suggestion) => {
            const suggestionEl = document.createElement('div')
            suggestionEl.classList.add('suggestion')

            const suggestionContent = document.createElement('span')
            suggestionContent.classList.add('suggestion-content')
            suggestionContent.innerText = suggestion.content
            suggestionEl.appendChild(suggestionContent)

            if (suggestion.description) {
              const suggestionDescription = document.createElement('span')
              suggestionDescription.classList.add('suggestion-description')
              suggestionDescription.innerText = suggestion.description
              suggestionEl.appendChild(suggestionDescription)
            }

            suggestionEl.addEventListener('click', () => {
              input.setInput((suggestion.replace ?? ((input) => {
                const splittedString = input.split(' ')
                const newString = splittedString.slice(0, splittedString.length - 1).join(' ') + (splittedString.length > 1 ? ' ' : '') + (suggestion.replaceString ?? suggestion.content)
                return newString
              }))(input.input()))
              suggestionsMenu.innerHTML = ''

              document.querySelector('#suggestions-menu')?.remove()
              suggestionIndex = -1

              input.focus()
            })

            suggestionsMenu.appendChild(suggestionEl)
          })
          // #endregion
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
            }))(input.input().slice(0, input.cursor().selectionStart))
            const block: ContentBlock[] = (preview + input.input().slice(input.cursor().selectionStart)).split('\n')
              .flatMap((line) => [options?.formatLine?.(line).map(x => typeof x === 'string' ? ContentBlock.from(x) : x) ?? ContentBlock.from(line), ContentBlock.from(' \n')]).flat(1)
            // this.data = this.data.slice(0, this.data.length - 1)
            // this.data.push(block)
            this.data[1]([...this.data[0]().slice(0, this.data[0]().length - 1), block])
            // this.emit('data', this.copy())

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
            e.preventDefault()
            if (suggestions.length === 0) return

            suggestionIndex = (suggestionIndex + 1) % suggestions.length
            showPreview()
          } else if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault()
            if (suggestions.length === 0) return

            suggestionIndex = (suggestionIndex - 1 + suggestions.length) % suggestions.length
            showPreview()
          } else if (e.key === 'Enter') {
            e.preventDefault()

            if (suggestions.length > 0 && suggestionIndex != -1) {
              input.setInput((suggestions[suggestionIndex].replace ?? ((input) => {
                const splittedString = input.split(' ')
                const newString = splittedString.slice(0, splittedString.length - 1).join(' ') + (splittedString.length > 1 ? ' ' : '') + (suggestions[suggestionIndex].replaceString ?? suggestions[suggestionIndex].content)
                return newString
              }))(input.input().slice(0, input.cursor().selectionStart) + input.input().slice(input.cursor().selectionStart)))

              document.querySelector('#suggestions-menu')?.remove()
              suggestionIndex = -1
            } else {
              document.querySelector('#suggestions-menu')?.remove()
              suggestionIndex = -1

              // this.data = this.data.slice(0, this.data.length - 1)
              this.data[1](this.data[0]().slice(0, this.data[0]().length - 1))

              const splittedString = input.input().split('\n')
              const block: ContentBlock[] = splittedString.flatMap((line) => [options?.formatLine?.(line).map(x => typeof x === 'string' ? ContentBlock.from(x) : x) ?? ContentBlock.from(line), ContentBlock.from(' \n')]).flat(1)

              // this.data.push(block)
              this.data[1]([...this.data[0](), block])

              // this.emit('data', this.copy())
              input.close()
            }
          } else if (e.key === 'Escape') {
            e.preventDefault()

            document.querySelector('#suggestions-menu')?.remove()
            suggestionIndex = -1

            updateBlock(input.input())
          } else if (suggestions.length > 0 && suggestionIndex != -1 && !(e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta')) {
            input.setInput((suggestions[suggestionIndex].replace ?? ((input) => {
              const splittedString = input.split(' ')
              const newString = splittedString.slice(0, splittedString.length - 1).join(' ') + (splittedString.length > 1 ? ' ' : '') + (suggestions[suggestionIndex].replaceString ?? suggestions[suggestionIndex].content)
              return newString
            }))(input.input()))

            if (e.key === ' ') {
              e.preventDefault()
            }

            document.querySelector('#suggestions-menu')?.remove()
            suggestionIndex = -1
          }
        })

        input.onInput(updateBlock)
        input.onCursor(() => updateBlock(input.input()))

        input.onClose(() => {
          document.querySelector('#suggestions-menu')?.remove()
          suggestionIndex = -1

          // this.data = this.data.slice(0, this.data.length - 1)
          this.data[1](this.data[0]().slice(0, this.data[0]().length - 1))

          const splittedString = input.input().split('\n')
          const block: ContentBlock[] = splittedString.flatMap((line) => [options?.formatLine?.(line).map(x => typeof x === 'string' ? ContentBlock.from(x) : x) ?? ContentBlock.from(line), ContentBlock.from(' \n')]).flat(1)

          // this.data.push(block)
          this.data[1]([...this.data[0](), block])
          // this.emit('data', this.copy())

          resolve(input.input())
        })
      })
    }
  }

  public clear(): void {
    // this.data = []
    this.data[1]([])
    // this.emit('data', this.copy())
    // this.emit('clear', this.copy())
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

    return length(this.data[0]())
  }

  // private listerners: {
  //   [event in StreamEvents]?: ((data: Content[]) => void)[]
  // } = {}
  // public on(event: StreamEvents, callback: (data: Content[]) => void) {
  //   if (!this.listerners[event]) {
  //     this.listerners[event] = []
  //   }

  //   this.listerners[event].push(callback)

  //   return () => {
  //     this.off(event, callback)
  //   }
  // }

  // public off(event: StreamEvents, callback: (data: Content[]) => void): void {
  //   if (this.listerners[event]) {
  //     this.listerners[event] = this.listerners[event].filter((cb) => cb !== callback)
  //   }
  // }

  // public once(event: StreamEvents, callback: (data: Content[]) => void) {
  //   const off = this.on(event, (data) => {
  //     off()
  //     callback(data)
  //   })

  //   return off
  // }

  // public emit(event: StreamEvents, data: Content[]): void {
  //   if (this.listerners[event]) {
  //     this.listerners[event].forEach((callback) => {
  //       callback(data)
  //     })
  //   }
  // }
}