import StateMachine from "javascript-state-machine"
import playerControlsTemplate from "./player-controls.lit"
import playerStatsTemplate from "./entity-stats.lit"
import { render, html } from "lit-html"

import "./combat.sass"

const entityTemplate = (
  /** @type import("./../../entities/entity").Entity*/ entity,
  results,
) => html`
  <section
    class="entity ${entity.isPlayer ? "player" : ""} ${entity.isProne
      ? "prone"
      : ""} ${results?.move.owner === entity ? "attack" : ""}"
  >
    ${results?.move.owner === entity && !results?.hit
      ? html`
          <span class="miss">MISS</span>
        `
      : ""}
  </section>
`

const template = (/** @type Combat */ scene, results) => html`
  <section class="combat">
    <section class="scene">
      <section class="entities">
        <section class="slot slot-0">
          ${scene.player.slot === 0
            ? entityTemplate(scene.player, results)
            : ""}
          ${scene.opponent.slot === 0
            ? entityTemplate(scene.opponent, results)
            : ""}
        </section>
        <section class="slot slot-1">
          ${scene.player.slot === 1
            ? entityTemplate(scene.player, results)
            : ""}
          ${scene.opponent.slot === 1
            ? entityTemplate(scene.opponent, results)
            : ""}
        </section>
        <section class="slot slot-2">
          ${scene.player.slot === 2
            ? entityTemplate(scene.player, results)
            : ""}
          ${scene.opponent.slot === 2
            ? entityTemplate(scene.opponent, results)
            : ""}
        </section>
      </section>
    </section>
    <section class="dashboard">
      <section class="player">${playerStatsTemplate(scene.player)}</section>
      <section class="opponent">${playerStatsTemplate(scene.opponent)}</section>
      <section class="controls">${playerControlsTemplate(scene)}</section>
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

  async render(results) {
    await new Promise(r => requestAnimationFrame(r))
    render(template(this, results), this.game.el)
    await new Promise(r => setTimeout(r, 500))
  }

  async turn(/** @type import("../../moves/move").Move */ move) {
    // await end of call stack as to not interfere with the FSM
    await new Promise(r => requestAnimationFrame(r))

    await this.render(move.execute())

    this.opponent.upkeep()
    await this.render()

    move = this.game.chance.pickone(Object.values(this.opponent.moves))

    await this.render(move.execute())

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
