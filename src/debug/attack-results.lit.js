import { html } from "lit-html"

export default results => html`
  <span class="attack-results">${debugMoveResults(results)}</span>
`

function debugMoveResults(results) {
  let text = ""
  if (!results) {
    return text
  }

  if (!results.hit) {
    text = "*MISS*"
  } else {
    if (results.damage) {
      text += `${results.damage} DMG `
    }

    if (results.lust) {
      text += `${results.lust} LUST `
    }

    if (results.crit) {
      text = "*CRIT* " + text
    }
  }

  return text
}
