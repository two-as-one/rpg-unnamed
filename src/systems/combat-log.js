export class CombatLog {
  constructor() {
    this.__log = []
  }

  log(results) {
    this.__log.unshift(CombatLog.combatMessage(results))
  }

  get history() {
    return this.__log.slice(0, 10)
  }

  /**
   * Generate a combat log message
   * @param {*} results
   */
  static combatMessage(results) {
    const move = results.move
    let effects = []

    if (!results.hit) {
      effects.push(`${CombatLog.name(move.owner)}[${move.name}] missed`)
    } else {
      if (!results.offensive) {
        effects.push(`${CombatLog.name(move.owner)}[${move.name}]`)
      } else if (results.crit) {
        effects.push(`${CombatLog.name(move.owner)}[${move.name}] CRIT`)
      } else {
        effects.push(`${CombatLog.name(move.owner)}[${move.name}] hit`)
      }

      if (results.push) {
        effects.push(`pushed ${CombatLog.name(move.owner.opponent)}`)
      }
      if (results.pull) {
        effects.push(`pulled ${CombatLog.name(move.owner.opponent)}`)
      }
      if (results.damage) {
        effects.push(`dealt ${results.damage} DMG`)
      }
      if (results.lust) {
        effects.push(`dealt ${results.lust} LUST`)
      }
    }

    return `${CombatLog.joinCommaAnd(effects)}.`
  }

  /**
   * Joins a list of strings with ,,,and
   * @param {string[]} list
   */
  static joinCommaAnd(list) {
    return [list.slice(0, -1).join(", "), list.slice(-1)[0]].join(
      list.length < 2 ? "" : " and ",
    )
  }

  /**
   * Returns 'you' or the name of an Entity
   * @param {import("./../entities/entity").Entity} entity
   */
  static name(entity) {
    return entity.isPlayer ? "you" : entity.name
  }
}
