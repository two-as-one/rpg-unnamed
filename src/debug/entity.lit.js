import { html } from "lit-html"

export default (/** @type import("./../entities/entity").Entity*/ e) => html`
  <div class="entity">
    <section class="name">${e.name}</section>
    <section class="position">
      <span><label>POS</label> ${position(e)}</span>
    </section>
    <section class="status-effects">
      ${e.isProne
        ? html`
            <section><label>PRONE</label></section>
          `
        : ""}
      ${e.buffs.strength.isActive
        ? html`
            <section>
              +${e.buffs.strength.power}<label>STR</label> (${e.buffs.strength
                .duration})
            </section>
          `
        : ""}
      ${e.buffs.dexterity.isActive
        ? html`
            <section>
              +${e.buffs.dexterity.power}<label>DEX</label> (${e.buffs.dexterity
                .duration})
            </section>
          `
        : ""}
      ${e.buffs.charisma.isActive
        ? html`
            <section>
              +${e.buffs.charisma.power}<label>CHAR</label> (${e.buffs.charisma
                .duration})
            </section>
          `
        : ""}
    </section>
    <section class="base-stats">
      <span>${e.strength}<label>STR</label></span>
      |
      <span>${e.dexterity}<label>DEX</label></span>
      |
      <span>${e.charisma}<label>CHAR</label></span>
    </section>
    <section class="health">
      <span>${e.hp}<label>HP</label></span>
      <span>${e.lp}<label>LP</label></span>
    </section>
    <section class="derived-stats">
      <section><span>${e.damage}</span><label>DMG</label></section>
      <section><span>${e.lust}</span><label>LUST</label></section>
      <section><span>${e.prot}</span><label>PROT</label></section>
      <section><span>${e.focus}</span><label>FOCUS</label></section>
      <section><span>${e.accuracy}%</span><label>ACC</label></section>
      <section><span>${e.crit}%</span><label>CRIT</label></section>
      <section><span>${e.dodge}%</span><label>DODGE</label></section>
    </section>
  </div>
`

function position(e) {
  switch (e.slot) {
    case 0:
      return `⬤⭘⭘⭘`
    case 1:
      return `⭘⬤⭘⭘`
    case 2:
      return `⭘⭘⬤⭘`
    case 3:
      return `⭘⭘⭘⬤`
    default:
      return `⭘⭘⭘⭘`
  }
}
