import { Entity } from "./entity"
import { game } from "./../game"

export class Player extends Entity {
  constructor(...args) {
    super(...args)
    this.name = `Player (${this.name})`
  }

  get isPlayer() {
    return true
  }

  get opponent() {
    return game.scene.opponent
  }

  advance() {
    const initial = this.slot
    if (this.slot < this.opponent.slot) {
      this.slot += 1
    }
    return initial !== this.slot
  }

  retreat() {
    const initial = this.slot
    this.slot -= 1
    return initial !== this.slot
  }
}
