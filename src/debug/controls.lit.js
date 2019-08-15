import { html } from "lit-html"

export default (game, callback) => html`
  <div class="controls">
    ${move("🡄", game.player, callback)} ${move("🡆", game.player, callback)}
  </div>
  <div class="controls">
    ${attack("pound", game.player, callback)}
  </div>
`

const attack = (name, attacker, callback) => html`
  <button @click=${() => callback(attacker.attack(name))}>
    ${attacker.name}:${name}
  </button>
`

const move = (dir, entity, callback) => html`
  <button
    @click=${() => {
      entity.slot += dir === "🡄" ? -1 : 1
      callback()
    }}
  >
    ${dir}
  </button>
`
