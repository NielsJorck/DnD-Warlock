export interface Roll {
  id: number
  label: string
  notation: string
  rolls: number[]
  modifier: number
  total: number
  crit?: 'hit' | 'miss'
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

export function useDice() {
  const log = useState<Roll[]>('dice-log', () => [])

  function roll(notation: string, label = notation) {
    const { dice, modifier } = parse(notation)
    const rolls: number[] = []
    let total = modifier
    for (const d of dice) {
      for (let i = 0; i < d.count; i++) {
        const r = 1 + Math.floor(Math.random() * d.sides)
        rolls.push(r * d.sign)
        total += r * d.sign
      }
    }
    const single20 = dice.length === 1 && dice[0].count === 1 && dice[0].sides === 20
    const entry: Roll = {
      id: nextId++,
      label,
      notation,
      rolls,
      modifier,
      total,
      crit: single20 ? (rolls[0] === 20 ? 'hit' : rolls[0] === 1 ? 'miss' : undefined) : undefined
    }
    log.value = [entry, ...log.value].slice(0, 6)
    return entry
  }

  function dismiss(id: number) {
    log.value = log.value.filter(r => r.id !== id)
  }

  return { log, roll, dismiss }
}
