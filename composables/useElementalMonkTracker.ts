// The Undertow's session tracker: hit points, Hit Dice, Focus Points, Elemental
// Attunement and the element each strike deals, the turn's bonus action,
// reaction and Tavern Brawler push, and Surprise Attack on the first round.
// Saved in this browser under its own key, apart from the other characters'
// trackers. 2024 rules: a long rest restores every Hit Die, and Exhaustion is −2
// per level on every d20 test.

import { character, resources, stats, type Element } from '~/data/characters/elemental-monk/character'

interface MonkState {
  hp: number
  temp: number
  hitDiceUsed: number
  used: Record<string, number>
  attuned: boolean // Elemental Attunement: +10 ft reach and the elements, 10 minutes
  element: Element // what an attuned strike deals
  bonusUsed: boolean // the bonus action this turn
  reactionUsed: boolean // since the start of their turn
  pushUsed: boolean // Tavern Brawler's push, once per turn
  dodging: boolean // Patient Defense with a Focus Point, until their next turn
  surprise: boolean // the fight's first round: Surprise Attack on creatures that haven't acted
  round: number // their turns since initiative: 0 before the first
  inspiration: boolean // Heroic Inspiration
  deathSaves: { success: number; fail: number }
  conditions: string[]
  exhaustion: number
}

const STORAGE_KEY = 'elemental-monk-tracker-v1'

// The 2024 conditions that include Incapacitated, which ends the attunement
const incapacitating = ['Incapacitated', 'Paralyzed', 'Petrified', 'Stunned', 'Unconscious']

function fresh(): MonkState {
  return {
    hp: character.maxHp,
    temp: 0,
    hitDiceUsed: 0,
    used: Object.fromEntries(resources.map(r => [r.id, 0])),
    attuned: false,
    element: 'thunder',
    bonusUsed: false,
    reactionUsed: false,
    pushUsed: false,
    dodging: false,
    surprise: false,
    round: 0,
    inspiration: false,
    deathSaves: { success: 0, fail: 0 },
    conditions: [],
    exhaustion: 0
  }
}

// A notation with its modifier, e.g. 1d20+6 or 1d20-1
const withMod = (dice: string, n: number) => (n ? `${dice}${n > 0 ? '+' : '-'}${Math.abs(n)}` : dice)

