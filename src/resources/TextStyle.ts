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
}

export function textStyleToCss(textStyle: TextStyle) {
  return {
    color: textStyle.color?.hex(),
    background: textStyle.backgroundColor?.hex(),
    '--text-color-r': textStyle.color?.rgb().red(),
    '--text-color-g': textStyle.color?.rgb().green(),
    '--text-color-b': textStyle.color?.rgb().blue(),

    fontWeight: textStyle.weight?.toString(),
    fontStyle: textStyle.italic ? 'italic' : '',

    animation: textStyle.blink ? 'blink 1.2s -.6s step-end infinite' : '',

    textDecoration: (textStyle.underline || textStyle.strikeThrough) ? [
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