// The Whisper-Knife's session tracker: hit points, Hit Dice, the Psionic Energy
// Dice, the turn's Sneak Attack, bonus action and reaction, and the advantage
// sources a rogue lives on. Saved in this browser under its own key, apart
// from the other characters' trackers. 2024 rules: a long rest restores every
// Hit Die, and Exhaustion is −2 per level on every d20 test.

import { character, resources, stats } from '~/data/characters/soulknife/character'

interface SoulknifeState {
  hp: number
  temp: number
  hitDiceUsed: number
  used: Record<string, number>
  sneakUsed: boolean // Sneak Attack this turn
  bonusUsed: boolean // the bonus action this turn
  reactionUsed: boolean // since the start of their turn
  steadyAim: boolean // advantage on the next attack this turn, speed 0
  vex: number // turns Vex's advantage still lasts: 2 when a blade hits, counted down by Next turn
  hidden: boolean // hidden with the Hide action: Invisible
  hood: boolean // Cloak of Elvenkind, hood up
  longstrider: boolean // +10 ft for the hour
  telepathy: number // hours of Psychic Whispers rolled, 0 when there is no link
  knackPending: boolean // a Knack die was added to a failed check: spend it only if the check now succeeds
  inspiration: boolean // Heroic Inspiration
  deathSaves: { success: number; fail: number }
  conditions: string[]
  exhaustion: number
}

const STORAGE_KEY = 'soulknife-tracker-v1'

function fresh(): SoulknifeState {
  return {
    hp: character.maxHp,
    temp: 0,
    hitDiceUsed: 0,
    used: Object.fromEntries(resources.map(r => [r.id, 0])),
    sneakUsed: false,
    bonusUsed: false,
    reactionUsed: false,
    steadyAim: false,
    vex: 0,
    hidden: false,
    hood: false,
    longstrider: false,
    telepathy: 0,
    knackPending: false,
    inspiration: false,
    deathSaves: { success: 0, fail: 0 },
    conditions: [],
    exhaustion: 0
  }
}

// A notation with its modifier, e.g. 1d20+6 or 1d20-1
const withMod = (dice: string, n: number) => (n ? `${dice}${n > 0 ? '+' : '-'}${Math.abs(n)}` : dice)

