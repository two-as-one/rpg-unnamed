import { cap } from "../utils/cap"
import STATS from "./stats.yaml"
import { moves } from "./../moves/move"
import { game } from "./../game"

function baseStat(name, entity) {
  const stat = STATS[name]
  const level = entity[stat.base] - 1
  return stat.values[level]
}

export class Entity {
  constructor(config = {}) {
    this.name = config.name || "entity"

    this.__config = config

    this.__slot = config.slot || 0

    this.__damage = 0
    this.__arousal = 0
  }

  get isPlayer() {
    return false
  }

  /** @returns {number} [1-5] the strength of this entity */
  get strength() {
    return cap(this.__config.strength || 1, 1, 5)
  }

  /** @returns {number} [1-5] the dexterity of this entity */
  get dexterity() {
    return cap(this.__config.dexterity || 1, 1, 5)
  }

  /** @returns {number} [1-5] the charisma of this entity */
  get charisma() {
    return cap(this.__config.charisma || 1, 1, 5)
  }

  /** The current hit points of this entity */
  get hp() {
    const maxHp = baseStat("hp", this)
    return cap(maxHp - this.__damage, 0, maxHp)
  }

  set hp(/** @type {number} */ val) {
    const maxHp = baseStat("hp", this)
    this.__damage = cap(maxHp - val, 0, maxHp)
  }

  get damage() {
    return baseStat("damage", this)
  }

  get prot() {
    return baseStat("prot", this)
  }

  /** The current lust points of this entity */
  get lp() {
    const maxLp = baseStat("lp", this)
    return cap(maxLp - this.__arousal, 0, maxLp)
  }

  set lp(/** @type {number} */ val) {
    const maxLp = baseStat("lp", this)
    this.__arousal = cap(maxLp - val, 0, maxLp)
  }

  get lust() {
    return baseStat("lust", this)
  }

  get focus() {
    return baseStat("focus", this)
  }

  get accuracy() {
    return baseStat("accuracy", this)
  }

  get dodge() {
    return baseStat("dodge", this)
  }

  get crit() {
    return baseStat("crit", this)
  }

  /** The current slot on the field this entity is occupying */
  get slot() {
    return cap(this.__slot, 0, 3)
  }

  set slot(/** @type {number} */ val) {
    this.__slot = cap(val, 0, 3)
  }

  /**
   * Attack a target
   *
   * @param {string} name the name of the attack
   * @param {Entity} target the target entity of the attack
   *
   * @returns the results of the attack
   */
  attack(name, target) {
    if (this.isPlayer) {
      target = game.opponent
    } else {
      target = game.player
    }
    return moves.execute(name, this, target)
  }
}
