// The Whisper-Knife's build, level by level. They start at level 3 with the
// campaign, so levels 1–3 were made at once; levels 4–12 are the plan, with
// the choices still open under `pending`. When a level is gained in play,
// change its entry from `upcoming` to `played`, add the date and the choices,
// and update character.ts to match.

import type { AbilityKey } from '../shared'

export type ChoiceKind = 'Species' | 'Background' | 'Subclass' | 'Feat' | 'Expertise' | 'Weapon Mastery' | 'Proficiencies' | 'Ability Scores'

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
  // The Rogue table (2024 PHB) at this level, and the Soulknife's Psionic Energy Dice
  table: { sneakAttack: string; psiDice?: string }
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

const power = (slug: string) => `/soulknife/powers/${slug}`

// Hit points: 8 at level 1, then the fixed 5 a level, plus CON +3 every level.
// Psionic Energy Dice past level 3 follow the 2014 pattern (twice the proficiency
// bonus, d8 from 5, d10 from 11); check them against the 2024 Soulknife table.
export const levels: LevelEntry[] = [
  {
    level: 1,
    status: 'creation',
    maxHp: 11,
    proficiencyBonus: 2,
    table: { sneakAttack: '1d6' },
    startingScores: {
      base: { str: 8, dex: 16, con: 15, int: 12, wis: 14, cha: 10 },
      increases: [{ source: 'Criminal', scores: { dex: 2, con: 1 } }]
    },
    gains: [
      { name: 'Expertise', note: 'Two skills at double proficiency' },
      { name: 'Sneak Attack', to: power('sneak-attack'), note: '1d6, once per turn' },
      { name: 'Thieves’ Cant', note: 'And one more language' },
      { name: 'Weapon Mastery', note: 'The mastery properties of two kinds of weapons' },
      { name: 'Wood Elf traits', note: 'Darkvision 60 ft, Fey Ancestry, Keen Senses, Trance, speed 35, Druidcraft', to: power('druidcraft') }
    ],
    choices: [
      {
        kind: 'Species',
        pick: 'Wood Elf',
        note: 'Speed 35, darkvision, and Pass without Trace for the whole party at level 5. Runners-up: Drow (120-ft darkvision, Faerie Fire at 3), Halfling (Luck, hiding behind larger friends)'
      },
      { kind: 'Background', pick: 'Criminal', note: '+2 DEX, +1 CON, the Alert feat, Sleight of Hand and Stealth, Thieves’ Tools', to: '/soulknife/lore' },
      { kind: 'Feat', pick: 'Alert', from: 'Criminal', note: 'Origin feat: +2 to initiative and the swap', to: power('initiative-swap') },
      { kind: 'Proficiencies', pick: 'Acrobatics, Deception, Insight, Investigation, Perception, Sleight of Hand, Stealth', note: 'Skills. Where each comes from is under Skill picks' },
      { kind: 'Expertise', pick: 'Stealth and Perception', note: 'Stealth +8 for scouting, Perception +6 (passive 16) for spotting traps and ambushes' },
      { kind: 'Weapon Mastery', pick: 'Shortbow (Vex), Dagger (Nick)', note: 'The Psychic Blade brings its own Vex at level 3' },
      { kind: 'Proficiencies', pick: 'Thieves’ Tools', note: 'From both the Rogue and the Criminal: whether the second can be another tool is a DM question', to: '/rules?ruleset=2024#soulknife' },
      { kind: 'Proficiencies', pick: 'Common, Elvish, Dwarvish, Thieves’ Cant, Goblin', note: 'Languages: Common and two standard ones at creation, Thieves’ Cant and one more from the Rogue' },
      { kind: 'Proficiencies', pick: 'Wisdom for the Wood Elf spells', note: 'The lineage lets them pick INT, WIS or CHA; WIS 14 is the highest: DC 12, attack +4' }
    ]
  },
  {
    level: 2,
    status: 'creation',
    maxHp: 19,
    proficiencyBonus: 2,
    table: { sneakAttack: '1d6' },
    gains: [{ name: 'Cunning Action', to: power('cunning-action'), note: 'Bonus action: Dash, Disengage or Hide' }],
    choices: []
  },
  {
    level: 3,
    status: 'creation',
    maxHp: 27,
    proficiencyBonus: 2,
    table: { sneakAttack: '2d6', psiDice: '4d6' },
    gains: [
      { name: 'Steady Aim', to: power('steady-aim'), note: 'Bonus action for advantage, if they haven’t moved' },
      { name: 'Psionic Power', to: '/soulknife/powers', note: 'Four d6s: Psi-Bolstered Knack and Psychic Whispers' },
      { name: 'Psychic Blades', to: power('psychic-blades'), note: '1d6 psychic, thrown 60 ft, Vex; a second blade for 1d4 as a bonus action' },
      { name: 'Longstrider', to: power('longstrider'), note: 'Wood Elf: once per long rest without a slot' },
      { name: 'Sneak Attack 2d6' }
    ],
    choices: [{ kind: 'Subclass', pick: 'Soulknife', note: 'No weapon to buy or lose, telepathy for the party, and a die that rescues failed checks. Runner-up: Thief (traps and locks as a bonus action, a climbing speed)' }]
  },
  {
    level: 4,
    status: 'upcoming',
    maxHp: 35,
    proficiencyBonus: 2,
    table: { sneakAttack: '2d6', psiDice: '4d6' },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['DEX +2, to 20: +1 to hit, damage, AC, initiative, Stealth and Thieves’ Tools all at once. The plan.']
  },
  {
    level: 5,
    status: 'upcoming',
    maxHp: 43,
    proficiencyBonus: 3,
    table: { sneakAttack: '3d6', psiDice: '6d8' },
    gains: [
      { name: 'Cunning Strike', to: power('cunning-strike'), note: 'Trade Sneak Attack dice for poison, a trip or a free retreat' },
      { name: 'Uncanny Dodge', to: power('uncanny-dodge'), note: 'Reaction: halve a hit' },
      { name: 'Pass without Trace', to: power('pass-without-trace'), note: 'Wood Elf: +10 Stealth for the party, once per long rest' },
      { name: 'Psionic Energy Dice', note: 'd8s, and more of them' },
      { name: 'Psychic Whispers for three' }
    ],
    choices: [],
    pending: ['Buy a Poisoner’s Kit (50 gp) for Cunning Strike’s Poison, unless the Criminal’s Thieves’ Tools became one.']
  },
  {
    level: 6,
    status: 'upcoming',
    maxHp: 51,
    proficiencyBonus: 3,
    table: { sneakAttack: '3d6', psiDice: '6d8' },
    gains: [{ name: 'Expertise', note: 'Two more skills' }],
    choices: [],
    pending: ['Expertise in Sleight of Hand and Investigation is the plan: the hands and eyes of trap work. Acrobatics, for escaping grapples, is the alternative.']
  },
  {
    level: 7,
    status: 'upcoming',
    maxHp: 59,
    proficiencyBonus: 3,
    table: { sneakAttack: '4d6', psiDice: '6d8' },
    gains: [
      { name: 'Evasion', to: power('evasion'), note: 'No damage on a successful DEX save, half on a failed one' },
      { name: 'Reliable Talent', to: power('reliable-talent'), note: 'Proficient checks never roll below 10' }
    ],
    choices: []
  },
  {
    level: 8,
    status: 'upcoming',
    maxHp: 67,
    proficiencyBonus: 3,
    table: { sneakAttack: '4d6', psiDice: '6d8' },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['Tough (+2 HP a level: 83 here, 123 by level 12) or Lucky (three advantages a day, or disadvantage on an attack against them). The HP shown here and after leaves Tough out.']
  },
  {
    level: 9,
    status: 'upcoming',
    maxHp: 75,
    proficiencyBonus: 4,
    table: { sneakAttack: '5d6', psiDice: '8d8' },
    gains: [
      { name: 'Soul Blades: Homing Strikes', to: power('homing-strikes'), note: 'A missed blade adds a psi die' },
      { name: 'Soul Blades: Psychic Teleportation', to: power('psychic-teleportation'), note: 'Throw a blade and teleport to it' },
      { name: 'Psychic Whispers for four', note: 'The whole party' }
    ],
    choices: []
  },
  {
    level: 10,
    status: 'upcoming',
    maxHp: 83,
    proficiencyBonus: 4,
    table: { sneakAttack: '5d6', psiDice: '8d8' },
    gains: [{ name: 'Ability Score Improvement', note: 'Rogues get one more than most classes here' }],
    choices: [],
    pending: ['Resilient (WIS): WIS 15 and proficiency in Wisdom saves, against the charms and fears that stop a rogue cold.']
  },
  {
    level: 11,
    status: 'upcoming',
    maxHp: 91,
    proficiencyBonus: 4,
    table: { sneakAttack: '6d6', psiDice: '8d10' },
    gains: [
      { name: 'Improved Cunning Strike', to: power('improved-cunning-strike'), note: 'Two effects on one Sneak Attack' },
      { name: 'Psionic Energy Dice', note: 'd10s' }
    ],
    choices: []
  },
  {
    level: 12,
    status: 'upcoming',
    maxHp: 99,
    proficiencyBonus: 4,
    table: { sneakAttack: '6d6', psiDice: '8d10' },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['Lucky, or Speedy (+10 speed, Dash through difficult terrain, opportunity attacks against them at disadvantage).']
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
  { source: 'Rogue', rule: 'Four from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Persuasion, Sleight of Hand and Stealth', picks: 4, skills: ['Acrobatics', 'Insight', 'Investigation', 'Deception'] },
  { source: 'Criminal', rule: 'Sleight of Hand and Stealth', picks: 2, skills: ['Sleight of Hand', 'Stealth'] },
  { source: 'Wood Elf', rule: 'Keen Senses: one of Insight, Perception or Survival', picks: 1, skills: ['Perception'] },
  { source: 'Expertise', rule: 'Rogue level 1: two of their skill proficiencies at double the bonus', picks: 2, skills: ['Stealth', 'Perception'] }
]
