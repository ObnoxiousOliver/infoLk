import Color from "color";

export enum FontWeight {
  THIN = 100,
  EXTRA_LIGHT = 200,
  LIGHT = 300,
  REGULAR = 400,
  MEDIUM = 500,
  SEMI_BOLD = 600,
  BOLD = 700,
  EXTRA_BOLD = 800
}

export class TextStyle {
  public readonly color?: Color
  public readonly backgroundColor?: Color
  public readonly weight?: number
  public readonly italic?: boolean
  public readonly underline?: boolean
  public readonly strikeThrough?: boolean
  public readonly blink?: boolean
  public readonly id?: string

  constructor(options: {
    color?: Color
    backgroundColor?: Color,
    weight?: FontWeight,
    italic?: boolean,
    underline?: boolean,
    strikeThrough?: boolean,
    blink?: boolean,
    id?: string
  }) {
    this.color = options.color
    this.backgroundColor = options.backgroundColor
    this.weight = options.weight
    this.italic = options.italic
    this.underline = options.underline
    this.strikeThrough = options.strikeThrough
    this.blink = options.blink
    this.id = options.id
  }

  toString() {
    return [
      this.color?.hex(),
      this.backgroundColor?.hex(),
      this.weight?.toString(),
      this.italic ? 'italic' : '',
      this.underline ? 'underline' : '',
      this.strikeThrough ? 'line-through' : '',
      this.blink ? 'blink' : ''
    ].join(' ')
  }

  isEqual(other: TextStyle) {
    return this.color?.hex() === other.color?.hex() &&
      this.backgroundColor?.hex() === other.backgroundColor?.hex() &&
      this.weight === other.weight &&
      this.italic === other.italic &&
      this.underline === other.underline &&
      this.strikeThrough === other.strikeThrough &&
      this.blink === other.blink
  }
}

export function textStyleToCss(textStyle: TextStyle) {
  return {
    color: textStyle.color?.hex(),
    background: textStyle.backgroundColor?.hex(),
    '--text-color-r': textStyle.color?.rgb().red(),
    '--text-color-g': textStyle.color?.rgb().green(),
    '--text-color-b': textStyle.color?.rgb().blue(),

    'font-weight': textStyle.weight?.toString(),
    'font-style': textStyle.italic ? 'italic' : '',

    animation: textStyle.blink ? 'blink 1.2s -.6s step-end infinite' : '',

    'text-decoration': (textStyle.underline || textStyle.strikeThrough) ? [
      textStyle.underline ? 'underline' : '',
      textStyle.strikeThrough ? 'line-through' : ''
    ].join(' ') : ''
  }
}

export function mergeTextStyles(...textStyles: TextStyle[]): TextStyle {
  return textStyles.reduce((acc, cur) => {
    return new TextStyle({
      color: cur.color ?? acc.color,
      backgroundColor: cur.backgroundColor ?? acc.backgroundColor,
      weight: cur.weight ?? acc.weight,
      italic: cur.italic ?? acc.italic,
      underline: cur.underline ?? acc.underline,
      strikeThrough: cur.strikeThrough ?? acc.strikeThrough,
      blink: cur.blink ?? acc.blink,
      id: cur.id ?? acc.id
    })
  }, new TextStyle({}))
}