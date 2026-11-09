// The Lightless Hunter's session tracker: hit points, spell slots, Hunter's Mark,
// Dreadful Strike, arrows and potions, and what is going on in a fight (the
// first turn, standing in darkness). Saved in this browser under its own key.
// 2024 rules: a long rest restores every Hit Point Die, exhaustion is −2 per
// level on d20 tests and −5 ft of speed, and concentration saves cap at DC 30.

import { character, resources, stats } from '~/data/characters/gloom-stalker/character'
import { spells, type Spell } from '~/data/characters/gloom-stalker/spells'
import { levelLabel } from '~/data/characters/shared'

interface GloomStalkerState {
  hp: number
  temp: number
  hitDiceUsed: number
  slotsUsed: number[] // by slot level, 1st first
  used: Record<string, number>
  concentration: string // spell slug
  concentrationLevel: number
  markTarget: string // who carries Hunter's Mark, as typed at the table
  firstTurn: boolean // Ambusher's Leap: +10 ft on the first turn of combat
  dark: boolean // entirely in darkness: invisible to creatures relying on darkvision
  dreadfulThisTurn: boolean // Dreadful Strike is once per turn
  shot: number // arrows shot since the last recovery
  inspiration: boolean // Heroic Inspiration, when the DM gives it
  deathSaves: { success: number; fail: number }
  conditions: string[]
  exhaustion: number
}

const STORAGE_KEY = 'gloom-stalker-tracker-v1'

// Spells that have a free use before a slot: Favored Enemy and the Wood Elf's lineage
const freeUse: Record<string, string> = { 'hunters-mark': 'mark', longstrider: 'longstrider' }

function fresh(): GloomStalkerState {
  return {
    hp: character.maxHp,
    temp: 0,
    hitDiceUsed: 0,
    slotsUsed: character.slots.map(() => 0),
    used: Object.fromEntries(resources.map(r => [r.id, 0])),
    concentration: '',
    concentrationLevel: 0,
    markTarget: '',
    firstTurn: false,
    dark: false,
    dreadfulThisTurn: false,
    shot: 0,
    inspiration: false,
    deathSaves: { success: 0, fail: 0 },
    conditions: [],
    exhaustion: 0
  }
}

