import { Scene as Scene2d } from '@2d'
import { Debug } from '@Utils'
import { Time } from '@Utils'

import { Scene as Scene3d } from './3d/Scene.ts'
import DeviceAcceleration from './utils/device/DeviceAcceleration.ts'
import { DeviceOrientation } from './utils/device/DeviceOrientation.ts'

let instanceWindowContext: WindowContext | null = null

export class WindowContext {
  private scenes: (Scene2d | Scene3d)[] = []
  time = new Time()
  debug: Debug | null = null
  orientation: DeviceOrientation | undefined
  acceleration: DeviceAcceleration | undefined

  constructor() {
    if (!!instanceWindowContext) return instanceWindowContext
    instanceWindowContext = this

    this.debug = new Debug()

    /** events */
    window.addEventListener('resize', () => this.resize())
    window.addEventListener('scroll', () => this.scroll())
    this.time = new Time()
    this.time.on('update', () => this.update())
  }

  get size() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    }
  }

  addScene(scene: Scene2d | Scene3d) {
    this.scenes.push(scene)
  }

  update() {
    this.scenes.forEach((s) => s.update())
  }
  resize() {
    this.scenes.forEach((s) => s.resize())
  }
  scroll() {
    this.scenes.forEach((s) => s.scroll())
  }
  destroy() {
    this.scenes.forEach((s) => s.destroy())
    window.removeEventListener('resize', () => this.resize())
    window.removeEventListener('scroll', () => this.scroll())
    this.time.off('update')
    if (this.debug?.active) this.debug?.ui?.destroy()
  }

  // Device motion
  set useDeviceOrientation(isUsed: boolean) {
    if (isUsed && !this.orientation) {
      this.orientation = new DeviceOrientation()
      this.orientation.on('reading', () => this.onDeviceOrientation())
    }
    if (!isUsed && this.orientation) this.orientation.off('reading')
  }
  onDeviceOrientation() {
    this.scenes.forEach((s) => s.onDeviceOrientation())
  }

  set useDeviceAcceration(isTrigger: boolean) {
    if (isTrigger && !this.acceleration) {
      this.acceleration = new DeviceAcceleration()
      this.acceleration.on('reading', () => this.onDeviceAcceleration())
    }
    if (!isTrigger && !!this.acceleration) this.acceleration.off('reading')
  }

  onDeviceAcceleration() {
    this.scenes.forEach((s) => s.onDeviceAcceleration())
  }
}
