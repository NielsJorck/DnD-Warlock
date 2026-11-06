// The Lightless Hunter's build, level by level. The campaign starts at level 3,
// so levels 1–3 were made at once and each choice sits at the first level the
// rules allow. Levels 4–12 are the plan (the campaign could reach 12 over the
// years): when a level is gained in play, change it from `upcoming` to `played`,
// add the date and the choices, and update character.ts to match.

import type { AbilityKey } from '../shared'

export type ChoiceKind = 'Species' | 'Background' | 'Subclass' | 'Feat' | 'Magic Initiate' | 'Spell' | 'Weapon Mastery' | 'Fighting Style' | 'Expertise' | 'Proficiencies'

export interface LevelChoice {
  kind: ChoiceKind
  pick: string
  replaces?: string // a swap: the old pick it replaces, so the counts stay the same
  from?: string // granted by the background or species rather than the class
  to?: string
  note?: string
}

export interface LevelEntry {
  level: number
  status: 'creation' | 'played' | 'upcoming'
  date?: string // the day the level was gained in play
  maxHp: number
  proficiencyBonus: number
  // The 2024 Ranger table at this level
  table: { prepared: number; slots: number[]; favoredEnemy: number }
  abilities?: string // only when a score changes
  // Level 1 only: the array as assigned, and what raised each score
  startingScores?: {
    base: Record<AbilityKey, number>
    increases: { source: string; scores: Partial<Record<AbilityKey, number>> }[]
  }
  gains: { name: string; to?: string; note?: string }[] // automatic class and subclass features
  choices: LevelChoice[]
  pending?: string[] // decisions still to make, with the plan
}

const spell = (slug: string) => `/gloom-stalker/spells/${slug}`

