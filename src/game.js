import { Entity } from "./entities/entity"
import { DebugView } from "./debug/debug-view"
import { Player } from "./entities/player"

export class Game {
  constructor() {
    this.player = new Player({
      name: "player",
      strength: 2,
      dexterity: 1,
      charisma: 1,
    })
    this.opponent = new Entity({
      name: "opponent",
      strength: 1,
      dexterity: 1,
      charisma: 2,
    })

    this.debugView = new DebugView(this)
  }
}

export const game = new Game()
