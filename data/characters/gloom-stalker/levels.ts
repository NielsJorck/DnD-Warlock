// The Lightless Hunter's build, level by level. The campaign starts at level 3,
// so levels 1–3 were made at once and each choice sits at the first level the
// rules allow. Levels 4–12 are the plan (the campaign could reach 12 over the
// years): when a level is gained in play, change it from `upcoming` to `played`,
// add the date and the choices, and update character.ts to match.

import type { AbilityKey } from '../shared'

export type ChoiceKind = 'Species' | 'Background' | 'Subclass' | 'Feat' | 'Spell' | 'Weapon Mastery' | 'Fighting Style' | 'Expertise' | 'Proficiencies'

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
      increases: [{ source: 'Criminal, by the DM’s ruling', scores: { dex: 2, wis: 1 } }]
    },
    gains: [
      { name: 'Spellcasting', to: '/gloom-stalker/spells', note: 'Wisdom; prepared spells from the ranger list, one swap after each long rest' },
      { name: 'Favored Enemy', to: spell('hunters-mark'), note: 'Hunter’s Mark always prepared, twice a day without a slot' },
      { name: 'Weapon Mastery', note: 'Two kinds of weapon' },
      { name: 'Wood Elf traits', note: 'Speed 35, Darkvision 60 ft, Fey Ancestry, Keen Senses, Trance' },
      { name: 'Druidcraft', to: spell('druidcraft'), note: 'Elven Lineage: a cantrip at will. Fire Play puts out a torch within 30 ft' }
    ],
    choices: [
      { kind: 'Species', pick: 'Wood Elf', note: 'Speed 35, Darkvision that Umbral Sight takes to 120 ft, Druidcraft, and Longstrider and Pass without Trace free once a day each. Runner-up: Human, for a second Origin feat and a daily Heroic Inspiration' },
      { kind: 'Species', pick: 'Elven Lineage: Wisdom', from: 'Wood Elf', note: 'The ability for Druidcraft, Longstrider and Pass without Trace: DC 13, the same as the ranger spells' },
      { kind: 'Species', pick: 'Keen Senses: Perception', from: 'Wood Elf', note: 'One of Insight, Perception or Survival. Deft Explorer doubles it' },
      { kind: 'Background', pick: 'Criminal', to: '/gloom-stalker/lore', note: '+2 DEX, +1 WIS. The Criminal’s own scores are DEX, CON and INT; the DM lets the increases and the feat go anywhere. A smuggler of the tunnels under the Sword Mountains' },
      { kind: 'Feat', pick: 'Alert', from: 'Criminal', note: 'The Criminal’s own Origin feat, kept by choice: proficiency bonus to initiative, and the initiative swap. Runner-up: Magic Initiate (Druid), for Healing Word and Guidance' },
      { kind: 'Weapon Mastery', pick: 'Longbow (Slow), Scimitar (Nick)' },
      { kind: 'Spell', pick: 'Cure Wounds', to: spell('cure-wounds') },
      { kind: 'Spell', pick: 'Alarm', to: spell('alarm'), note: 'A ritual: guards the camp in a dungeon' },
      { kind: 'Proficiencies', pick: 'Athletics, Investigation, Perception, Sleight of Hand, Stealth, Survival', note: 'Skills. Where each comes from is under Skill picks' },
      { kind: 'Proficiencies', pick: 'Thieves’ Tools', note: 'Criminal' },
      { kind: 'Proficiencies', pick: 'Common, Elvish, Dwarvish', note: 'Languages: Common and two more at creation' }
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
      { kind: 'Proficiencies', pick: 'Goblin, Orc', note: 'Deft Explorer’s two languages: who lives in the old delves now, and who else holds the Sword Mountains' },
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
      { name: 'Umbral Sight', note: 'Darkvision 60 ft more, to 120 ft, and invisible in darkness to creatures relying on darkvision' },
      { name: 'Gloom Stalker spells', to: spell('disguise-self'), note: 'Disguise Self, always prepared' },
      { name: 'Longstrider', to: spell('longstrider'), note: 'Elven Lineage: always prepared, once a day without a slot' }
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
      'The plan: Sharpshooter, with its +1 DEX (to 19). No disadvantage shooting with an enemy next to him, half and three-quarters cover ignored, no disadvantage at long range. In corridors the first two come up every fight. Skulker at 8 takes DEX the rest of the way to 20.'
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
      { name: 'Favored Enemy', note: 'Hunter’s Mark free three times a day' },
      { name: 'Pass without Trace', to: spell('pass-without-trace'), note: 'Elven Lineage: always prepared, once a day without a slot. The party’s ambush' }
    ],
    choices: [],
    pending: ['Two more prepared spells. Pass without Trace comes free from the Wood Elf, so the plan is Spike Growth for the corridor the enemy has to come down, and Silence, a ritual too.']
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
    pending: ['One more prepared spell: Summon Beast if the 200-gp acorn has turned up.']
  },
  {
    level: 8,
    status: 'upcoming',
    maxHp: 68,
    proficiencyBonus: 3,
    table: { prepared: 7, slots: [4, 3], favoredEnemy: 3 },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: [
      'The plan: Skulker, with its +1 DEX (to 20). Blindsight 10 ft: he sees anything within 10 ft, even if it is invisible or in magical darkness. Advantage on the Stealth check when he Hides in combat, and a miss while hidden doesn’t give away where he is. DEX 20 is +1 to hit and damage, AC 17 and +1 initiative.'
    ]
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
    pending: ['Left open until the campaign gets near it. With DEX at 20, the obvious candidates are +2 WIS (spell DC 16, initiative +1, a fourth Dreadful Strike), War Caster for keeping Hunter’s Mark up, or Tough.']
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
  { source: 'Ranger', rule: 'Three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth and Survival', picks: 3, skills: ['Athletics', 'Investigation', 'Survival'] },
  { source: 'Criminal', rule: 'Sleight of Hand and Stealth', picks: 2, skills: ['Sleight of Hand', 'Stealth'] },
  { source: 'Wood Elf (Keen Senses)', rule: 'One of Insight, Perception and Survival', picks: 1, skills: ['Perception'] }
]
