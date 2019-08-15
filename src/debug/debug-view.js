import { html, render } from "lit-html"
import entityTemplate from "./entity.lit"
import moveResultsTemplate from "./attack-results.lit"
import controlsTemplate from "./controls.lit"
import "./debug.sass"

export class DebugView {
  constructor(game) {
    this.game = game
    this.render()
  }

  render(results) {
    const player = this.game.player
    const opponent = this.game.opponent

    const template = (player, opponent) =>
      html`
        <div class="entities">
          ${entityTemplate(player)} ${entityTemplate(opponent)}
        </div>
        ${controlsTemplate(this.game, r => this.render(r))}
        ${moveResultsTemplate(results)}
      `
    render(template(player, opponent), document.body)
  }
}
