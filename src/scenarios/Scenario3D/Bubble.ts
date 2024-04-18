import { Bodies, Body } from 'matter-js'
import * as THREE from 'three'
import { ColorRepresentation } from 'three'

export class Bubble extends THREE.Mesh {
  body: Body
  constructor(radius: number, color: ColorRepresentation) {
    super()
    this.geometry = new THREE.BoxGeometry(2 * radius, 2 * radius)
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
    })

    this.body = Bodies.rectangle(0, 0, 2 * radius, 2 * radius)
  }

  setPosition(x: number, y: number) {
    this.position.set(x, y, 0)
    Body.setPosition(this.body, { x, y: -y })
  }

  update() {
    this.position.x = this.body.position.x
    this.position.y = -this.body.position.y
    this.rotation.z = -this.body.angle
  }
}
