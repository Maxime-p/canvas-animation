export class DomElement {
  public element: HTMLCanvasElement
  width = 0
  height = 0
  position: {
    top: number
    left: number
    bottom: number
    right: number
  } = { top: 0, left: 0, bottom: 0, right: 0 }
  isVisible: any
  aspectRatio: number | undefined

  constructor(id: string) {
    this.element = document.getElementById(id) as HTMLCanvasElement
    this.setSize()
  }

  setSize() {
    const rect_ = this.element.getBoundingClientRect()
    this.width = rect_.width
    this.height = rect_.height
    this.position = {
      left: rect_.left,
      top: rect_.top,
      right: rect_.right,
      bottom: rect_.bottom,
    }
  }
}
