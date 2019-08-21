import { html } from "lit-html"
import "./player-controls.sass"

export default (/** @type import("./combat").Combat */ scene) => html`
  <section class="player-controls">
    ${Object.values(scene.player.moves).map(move =>
      moveTemplate(move, move.tooltip, scene),
    )}
  </section>
`
const moveTemplate = (
  /** @type import("./../moves/move").Move */ move,
  tooltip,
  /** @type import("./combat").Combat */ scene,
) => html`
  <button class="move" @click=${() => scene.input(move)}>
    <section class="title name">
      ${move.name}
    </section>
    <section class="info">
      <section>${tooltip.accuracy}% ACC</section>
      ${tooltip.crit
        ? html`
            <section>${tooltip.crit}% CRIT</section>
          `
        : ""}
    </section>
    <section class="effects">
      <section class="opponent">
        <section class="title">Effect</section>
        ${tooltip.push
          ? html`
              <section class="effect">PUSH 🡆</section>
            `
          : ""}
        ${tooltip.pull
          ? html`
              <section class="effect">PULL 🡄</section>
            `
          : ""}
        ${tooltip.damage
          ? html`
              <section class="effect">${tooltip.damage} DMG</section>
            `
          : ""}
        ${tooltip.lust
          ? html`
              <section class="effect">${tooltip.lust} LUST</section>
            `
          : ""}
      </section>
      <section class="self">
        <section class="title">Self</section>
        ${tooltip.advance
          ? html`
              <section class="effect">MOVE 🡆</section>
            `
          : ""}
        ${tooltip.retreat
          ? html`
              <section class="effect">MOVE 🡄</section>
            `
          : ""}
      </section>
    </section>
  </button>
`
