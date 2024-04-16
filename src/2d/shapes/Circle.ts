import { deg2rad } from '@Utils'

export function Circle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  style: { isFill?: boolean; isStroke?: boolean } = {
    isFill: false,
    isStroke: true,
  }
) {
  context.beginPath()
  context.arc(x, y, radius, 0, deg2rad(360))
  if (style.isFill) context.fill()
  if (style.isStroke) context.stroke()
  context.closePath()
}

export function Line(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.closePath()
}
