import { character, resources, lesserDao } from '~/data/character'

interface TrackerState {
  hp: number
  temp: number
  form: number // Form of the Lesser Dao HP; 0 when not transformed
  hitDiceUsed: number
  used: Record<string, number>
  concentration: string
  inspiration: boolean
  ring: { name: string; slug?: string; level: number; by: string }[] // Ring of Spell Storing
}

const STORAGE_KEY = 'codex-tracker-v1'
const hitDiceMax = character.level

function fresh(): TrackerState {
  return {
    hp: character.maxHp,
    temp: 0,
    form: 0,
    hitDiceUsed: 0,
    used: Object.fromEntries(resources.map(r => [r.id, 0])),
    concentration: '',
    inspiration: false,
    ring: []
  }
}

export function useTracker() {
  const state = useState<TrackerState>('tracker', fresh)
  const loaded = useState('tracker-loaded', () => false)

  onMounted(() => {
    if (!loaded.value) {
      loaded.value = true
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          const base = fresh()
          // Resources added since the save start unused; HP is capped at the new max
          state.value = { ...base, ...parsed, used: { ...base.used, ...parsed.used }, hp: Math.min(parsed.hp ?? base.hp, character.maxHp) }
        }
      } catch {
        // ignore corrupt storage
      }
    }
    // Registered per component so it lives as long as the component using it
    watch(state, v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })
  })

  function damage(amount: number) {
    const s = state.value
    // The Lesser Dao form soaks damage first; leftover damage carries over to Lucan
    const fromForm = Math.min(s.form, amount)
    s.form -= fromForm
    amount -= fromForm
    const fromTemp = Math.min(s.temp, amount)
    s.temp -= fromTemp
    s.hp = Math.max(0, s.hp - (amount - fromTemp))
  }

  function heal(amount: number) {
    state.value.hp = Math.min(character.maxHp, state.value.hp + amount)
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

  function shortRest() {
    for (const r of resources) if (r.recharge === 'short') state.value.used[r.id] = 0
  }

  function longRest() {
    const s = state.value
    s.hp = character.maxHp
    s.temp = 0
    s.form = 0
    s.hitDiceUsed = Math.max(0, s.hitDiceUsed - Math.max(1, Math.floor(hitDiceMax / 2)))
    for (const r of resources) if (r.recharge !== 'never') s.used[r.id] = 0
    s.concentration = ''
  }

  function assumeForm() {
    if ((state.value.used.lesserDao ?? 0) >= 2 || state.value.form > 0) return
    use('lesserDao')
    state.value.form = lesserDao.hp
  }

  function endForm() {
    state.value.form = 0
  }

  function reset() {
    state.value = fresh()
  }

  return { state, hitDiceMax, damage, heal, setTemp, use, shortRest, longRest, reset, assumeForm, endForm }
}
