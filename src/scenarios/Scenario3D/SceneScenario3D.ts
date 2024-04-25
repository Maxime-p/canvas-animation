import { Scene } from '@3d'
import { randomRange } from '@Utils'
import { Body, Composite, Engine, Runner } from 'matter-js'
import * as THREE from 'three'
import { Material } from 'three'

import { Bubble } from './Bubble.ts'
import { Wall } from './Wall.ts'

export default class SceneScenario3D extends Scene {
  private wallLeft: Wall
  private wallTop: Wall
  private wallRight: Wall
  private wallBottom: Wall
  private platform1: Wall
  private platform2: Wall
  public bubbles: Bubble[]
  private engine: Engine
  private runner: Runner
  private bodies: Body[]
  private acceleration: any
  public radius = 20

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
    this.platform1 = new Wall('white')
    this.platform2 = new Wall('white')
    this.add(this.wallLeft)
    this.add(this.wallTop)
    this.add(this.wallRight)
    this.add(this.wallBottom)
    this.add(this.platform1)
    this.add(this.platform2)

    this.wallLeft.depth = 100
    this.wallTop.depth = 100
    this.wallRight.depth = 100
    this.wallBottom.depth = 100
    this.platform1.depth = 100
    this.platform2.depth = 100

    /** bubbles */
    this.bubbles = []
    for (let i = 0; i < nBubbles; i++) {
      const bubble_ = new Bubble(this.radius, this.generateRandomColor())
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
      this.platform1.body,
      this.platform2.body,
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

  addBubble(x: number, y: number) {
    // create new bubble
    const bubble_ = new Bubble(this.radius, this.generateRandomColor())
    bubble_.setPosition(x, y)
    this.add(bubble_)
    this.bubbles.push(bubble_)

    // update du composite
    Composite.add(this.engine.world, bubble_.body)
  }

  removeBubble(bubble: Bubble) {
    bubble.geometry.dispose()
    if (bubble.material instanceof Material) {
      bubble.material.dispose()
    }
    bubble.removeFromParent()

    // remove from physic engine (composite)
    Composite.remove(this.engine.world, bubble.body)

    // remove from this.bubbles
    this.bubbles = this.bubbles.filter((b) => b !== bubble)
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
      const thickness_ = 20

      /** walls sizes */
      this.wallLeft.setSize(thickness_, this.height)
      this.wallTop.setSize(this.width, thickness_)
      this.wallRight.setSize(thickness_, this.height)
      this.wallBottom.setSize(this.width, thickness_)

      /** walls position */
      this.wallLeft.setPosition(-this.width / 2 - thickness_ / 2, 0)
      this.wallTop.setPosition(0, this.height / 2 + thickness_ * 2)
      this.wallRight.setPosition(this.width / 2 + thickness_ / 2, 0)
      this.wallBottom.setPosition(
        0,
        -this.height / 2 - thickness_ / 2 - this.radius * 2
      )

      /* platforms */
      this.platform1.setSize(this.width / 2, 20)
      this.platform1.setPosition(-this.width / 4, 50)
      this.platform2.setSize(this.width / 2, 20)
      this.platform2.setPosition(this.width / 4, -50)
    }
  }

  // Random color
  generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };
}
