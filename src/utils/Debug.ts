import { GUI } from 'dat.gui'

export class Debug {
  ui: GUI | null = null
  constructor() {
    if (window.location.hash == '#debug' && !this.ui) {
      console.log(this.ui)
      this.ui = new GUI()
    }
  }
}
