import { Entity } from "./entities/entity"
import { Player } from "./entities/player"
import TRACKER from "./entities/classes/tracker.yaml"
// import SLIME from "./entities/enemies/slime.yaml"
import IMP from "./entities/enemies/imp.yaml"
import { Combat } from "./scenes/combat/combat"
import { Chance } from "chance"

export class Game {
  constructor() {
    this.el = document.createElement("div")
    this.el.classList.add("game")
    document.body.appendChild(this.el)

    this.chance = new Chance()
    this.player = new Player(TRACKER)
    this.opponent = new Entity(IMP)

    this.setScene()
  }

  setScene() {
    this.scene = new Combat(this, this.player, this.opponent)
  }
}

export const game = new Game()
