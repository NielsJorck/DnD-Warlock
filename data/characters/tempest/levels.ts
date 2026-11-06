// The Storm-Hammer's build, level by level. He is built at level 10 to join the
// party, so levels 1–10 were made at once and each choice sits at the first level
// the rules allow. Record each new level here as it's gained in play, with the
// date and the choices, and update character.ts to match.

import type { AbilityKey } from '../shared'

export type ChoiceKind = 'Race' | 'Background' | 'Deity' | 'Domain' | 'Feat' | 'Cantrip' | 'Magic Initiate' | 'Proficiencies'

export interface LevelChoice {
  kind: ChoiceKind
  pick: string
  replaces?: string // a swap: the old pick it replaces, so the counts stay the same
  from?: string // granted from outside his levels, e.g. the Seeker Guild
  to?: string
  note?: string
}

export interface LevelEntry {
  level: number
  status: 'creation' | 'played' | 'upcoming'
  date?: string // the day the level was gained in play
  maxHp: number
  proficiencyBonus: number
  // The Cleric table (PHB) at this level; prepared is WIS modifier + level
  table: { cantrips: number; prepared: number; slots: number[]; channelDivinity: number }
  abilities?: string // only when a score changes
  // Level 1 only: the array as assigned, and what raised each score
  startingScores?: {
    base: Record<AbilityKey, number>
    increases: { source: string; scores: Partial<Record<AbilityKey, number>> }[]
  }
  gains: { name: string; to?: string; note?: string }[] // automatic class and domain features
  choices: LevelChoice[]
  pending?: string[] // decisions still to make
}

const spell = (slug: string) => `/tempest/spells/${slug}`

