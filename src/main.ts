import { BouncingBubbleScene } from '@Scenarios'
import { randomRange } from '@Utils'

import { WindowContext } from './WindowContext.ts'
import SceneScenario3D from './scenarios/Scenario3D/SceneScenario3D.ts'
import './style.css'
import { askMotionAccess } from './utils/device/DeviceAccess.ts'

document.getElementById('app')!.innerHTML = `
  <h1>Creative Web</h1>
  <div>
  <button id="btn-access">Allow sensors</button>
</div>
  <div class="container">
    <canvas id="scene1" class="scene"></canvas>
    <canvas id="canvas-scene-3d" class="scene"></canvas>
    <canvas id="scene2" class="scene"></canvas>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-access') as HTMLButtonElement
  btn.addEventListener('click', () => {
    askMotionAccess()
  })

  const scene1 = new BouncingBubbleScene(10, 'scene1')
  const scene2 = new SceneScenario3D('canvas-scene-3d', 5)
  const scene3 = new BouncingBubbleScene(10, 'scene2')

  const windowContext = new WindowContext()
  const time = windowContext.time

  const update = () => {
    const bubblesToRemoveScene1 = scene1.bubbles.filter(
      (b) => b.y > scene1.height || b.y < 0
    )
    const bubblesToRemoveScene2 = scene2.bubbles.filter(
      (b) =>
        b.position.y < -scene2.height / 2 || b.position.y > scene2.height / 2
    )

    const bubblesToRemoveScene3 = scene3.bubbles.filter(
      (b) => b.y < 0 || b.y > scene3.height
    )

    bubblesToRemoveScene1.forEach((b) => {
      // Remove from scene 1
      scene1.bubbles = scene1.bubbles.filter((bubble) => bubble !== b)

      // Add to other scene
      if (b.y < 0) {
        scene3.addBubble(b.x, scene3.height - b.radius, b.vx, b.vy)
      }
      if (b.y > scene1.height) {
        scene2.addBubble(
          b.x - scene2.width / 2,
          scene2.height / 2 - scene2.radius
        )
      }
    })

    bubblesToRemoveScene2.forEach((b) => {
      // Remove from scene 2
      scene2.bubbles = scene2.bubbles.filter((bubble) => bubble !== b)

      // Add to other scene
      if (b.position.y > scene2.height / 2) {
        scene1.addBubble(
          b.position.x + scene2.width / 2,
          scene1.height - scene2.radius,
          randomRange(-100, 0),
          randomRange(-100, 0)
        )
      }

      if (b.position.y < -scene2.height / 2) {
        scene3.addBubble(
          b.position.x + scene2.width / 2,
          0,
          randomRange(0, 100),
          randomRange(0, 100)
        )
      }
      scene2.removeBubble(b)
    })

    bubblesToRemoveScene3.forEach((b) => {
      // Remove from scene 3
      scene3.bubbles = scene3.bubbles.filter((bubble) => bubble !== b)

      // Add to other scene
      if (b.y < 0) {
        scene2.addBubble(
          b.x - scene2.width / 2,
          -scene2.height / 2 + scene2.radius
        )
      }
      if (b.y > scene3.height) {
        scene1.addBubble(b.x, b.radius, b.vx, b.vy)
      }
    })
  }

  time.on('update', update)
})
