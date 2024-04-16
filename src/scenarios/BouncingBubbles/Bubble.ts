import { Circle } from '@2d'
import { randomRange } from '@Utils'

export class Bubble {
  private context: CanvasRenderingContext2D
  x: number
  y: number
  radius: number
  private vx: number
  private vy: number

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) {
    this.context = context
    this.x = x
    this.y = y
    this.radius = radius

    const speed = 50
    this.vx = randomRange(-speed, speed)
    this.vy = randomRange(-speed, speed)
  }

  update(
    width: number,
    height: number,
    deltaTime = 16,
    speed = 1,
    radius = 10
  ) {
    this.x += (this.vx * speed * deltaTime) / 1000
    this.y += (this.vy * speed * deltaTime) / 1000

    // Bounce the bubble off the walls
    if (this.x < this.radius || this.x > width - this.radius) {
      this.vx = -this.vx
    }
    if (this.y < this.radius || this.y > height - this.radius) {
      this.vy = -this.vy
    }

    // Ensure the bubble stays within the scene
    this.x = Math.min(Math.max(this.x, this.radius), width - this.radius)
    this.y = Math.min(Math.max(this.y, this.radius), height - this.radius)

    this.radius = radius
  }

  draw() {
    Circle(this.context, this.x, this.y, this.radius, {
      isStroke: true,
      isFill: true,
    })
  }
}
