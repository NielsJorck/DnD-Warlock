// Shapes every character's data uses: ability keys, their names, a feature
// (feat, class feature, racial trait) as the sheets list them, and spell schools.

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export const abilityNames: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma'
}

export interface Feature {
  name: string
  source: string
  level?: number
  summary: string
  detail?: string
  uses?: string
  homebrew?: boolean
  to?: string // the page of the site that covers it in full
}

export type School = 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation'

export const schoolGlyph: Record<School, string> = {
  Abjuration: '⛨',
  Conjuration: '✧',
  Divination: '◉',
  Enchantment: '♥',
  Evocation: '✶',
  Illusion: '◐',
  Necromancy: '☠',
  Transmutation: '⟲'
}

export function levelLabel(level: number, long = false) {
  if (level === 0) return 'Cantrip'
  const suffix = ['th', 'st', 'nd', 'rd'][level] ?? 'th'
  return long ? `${level}${suffix}-level` : `${level}${suffix}`
}
