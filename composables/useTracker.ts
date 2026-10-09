import { character, resources } from '~/data/character'

interface TrackerState {
  hp: number
  temp: number
  hitDiceUsed: number
  used: Record<string, number>
  concentration: string
  inspiration: boolean
}

const STORAGE_KEY = 'codex-tracker-v1'
const hitDiceMax = character.level

function fresh(): TrackerState {
  return {
    hp: character.maxHp,
    temp: 0,
    hitDiceUsed: 0,
    used: Object.fromEntries(resources.map(r => [r.id, 0])),
    concentration: '',
    inspiration: false
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
        if (saved) state.value = { ...fresh(), ...JSON.parse(saved) }
      } catch {
        // ignore corrupt storage
      }
    }
    // Registered per component so it lives as long as the component using it
    watch(state, v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })
  })

  function damage(amount: number) {
    const s = state.value
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
    s.hitDiceUsed = Math.max(0, s.hitDiceUsed - Math.max(1, Math.floor(hitDiceMax / 2)))
    for (const r of resources) s.used[r.id] = 0
    s.concentration = ''
  }

  function reset() {
    state.value = fresh()
  }

  return { state, hitDiceMax, damage, heal, setTemp, use, shortRest, longRest, reset }
}