// Hit points: 10 at level 1, then the fixed 6 a level, plus CON +2 every level
export const levels: LevelEntry[] = [
  {
    level: 1,
    status: 'creation',
    maxHp: 12,
    proficiencyBonus: 2,
    table: { prepared: 2, slots: [2], favoredEnemy: 2 },
    startingScores: {
      base: { str: 12, dex: 16, con: 14, int: 10, wis: 15, cha: 8 },
      increases: [{ source: 'Guide', scores: { dex: 2, wis: 1 } }]
    },
    gains: [
      { name: 'Spellcasting', to: '/gloom-stalker/spells', note: 'Wisdom; prepared spells from the ranger list, one swap after each long rest' },
      { name: 'Favored Enemy', to: spell('hunters-mark'), note: 'Hunter’s Mark always prepared, twice a day without a slot' },
      { name: 'Weapon Mastery', note: 'Two kinds of weapon' },
      { name: 'Human traits', note: 'Resourceful (Heroic Inspiration after each long rest), Skillful, Versatile' }
    ],
    choices: [
      { kind: 'Species', pick: 'Human', note: 'Alert from Versatile and a daily Heroic Inspiration. Umbral Sight gives the darkvision humans lack. Runner-up: Wood Elf (speed 35, free Pass without Trace at 5) without Alert' },
      { kind: 'Background', pick: 'Guide', to: '/gloom-stalker/lore', note: '+2 DEX, +1 WIS. A guide of the Sword Mountain passes' },
      { kind: 'Feat', pick: 'Magic Initiate (Druid)', from: 'Guide', to: '/gloom-stalker/spells', note: 'The Guide’s Origin feat. Wisdom casting' },
      { kind: 'Magic Initiate', pick: 'Guidance', to: spell('guidance'), from: 'Guide' },
      { kind: 'Magic Initiate', pick: 'Message', to: spell('message'), from: 'Guide' },
      { kind: 'Magic Initiate', pick: 'Healing Word', to: spell('healing-word'), from: 'Guide', note: 'Once per long rest without a slot, and with ranger slots' },
      { kind: 'Feat', pick: 'Alert', from: 'Human', note: 'Versatile’s Origin feat: proficiency bonus to initiative, and the initiative swap' },
      { kind: 'Weapon Mastery', pick: 'Longbow (Slow), Scimitar (Nick)' },
      { kind: 'Spell', pick: 'Cure Wounds', to: spell('cure-wounds') },
      { kind: 'Spell', pick: 'Alarm', to: spell('alarm'), note: 'A ritual: guards the camp in a dungeon' },
      { kind: 'Proficiencies', pick: 'Athletics, Insight, Investigation, Perception, Stealth, Survival', note: 'Skills. Where each comes from is under Skill picks' },
      { kind: 'Proficiencies', pick: 'Cartographer’s tools', note: 'Guide' },
      { kind: 'Proficiencies', pick: 'Common, Dwarvish, Goblin', note: 'Languages: Common and two more at creation' }
    ]
  },
  {
    level: 2,
    status: 'creation',
    maxHp: 20,
    proficiencyBonus: 2,
    table: { prepared: 3, slots: [2], favoredEnemy: 2 },
    gains: [
      { name: 'Deft Explorer', note: 'Expertise in one skill and two languages' },
      { name: 'Fighting Style', note: 'A Fighting Style feat, or Druidic Warrior' }
    ],
    choices: [
      { kind: 'Expertise', pick: 'Perception', note: 'Deft Explorer: +7, passive 17. Spotting the ambush before springing one' },
      { kind: 'Proficiencies', pick: 'Orc, Giant', note: 'Deft Explorer’s two languages: who else lives in the Sword Mountains' },
      { kind: 'Fighting Style', pick: 'Archery', note: '+2 to ranged attack rolls' },
      { kind: 'Spell', pick: 'Detect Magic', to: spell('detect-magic'), note: 'A ritual: magic traps and loot' }
    ]
  },
  {
    level: 3,
    status: 'creation',
    maxHp: 28,
    proficiencyBonus: 2,
    table: { prepared: 4, slots: [3], favoredEnemy: 2 },
    gains: [
      { name: 'Dread Ambusher', to: '/gloom-stalker/session#attacks', note: 'WIS to initiative, +10 ft on the first turn, Dreadful Strike 2d6 psychic three times a day' },
      { name: 'Umbral Sight', note: 'Darkvision 60 ft, and invisible in darkness to creatures relying on darkvision' },
      { name: 'Gloom Stalker spells', to: spell('disguise-self'), note: 'Disguise Self, always prepared' }
    ],
    choices: [
      { kind: 'Subclass', pick: 'Gloom Stalker', note: 'Made for dungeons: most of what lives in the dark sees with darkvision. Runner-up: Hunter' },
      { kind: 'Spell', pick: 'Fog Cloud', to: spell('fog-cloud'), note: 'The emergency exit' }
    ]
  },
  {
    level: 4,
    status: 'upcoming',
    maxHp: 36,
    proficiencyBonus: 2,
    table: { prepared: 4, slots: [3], favoredEnemy: 2 },
    gains: [{ name: 'Ability Score Improvement', note: 'Or a feat' }],
    choices: [],
    pending: [
      'The plan: Sharpshooter, with its +1 DEX (to 19). No disadvantage shooting with an enemy next to them, half and three-quarters cover ignored, no disadvantage at long range. In corridors the first two come up every fight. DEX 20 instead is +1 to hit and damage.'
    ]
  },
  {
    level: 5,
    status: 'upcoming',
    maxHp: 44,
    proficiencyBonus: 3,
    table: { prepared: 6, slots: [4, 2], favoredEnemy: 3 },
    gains: [
      { name: 'Extra Attack', note: 'Two arrows a turn: the big jump' },
      { name: '2nd-level spells', to: '/gloom-stalker/spells?tab=later' },
      { name: 'Rope Trick', to: spell('rope-trick'), note: 'Gloom Stalker spell, always prepared: a safe short rest anywhere' },
      { name: 'Favored Enemy', note: 'Hunter’s Mark free three times a day' }
    ],
    choices: [],
    pending: ['Two more prepared spells. The plan: Pass without Trace for the party’s ambush, and Spike Growth for the corridor the enemy has to come down.']
  },
  {
    level: 6,
    status: 'upcoming',
    maxHp: 52,
    proficiencyBonus: 3,
    table: { prepared: 6, slots: [4, 2], favoredEnemy: 3 },
    gains: [{ name: 'Roving', note: '+10 ft speed out of heavy armor, and climbing and swimming speeds equal to it' }],
    choices: []
  },
  {
    level: 7,
    status: 'upcoming',
    maxHp: 60,
    proficiencyBonus: 3,
    table: { prepared: 7, slots: [4, 3], favoredEnemy: 3 },
    gains: [{ name: 'Iron Mind', note: 'Proficiency in Wisdom saves' }],
    choices: [],
    pending: ['One more prepared spell: Silence or Summon Beast if the 200-gp acorn has turned up.']
  },
  {
    level: 8,
    status: 'upcoming',
    maxHp: 68,
    proficiencyBonus: 3,
    table: { prepared: 7, slots: [4, 3], favoredEnemy: 3 },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['The plan: +1 DEX and +1 WIS, to DEX 20 and WIS 17. The bow reaches its best, and the spell DC, initiative and Dreadful Strike uses wait for WIS 18.']
  },
  {
    level: 9,
    status: 'upcoming',
    maxHp: 76,
    proficiencyBonus: 4,
    table: { prepared: 9, slots: [4, 3, 2], favoredEnemy: 4 },
    gains: [
      { name: 'Expertise', note: 'Two more skills' },
      { name: '3rd-level spells', to: '/gloom-stalker/spells?tab=later' },
      { name: 'Fear', to: spell('fear'), note: 'Gloom Stalker spell, always prepared' },
      { name: 'Favored Enemy', note: 'Hunter’s Mark free four times a day' }
    ],
    choices: [],
    pending: ['Expertise: Stealth and Survival are the plan. Two more prepared spells: Lightning Arrow and Conjure Barrage, checking their 2024 wording first.']
  },
  {
    level: 10,
    status: 'upcoming',
    maxHp: 84,
    proficiencyBonus: 4,
    table: { prepared: 9, slots: [4, 3, 2], favoredEnemy: 4 },
    gains: [{ name: 'Tireless', note: 'Temporary hit points as an action, WIS times a day, and a short rest removes a level of exhaustion' }],
    choices: []
  },
  {
    level: 11,
    status: 'upcoming',
    maxHp: 92,
    proficiencyBonus: 4,
    table: { prepared: 10, slots: [4, 3, 3], favoredEnemy: 4 },
    gains: [{ name: 'Stalker’s Flurry', note: 'Dreadful Strike becomes 2d8, and adds either a second attack on a creature next to the target or fear on everything within 10 ft of it' }],
    choices: [],
    pending: ['One more prepared spell.']
  },
  {
    level: 12,
    status: 'upcoming',
    maxHp: 100,
    proficiencyBonus: 4,
    table: { prepared: 10, slots: [4, 3, 3], favoredEnemy: 4 },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['The plan: +1 WIS and +1 CON, to WIS 18 (DC 16, a fourth Dreadful Strike) and CON 15. Tough is the other option.']
  }
]

// Every skill proficiency at level 1 and the skill it went to
export interface SkillPick {
  source: string
  rule: string
  picks: number
  skills: string[]
}

export const skillPicks: SkillPick[] = [
  { source: 'Ranger', rule: 'Three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth and Survival', picks: 3, skills: ['Athletics', 'Insight', 'Investigation'] },
  { source: 'Guide', rule: 'Stealth and Survival', picks: 2, skills: ['Stealth', 'Survival'] },
  { source: 'Human (Skillful)', rule: 'Any one skill', picks: 1, skills: ['Perception'] }
]
