// The Storm-Hammer's session tracker: hit points, spell slots by level, his
// resources and what is running in a fight. Saved in this browser under its own
// key, apart from Lucan's tracker (useTracker).

import { character, resources, stats } from '~/data/characters/tempest/character'
import { spells, type Spell } from '~/data/characters/tempest/spells'
import { levelLabel } from '~/data/characters/shared'

interface TempestState {
  hp: number
  temp: number
  hitDiceUsed: number
  slotsUsed: number[] // 1st to 5th level
  used: Record<string, number>
  concentration: string // spell slug
  concentrationLevel: number // the slot level it was cast with
  weapon: number // Spiritual Weapon's slot level while it's out, 0 when not
  shieldUp: boolean // Shield: +5 AC until the start of his next turn
  avatar: number // Storm Avatar turns left, 0 when not
  boots: boolean // Boots of Speed clicked on
  wrathReady: boolean // Destructive Wrath: the next lightning or thunder roll is maxed
  kordAnswered: boolean // Divine Intervention worked: not again for 7 days
  inspiration: boolean
  deathSaves: { success: number; fail: number }
  conditions: string[]
  exhaustion: number
}

const STORAGE_KEY = 'tempest-tracker-v1'
export const avatarTurns = 10 // 1 minute

function fresh(): TempestState {
  return {
    hp: character.maxHp,
    temp: 0,
    hitDiceUsed: 0,
    slotsUsed: character.slots.map(() => 0),
    used: Object.fromEntries(resources.map(r => [r.id, 0])),
    concentration: '',
    concentrationLevel: 0,
    weapon: 0,
    shieldUp: false,
    avatar: 0,
    boots: false,
    wrathReady: false,
    kordAnswered: false,
    inspiration: false,
    deathSaves: { success: 0, fail: 0 },
    conditions: [],
    exhaustion: 0
  }
}

// Destructive Wrath maxes the lightning or thunder dice: the first dice term
// (5d10+5d10 → 50+5d10 for Destructive Wave), and the rest is rolled
const maxFirstDice = (notation: string) => notation.replace(/(\d*)d(\d+)/i, (_, n, sides) => String(Number(n || 1) * Number(sides)))

export function useTempestTracker() {
  const state = useState<TempestState>('tempest-tracker', fresh)
  const loaded = useState('tempest-tracker-loaded', () => false)
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

  // Spell slots, 1st to 5th level
  const slotsLeft = (level: number) => (character.slots[level - 1] ?? 0) - (state.value.slotsUsed[level - 1] ?? 0)
  const lowestSlot = (from: number) => {
    for (let l = Math.max(1, from); l <= character.slots.length; l++) if (slotsLeft(l) > 0) return l
    return null
  }
  function useSlot(level: number, delta = 1) {
    const i = level - 1
    state.value.slotsUsed[i] = Math.min(character.slots[i], Math.max(0, state.value.slotsUsed[i] + delta))
  }

  // Channel Divinity: the two that come back on a short rest go first, the amulet's free daily one last
  const channelLeft = computed(() => left('channel') + left('devout'))
  function spendChannel() {
    if (left('channel') > 0) use('channel')
    else if (left('devout') > 0) use('devout')
    else return false
    return true
  }

  const ac = computed(() => character.ac.total + (state.value.shieldUp ? 5 : 0))
  const speed = computed(() => character.speed * (state.value.boots ? 2 : 1))
  const concentrating = computed(() => spells.find(s => s.slug === state.value.concentration))

  function dropConcentration() {
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

  // Takes damage and rolls the concentration save, with War Caster's advantage
  function hit(amount: number) {
    const spell = concentrating.value
    damage(amount)
    if (!spell) return
    if (state.value.hp === 0) {
      dropConcentration()
      note(`Lost concentration on ${spell.name}`, 'Dropped to 0 hit points')
      return
    }
    const dc = Math.max(10, Math.floor(amount / 2))
    const save = roll(`1d20+${stats.abilities.con.save}`, `Concentration save (DC ${dc}) · War Caster`, { advantage: true })
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

  // Casting spends the slot, or Shield's once-a-day use, and follows what keeps running
  function cast(spell: Spell, level = spell.level) {
    const s = state.value
    const parts: string[] = []
    if (spell.access === 'Magic Initiate' && spell.level > 0) {
      if (left('shield') <= 0) return false
      use('shield')
      parts.push('Once per long rest')
    } else if (spell.level > 0) {
      if (slotsLeft(level) <= 0) return false
      useSlot(level)
      parts.push(`${levelLabel(level, true)} slot · ${slotsLeft(level)} left`)
    }
    if (spell.slug === 'shield') {
      s.shieldUp = true
      parts.push(`AC ${ac.value} until his next turn`)
    }
    if (spell.slug === 'spiritual-weapon') s.weapon = level
    if (spell.concentration) {
      const prev = concentrating.value
      s.concentration = spell.slug
      s.concentrationLevel = level
      if (prev && prev.slug !== spell.slug) parts.push(`Dropped ${prev.name}`)
    }
    note(`Cast ${spell.name}${level > spell.level && spell.level > 0 ? ` at ${levelLabel(level)} level` : ''}`, parts.join(' · '))
    return true
  }

  // A damage roll. Lightning or thunder spends a primed Destructive Wrath and comes out at its maximum.
  function rollDamage(notation: string, label: string, opts: { storm?: boolean; crit?: boolean } = {}) {
    const dice = opts.crit ? critDice(notation) : notation
    const name = opts.crit ? `${label} · critical` : label
    if (opts.storm && state.value.wrathReady && spendChannel()) {
      state.value.wrathReady = false
      return roll(maxFirstDice(dice), `${name} · Destructive Wrath`)
    }
    return roll(dice, name)
  }

  function startAvatar() {
    if (left('avatar') <= 0 || state.value.avatar) return
    use('avatar')
    state.value.avatar = avatarTurns
    note('Storm Avatar', 'Immune to lightning and thunder · staff hits deal thunder · bonus action bolt')
  }

  // The start of his next turn: Shield wears off and the avatar counts down
  function nextTurn() {
    const s = state.value
    s.shieldUp = false
    if (s.avatar > 0) {
      s.avatar--
      if (!s.avatar) note('The Storm Avatar ends', `${avatarTurns} turns are up`)
    }
  }

  function toggleBoots() {
    const s = state.value
    if (s.boots) return void (s.boots = false)
    if (left('boots') <= 0) return
    use('boots')
    s.boots = true
  }

  function shortRest() {
    for (const r of resources) if (r.recharge === 'short') state.value.used[r.id] = 0
  }

  function longRest() {
    const s = state.value
    s.hp = character.maxHp
    s.temp = 0
    s.hitDiceUsed = Math.max(0, s.hitDiceUsed - Math.max(1, Math.floor(character.level / 2)))
    for (const r of resources) if (!(r.id === 'intervention' && s.kordAnswered)) s.used[r.id] = 0
    s.slotsUsed = character.slots.map(() => 0)
    dropConcentration()
    s.weapon = 0
    s.shieldUp = false
    s.avatar = 0
    s.boots = false
    s.wrathReady = false
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
    concentrating,
    left,
    maxOf,
    channelLeft,
    spendChannel,
    use,
    slotsLeft,
    lowestSlot,
    useSlot,
    dropConcentration,
    hit,
    damage,
    heal,
    setTemp,
    cast,
    rollDamage,
    startAvatar,
    nextTurn,
    toggleBoots,
    shortRest,
    longRest,
    reset
  }
}
