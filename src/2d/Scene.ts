import { Debug } from '@Utils'
import { DomElement } from '@Utils'
import { GUI } from 'dat.gui'

import { WindowContext } from '../WindowContext'

export class Scene {
  private domElement: DomElement
  private canvas: HTMLCanvasElement
  protected context: CanvasRenderingContext2D
  protected windowContext: WindowContext
  protected debug: Debug | null
  protected debugFolder: GUI | undefined
  public params: any = {
    isUpdate: true,
  }

  constructor(id: string) {
    this.windowContext = new WindowContext()
    this.windowContext.addScene(this)

    this.debug = this.windowContext.debug
    this.debugFolder = this.debug?.ui?.addFolder(id)
    this.debugFolder?.open()
    this.debugFolder?.add(this.params, 'isUpdate', true).name('Play/Pause')

    this.domElement = new DomElement(id)
    this.canvas = this.domElement.element
    this.context = this.canvas.getContext('2d')!

    this.resize()
  }

  get width() {
    return this.domElement.width
  }

  get height() {
    return this.domElement.height
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  update() {
    return this.params.isUpdate
  }

  resize() {
    this.domElement.setSize()
    const pixelRatio = this.windowContext.size.pixelRatio
    this.canvas.width = this.domElement.width * pixelRatio
    this.canvas.height = this.domElement.height * pixelRatio
    this.context.scale(pixelRatio, pixelRatio)
  }
}
