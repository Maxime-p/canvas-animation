import { Scene } from '@3d'
import { randomRange } from '@Utils'
import { Body, Composite, Engine, Runner } from 'matter-js'
import * as THREE from 'three'
import { terminal } from 'virtual:terminal'

import { Bubble } from './Bubble.ts'
import { Wall } from './Wall.ts'

export default class SceneScenario3D extends Scene {
  private wallLeft: Wall
  private wallTop: Wall
  private wallRight: Wall
  private wallBottom: Wall
  private bubbles: Bubble[]
  private engine: Engine
  private runner: Runner
  private bodies: Body[]
  private acceleration: any
  constructor(id = 'canvas-scene', nBubbles = 10) {
    super(id)

    /** change default camera -> orthographic camera */
    this.camera = new THREE.OrthographicCamera(
      -this.width / 2,
      this.width / 2,
      this.height / 2,
      -this.height / 2
    )
    this.camera.position.z = 100

    /** wall */
    this.wallLeft = new Wall('blue')
    this.wallTop = new Wall('yellow')
    this.wallRight = new Wall('blue')
    this.wallBottom = new Wall('yellow')
    this.add(this.wallLeft)
    this.add(this.wallTop)
    this.add(this.wallRight)
    this.add(this.wallBottom)

    this.wallLeft.depth = 100
    this.wallTop.depth = 100
    this.wallRight.depth = 100
    this.wallBottom.depth = 100

    /** bubbles */
    this.bubbles = []
    const radius_ = 20
    const colors = ['red', 'blue', 'yellow']
    for (let i = 0; i < nBubbles; i++) {
      const bubble_ = new Bubble(radius_, colors[i % colors.length])
      const x_ = (bubble_.position.x = randomRange(
        -this.width / 2,
        this.width / 2
      ))
      const y_ = (bubble_.position.y = randomRange(
        -this.height / 2,
        this.height / 2
      ))
      bubble_.setPosition(x_, y_)
      this.add(bubble_)
      this.bubbles.push(bubble_)
    }

    this.bodies = [
      this.wallLeft.body,
      this.wallTop.body,
      this.wallRight.body,
      this.wallBottom.body,
    ]
    this.bubbles.forEach((bubble) => {
      this.bodies.push(bubble.body)
    })
    // @ts-ignore
    this.engine = Engine.create({ render: { visible: false } })

    Composite.add(this.engine.world, this.bodies)
    this.runner = Runner.create()
    Runner.run(this.runner, this.engine)
    this.engine.gravity.scale *= 5

    this.windowContext.useDeviceAcceration = true
    this.acceleration = this.windowContext.acceleration

    /** init */
    this.resize()
  }

  update() {
    super.update()

    if (!!this.bubbles) {
      this.bubbles.forEach((bubble) => {
        bubble.update()
      })
    }
  }

  onDeviceAcceleration() {
    /** debug */
    let coordinates_ = ''
    coordinates_ = coordinates_.concat(
      this.acceleration.x.toFixed(2),
      ', ',
      this.acceleration.y.toFixed(2),
      ', ',
      this.acceleration.z.toFixed(2)
    )

    this.engine.gravity.x = -this.acceleration.x / 9.81
    this.engine.gravity.y = this.acceleration.y / 9.81
  }

  resize() {
    super.resize()

    if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.left = -this.width / 2
      this.camera.right = this.width / 2
      this.camera.top = this.height / 2
      this.camera.bottom = -this.height / 2
    }

    if (!!this.wallLeft) {
      const thickness_ = 10

      /** walls sizes */
      this.wallLeft.setSize(thickness_, this.height)
      this.wallTop.setSize(this.width - 2 * thickness_, thickness_)
      this.wallRight.setSize(thickness_, this.height)
      this.wallBottom.setSize(this.width - 2 * thickness_, thickness_)

      /** walls position */
      this.wallLeft.setPosition(-this.width / 2 + thickness_ / 2, 0)
      this.wallTop.setPosition(0, this.height / 2 - thickness_ / 2)
      this.wallRight.setPosition(this.width / 2 - thickness_ / 2, 0)
      this.wallBottom.setPosition(0, -this.height / 2 + thickness_ / 2)
    }
  }
}
