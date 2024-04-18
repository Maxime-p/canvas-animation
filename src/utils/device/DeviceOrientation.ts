import { terminal } from 'virtual:terminal'

import EventEmitter from '../events/EventEmitter.ts'

export class DeviceOrientation extends EventEmitter {
  alpha: number = 0 // Z (0 to 360)
  beta: number = 0 // Y (180 to -180)
  gamma: number = 0 // X (90 to -90)

  constructor() {
    super()

    if (navigator.permissions) {
      Promise.all([
        // @ts-ignore
        navigator.permissions.query({ name: 'accelerometer' }),
        // @ts-ignore
        navigator.permissions.query({ name: 'magnetometer' }),
        // @ts-ignore
        navigator.permissions.query({ name: 'gyroscope' }),
      ])
        .then((results) => {
          if (results.every((result) => result.state === 'granted')) {
            this.init()
          } else {
            terminal.log('Permission to use sensor was denied.')
            this.init()
          }
        })
        .catch((err) => {
          terminal.log(
            'Integration with Permissions API is not enabled, still try to start app.',
            err
          )
          this.init()
        })
    } else {
      terminal.log('No Permissions API, still try to start app.')
      this.init()
    }
  }

  init() {
    window.addEventListener('deviceorientation', (e) => {
      if (!e.alpha || !e.beta || !e.gamma) return
      this.alpha = e.alpha
      this.beta = e.beta
      this.gamma = e.gamma
      this.trigger('reading')
    })
  }
}
