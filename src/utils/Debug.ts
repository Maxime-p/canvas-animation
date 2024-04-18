import { GUI } from 'dat.gui'

export class Debug {
  ui: GUI | null = null

  constructor() {
    if (window.location.hash == '#debug' && !this.ui) {
      this.ui = new GUI()
    }
  }

  get active() {
    return !!this.ui
  }

  set domDebug(content: string) {
    document.getElementById('debug')!.innerHTML = content
    document.getElementById('debug')!.style.display = 'inline'
  }
}
