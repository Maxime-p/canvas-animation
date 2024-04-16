import { Scene } from '@2d'
import { Debug } from '@Utils'
import { Time } from '@Utils'

let instanceWindowContext: WindowContext | null = null

export class WindowContext {
  private scenes: Scene[] = []
  time = new Time()
  debug: Debug | null = null

  constructor() {
    if (!!instanceWindowContext) return instanceWindowContext
    instanceWindowContext = this

    this.debug = new Debug()

    window.addEventListener('resize', () => this.resize())
    this.time.on('update', () => this.update())
  }

  get size() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    }
  }

  addScene(scene: Scene) {
    this.scenes.push(scene)
  }

  update() {
    this.scenes.forEach((s) => s.update())
  }
  resize() {
    this.scenes.forEach((s) => s.resize())
  }
}
