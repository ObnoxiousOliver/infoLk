export class Display {
  constructor() {}

  public static getCharSize () {
    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.whiteSpace = 'pre'
    // span.style.font = 'JetBrains Mono, monospace'
    span.textContent = 'X'

    ;(document.querySelector('#terminalWindow') ?? document.body)?.appendChild(span)

    const { width, height } = span.getBoundingClientRect()

    span.remove()

    return { width, height }
  }

  public static onResize (callback: () => void) {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }

  public static getRem () {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return rem
  }

  public static width () {
    const w = this.getCharSize().width
    return Math.floor((document.documentElement.clientWidth - this.getRem() * 1.5) / w)
  }

  public static height () {
    const h = this.getCharSize().height
    return Math.floor((document.documentElement.clientHeight - this.getRem() * 1.5) / h)
  }
}