// Hit points: 8 at level 1, then the fixed 5 a level, plus CON +4 and Dwarven Toughness +1 every level
export const levels: LevelEntry[] = [
  {
    level: 1,
    status: 'creation',
    maxHp: 13,
    proficiencyBonus: 2,
    table: { cantrips: 3, prepared: 5, slots: [2], channelDivinity: 0 },
    startingScores: {
      base: { str: 8, dex: 11, con: 16, int: 10, wis: 17, cha: 10 },
      increases: [{ source: 'Hill Dwarf', scores: { con: 2, wis: 1 } }]
    },
    gains: [
      { name: 'Spellcasting', to: '/tempest/spells', note: 'Wisdom; prepares from the whole cleric list after each long rest' },
      { name: 'Tempest Domain spells', note: 'Fog Cloud, Thunderwave, always prepared' },
      { name: 'Bonus Proficiencies', note: 'Heavy armor and martial weapons' },
      { name: 'Wrath of the Storm', note: '2d8 lightning or thunder as a reaction, WIS times a day' },
      { name: 'Hill Dwarf traits', note: 'Darkvision 60 ft, poison resistance, Dwarven Toughness, speed 25 never slowed by heavy armor' }
    ],
    choices: [
      { kind: 'Race', pick: 'Hill Dwarf', note: '+2 CON, +1 WIS, +1 HP a level. Runner-up: Firbolg (+2 WIS, Hidden Step, a giant heritage that suits the Stormgirdle; its +1 STR is wasted under the belt)' },
      { kind: 'Background', pick: 'Acolyte', note: 'Struck by lightning at the altar of Kord', to: '/tempest/lore' },
      { kind: 'Deity', pick: 'Kord, the Storm Lord', to: '/tempest/lore' },
      { kind: 'Domain', pick: 'Tempest' },
      { kind: 'Feat', pick: 'War Caster', note: 'The table’s extra level-1 feat. Keeps Spirit Guardians up and frees his hands for somatic components' },
      { kind: 'Feat', pick: 'Magic Initiate (Wizard)', from: 'Seeker Guild', note: 'On top of the level feats. Intelligence casting: attack +5, DC 13 with the amulet' },
      { kind: 'Magic Initiate', pick: 'Booming Blade', to: spell('booming-blade'), from: 'Seeker Guild' },
      { kind: 'Magic Initiate', pick: 'Shocking Grasp', to: spell('shocking-grasp'), from: 'Seeker Guild' },
      { kind: 'Magic Initiate', pick: 'Shield', to: spell('shield'), from: 'Seeker Guild', note: 'Once per long rest, without a slot' },
      { kind: 'Proficiencies', pick: 'Athletics, Insight, Perception, Religion', note: 'Skills. Where each comes from is under Skill picks' },
      { kind: 'Proficiencies', pick: 'Smith’s tools', note: 'Hill Dwarf' },
      { kind: 'Proficiencies', pick: 'Common, Dwarvish, Giant, Primordial', note: 'Languages: Hill Dwarf 2, Acolyte 2' },
      { kind: 'Cantrip', pick: 'Toll the Dead', to: spell('toll-the-dead') },
      { kind: 'Cantrip', pick: 'Word of Radiance', to: spell('word-of-radiance') },
      { kind: 'Cantrip', pick: 'Guidance', to: spell('guidance') }
    ]
  },
  {
    level: 2,
    status: 'creation',
    maxHp: 23,
    proficiencyBonus: 2,
    table: { cantrips: 3, prepared: 6, slots: [3], channelDivinity: 1 },
    gains: [
      { name: 'Channel Divinity, 1 per rest', note: 'Turn Undead' },
      { name: 'Destructive Wrath', note: 'Channel Divinity: max a lightning or thunder damage roll' }
    ],
    choices: []
  },
  {
    level: 3,
    status: 'creation',
    maxHp: 33,
    proficiencyBonus: 2,
    table: { cantrips: 3, prepared: 7, slots: [4, 2], channelDivinity: 1 },
    gains: [
      { name: '2nd-level spells', note: 'Spiritual Weapon among them' },
      { name: 'Tempest Domain spells', note: 'Gust of Wind, Shatter' }
    ],
    choices: []
  },
  {
    level: 4,
    status: 'creation',
    maxHp: 43,
    proficiencyBonus: 2,
    table: { cantrips: 4, prepared: 8, slots: [4, 3], channelDivinity: 1 },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [
      { kind: 'Feat', pick: 'Elemental Adept', note: 'His spells of one type ignore resistance, and 1s count as 2s' },
      { kind: 'Cantrip', pick: 'Thaumaturgy', to: spell('thaumaturgy') }
    ],
    pending: ['Elemental Adept: thunder or lightning. Thunder covers more of his spells (Booming Blade, Thunderwave, Shatter, Destructive Wave); lightning resistance is the more common one.']
  },
  {
    level: 5,
    status: 'creation',
    maxHp: 53,
    proficiencyBonus: 3,
    table: { cantrips: 4, prepared: 9, slots: [4, 3, 2], channelDivinity: 1 },
    gains: [
      { name: '3rd-level spells', to: spell('spirit-guardians'), note: 'Spirit Guardians, the core of the build' },
      { name: 'Tempest Domain spells', note: 'Call Lightning, Sleet Storm' },
      { name: 'Destroy Undead (CR 1/2)' },
      { name: 'Cantrips grow', note: 'Booming Blade 1d8 on a hit and 2d8 for moving; the others roll two dice' }
    ],
    choices: []
  },
  {
    level: 6,
    status: 'creation',
    maxHp: 63,
    proficiencyBonus: 3,
    table: { cantrips: 4, prepared: 10, slots: [4, 3, 3], channelDivinity: 2 },
    gains: [
      { name: 'Channel Divinity, 2 per rest' },
      { name: 'Thunderbolt Strike', note: 'Lightning damage pushes a Large or smaller creature 10 ft' }
    ],
    choices: []
  },
  {
    level: 7,
    status: 'creation',
    maxHp: 73,
    proficiencyBonus: 3,
    table: { cantrips: 4, prepared: 11, slots: [4, 3, 3, 1], channelDivinity: 2 },
    gains: [
      { name: '4th-level spells' },
      { name: 'Tempest Domain spells', note: 'Control Water, Ice Storm' }
    ],
    choices: []
  },
  {
    level: 8,
    status: 'creation',
    maxHp: 83,
    proficiencyBonus: 3,
    table: { cantrips: 4, prepared: 12, slots: [4, 3, 3, 2], channelDivinity: 2 },
    gains: [
      { name: 'Ability Score Improvement' },
      { name: 'Divine Strike', note: 'Once a turn, a weapon hit deals 1d8 thunder more' },
      { name: 'Destroy Undead (CR 1)' }
    ],
    choices: [{ kind: 'Feat', pick: 'Shield Master', note: 'Shoves, +2 to Dexterity saves against effects that target only him, and no damage on a successful one' }]
  },
  {
    level: 9,
    status: 'creation',
    maxHp: 93,
    proficiencyBonus: 4,
    table: { cantrips: 4, prepared: 13, slots: [4, 3, 3, 3, 1], channelDivinity: 2 },
    gains: [
      { name: '5th-level spells' },
      { name: 'Tempest Domain spells', note: 'Destructive Wave, Insect Plague' }
    ],
    choices: []
  },
  {
    level: 10,
    status: 'creation',
    maxHp: 103,
    proficiencyBonus: 4,
    table: { cantrips: 5, prepared: 14, slots: [4, 3, 3, 3, 2], channelDivinity: 2 },
    gains: [{ name: 'Divine Intervention', note: 'A d100 of 10 or lower and Kord answers' }],
    choices: [{ kind: 'Cantrip', pick: 'Spare the Dying', to: spell('spare-the-dying') }]
  },
  {
    level: 11,
    status: 'upcoming',
    maxHp: 113,
    proficiencyBonus: 4,
    table: { cantrips: 5, prepared: 15, slots: [4, 3, 3, 3, 2, 1], channelDivinity: 2 },
    gains: [
      { name: '6th-level spells', to: '/tempest/spells?tab=later', note: 'Heal, Heroes’ Feast, Blade Barrier and Word of Recall wait in the spellbook' },
      { name: 'Destroy Undead (CR 2)' },
      { name: 'Cantrips grow', note: 'Booming Blade 2d8 on a hit and 3d8 for moving; the others roll three dice' }
    ],
    choices: []
  },
  {
    level: 12,
    status: 'upcoming',
    maxHp: 123,
    proficiencyBonus: 4,
    table: { cantrips: 5, prepared: 16, slots: [4, 3, 3, 3, 2, 1], channelDivinity: 2 },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['A feat or an ability score increase. Wisdom +2, to 20, is the suggestion: +1 DC and attack, a fifth Wrath of the Storm, one more prepared spell.']
  }
]

// Every skill proficiency he gets at level 1 and the skill it went to
export interface SkillPick {
  source: string
  rule: string
  picks: number
  skills: string[]
}

export const skillPicks: SkillPick[] = [
  { source: 'Cleric', rule: 'Two from History, Insight, Medicine, Persuasion and Religion', picks: 2, skills: ['Insight', 'Religion'] },
  { source: 'Acolyte', rule: 'Insight and Religion, both repeated, so any two others instead (PHB)', picks: 2, skills: ['Athletics', 'Perception'] },
  { source: 'INT 10', rule: 'No modifier, so no extra proficiency', picks: 0, skills: [] }
]
