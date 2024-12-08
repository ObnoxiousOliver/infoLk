import { TextStyle } from './TextStyle'

export type Content = ContentBlock | string

export class ContentBlock {
  content: string
  style: TextStyle

  constructor(content: string, style: TextStyle) {
    this.content = content
    this.style = style
  }

  toString(): string {
    return this.content + this.style.toString()
  }

  /**
   * Searches for the index of the content in the content block.
   */
  public indexOf(str: string): number {
    return this.text().indexOf(str)
  }

  public length(): number {
    return this.text().length
  }

  public replace(index: number, content: Content) {
    const text = this.text()
    const contentText = typeof content === 'string' ? content : content.text()

    this.content = text.slice(0, index) + contentText + text.slice(index + contentText.length)
  }

  /**
   * Splits the content block into multiple content blocks based on the divider.
   * It keeps the style of the original content block.
   * 
   * @param divider The string to split the content block by
   * @returns An array of content blocks
   */
  public split(divider: string): ContentBlock[] {
    return this.text().split(divider).map((content) => {
      return new ContentBlock(content, this.style)
    })
  }

  /**
   * Returns the raw text of the content block.
   */
  public text(): string {
    return this.content
  }

  /**
   * Returns a copy of the content block.
   */
  public copy(): ContentBlock {
    return new ContentBlock(this.content, this.style)
  }

  public static from(content: Content, style?: TextStyle): ContentBlock {
    if (typeof content === 'string') {
      return new ContentBlock(content, style ?? new TextStyle({}))
    } else {
      return new ContentBlock(content.text(), style ?? content.style)
    }
  }
}