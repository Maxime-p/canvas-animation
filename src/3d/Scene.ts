import { Debug, DomElement } from '@Utils'
import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from 'three'

import { WindowContext } from '../WindowContext.ts'

export class Scene extends THREE.Scene {
  private domElement: DomElement
  private canvas: HTMLCanvasElement
  protected windowContext: WindowContext
  protected debug: Debug | null
  protected debugFolder: GUI | undefined
  protected camera: OrthographicCamera | PerspectiveCamera
  private renderer: WebGLRenderer

  public params: any = {
    isUpdate: true,
  }
  constructor(id: string) {
    super()

    this.windowContext = new WindowContext()
    this.windowContext.addScene(this)

    this.debug = this.windowContext.debug
    this.debugFolder = this.debug?.ui?.addFolder(id)
    this.debugFolder?.open()
    this.debugFolder?.add(this.params, 'isUpdate', true).name('Play/Pause')

    this.domElement = new DomElement(id)
    this.canvas = this.domElement.element

    /** init scene threejs */
    this.camera = new THREE.PerspectiveCamera(75) // default camera
    this.camera.near = 0.1
    this.camera.far = 200
    this.camera.position.z = 100
    this.add(this.camera)

    /** renderer */
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    /** init */
    this.resize()
  }

  get width() {
    return this.domElement.width
  }
  get height() {
    return this.domElement.height
  }

  get isVisible() {
    return this.domElement.isVisible
  }

  scroll() {
    this.domElement.setSize()
  }
  update() {
    this.renderer.render(this, this.camera)
    return this.params.isUpdate
  }
  destroy() {
    this.renderer.dispose()
    this.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })
  }

  resize() {
    console.log('resize scene 3d')
    this.domElement.setSize()

    /** camera */
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = this.domElement.aspectRatio ?? 1
      this.camera.updateProjectionMatrix()
    }

    /** renderer */
    this.renderer.setSize(this.width, this.height, false)
    this.renderer.setPixelRatio(this.windowContext.size.pixelRatio)
  }

  /**
   * DEVICE MOTION
   */
  onDeviceOrientation() {}
  onDeviceAcceleration() {}
}