export function useElementalMonkTracker() {
  const state = useState<MonkState>('elemental-monk-tracker', fresh)
  const loaded = useState('elemental-monk-tracker-loaded', () => false)
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

  const focusLeft = computed(() => left('focus'))
  const exhaustionPenalty = computed(() => Math.min(5, state.value.exhaustion) * 2)
  const speed = computed(() => Math.max(0, character.speed - state.value.exhaustion * 5))
  // The reach of an Unarmed Strike on their own turn, and on anyone else's
  const reach = computed(() => (state.value.attuned ? { own: stats.reach.attuned, other: stats.reach.attunedOff } : { own: stats.reach.ownTurn, other: stats.reach.base }))
  // What a strike deals: the element while attuned, bludgeoning otherwise
  const strikeType = computed(() => (state.value.attuned ? state.value.element : 'bludgeoning'))
  const surpriseReady = computed(() => state.value.surprise && state.value.round <= 1)

  // Anything done on their turn means the first turn has started
  function act() {
    if (state.value.round === 0) state.value.round = 1
  }

  // A d20 test: Exhaustion takes 2 a level off it (2024)
  function d20(bonus: number, label: string, opts: { advantage?: boolean } = {}) {
    const pen = exhaustionPenalty.value
    return roll(withMod('1d20', bonus - pen), pen ? `${label} · exhaustion −${pen}` : label, opts)
  }

  function rollInitiative() {
    const s = state.value
    s.surprise = true
    s.round = 0
    const r = d20(stats.initiative, 'Initiative')
    if (left('metabolism') > 0 && s.used.focus > 0) note('Uncanny Metabolism is ready', 'Every Focus Point back and 1d6 + 3 HP, under Techniques')
    return r
  }

  function attune() {
    const s = state.value
    if (s.attuned || focusLeft.value <= 0) return
    act()
    use('focus')
    s.attuned = true
    note('Elemental Attunement', `Reach ${reach.value.own} ft on their turn, ${reach.value.other} ft otherwise · 10 minutes · ${focusLeft.value} Focus left`)
  }

  function endAttunement(why = 'It ends') {
    if (!state.value.attuned) return
    state.value.attuned = false
    note('Attunement over', why)
  }

  // An Unarmed Strike or a monk weapon
  function attack(label: string, opts: { bonusAction?: boolean } = {}) {
    act()
    if (opts.bonusAction) state.value.bonusUsed = true
    return d20(stats.strikeAttack, label)
  }

  function rollDamage(notation: string, label: string, crit = false, rerollOnes = false) {
    return roll(crit ? critDice(notation) : notation, crit ? `${label} · critical` : label, { rerollOnes })
  }

  // A strike's damage: the Martial Arts die, with Tavern Brawler's rerolled 1s
  function strikeHit(crit = false) {
    return rollDamage(stats.strike, `Unarmed Strike (${strikeType.value})`, crit, true)
  }

  function surpriseAttack(crit = false, type = strikeType.value) {
    if (!surpriseReady.value) return
    return rollDamage(stats.surprise, `Surprise Attack (${type})`, crit)
  }

  // Elemental Strikes: an elemental hit can move the target 10 ft on a failed STR save
  function elementalMove() {
    if (!state.value.attuned) return
    note('Elemental Strikes', `STR save DC ${stats.focusDc}: on a failure, move it up to 10 ft toward or away`)
  }

  // Tavern Brawler: an Attack-action hit also pushes 5 ft, once per turn, no save
  function brawlerPush() {
    if (state.value.pushUsed) return
    state.value.pushUsed = true
    note('Tavern Brawler push', '5 ft straight away from them, no save')
  }

  function bonusStrike() {
    return attack('Bonus Unarmed Strike — attack', { bonusAction: true })
  }

  function flurry() {
    const s = state.value
    if (s.bonusUsed || focusLeft.value <= 0) return
    act()
    use('focus')
    s.bonusUsed = true
    note('Flurry of Blows', `Two Unarmed Strikes as the bonus action · ${focusLeft.value} Focus left`)
  }

  function patientDefense(withFocus: boolean) {
    const s = state.value
    if (s.bonusUsed || (withFocus && focusLeft.value <= 0)) return
    act()
    s.bonusUsed = true
    if (!withFocus) return note('Patient Defense: Disengage', 'No opportunity attacks this turn')
    use('focus')
    s.dodging = true
    note('Patient Defense: Disengage and Dodge', `Attacks against them at disadvantage until their next turn · ${focusLeft.value} Focus left`)
  }

  function stepOfTheWind(withFocus: boolean) {
    const s = state.value
    if (s.bonusUsed || (withFocus && focusLeft.value <= 0)) return
    act()
    s.bonusUsed = true
    if (!withFocus) return note('Step of the Wind: Dash', `${speed.value} ft more this turn`)
    use('focus')
    note('Step of the Wind: Disengage and Dash', `${speed.value} ft more, no opportunity attacks, jumps doubled · ${focusLeft.value} Focus left`)
  }

  function deflect() {
    if (state.value.reactionUsed) return
    state.value.reactionUsed = true
    return roll(stats.deflect, 'Deflect Attacks · damage taken off')
  }

  // After a deflected hit is brought to 0: a Focus Point sends it back
  function redirect(crit = false) {
    if (focusLeft.value <= 0) return
    use('focus')
    return rollDamage(stats.redirect, `Redirect · DEX save DC ${stats.focusDc}, the attack’s type`, crit)
  }

  // Uncanny Metabolism: on rolling initiative, all Focus back and a heal, once per long rest
  function metabolism() {
    if (left('metabolism') <= 0) return
    use('metabolism')
    state.value.used.focus = 0
    heal(Math.max(0, roll(stats.metabolism, 'Uncanny Metabolism · hit points').total))
    note('Uncanny Metabolism', `${maxOf('focus')} Focus Points back`)
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
      if (s.hp === 0) endAttunement('Down at 0 HP: Unconscious, so Incapacitated')
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

  function toggleCondition(name: string) {
    const s = state.value
    const on = !s.conditions.includes(name)
    s.conditions = on ? [...s.conditions, name] : s.conditions.filter(c => c !== name)
    if (on && incapacitating.includes(name)) endAttunement(`${name}, so Incapacitated`)
  }

  function drinkPotion() {
    if (left('potions') <= 0) return
    use('potions')
    state.value.bonusUsed = true
    heal(Math.max(0, roll('2d4+2', 'Potion of Healing').total))
  }

  // The start of their turn: the turn's uses reset and the Dodge ends.
  // Surprise Attack is over once their second turn starts: everyone has acted by then.
  function nextTurn() {
    const s = state.value
    s.bonusUsed = false
    s.reactionUsed = false
    s.pushUsed = false
    s.dodging = false
    s.round++
    if (s.round > 1) s.surprise = false
  }

  function spendHitDie() {
    const s = state.value
    if (s.hitDiceUsed >= character.level) return
    s.hitDiceUsed++
    heal(Math.max(0, roll(`1d${character.hitDie}+${stats.abilities.con.check}`, 'Hit Die').total))
  }

  function endFight() {
    const s = state.value
    s.bonusUsed = false
    s.reactionUsed = false
    s.pushUsed = false
    s.dodging = false
    s.surprise = false
    s.round = 0
  }

  function shortRest() {
    for (const r of resources) if (r.recharge === 'short') state.value.used[r.id] = 0
    endFight()
    state.value.attuned = false // an hour outlasts the 10 minutes
  }

  function longRest() {
    const s = state.value
    s.hp = character.maxHp
    s.temp = 0
    s.hitDiceUsed = 0 // 2024: a long rest restores every Hit Die
    for (const r of resources) if (r.recharge !== 'none') s.used[r.id] = 0
    endFight()
    s.attuned = false
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
    reach,
    strikeType,
    surpriseReady,
    focusLeft,
    exhaustionPenalty,
    left,
    maxOf,
    use,
    d20,
    rollInitiative,
    attune,
    endAttunement,
    attack,
    rollDamage,
    strikeHit,
    surpriseAttack,
    elementalMove,
    brawlerPush,
    bonusStrike,
    flurry,
    patientDefense,
    stepOfTheWind,
    deflect,
    redirect,
    metabolism,
    damage,
    heal,
    setTemp,
    toggleCondition,
    drinkPotion,
    nextTurn,
    spendHitDie,
    endFight,
    shortRest,
    longRest,
    reset
  }
}
