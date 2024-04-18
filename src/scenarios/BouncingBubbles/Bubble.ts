import { Circle } from '@2d'
import { clamp, randomRange } from '@Utils'

export class Bubble {
  private context: CanvasRenderingContext2D
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  gx: number
  gy: number
  private transitionWall: 'top' | 'bottom'

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    transitionWall: 'top' | 'bottom'
  ) {
    this.context = context
    this.x = x
    this.y = y
    this.radius = radius
    this.transitionWall = transitionWall

    const speed = 100
    this.vx = randomRange(-speed, speed)
    this.vy = randomRange(-speed, speed)

    this.gx = 0
    this.gy = 1
  }

  update(
    width: number,
    height: number,
    deltaTime = 16,
    speed = 1,
    radius = 10
  ) {
    this.radius = radius

    this.x += ((this.vx + this.gx) * speed * deltaTime) / 1000
    this.y += ((this.vy + this.gy) * speed * deltaTime) / 1000

    this.vx = this.x < this.radius ? Math.abs(this.vx) : this.vx
    this.vx = this.x > width - this.radius ? -Math.abs(this.vx) : this.vx
    if (this.transitionWall !== 'top') {
      this.vy = this.y < this.radius ? Math.abs(this.vy) : this.vy
    }
    if (this.transitionWall !== 'bottom') {
      this.vy = this.y > height - this.radius ? -Math.abs(this.vy) : this.vy
    }

    /** constrain bubbles (cf. gravity) */
    this.x = clamp(this.x, this.radius, width - this.radius)
  }

  draw() {
    Circle(this.context, this.x, this.y, this.radius, {
      isStroke: true,
      isFill: true,
    })
  }
}