export function useGloomStalkerTracker() {
  const state = useState<GloomStalkerState>('gloom-stalker-tracker', fresh)
  const loaded = useState('gloom-stalker-tracker-loaded', () => false)
  const { roll, note } = useDice()

  onMounted(() => {
    if (!loaded.value) {
      loaded.value = true
      try {
        const saved = readSaved(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          const base = fresh()
          // Fields and resources added since the save start fresh; HP is capped at the max
          state.value = {
            ...base,
            ...parsed,
            used: { ...base.used, ...parsed.used },
            slotsUsed: base.slotsUsed.map((_, i) => parsed.slotsUsed?.[i] ?? 0),
            deathSaves: { ...base.deathSaves, ...parsed.deathSaves },
            hp: Math.min(parsed.hp ?? base.hp, character.maxHp)
          }
        }
      } catch {
        // ignore corrupt storage
      }
    }
    watch(state, v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })
  })

  const maxOf = (id: string) => resources.find(r => r.id === id)?.max ?? 0
  const left = (id: string) => maxOf(id) - (state.value.used[id] ?? 0)
  function use(id: string, delta = 1) {
    if (!resources.some(r => r.id === id)) return
    state.value.used[id] = Math.min(maxOf(id), Math.max(0, (state.value.used[id] ?? 0) + delta))
  }

  // Spell slots by level
  const slotsLeft = (level: number) => (character.slots[level - 1] ?? 0) - (state.value.slotsUsed[level - 1] ?? 0)
  const lowestSlot = (from: number) => {
    for (let l = Math.max(1, from); l <= character.slots.length; l++) if (slotsLeft(l) > 0) return l
    return null
  }
  function useSlot(level: number, delta = 1) {
    const i = level - 1
    if (i < 0 || i >= character.slots.length) return
    state.value.slotsUsed[i] = Math.min(character.slots[i], Math.max(0, state.value.slotsUsed[i] + delta))
  }

  // 2024 exhaustion: −2 per level on every d20 test, −5 ft of speed per level
  const d20Penalty = computed(() => state.value.exhaustion * 2)
  const ac = computed(() => character.ac.total)
  const speed = computed(() => Math.max(0, character.speed + (state.value.firstTurn ? 10 : 0) - state.value.exhaustion * 5))
  const concentrating = computed(() => spells.find(s => s.slug === state.value.concentration))
  const marked = computed(() => state.value.concentration === 'hunters-mark')

  // A d20 roll with the exhaustion penalty taken off; `advantage` from a feature
  function d20(bonus: number, label: string, opts: { advantage?: boolean } = {}) {
    const total = bonus - d20Penalty.value
    return roll(`1d20${signed(total).replace('−', '-')}`, d20Penalty.value ? `${label} · exhaustion −${d20Penalty.value}` : label, opts)
  }

  function dropConcentration() {
    if (state.value.concentration === 'hunters-mark') state.value.markTarget = ''
    state.value.concentration = ''
    state.value.concentrationLevel = 0
  }

  function damage(amount: number) {
    const s = state.value
    const wasDown = s.hp === 0
    const fromTemp = Math.min(s.temp, amount)
    s.temp -= fromTemp
    amount -= fromTemp
    if (amount > 0) {
      // Damage at 0 HP is a failed death save
      if (wasDown) s.deathSaves.fail = Math.min(3, s.deathSaves.fail + 1)
      s.hp = Math.max(0, s.hp - amount)
    }
  }

  // Takes damage and rolls the concentration save: DC 10 or half the damage, at most 30
  function hit(amount: number) {
    const spell = concentrating.value
    damage(amount)
    if (!spell) return
    if (state.value.hp === 0) {
      dropConcentration()
      note(`Lost concentration on ${spell.name}`, 'Dropped to 0 hit points')
      return
    }
    const dc = Math.min(30, Math.max(10, Math.floor(amount / 2)))
    const save = d20(stats.abilities.con.save, `Concentration save (DC ${dc})`)
    if (save.total < dc) {
      dropConcentration()
      note(`Lost concentration on ${spell.name}`, `Rolled ${save.total} against DC ${dc}`)
    }
  }

  function heal(amount: number) {
    const s = state.value
    s.hp = Math.min(character.maxHp, s.hp + amount)
    if (s.hp > 0) s.deathSaves = { success: 0, fail: 0 }
  }

  function setTemp(amount: number) {
    // Temporary HP don't stack: keep the higher value
    state.value.temp = Math.max(state.value.temp, amount)
  }

  // Free uses left before a slot is needed (Hunter's Mark, Longstrider)
  const freeLeft = (spell: Spell) => (freeUse[spell.slug] ? left(freeUse[spell.slug]) : 0)
  const canCast = (spell: Spell, level = spell.level) => spell.level === 0 || freeLeft(spell) > 0 || slotsLeft(level) > 0

  // Casting spends a free use first, then the slot, and follows concentration
  function cast(spell: Spell, level = spell.level) {
    const s = state.value
    const parts: string[] = []
    const free = freeUse[spell.slug]
    if (spell.level > 0) {
      if (free && left(free) > 0 && level === spell.level) {
        use(free)
        parts.push(`Free cast · ${left(free)} left`)
      } else {
        if (slotsLeft(level) <= 0) return false
        useSlot(level)
        parts.push(`${levelLabel(level, true)} slot · ${slotsLeft(level)} left`)
      }
    }
    if (spell.concentration) {
      const prev = concentrating.value
      if (prev?.slug === 'hunters-mark' && spell.slug !== 'hunters-mark') s.markTarget = ''
      s.concentration = spell.slug
      s.concentrationLevel = level
      if (prev && prev.slug !== spell.slug) parts.push(`Dropped ${prev.name}`)
    }
    note(`Cast ${spell.name}${level > spell.level && spell.level > 0 ? ` at ${levelLabel(level)} level` : ''}`, parts.join(' · '))
    return true
  }

  function rollDamage(notation: string, label: string, opts: { crit?: boolean } = {}) {
    return roll(opts.crit ? critDice(notation) : notation, opts.crit ? `${label} · critical` : label)
  }

  // An arrow: the attack roll, with advantage while unseen in the dark
  function shoot(label: string) {
    if (left('arrows') <= 0) {
      note('Out of arrows', 'Recover some after the fight, or switch to the scimitar')
      return
    }
    use('arrows')
    state.value.shot++
    return d20(stats.bowAttack, state.value.dark ? `${label} · unseen in the dark` : label, { advantage: state.value.dark })
  }

  // 2024: after a fight, a minute of searching recovers half the ammunition used
  function recoverArrows() {
    const back = Math.floor(state.value.shot / 2)
    use('arrows', -back)
    state.value.shot = 0
    note('Arrows recovered', `${back} found · ${left('arrows')} in the quivers`)
  }

  function dreadfulStrike(crit = false) {
    if (left('dreadful') <= 0 || state.value.dreadfulThisTurn) return
    use('dreadful')
    state.value.dreadfulThisTurn = true
    rollDamage('2d6', `Dreadful Strike (psychic) · ${left('dreadful')} left`, { crit })
  }

  function drinkPotion() {
    if (left('potions') <= 0) return
    use('potions')
    const r = roll(stats.potion, 'Potion of Healing')
    heal(Math.max(0, r.total))
  }

  // Initiative starts a fight: Ambusher's Leap is on for the first turn
  function startCombat() {
    state.value.firstTurn = true
    state.value.dreadfulThisTurn = false
    return d20(stats.initiative, 'Initiative · Dread Ambusher, Alert')
  }

  // The start of their next turn: the leap is over, Dreadful Strike is ready again
  function nextTurn() {
    state.value.firstTurn = false
    state.value.dreadfulThisTurn = false
  }

  function spendHitDie() {
    if (state.value.hitDiceUsed >= character.level) return
    state.value.hitDiceUsed++
    heal(Math.max(0, roll(`1d${character.hitDie}+${stats.abilities.con.check}`, 'Hit Point Die').total))
  }

  function shortRest() {
    for (const r of resources) if (r.recharge === 'short') state.value.used[r.id] = 0
  }

  // 2024 long rest: all HP and every Hit Point Die back, one level of exhaustion gone
  function longRest() {
    const s = state.value
    s.hp = character.maxHp
    s.temp = 0
    s.hitDiceUsed = 0
    for (const r of resources) if (r.recharge !== 'none') s.used[r.id] = 0
    s.slotsUsed = character.slots.map(() => 0)
    dropConcentration()
    s.firstTurn = false
    s.dreadfulThisTurn = false
    s.deathSaves = { success: 0, fail: 0 }
    s.conditions = []
    s.exhaustion = Math.max(0, s.exhaustion - 1)
  }

  function reset() {
    state.value = fresh()
  }

  return {
    state,
    ac,
    speed,
    d20Penalty,
    concentrating,
    marked,
    left,
    maxOf,
    use,
    slotsLeft,
    lowestSlot,
    useSlot,
    d20,
    dropConcentration,
    hit,
    damage,
    heal,
    setTemp,
    freeLeft,
    canCast,
    cast,
    rollDamage,
    shoot,
    recoverArrows,
    dreadfulStrike,
    drinkPotion,
    startCombat,
    nextTurn,
    spendHitDie,
    shortRest,
    longRest,
    reset
  }
}
