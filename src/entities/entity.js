import { cap } from "../utils/cap"
import STATS from "./stats.yaml"
import { Move } from "./../moves/move"
import { game } from "./../game"
import { Buff } from "./buff"

function baseStat(name, entity) {
  const stat = STATS[name]
  const level = entity[stat.base]
  return stat.values[level]
}

export class Entity {
  constructor(config = {}) {
    this.name = config.name || "entity"

    this.__config = config

    this.__slot = config.slot || 1

    this.__damage = 0
    this.__arousal = 0
    this.buffs = {
      strength: new Buff("strength", 2),
      dexterity: new Buff("dexterity", 2),
      charisma: new Buff("charisma", 2),
    }

    this.moves = {}
    this.__config.moves.forEach(
      name => (this.moves[name] = new Move(name, this)),
    )
  }

  get isPlayer() {
    return false
  }

  /** @returns {number} [1-5] the strength of this entity */
  get strength() {
    let val = cap(this.__config.strength || 0, 0, 5)
    if (this.buffs.strength.isActive) {
      val += this.buffs.strength.power
    }
    return cap(val, 0, 10)
  }

  /** @returns {number} [1-5] the dexterity of this entity */
  get dexterity() {
    let val = cap(this.__config.dexterity || 0, 0, 5)
    if (this.buffs.dexterity.isActive) {
      val += this.buffs.dexterity.power
    }
    return cap(val, 0, 10)
  }

  /** @returns {number} [1-5] the charisma of this entity */
  get charisma() {
    let val = cap(this.__config.charisma || 0, 0, 5)
    if (this.buffs.charisma.isActive) {
      val += this.buffs.charisma.power
    }
    return cap(val, 0, 10)
  }

  get maxHp() {
    return baseStat("hp", this)
  }

  /** The current hit points of this entity */
  get hp() {
    return cap(this.maxHp - this.__damage, 0, this.maxHp)
  }

  set hp(/** @type {number} */ val) {
    this.__damage = cap(this.maxHp - val, 0, this.maxHp)
  }

  get damage() {
    return baseStat("damage", this)
  }

  get prot() {
    return baseStat("prot", this)
  }

  get maxLp() {
    return baseStat("lp", this)
  }

  /** The current lust points of this entity */
  get lp() {
    return cap(this.maxLp - this.__arousal, 0, this.maxLp)
  }

  set lp(/** @type {number} */ val) {
    this.__arousal = cap(this.maxLp - val, 0, this.maxLp)
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
    return cap(this.__slot, 0, 2)
  }

  set slot(/** @type {number} */ val) {
    this.__slot = cap(val, 0, 2)
  }

  /** @returns {Entity} The opponent of this entity */
  get opponent() {
    return game.scene.player
  }

  static isProne(slotA, slotB) {
    slotA = cap(slotA, 0, 2)
    slotB = cap(slotB, 0, 2)
    return slotA === slotB && (slotA === 0 || slotA === 2)
  }

  /** @returns {boolean} Whether this entity is prone */
  get isProne() {
    return Entity.isProne(this.slot, this.opponent.slot)
  }

  /**
   * Attack a target
   *
   * @param {string} name the name of the attack
   *
   * @returns the results of the attack
   */
  attack(name) {
    return this.moves[name].execute()
  }

  /**
   * Advance a slot
   * @returns {boolean} true if position has actually changed
   */
  advance() {
    const initial = this.slot
    if (this.slot > this.opponent.slot) {
      this.slot -= 1
    }
    return initial !== this.slot
  }

  /**
   * Retreat a slot
   * @returns {boolean} true if position has actually changed
   */
  retreat() {
    const initial = this.slot
    this.slot += 1
    return initial !== this.slot
  }

  upkeep() {
    Object.values(this.buffs).forEach(buff => buff.upkeep())
  }
}
