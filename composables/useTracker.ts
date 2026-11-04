import { character, resources, lesserDao } from '~/data/characters/lucan/character'

export interface StoredSpell {
  name: string
  slug?: string
  level: number
  by: string
}

interface TrackerState {
  hp: number
  temp: number
  form: number // Form of the Lesser Dao HP; 0 when not transformed
  formTurns: number // turns of the form left
  hitDiceUsed: number
  used: Record<string, number>
  concentration: string
  inspiration: boolean
  ring: StoredSpell[] // Ring of Spell Storing
  gem: StoredSpell | null // Spell Gem (Blue Topaz)
  deathSaves: { success: number; fail: number }
  conditions: string[]
  exhaustion: number
  flying: boolean // Elemental Gift, 10 minutes
  agathys: number // Armor of Agathys cold damage; lasts while its temp HP do, 0 when off
}

const STORAGE_KEY = 'lucan-tracker-v1'
const hitDiceMax = character.level
const pactMax = character.pactSlots.count
const savantMax = character.savantSlot.count

function fresh(): TrackerState {
  return {
    hp: character.maxHp,
    temp: 0,
    form: 0,
    formTurns: 0,
    hitDiceUsed: 0,
    used: Object.fromEntries(resources.map(r => [r.id, 0])),
    concentration: '',
    inspiration: false,
    ring: [],
    gem: null,
    deathSaves: { success: 0, fail: 0 },
    conditions: [],
    exhaustion: 0,
    flying: false,
    agathys: 0
  }
}

export function useTracker() {
  const state = useState<TrackerState>('tracker', fresh)
  const loaded = useState('tracker-loaded', () => false)

  onMounted(() => {
    if (!loaded.value) {
      loaded.value = true
      try {
        const saved = readSaved(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          const base = fresh()
          // Fields and resources added since the save start fresh; HP is capped at the new max
          state.value = {
            ...base,
            ...parsed,
            used: { ...base.used, ...parsed.used },
            deathSaves: { ...base.deathSaves, ...parsed.deathSaves },
            hp: Math.min(parsed.hp ?? base.hp, character.maxHp),
            formTurns: parsed.formTurns ?? (parsed.form ? lesserDao.turns : 0)
          }
        }
      } catch {
        // ignore corrupt storage
      }
    }
    // Registered per component so it lives as long as the component using it
    watch(state, v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })
  })

  const left = (id: string) => (resources.find(r => r.id === id)?.max ?? 0) - (state.value.used[id] ?? 0)

  // In the Form of the Lesser Dao: no spellcasting, and rolls use the form's stats
  const inForm = computed(() => state.value.form > 0)
  const stats = computed(() => (inForm.value ? formStats : lucanStats))

  // Returns whether the form broke and how much damage carried over to Lucan
  function damage(amount: number) {
    const s = state.value
    const wasDown = s.hp === 0
    // The Lesser Dao form soaks damage first; leftover damage carries over to Lucan
    const fromForm = Math.min(s.form, amount)
    const formBroke = fromForm > 0 && fromForm === s.form
    s.form -= fromForm
    amount -= fromForm
    if (formBroke) s.formTurns = 0
    const carried = formBroke ? amount : 0
    const fromTemp = Math.min(s.temp, amount)
    s.temp -= fromTemp
    amount -= fromTemp
    if (!s.temp) s.agathys = 0
    if (amount > 0) {
      // Damage at 0 HP is a failed death save
      if (wasDown) s.deathSaves.fail = Math.min(3, s.deathSaves.fail + 1)
      s.hp = Math.max(0, s.hp - amount)
    }
    return { formBroke, carried }
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

  function use(id: string, delta = 1) {
    const r = resources.find(x => x.id === id)
    if (!r) return
    const next = (state.value.used[id] ?? 0) + delta
    state.value.used[id] = Math.min(r.max, Math.max(0, next))
  }

  // Leveled spells all use 5th-level slots: pact slots first, then Spell Savant
  const nextSlot = computed<'pact' | 'savant' | null>(() =>
    (state.value.used.pact ?? 0) < pactMax ? 'pact' : (state.value.used.savant ?? 0) < savantMax ? 'savant' : null
  )
  function spendSlot() {
    const slot = nextSlot.value
    if (slot) use(slot)
    return slot
  }

  function shortRest() {
    for (const r of resources) if (r.recharge === 'short') state.value.used[r.id] = 0
  }

  function longRest() {
    const s = state.value
    s.hp = character.maxHp
    s.temp = 0
    s.form = 0
    s.formTurns = 0
    s.hitDiceUsed = Math.max(0, s.hitDiceUsed - Math.max(1, Math.floor(hitDiceMax / 2)))
    for (const r of resources) if (r.recharge !== 'never') s.used[r.id] = 0
    s.concentration = ''
    s.deathSaves = { success: 0, fail: 0 }
    s.conditions = []
    s.exhaustion = Math.max(0, s.exhaustion - 1)
    s.flying = false
    s.agathys = 0
  }

  function assumeForm() {
    if (left('lesserDao') <= 0 || inForm.value) return
    use('lesserDao')
    state.value.form = lesserDao.hp
    state.value.formTurns = lesserDao.turns
  }

  function endForm() {
    state.value.form = 0
    state.value.formTurns = 0
  }

  // Counts down the form's 10 turns; returns true when this turn ended it
  function endTurn() {
    if (!inForm.value) return false
    state.value.formTurns = Math.max(0, state.value.formTurns - 1)
    if (state.value.formTurns > 0) return false
    endForm()
    return true
  }

  function reset() {
    state.value = fresh()
  }

  return { state, hitDiceMax, pactMax, savantMax, inForm, stats, left, damage, heal, setTemp, use, nextSlot, spendSlot, shortRest, longRest, reset, assumeForm, endForm, endTurn }
}
