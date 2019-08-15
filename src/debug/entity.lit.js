import { html } from "lit-html"

export default e => html`
  <pre class="entity">
╔════════════════════════╗
║ ${padEnd(e.name, 22)} ║
╠════════╤═══╤═══╤═══╤═══╣
║ POS    │ ${slot(e, 0)} │ ${slot(e, 1)} │ ${slot(e, 2)} │ ${slot(e, 3)} ║
╠═══════╤╧═══╧══╤╧═══╧═══╣
║ ${e.strength} STR │ ${e.dexterity} DEX │ ${e.charisma} CHAR ║
╠═══════╧═══╤═══╧════════╣
║ ${padStart(e.hp, 5)} HP  │ ${padStart(e.lp, 5)} LP   ║
╠═══════════╧════════════╣
║ ${padStart(e.damage, 4)} DMG               ║
║ ${padStart(e.lust, 4)} LUST              ║
║ ${padStart(e.prot, 4)} PROT              ║
║ ${padStart(e.focus, 4)} FOCUS             ║
║ ${padStart(e.crit + "%", 4)} CRIT              ║
║ ${padStart(e.focus + "%", 4)} DODGE             ║
║ ${padStart(e.focus + "%", 4)} ACC               ║
╚════════════════════════╝
</pre>
`
function padStart(val, amount = 0) {
  return String(val).padStart(amount, " ")
}

function padEnd(val, amount = 0) {
  return String(val).padEnd(amount, " ")
}

function slot(entity, i) {
  if (!entity.isPlayer) {
    i = 3 - i
  }
  return entity.slot === i ? "■" : " "
}
