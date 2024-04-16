import { BouncingBubbleScene } from '@Scenarios'

import './style.css'

document.getElementById('app')!.innerHTML = `
  <h1>Creative Web</h1>
  <div class="container">
    <canvas id="scene1" class="scene"></canvas>
    <canvas id="scene2" class="scene"></canvas>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  new BouncingBubbleScene(100, 'scene1')
  new BouncingBubbleScene(20, 'scene2')
})
