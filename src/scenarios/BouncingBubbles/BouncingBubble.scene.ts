import { Line, Scene } from '@2d'
import { clamp, distance2d, randomRange } from '@Utils'
import { terminal } from 'virtual:terminal'

import { DeviceOrientation } from '../../utils/device/DeviceOrientation.ts'
import { Bubble } from './Bubble'

export class BouncingBubbleScene extends Scene {
  private bubbles: Bubble[] = []
  private orientation: DeviceOrientation | undefined

  constructor(nBubbles: number, id: string) {
    super(id)

    this.params.threshold = 75
    this.params.lineWidth = 2
    this.params.speed = 1
    this.params.radius = 10
    this.params.nBubbles = nBubbles
    this.params.gStrength = 300

    this.debugFolder?.add(this.params, 'threshold', 0, 350)
    this.debugFolder?.add(this.params, 'speed', -10, 10, 0.25)
    this.debugFolder?.add(this.params, 'radius', 0, 50)
    this.debugFolder
      ?.add(this.params, 'strokeWeight', 0, 10, 1)
      .name('stroke weight')
    this.debugFolder
      ?.add(this.params, 'nBubbles', 0, 500, 1)
      .name('Bubbles number')

    this.windowContext.useDeviceOrientation = true
    this.orientation = this.windowContext.orientation

    this.generateBubbles()
  }

  generateBubbles() {
    for (let i = 0; i < this.params.nBubbles; i++) {
      const x_ = randomRange(
        this.params.radius,
        this.width - this.params.radius
      )
      const y__ = randomRange(
        this.params.radius,
        this.height - this.params.radius
      )
      const bubble_ = new Bubble(this.context, x_, y__, this.params.radius)
      this.bubbles.push(bubble_)
    }
    this.clear()
    this.draw()
  }

  update() {
    if (!super.update()) return

    this.clear()
    this.bubbles.forEach((b) => {
      b.update(
        this.width,
        this.height,
        this.windowContext.time.delta,
        this.params.speed
      )
    })
    this.draw()
  }

  draw() {
    /** style */
    this.context.strokeStyle = 'white'
    this.context.fillStyle = 'black'
    this.context.lineWidth = this.params.strokeWeight

    if (!!this.bubbles) {
      for (let i = 0; i < this.bubbles.length; i++) {
        const current_ = this.bubbles[i]
        for (let j = i; j < this.bubbles.length; j++) {
          const next_ = this.bubbles[j]

          if (
            distance2d(current_.x, current_.y, next_.x, next_.y) <
            this.params.threshold
          ) {
            Line(this.context, current_.x, current_.y, next_.x, next_.y)
          }
        }
      }

      this.bubbles.forEach((b) => {
        b.draw()
      })
    }
  }

  onDeviceOrientation() {
    /** gravity orientation */
    let gx_ = this.orientation.gamma / 90 // -1 : 1
    let gy_ = this.orientation.beta / 90 // -1 : 1
    gx_ = clamp(gx_, -1, 1)
    gy_ = clamp(gy_, -1, 1)

    /** update */
    gx_ *= this.params.gStrength // apply gravity strength
    gy_ *= this.params.gStrength // apply gravity strength
    if (!!this.bubbles) {
      this.bubbles.forEach((b) => {
        b.gx = gx_
        b.gy = gy_
      })
    }
  }

  resize() {
    super.resize()

    if (!!this.bubbles) {
      this.bubbles.forEach((b) => {
        b.x = b.x > this.width - b.radius ? this.width - b.radius : b.x
        b.y = b.y > this.height - b.radius ? this.height - b.radius : b.y
      })
    }
  }
}