export function useSoulknifeTracker() {
  const state = useState<SoulknifeState>('soulknife-tracker', fresh)
  const loaded = useState('soulknife-tracker-loaded', () => false)
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

  const psiLeft = computed(() => left('psi'))
  const exhaustionPenalty = computed(() => Math.min(5, state.value.exhaustion) * 2)
  const speed = computed(() => (state.value.steadyAim ? 0 : Math.max(0, character.speed + (state.value.longstrider ? 10 : 0) - state.value.exhaustion * 5)))
  // Advantage on the next attack, and where it comes from
  const advantageFrom = computed(() =>
    [state.value.steadyAim && 'Steady Aim', state.value.vex > 0 && 'Vex', state.value.hidden && 'hidden'].filter(Boolean) as string[]
  )

  // A d20 test: Exhaustion takes 2 a level off it (2024)
  function d20(bonus: number, label: string, opts: { advantage?: boolean } = {}) {
    const pen = exhaustionPenalty.value
    return roll(withMod('1d20', bonus - pen), pen ? `${label} · exhaustion −${pen}` : label, opts)
  }

  function rollInitiative() {
    // An Invisible creature (hidden) has advantage on initiative
    return d20(stats.initiative, state.value.hidden ? 'Initiative · Alert · hidden' : 'Initiative · Alert', { advantage: state.value.hidden })
  }

  // A blade or weapon attack: the advantage sources it uses are spent
  function attack(bonus: number, label: string, opts: { bonusAction?: boolean } = {}) {
    const s = state.value
    const from = advantageFrom.value
    const r = d20(bonus, from.length ? `${label} · ${from.join(', ')}` : label, { advantage: from.length > 0 })
    s.steadyAim = false
    s.vex = 0
    s.hidden = false // an attack roll ends hiding
    if (opts.bonusAction) s.bonusUsed = true
    return r
  }

  function rollDamage(notation: string, label: string, crit = false) {
    return roll(crit ? critDice(notation) : notation, crit ? `${label} · critical` : label)
  }

  // A blade hit: its damage, and Vex's advantage on the next attack against the target
  function bladeHit(second: boolean, crit = false) {
    state.value.vex = 2
    return rollDamage(second ? stats.secondBlade : stats.blade, `${second ? 'Second blade' : 'Psychic Blade'} (psychic)`, crit)
  }

  function sneakAttack(crit = false, type = 'psychic') {
    if (state.value.sneakUsed) return
    state.value.sneakUsed = true
    return rollDamage(stats.sneak, `Sneak Attack (${type})`, crit)
  }

  // Psi-Bolstered Knack: add a die to a failed proficient check; it's spent only if that saves the check
  function knack() {
    if (psiLeft.value <= 0 || state.value.knackPending) return
    state.value.knackPending = true
    return roll(`1${stats.psiDie}`, 'Psi-Bolstered Knack · add it to the failed check')
  }
  function resolveKnack(success: boolean) {
    if (success) use('psi')
    state.value.knackPending = false
    note(success ? 'Knack: the check succeeds' : 'Knack: still a failure', success ? `Psi die spent · ${psiLeft.value} left` : 'The die isn’t spent')
  }

  // Psychic Whispers: the first use after a long rest is free, then it spends a die
  function whispers() {
    let how = 'Free use'
    if (left('whispers') > 0) use('whispers')
    else if (psiLeft.value > 0) {
      use('psi')
      how = `Psi die spent · ${psiLeft.value} left`
    } else return
    const r = roll(`1${stats.psiDie}`, 'Psychic Whispers · hours')
    state.value.telepathy = r.total
    note('Psychic Whispers', `Up to ${stats.psiTelepathy} creatures, ${r.total} hour${r.total === 1 ? '' : 's'} · ${how}`)
  }

  function spendPsi(label: string) {
    if (psiLeft.value <= 0) return
    use('psi')
    return roll(`1${stats.psiDie}`, label)
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

  function heal(amount: number) {
    const s = state.value
    s.hp = Math.min(character.maxHp, s.hp + amount)
    if (s.hp > 0) s.deathSaves = { success: 0, fail: 0 }
  }

  function setTemp(amount: number) {
    // Temporary HP don't stack: keep the higher value
    state.value.temp = Math.max(state.value.temp, amount)
  }

  function drinkPotion() {
    if (left('potions') <= 0) return
    use('potions')
    state.value.bonusUsed = true
    heal(Math.max(0, roll('2d4+2', 'Potion of Healing').total))
  }

  function castLongstrider() {
    if (left('longstrider') <= 0) return
    use('longstrider')
    state.value.longstrider = true
    note('Longstrider', `Speed ${speed.value} for 1 hour · no concentration`)
  }

  // Cunning Action: Dash, Disengage or Hide as the bonus action
  function cunning(kind: 'Dash' | 'Disengage' | 'Hide') {
    const s = state.value
    s.bonusUsed = true
    if (kind !== 'Hide') return note(`Cunning Action: ${kind}`, kind === 'Dash' ? `${speed.value} ft more this turn` : 'No opportunity attacks this turn')
    const stealth = stats.skills.find(k => k.name === 'Stealth')!.bonus
    const r = d20(stealth, s.hood ? 'Hide · Stealth · cloak' : 'Hide · Stealth', { advantage: s.hood })
    if (r.total >= 15) {
      s.hidden = true
      note('Hidden', `Invisible until they attack or make a noise · ${r.total} to find them`)
    } else note('Not hidden', `${r.total} against DC 15`)
  }

  function steadyAim() {
    const s = state.value
    s.steadyAim = true
    s.bonusUsed = true
  }

  // The start of their turn: the turn's uses reset, Steady Aim is gone and Vex counts down
  function nextTurn() {
    const s = state.value
    s.sneakUsed = false
    s.bonusUsed = false
    s.reactionUsed = false
    s.steadyAim = false
    s.vex = Math.max(0, s.vex - 1)
  }

  function spendHitDie() {
    const s = state.value
    if (s.hitDiceUsed >= character.level) return
    s.hitDiceUsed++
    heal(Math.max(0, roll(`1d${character.hitDie}+${stats.abilities.con.check}`, 'Hit Die').total))
  }

  function shortRest() {
    for (const r of resources) if (r.recharge === 'short') state.value.used[r.id] = 0
    use('psi', -1) // one Psionic Energy Die comes back
  }

  function longRest() {
    const s = state.value
    s.hp = character.maxHp
    s.temp = 0
    s.hitDiceUsed = 0 // 2024: a long rest restores every Hit Die
    for (const r of resources) if (r.recharge !== 'none') s.used[r.id] = 0
    s.sneakUsed = false
    s.bonusUsed = false
    s.reactionUsed = false
    s.steadyAim = false
    s.vex = 0
    s.hidden = false
    s.longstrider = false
    s.telepathy = 0
    s.knackPending = false
    s.deathSaves = { success: 0, fail: 0 }
    s.conditions = []
    s.exhaustion = Math.max(0, s.exhaustion - 1)
  }

  function reset() {
    state.value = fresh()
  }

  return {
    state,
    speed,
    psiLeft,
    advantageFrom,
    exhaustionPenalty,
    left,
    maxOf,
    use,
    d20,
    rollInitiative,
    attack,
    rollDamage,
    bladeHit,
    sneakAttack,
    knack,
    resolveKnack,
    whispers,
    spendPsi,
    damage,
    heal,
    setTemp,
    drinkPotion,
    castLongstrider,
    cunning,
    steadyAim,
    nextTurn,
    spendHitDie,
    shortRest,
    longRest,
    reset
  }
}
