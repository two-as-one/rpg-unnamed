import { html } from "lit-html"

export default messages => html`
  <section class="combat-log">
    ${messages.map(m => log(m))}
  </section>
`

const log = m =>
  html`
    <span class="log">${m}</span>
  `
