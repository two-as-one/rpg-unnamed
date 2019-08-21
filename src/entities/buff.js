import { cap } from "../utils/cap"

export class Buff {
  constructor(name, power = 1) {
    this.name = name
    this.power = cap(power, 0, 5)

    this.duration = 0

    // this buffer is used to prevent a buff from counting down on the turn it's cast
    this.__buffer = true
  }

  upkeep() {
    if (this.__buffer) {
      this.__buffer = false
    } else {
      this.duration = cap(this.duration - 1, 0, 5)
    }
  }

  get isActive() {
    return this.duration > 0
  }

  activate(duration = 1) {
    this.__buffer = true
    this.duration = duration
  }
}
