import { html } from "lit-html"
import "./stats.sass"

export default (/** @type import("../../entities/entity").Entity */ entity) =>
  html`
    <section class="stats">
      <section class="header ${entity.isPlayer ? "" : "reverse"}">
        <section class="portrait"></section>
        <section class="resources">
          <span class="name">${entity.name}</span>
          <span class="bar hp">
            <label>HP</label>
            <span class="fill">
              ${bar(entity.maxHp, entity.hp)}
            </span>
          </span>
          <span class="bar lp">
            <label>LP</label>
            <span class="fill">
              ${bar(entity.maxLp, entity.lp)}
            </span>
          </span>
        </section>
      </section>
      <section class="details">
        <section class="base-stats">
          <span class="stat"
            ><span class="value">${entity.strength}</span
            ><label>STR</label></span
          >
          <span class="stat"
            ><span class="value">${entity.dexterity}</span
            ><label>DEX</label></span
          >
          <span class="stat"
            ><span class="value">${entity.charisma}</span
            ><label>CHAR</label></span
          >
        </section>
        <section class="derived-stats">
          <span class="stat"
            ><span class="value">${entity.damage}</span><label>DMG</label></span
          >
          <span class="stat"
            ><span class="value">${entity.lust}</span><label>LUST</label></span
          >
          <span class="stat"
            ><span class="value">${entity.prot}</span><label>PROT</label></span
          >
          <span class="stat"
            ><span class="value">${entity.focus}</span
            ><label>FOCUS</label></span
          >
          <span class="stat"
            ><span class="value">${entity.accuracy}%</span
            ><label>ACC</label></span
          >
          <span class="stat"
            ><span class="value">${entity.crit}%</span><label>CRIT</label></span
          >
          <span class="stat"
            ><span class="value">${entity.dodge}%</span
            ><label>DODGE</label></span
          >
        </section>
      </section>
    </section>
  `

function bar(max, current) {
  let out = []
  for (let i = 0; i < max; i++) {
    out.push(html`
      <span class="${i < current ? "full" : "empty"}"></span>
    `)
  }
  return out
}
