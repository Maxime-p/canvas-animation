import { Bodies, Body } from 'matter-js'
import * as THREE from 'three'
import { ColorRepresentation } from 'three'

export class Wall extends THREE.Mesh {
  depth: number
  body: Body

  constructor(color: ColorRepresentation) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
    })
    super(geometry, material)

    this.depth = 1

    this.body = Bodies.rectangle(0, 0, 1, 1, { isStatic: true })
  }

  setPosition(x: number, y: number) {
    this.position.set(x, y, 0)
    Body.setPosition(this.body, { x, y: -y })
  }

  setSize(width: number, height: number) {
    const oldScaleX_ = this.scale.x
    const oldScaleY_ = this.scale.y
    Body.scale(this.body, width / oldScaleX_, height / oldScaleY_)
    this.scale.set(width, height, this.depth)
  }
}
