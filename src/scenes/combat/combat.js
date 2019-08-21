import StateMachine from "javascript-state-machine"
import playerControlsTemplate from "./player-controls.lit"
import playerStatsTemplate from "./entity-stats.lit"
import { render, html } from "lit-html"

import "./combat.sass"

const template = scene => html`
  <section class="combat">
    <section class="scene"></section>
    <section class="dashboard">
      <section class="player">${playerStatsTemplate(scene.player)}</section>
      <section class="controls">${playerControlsTemplate(scene)}</section>
      <section class="opponent">${playerStatsTemplate(scene.opponent)}</section>
    </section>
  </section>
`

export class Combat {
  constructor(
    /** @type import("../../game").Game */ game,
    /** @type import("../../entities/player").Player */ player,
    /** @type import("../../entities/entity").Entity */ opponent,
  ) {
    this.game = game
    this.player = player
    this.opponent = opponent

    this._fsm()

    this.render()
  }

  async render() {
    await new Promise(r => requestAnimationFrame(r))
    render(template(this), this.game.el)

    await new Promise(r => setTimeout(r, 500))
  }

  async turn(/** @type import("../../moves/move").Move */ move) {
    // await end of call stack
    await new Promise(r => requestAnimationFrame(r))

    move.execute()
    await this.render()

    this.opponent.upkeep()
    await this.render()

    move = this.game.chance.pickone(Object.values(this.opponent.moves))
    move.execute()
    await this.render()

    this.player.upkeep()
    await this.render()

    this.next()
  }

  onInput(lifecycle, /** @type import("../../moves/move").Move */ move) {
    this.turn(move)
  }
}

StateMachine.factory(Combat, {
  init: "awaiting-input",
  transitions: [
    { name: "input", from: "awaiting-input", to: "player-attack" },
    { name: "next", from: "player-attack", to: "awaiting-input" },
  ],
})
