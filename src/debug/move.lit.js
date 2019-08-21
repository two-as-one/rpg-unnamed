import { html } from "lit-html"
import { game } from "./../game"

export default (/** @type import("./../moves/move").Move */ move) => html`
  <button @click=${() => game.scene.input(move)}>
    ${move.name} ${tooltip(move)}
  </button>
`

const tooltip = (/** @type import("./../moves/move").Move */ move) => html`
  <span class="tooltip">
    ${getTooltipData(move).map(values =>
      value(values.name, values.value, values.suffix),
    )}
  </span>
`

function getTooltipData(/** @type import("./../moves/move").Move */ move) {
  const data = move.tooltip
  const info = []

  if (data.push) {
    info.push({
      name: "PUSH",
      value: move.owner.isPlayer > 0 ? "🡆" : "🡄",
    })
  }

  if (data.pull) {
    info.push({
      name: "PUSH",
      value: move.owner.isPlayer > 0 ? "🡄" : "🡆",
    })
  }

  if (data.advance) {
    info.push({
      name: "MOVE",
      value: move.owner.isPlayer > 0 ? "🡆" : "🡄",
    })
  }

  if (data.retreat) {
    info.push({
      name: "MOVE",
      value: move.owner.isPlayer > 0 ? "🡄" : "🡆",
    })
  }

  if (data.damage) {
    info.push({
      name: "DMG",
      value: data.damage,
    })
  }

  if (data.lust) {
    info.push({
      name: "LUST",
      value: data.lust,
    })
  }

  if (data.accuracy !== 100) {
    info.push({
      name: "ACC",
      value: data.accuracy,
      suffix: "%",
    })
  }

  if (data.crit) {
    info.push({
      name: "CRIT",
      value: data.crit,
      suffix: "%",
    })
  }

  if (data.strUp) {
    info.push({
      value: `+2 STR (${data.strUp})`,
    })
  }

  if (data.dexUp) {
    info.push({
      value: `+2 DEX (${data.dexUp})`,
    })
  }

  if (data.charUp) {
    info.push({
      value: `+2 CHAR (${data.charUp})`,
    })
  }

  return info
}

const value = (name, value, suffix = "") => html`
  <span class="value">
    <span class="value">${value}${suffix}</span>
    <span class="name">${name}</span>
  </span>
`
