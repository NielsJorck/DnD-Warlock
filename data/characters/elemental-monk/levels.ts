// The Undertow's build, level by level. They start at level 3 with the
// campaign, so levels 1–3 were made at once; levels 4–12 are the plan, with the
// choices still open under `pending`. When a level is gained in play, change its
// entry from `upcoming` to `played`, add the date and the choices, and update
// character.ts to match.

import type { AbilityKey } from '../shared'

export type ChoiceKind = 'Species' | 'Background' | 'Subclass' | 'Feat' | 'Proficiencies' | 'Ability Scores'

export interface LevelChoice {
  kind: ChoiceKind
  pick: string
  replaces?: string // a swap: the old pick it replaces
  from?: string // granted from outside the class levels
  to?: string
  note?: string
}

export interface LevelEntry {
  level: number
  status: 'creation' | 'played' | 'upcoming'
  date?: string // the day the level was gained in play
  maxHp: number
  proficiencyBonus: number
  // The Monk table (2024 PHB) at this level
  table: { martialArts: string; focus?: number; movement?: string }
  abilities?: string // only when a score changes
  // Level 1 only: the array as assigned, and what raised each score
  startingScores?: {
    base: Record<AbilityKey, number>
    increases: { source: string; scores: Partial<Record<AbilityKey, number>> }[]
  }
  gains: { name: string; to?: string; note?: string }[] // automatic class, subclass and species features
  choices: LevelChoice[]
  pending?: string[] // decisions still to make
}

const technique = (slug: string) => `/elemental-monk/techniques/${slug}`

