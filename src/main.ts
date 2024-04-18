import { BouncingBubbleScene } from '@Scenarios'

import { WindowContext } from './WindowContext.ts'
import './style.css'
import { askMotionAccess } from './utils/device/DeviceAccess.ts'

document.getElementById('app')!.innerHTML = `
  <h1>Creative Web</h1>
  <div>
  <button id="btn-access">Allow sensors</button>
</div>
  <div class="container">
    <canvas id="scene1" class="scene"></canvas>
    <canvas id="scene2" class="scene"></canvas>
  </div>
`
//<canvas id="canvas-scene-3d" class="scene"></canvas>

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-access') as HTMLButtonElement
  btn.addEventListener('click', () => {
    askMotionAccess()
  })

  const scene1 = new BouncingBubbleScene(50, 'scene1', 'bottom')
  //const scene2 = new SceneScenario3D('canvas-scene-3d', 10)
  const scene3 = new BouncingBubbleScene(20, 'scene2', 'top')

  const windowContext = new WindowContext()
  const time = windowContext.time

  const update = () => {
    const bubblesToRemoveScene1 = scene1.bubbles.filter(
      (b) => b.y > scene1.height
    )
    const bubblesToRemoveScene3 = scene3.bubbles.filter((b) => b.y < 0)
    //const bubblesToRemove3d = scene2.bubbles.filter((b) => b)

    bubblesToRemoveScene1.forEach((b) => {
      // Remove from scene 1
      scene1.bubbles = scene1.bubbles.filter((bubble) => bubble !== b)

      // Add to other scene
      scene3.addBubble(b.x, b.y, b.vx, b.vy)
    })

    bubblesToRemoveScene3.forEach((b) => {
      // Remove from scene 3
      scene3.bubbles = scene3.bubbles.filter((bubble) => bubble !== b)

      // Add to other scene
      scene1.addBubble(b.x, b.y, b.vx, b.vy)
    })
    /*
    bubblesToRemove3d.forEach((b) => {
      // Remove from scene 2 => removeBubble(b)
      // Add to other scene
    })
    */
  }

  time.on('update', update)
})
