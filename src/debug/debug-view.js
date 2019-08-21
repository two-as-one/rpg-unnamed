import { html, render } from "lit-html"
import entityTemplate from "./entity.lit"
import moveTemplate from "./move.lit"
import "./debug.sass"
import { CombatLog } from "../systems/combat-log"
import combatLogTemplate from "./combat-log.lit"

export class DebugView {
  constructor(game, container = document.body) {
    this.game = game
    this.container = container
    this.log = new CombatLog()
  }

  async render(info) {
    const player = this.game.scene.player
    const opponent = this.game.scene.opponent

    if (info) {
      this.log.log(info)
    }

    if (!info?.move?.owner.isPlayer) {
      await new Promise(r => setTimeout(r, 500))
    }

    const template = (player, opponent) =>
      html`
        <section class="debug-view">
          <div class="entities">
            ${entityTemplate(player)} ${entityTemplate(opponent)}
          </div>
          <section class="moves">
            ${Object.values(player.moves).map(move => moveTemplate(move))}
          </section>
          ${combatLogTemplate(this.log.history)}
        </section>
      `
    render(template(player, opponent), this.container)
  }
}
