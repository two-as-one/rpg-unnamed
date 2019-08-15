import { Chance } from "chance"
const fallbackChance = new Chance()

import { cap } from "../utils/cap"
import MOVES from "./moves.yaml"

class Move {
  constructor(config) {
    this.config = config
  }

  /**
   * Execute this move
   *
   * @param {import("../entities/entity").Entity} attacker
   * @param {import("../entities/entity").Entity} defender
   */
  execute(move, attacker, defender) {
    const stats = this.calValues(move, attacker, defender)
    const results = this.roll(stats)

    if (results.hit) {
      defender.hp -= results.damage
      defender.lp -= results.lust
    }

    return results
  }

  /**
   * Caclulate the values of a move
   *
   * @param {string} move - the name of the move
   * @param {import("../entities/entity").Entity} attacker
   * @param {import("../entities/entity").Entity} defender
   */
  calValues(move, attacker, defender) {
    move = MOVES[move].position[attacker.slot]

    return {
      slot: attacker.slot,
      damage: Move.calcRange(attacker.damage, move.damage, defender.prot),
      lust: Move.calcRange(attacker.lust, move.lust, defender.focus),
      accuracy: Move.calcChance(attacker.accuracy, move.accuracy),
      crit: Move.calcChance(attacker.crit, move.crit),
    }
  }

  /**
   * Roll the results of a move
   *
   * @param {*} stats
   * @param {*} seed
   */
  roll(stats, seed = fallbackChance.word({ length: 5 })) {
    const chance = new Chance(seed)

    const hit = stats.accuracy > chance.floating({ min: 0, max: 100 })
    const crit = hit && stats.crit > chance.floating({ min: 0, max: 100 })
    const multiplier = crit ? 2 : 1
    const damage = chance.integer(Move.minMax(stats.damage)) * multiplier
    const lust = chance.integer(Move.minMax(stats.lust)) * multiplier

    return { seed, hit, crit, damage, lust }
  }

  static calcChance(base, modifier = 1) {
    return base * modifier
  }

  static calcRange(base, modifier = 0, reduction = 0) {
    let [min, max] = base.split("-").map(str => Number(str))
    min = cap(Math.ceil(min * modifier) - reduction, 0, 99)
    max = cap(Math.ceil(max * modifier) - reduction, 0, 99)
    return [min, max].join("-")
  }

  static minMax(str) {
    const [min, max] = str.split("-").map(val => Number(val))
    return { min, max }
  }
}

export const moves = new Move()
