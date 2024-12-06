export class Trap {
  /**
   * Trap focus on an element
   * @param element The element to trap focus on
   */
  public static focus(element: HTMLElement): void {
    element.tabIndex = 0
    element.focus()
    element.addEventListener('blur', () => {
      element.focus()
    })
  }
}