import { cap } from "../utils/cap"
import MOVES from "./moves.yaml"
import { game } from "./../game"

export class Move {
  constructor(name, /** @type import("./../entities/entity").Entity */ owner) {
    this.config = MOVES[name]
    this.owner = owner

    if (!MOVES[name]) {
      throw Error(`No move found with name '${name}'`)
    }
  }

  get name() {
    return this.config.name
  }

  /** Execute this move */
  execute() {
    const stats = this.calValues()
    const results = this.roll(stats)

    if (results.hit) {
      if (results.push) {
        results.push = this.owner.opponent.retreat()
      }
      if (results.pull) {
        results.pull = this.owner.opponent.advance()
      }
      if (results.retreat) {
        results.retreat = this.owner.retreat()
      }
      if (results.advance) {
        results.advance = this.owner.advance()
      }

      if (this.owner.isProne) {
        this.owner.opponent.lp -= results.lust
        results.damage = 0
      } else {
        this.owner.opponent.hp -= results.damage
        results.lust = 0
      }

      if (results.strUp) {
        this.owner.buffs.strength.activate(results.strUp)
      }
      if (results.dexUp) {
        this.owner.buffs.dexterity.activate(results.dexUp)
      }
      if (results.charUp) {
        this.owner.buffs.charisma.activate(results.charUp)
      }
    }

    console.log(results)

    return results
  }

  /** Caclulate the values of a move */
  calValues() {
    const move = this.config
    const name = move.name

    const push = Boolean(move.push)
    const pull = Boolean(move.pull)
    const advance = Boolean(move.advance)
    const retreat = Boolean(move.retreat)

    let damage = 0
    let lust = 0

    // determine whether this move is offensive
    // non-offensive moves always hit automatically
    const offensive = Boolean(move.damage || move.lust || push || pull)
    const accuracy = offensive
      ? cap(
          Move.calcChance(
            this.owner.accuracy,
            move.accuracy,
            -this.owner.opponent.dodge,
          ),
          5,
          95,
        )
      : 100

    if (this.wouldBeProne(push, pull, retreat, advance)) {
      lust = Move.calcRange(
        this.owner.lust,
        move.damage,
        this.owner.opponent.focus,
      )
    } else {
      damage = Move.calcRange(
        this.owner.damage,
        move.damage,
        this.owner.opponent.prot,
      )
    }

    const crit =
      damage || lust ? Move.calcChance(this.owner.crit, move.crit || 0) : 0

    return {
      name,
      damage,
      lust,
      offensive,
      accuracy,
      crit,
      strUp: cap(move.strUp, 0, 5),
      dexUp: cap(move.dexUp, 0, 5),
      charUp: cap(move.charUp, 0, 5),
      push,
      pull,
      advance,
      retreat,
      move: this,
    }
  }

  get tooltip() {
    return this.calValues()
  }

  /**
   * Roll the results of a move
   *
   * @param {*} stats
   * @param {*} seed
   */
  roll(stats) {
    stats = Object.assign({}, stats) // copy stats onto new object
    const chance = game.chance

    stats.hit = stats.accuracy > chance.floating({ min: 0, max: 100 })
    stats.crit = stats.hit && stats.crit > chance.floating({ min: 0, max: 100 })
    const multiplier = stats.crit ? 2 : 1
    stats.damage = chance.integer(Move.minMax(stats.damage)) * multiplier
    stats.lust = chance.integer(Move.minMax(stats.lust)) * multiplier

    return stats
  }

  /**
   * Checks whether using this move would cause the owner to become prone
   *
   * @param {boolean} push
   * @param {boolean} pull
   * @param {boolean} retreat
   * @param {boolean} advance
   * @returns {boolean} true if the owner would be prone
   */
  wouldBeProne(push, pull, retreat, advance) {
    const a = this.owner
    const b = a.opponent
    const initA = a.slot
    const initB = b.slot

    if (push) {
      b.retreat()
    }
    if (pull) {
      b.advance()
    }
    if (retreat) {
      a.retreat()
    }
    if (advance) {
      a.advance()
    }

    const prone = a.isProne

    a.slot = initA
    b.slot = initB

    return prone
  }

  static calcChance(base, ...modifiers) {
    return cap(
      [base, ...modifiers].map(val => val || 0).reduce((a, b) => a + b),
      0,
      100,
    )
  }

  static calcRange(base, modifier = 0, reduction = 0) {
    let [min, max] = base.split("-").map(str => Number(str))
    min = cap(Math.ceil(min * modifier) - reduction, 0, 99)
    max = cap(Math.ceil(max * modifier) - reduction, 0, 99)

    if (max === 0) {
      return 0
    }
    return [min, max].join("-")
  }

  static minMax(str) {
    if (!str) {
      return { min: 0, max: 0 }
    }
    const [min, max] = str.split("-").map(val => Number(val))
    return { min, max }
  }
}
