import EventEmitter from './events/EventEmitter.ts'

export class Time extends EventEmitter {
  private start: number
  private current: number
  elapsed: number
  delta: number

  constructor() {
    super()
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    this.update()
  }

  update() {
    const current_ = Date.now()
    this.delta = current_ - this.current
    this.current = current_
    this.elapsed = current_ - this.start

    this.trigger('update')

    window.requestAnimationFrame(() => this.update())
  }
}
