export type RollMode = 'normal' | 'adv' | 'dis'

export interface Roll {
  id: number
  label: string
  notation: string
  rolls: number[]
  modifier: number
  total: number
  crit?: 'hit' | 'miss'
  mode?: 'adv' | 'dis'
  dropped?: number // the other d20 when rolling with advantage or disadvantage
  note?: string // a notification with no dice, e.g. "Pact slot spent"
}

let nextId = 1

function parse(notation: string) {
  const terms = notation.replace(/\s+/g, '').replace(/−/g, '-').match(/[+-]?[^+-]+/g) ?? []
  const dice: { count: number; sides: number; sign: number }[] = []
  let modifier = 0
  for (const term of terms) {
    const sign = term.startsWith('-') ? -1 : 1
    const body = term.replace(/^[+-]/, '')
    const m = body.match(/^(\d*)d(\d+)$/i)
    if (m) dice.push({ count: Number(m[1] || 1), sides: Number(m[2]), sign })
    else modifier += sign * Number(body)
  }
  return { dice, modifier }
}

// Doubles every dice term for a critical hit: 1d10+1d6+9 → 2d10+2d6+9
export function critDice(notation: string) {
  return notation.replace(/(\d*)d(\d+)/gi, (_, n, s) => `${Number(n || 1) * 2}d${s}`)
}

const die = (sides: number) => 1 + Math.floor(Math.random() * sides)

export function useDice() {
  const log = useState<Roll[]>('dice-log', () => [])
  // Applies to every single-d20 roll until it is switched back
  const mode = useState<RollMode>('dice-mode', () => 'normal')

  function push(entry: Roll) {
    log.value = [entry, ...log.value].slice(0, 6)
    return entry
  }

  // plain: ignore advantage/disadvantage (death saves). advantage: the roll has it from a
  // feature or item, which cancels out against disadvantage from the top bar.
  function roll(notation: string, label = notation, opts: { plain?: boolean; advantage?: boolean } = {}) {
    const { dice, modifier } = parse(notation)
    const single20 = dice.length === 1 && dice[0].count === 1 && dice[0].sides === 20 && dice[0].sign === 1
    const m: RollMode = opts.plain ? 'normal' : opts.advantage ? (mode.value === 'dis' ? 'normal' : 'adv') : mode.value
    const twice = single20 && m !== 'normal' ? m : undefined
    const rolls: number[] = []
    let total = modifier
    let dropped: number | undefined
    for (const d of dice) {
      for (let i = 0; i < d.count; i++) {
        let r = die(d.sides)
        if (twice) {
          const other = die(20)
          const keep = twice === 'adv' ? Math.max(r, other) : Math.min(r, other)
          dropped = keep === r ? other : r
          r = keep
        }
        rolls.push(r * d.sign)
        total += r * d.sign
      }
    }
    return push({
      id: nextId++,
      label: twice ? `${label} · ${twice === 'adv' ? 'advantage' : 'disadvantage'}` : label,
      notation,
      rolls,
      modifier,
      total,
      mode: twice,
      dropped,
      crit: single20 ? (rolls[0] === 20 ? 'hit' : rolls[0] === 1 ? 'miss' : undefined) : undefined
    })
  }

  function note(label: string, detail = '') {
    return push({ id: nextId++, label, notation: '', rolls: [], modifier: 0, total: 0, note: detail })
  }

  function dismiss(id: number) {
    log.value = log.value.filter(r => r.id !== id)
  }

  return { log, mode, roll, note, dismiss }
}