// Hit points: 8 at level 1, then the fixed 5 a level, plus CON +2 every level
export const levels: LevelEntry[] = [
  {
    level: 1,
    status: 'creation',
    maxHp: 10,
    proficiencyBonus: 2,
    table: { martialArts: 'd6' },
    startingScores: {
      base: { str: 12, dex: 16, con: 14, int: 10, wis: 15, cha: 8 },
      increases: [{ source: 'Sailor', scores: { dex: 2, wis: 1 } }]
    },
    gains: [
      { name: 'Martial Arts', to: technique('martial-arts'), note: 'A d6, DEX for strikes, a bonus Unarmed Strike' },
      { name: 'Unarmored Defense', note: 'AC 10 + DEX + WIS' },
      { name: 'Bugbear traits', note: 'Darkvision 60 ft, Fey Ancestry, Long-Limbed, Powerful Build, Sneaky, Surprise Attack', to: technique('long-limbed') }
    ],
    choices: [
      {
        kind: 'Species',
        pick: 'Bugbear',
        note: 'From Monsters of the Multiverse, not the 2024 Player’s Handbook: it needs the DM’s yes. Long-Limbed puts 5 ft on every punch, which the attunement turns into 20 ft. If the answer is no, a Goliath keeps most of the build (speed 35, Hill’s Tumble knocks a hit target Prone) with 15 ft of reach',
        to: '/rules?ruleset=2024#elemental-monk'
      },
      { kind: 'Background', pick: 'Sailor', note: '+2 DEX, +1 WIS, the Tavern Brawler feat, Acrobatics and Perception, Navigator’s Tools', to: '/elemental-monk/lore' },
      { kind: 'Feat', pick: 'Tavern Brawler', from: 'Sailor', note: 'Origin feat: rerolled 1s on every strike and a free 5-ft push', to: technique('tavern-brawler') },
      { kind: 'Proficiencies', pick: 'Acrobatics, Athletics, Insight, Perception, Stealth', note: 'Skills. Where each comes from is under Skill picks' },
      { kind: 'Proficiencies', pick: 'Carpenter’s Tools, Navigator’s Tools', note: 'The Monk’s artisan’s tool is a ship’s carpenter’s: it seals and pries doors. The Sailor brings the navigator’s' },
      { kind: 'Proficiencies', pick: 'Common, Goblin, Dwarvish', note: 'Languages: Common and two standard ones at creation' }
    ]
  },
  {
    level: 2,
    status: 'creation',
    maxHp: 17,
    proficiencyBonus: 2,
    table: { martialArts: 'd6', focus: 2, movement: '+10 ft' },
    gains: [
      { name: 'Monk’s Focus', note: 'Two Focus Points: Flurry of Blows, Patient Defense, Step of the Wind', to: technique('flurry-of-blows') },
      { name: 'Unarmored Movement', note: 'Speed 40' },
      { name: 'Uncanny Metabolism', to: technique('uncanny-metabolism'), note: 'Focus back and a heal on initiative, once a day' }
    ],
    choices: []
  },
  {
    level: 3,
    status: 'creation',
    maxHp: 24,
    proficiencyBonus: 2,
    table: { martialArts: 'd6', focus: 3, movement: '+10 ft' },
    gains: [
      { name: 'Deflect Attacks', to: technique('deflect-attacks'), note: '1d10 + 7 off a weapon hit, and sometimes back' },
      { name: 'Elemental Attunement', to: technique('elemental-attunement'), note: '+10 ft reach, five elements, a 10-ft push or pull' },
      { name: 'Manipulate Elements', to: technique('elementalism'), note: 'The Elementalism cantrip' }
    ],
    choices: [
      {
        kind: 'Subclass',
        pick: 'Warrior of the Elements',
        note: 'The reach is the build: with Long-Limbed, 20 ft on their turn. Runners-up: Warrior of the Open Hand (Topple and Push on every Flurry hit, a heal at 6) and Warrior of Shadow (Darkness they see through)',
        to: technique('elemental-attunement')
      }
    ]
  },
  {
    level: 4,
    status: 'upcoming',
    maxHp: 31,
    proficiencyBonus: 2,
    table: { martialArts: 'd6', focus: 4, movement: '+10 ft' },
    gains: [{ name: 'Ability Score Improvement' }, { name: 'Slow Fall', to: technique('slow-fall'), note: '20 off falling damage' }],
    choices: [],
    pending: ['DEX +2, to 20: +1 to hit, damage, AC, initiative, Stealth, Acrobatics and Deflect Attacks all at once. The plan.']
  },
  {
    level: 5,
    status: 'upcoming',
    maxHp: 38,
    proficiencyBonus: 3,
    table: { martialArts: 'd8', focus: 5, movement: '+10 ft' },
    gains: [
      { name: 'Extra Attack', to: technique('extra-attack'), note: 'Three strikes a turn, four with Flurry' },
      { name: 'Stunning Strike', to: technique('stunning-strike'), note: 'A Focus Point: CON save or Stunned' },
      { name: 'Martial Arts d8' }
    ],
    choices: []
  },
  {
    level: 6,
    status: 'upcoming',
    maxHp: 45,
    proficiencyBonus: 3,
    table: { martialArts: 'd8', focus: 6, movement: '+15 ft' },
    gains: [
      { name: 'Empowered Strikes', to: technique('empowered-strikes'), note: 'Force damage without attuning' },
      { name: 'Elemental Burst', to: technique('elemental-burst'), note: '2 Focus Points: a 20-ft sphere, 3d8' }
    ],
    choices: []
  },
  {
    level: 7,
    status: 'upcoming',
    maxHp: 52,
    proficiencyBonus: 3,
    table: { martialArts: 'd8', focus: 7, movement: '+15 ft' },
    gains: [{ name: 'Evasion', to: technique('evasion'), note: 'No damage on a successful DEX save, half on a failed one' }],
    choices: []
  },
  {
    level: 8,
    status: 'upcoming',
    maxHp: 59,
    proficiencyBonus: 3,
    table: { martialArts: 'd8', focus: 8, movement: '+15 ft' },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: [
      'WIS +2, to 18: +1 AC, and +1 to the DC of Elemental Strikes, Stunning Strike and Elemental Burst. The plan.',
      'Or Sentinel: an opportunity attack that hits stops the target dead, and with 15 ft of reach while attuned, nothing walks past them. Its +1 can’t go to DEX at 20, so it would go to STR.'
    ]
  },
  {
    level: 9,
    status: 'upcoming',
    maxHp: 66,
    proficiencyBonus: 4,
    table: { martialArts: 'd8', focus: 9, movement: '+15 ft' },
    gains: [{ name: 'Acrobatic Movement', to: technique('acrobatic-movement'), note: 'Up walls and across water' }],
    choices: []
  },
  {
    level: 10,
    status: 'upcoming',
    maxHp: 73,
    proficiencyBonus: 4,
    table: { martialArts: 'd8', focus: 10, movement: '+20 ft' },
    gains: [
      { name: 'Heightened Focus', to: technique('heightened-focus'), note: 'Three strikes in a Flurry' },
      { name: 'Self-Restoration', to: technique('self-restoration'), note: 'Shake off Charmed, Frightened or Poisoned' }
    ],
    choices: []
  },
  {
    level: 11,
    status: 'upcoming',
    maxHp: 80,
    proficiencyBonus: 4,
    table: { martialArts: 'd10', focus: 11, movement: '+20 ft' },
    gains: [
      { name: 'Stride of the Elements', to: technique('stride-of-the-elements'), note: 'Fly and swim speeds while attuned' },
      { name: 'Martial Arts d10' }
    ],
    choices: []
  },
  {
    level: 12,
    status: 'upcoming',
    maxHp: 87,
    proficiencyBonus: 4,
    table: { martialArts: 'd10', focus: 12, movement: '+20 ft' },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['WIS +2, to 20, or whichever of Sentinel and WIS 18 wasn’t taken at 8.']
  }
]

// Every skill proficiency they get at level 1 and the skill it went to
export interface SkillPick {
  source: string
  rule: string
  picks: number
  skills: string[]
}

export const skillPicks: SkillPick[] = [
  { source: 'Monk', rule: 'Two from Acrobatics, Athletics, History, Insight, Religion and Stealth', picks: 2, skills: ['Athletics', 'Insight'] },
  { source: 'Sailor', rule: 'Acrobatics and Perception', picks: 2, skills: ['Acrobatics', 'Perception'] },
  { source: 'Bugbear', rule: 'Sneaky: Stealth', picks: 1, skills: ['Stealth'] }
]
