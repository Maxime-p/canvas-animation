import { BouncingBubbleScene } from '@Scenarios'

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

  new BouncingBubbleScene(100, 'scene1')
  new SceneScenario3D('canvas-scene-3d', 10)
  new BouncingBubbleScene(20, 'scene2')
})
