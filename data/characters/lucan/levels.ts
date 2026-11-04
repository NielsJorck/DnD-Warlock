// Lucan's build, level by level. Levels 1–10 were built in one go for the campaign
// start, so only some choices have a level of their own: 'fixed' when the rules or
// the old notes set it, 'fitted' when it's shown at the first level the rules allow.
// Record each new level here as it's gained in play, with the date and the choices.

import type { AbilityKey } from './character'

export type ChoiceBasis = 'fixed' | 'fitted'
export type ChoiceKind =
  | 'Race'
  | 'Background'
  | 'Patron'
  | 'Pact boon'
  | 'Feat'
  | 'Invocation'
  | 'Cantrip'
  | 'Tome cantrips'
  | 'Spell'
  | 'Proficiencies'

export interface LevelChoice {
  kind: ChoiceKind
  pick: string
  basis: ChoiceBasis
  replaces?: string // a swap: the old pick it replaces, so the counts stay the same
  gift?: boolean // given by the DM on top of the normal picks
  to?: string
  note?: string
}

export interface LevelEntry {
  level: number
  status: 'creation' | 'played' | 'upcoming'
  date?: string // the day the level was gained in play
  maxHp: number
  proficiencyBonus: number
  // The Warlock table (PHB) at this level
  table: { cantrips: number; spellsKnown: number; slots: number; slotLevel: number; invocations: number }
  abilities?: string // only when a score changes
  // Level 1 only: the array as assigned, and what raised each score
  startingScores?: {
    base: Record<AbilityKey, number>
    increases: { source: string; scores: Partial<Record<AbilityKey, number>> }[]
  }
  gains: { name: string; to?: string; note?: string }[] // automatic class and patron features
  choices: LevelChoice[]
  pending?: string[] // decisions still to make, for upcoming levels
}

// Spells with a page of their own, so the picks below can link to them
const spell = (slug: string) => `/lucan/spells/${slug}`

// Hit points: 8 at level 1, then the fixed 5 per level, plus CON modifier per level
// (CON 14 until level 4, 15 until 8, then 16). 83 at level 10 matches the Foundry sheet.
export const levels: LevelEntry[] = [
  {
    level: 1,
    status: 'creation',
    maxHp: 10,
    proficiencyBonus: 2,
    table: { cantrips: 2, spellsKnown: 2, slots: 1, slotLevel: 1, invocations: 0 },
    // Gives the sheet's scores once Crusher and Resilient (+1 CON each at 4 and 8) are added
    startingScores: {
      base: { str: 8, dex: 13, con: 13, int: 12, wis: 12, cha: 17 },
      increases: [
        { source: 'Half-Elf', scores: { cha: 2, dex: 1, con: 1 } },
        { source: 'Spell Savant', scores: { cha: 1 } }
      ]
    },
    gains: [
      { name: 'Pact Magic', to: '/lucan/spells' },
      { name: 'Genie’s Vessel', to: '/lucan/vessel', note: 'Bottled Respite and Genie’s Wrath (Dao)' },
      { name: 'Expanded spell list', note: 'Genie and Dao spells join the Warlock list' },
      { name: 'Fey Ancestry', note: 'Half-Elf' },
      { name: 'Darkvision 30 ft', note: 'Half-Elf, campaign homebrew' }
    ],
    choices: [
      { kind: 'Race', pick: 'Half-Elf', basis: 'fixed', note: '+2 CHA, +1 DEX, +1 CON' },
      { kind: 'Background', pick: 'Guild Artisan', basis: 'fixed', note: 'Jeweler, gemcutter, appraiser' },
      { kind: 'Patron', pick: 'The Genie (Dao): Zahir ibn Kharum', basis: 'fixed', to: '/lucan/lore' },
      { kind: 'Feat', pick: 'Spell Savant', basis: 'fixed', note: 'The table’s extra level-1 feat. +1 CHA to 20' },
      {
        kind: 'Feat',
        pick: 'Prodigy',
        basis: 'fixed',
        gift: true,
        note: 'Given by the DM on top of the table’s extra feat. Xanathar’s version: Persuasion expertise, Calligrapher’s supplies, Draconic. Its skill pick is unused'
      },
      {
        kind: 'Proficiencies',
        pick: 'Arcana, Deception, History, Insight, Investigation, Persuasion',
        basis: 'fixed',
        note: 'Skills. Where each comes from is under Skill Picks'
      },
      { kind: 'Proficiencies', pick: 'Jeweler’s tools, Calligrapher’s supplies', basis: 'fixed', note: 'Tools: Guild Artisan 1, Prodigy 1' },
      {
        kind: 'Proficiencies',
        pick: 'Common, Elvish, Terran, Dwarvish, Undercommon, Draconic',
        basis: 'fixed',
        note: 'Languages: Half-Elf 3, Guild Artisan 1, INT bonus 1, Prodigy 1'
      },
      { kind: 'Cantrip', pick: 'Eldritch Blast', basis: 'fitted', to: spell('eldritch-blast'), note: 'Needed for the level-2 invocations' },
      { kind: 'Cantrip', pick: 'Mind Sliver', basis: 'fitted', to: spell('mind-sliver') },
      { kind: 'Spell', pick: 'Armor of Agathys', basis: 'fitted', to: spell('armor-of-agathys') },
      { kind: 'Spell', pick: 'Hex', basis: 'fitted', to: spell('hex') }
    ]
  },
  {
    level: 2,
    status: 'creation',
    maxHp: 17,
    proficiencyBonus: 2,
    table: { cantrips: 2, spellsKnown: 3, slots: 2, slotLevel: 1, invocations: 2 },
    gains: [{ name: 'Eldritch Invocations' }],
    choices: [
      { kind: 'Invocation', pick: 'Agonizing Blast', basis: 'fitted' },
      { kind: 'Invocation', pick: 'Repelling Blast', basis: 'fitted' }
    ]
  },
  {
    level: 3,
    status: 'creation',
    maxHp: 24,
    proficiencyBonus: 2,
    table: { cantrips: 2, spellsKnown: 4, slots: 2, slotLevel: 2, invocations: 2 },
    gains: [
      { name: 'Book of Shadows', to: '/lucan/spells?tab=book', note: 'Pact of the Tome' },
      {
        name: 'Patron spells known',
        note: 'Zman’s Tweaks: with the Tome, the expanded list counts as spells known. Detect Evil and Good, Sanctuary, Phantasmal Force, Spike Growth'
      }
    ],
    choices: [
      { kind: 'Pact boon', pick: 'Pact of the Tome', basis: 'fixed' },
      { kind: 'Tome cantrips', pick: 'Light, Guidance, Message', basis: 'fixed', note: 'From any class list' },
      { kind: 'Spell', pick: 'Hold Person', basis: 'fitted', to: spell('hold-person') },
      { kind: 'Spell', pick: 'Mind Spike', basis: 'fitted', to: spell('mind-spike') }
    ]
  },
  {
    level: 4,
    status: 'creation',
    maxHp: 31,
    proficiencyBonus: 2,
    table: { cantrips: 3, spellsKnown: 5, slots: 2, slotLevel: 2, invocations: 2 },
    abilities: 'CON 14 → 15',
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [
      { kind: 'Feat', pick: 'Crusher', basis: 'fixed', note: '+1 CON' },
      { kind: 'Cantrip', pick: 'Create Bonfire', basis: 'fitted', to: spell('create-bonfire') }
    ]
  },
  {
    level: 5,
    status: 'creation',
    maxHp: 38,
    proficiencyBonus: 3,
    table: { cantrips: 3, spellsKnown: 6, slots: 2, slotLevel: 3, invocations: 3 },
    gains: [
      { name: 'Eldritch Blast: two beams', to: spell('eldritch-blast') },
      { name: '3rd-level patron spells', note: 'Create Food and Water, Meld into Stone' }
    ],
    choices: [
      { kind: 'Invocation', pick: 'Grasp of Hadar', basis: 'fitted' },
      { kind: 'Spell', pick: 'Counterspell', basis: 'fitted', to: spell('counterspell') },
      { kind: 'Spell', pick: 'Dispel Magic', basis: 'fitted', to: spell('dispel-magic') }
    ]
  },
  {
    level: 6,
    status: 'creation',
    maxHp: 45,
    proficiencyBonus: 3,
    table: { cantrips: 3, spellsKnown: 7, slots: 2, slotLevel: 3, invocations: 3 },
    gains: [{ name: 'Elemental Gift (Dao)', note: 'Bludgeoning resistance, 30-ft flight' }],
    choices: []
  },
  {
    level: 7,
    status: 'creation',
    maxHp: 52,
    proficiencyBonus: 3,
    table: { cantrips: 3, spellsKnown: 8, slots: 2, slotLevel: 4, invocations: 4 },
    gains: [{ name: '4th-level patron spells', note: 'Phantasmal Killer, Stone Shape' }],
    choices: [
      { kind: 'Invocation', pick: 'Book of Ancient Secrets', basis: 'fitted', to: '/lucan/spells?tab=book', note: 'Needs the Tome' },
      { kind: 'Spell', pick: 'Shadow of Moil', basis: 'fitted', to: spell('shadow-of-moil') }
    ]
  },
  {
    level: 8,
    status: 'creation',
    maxHp: 67,
    proficiencyBonus: 3,
    table: { cantrips: 3, spellsKnown: 9, slots: 2, slotLevel: 4, invocations: 4 },
    abilities: 'CON 15 → 16',
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [{ kind: 'Feat', pick: 'Resilient (Constitution)', basis: 'fixed', note: '+1 CON and CON save proficiency' }]
  },
  {
    level: 9,
    status: 'creation',
    maxHp: 75,
    proficiencyBonus: 4,
    table: { cantrips: 3, spellsKnown: 10, slots: 2, slotLevel: 5, invocations: 5 },
    gains: [{ name: '5th-level patron spells', note: 'Creation, Wall of Stone' }],
    choices: [
      { kind: 'Invocation', pick: 'Gift of the Protectors', basis: 'fitted', note: 'Needs Warlock 9 and the Tome' },
      { kind: 'Spell', pick: 'Far Step', basis: 'fitted', to: spell('far-step') },
      { kind: 'Spell', pick: 'Hold Monster', basis: 'fitted', to: spell('hold-monster') },
      { kind: 'Spell', pick: 'Synaptic Static', basis: 'fitted', to: spell('synaptic-static') }
    ]
  },
  {
    level: 10,
    status: 'creation',
    maxHp: 83,
    proficiencyBonus: 4,
    table: { cantrips: 4, spellsKnown: 10, slots: 2, slotLevel: 5, invocations: 5 },
    gains: [{ name: 'Sanctuary Vessel', to: '/lucan/vessel' }],
    choices: [{ kind: 'Cantrip', pick: 'Mage Hand', basis: 'fitted', to: spell('mage-hand') }]
  },
  {
    level: 11,
    status: 'upcoming',
    maxHp: 91,
    proficiencyBonus: 4,
    table: { cantrips: 4, spellsKnown: 11, slots: 3, slotLevel: 5, invocations: 5 },
    gains: [
      { name: 'Third pact slot' },
      { name: 'Eldritch Blast: three beams', to: spell('eldritch-blast') },
      {
        name: '6th-level rituals',
        to: '/lucan/spells?tab=later',
        note: 'Book of Ancient Secrets can copy them. Drawmij’s Instant Summons and Forbiddance are waiting as placeholders'
      }
    ],
    choices: [],
    pending: ['Mystic Arcanum: one 6th-level spell, once per long rest.', 'One new spell known, and the usual option to swap one.']
  },
  {
    level: 12,
    status: 'upcoming',
    maxHp: 99,
    proficiencyBonus: 4,
    table: { cantrips: 4, spellsKnown: 11, slots: 3, slotLevel: 5, invocations: 6 },
    gains: [{ name: 'Ability Score Improvement' }],
    choices: [],
    pending: ['A feat or an ability score increase.', 'A sixth invocation.']
  }
]

// Changes made to the level-10 build after it was first written down. The dates are
// when the change reached this site (or the Codex notes before it).
export interface Revision {
  date: string
  title: string
  changes: string[]
}

export const revisions: Revision[] = [
  {
    date: 'Before Oct 2026',
    title: 'Codex notes',
    changes: ['Mind Sliver replaced Gravity Spike.', 'Far Step taken instead of Dimension Door.']
  },
  {
    date: '2026-10-13',
    title: 'Character changes',
    changes: ['Spell Savant (Zman’s 5e Tweaks) replaced Telekinetic as the level-1 bonus feat.', 'Mage Hand replaced Lightning Lure.']
  },
  {
    date: '2026-10-19',
    title: 'Synced with the Foundry campaign sheet',
    changes: [
      'Abilities set to the Foundry sheet: DEX 12 → 14, CON 18 → 16, INT 10 → 12. Max HP 93 → 83.',
      'Prodigy added: Persuasion expertise, Calligrapher’s supplies and Draconic.',
      'With INT 12, Undercommon and a third class skill came from the INT rule.',
      'Hex and Mind Spike added, Banishment dropped. Phantasmal Killer is not treated as known.',
      'The DM reverted the Agonizing Blast house rule: +CHA on every beam that hits.',
      'The Golden Pact, Bracers of the Dao Pact and Pact Keeper’s Crystal Dagger replaced the Barrier and Illuminator’s Tattoos, the requested Illusionist’s Bracers and the Rod of the Pact Keeper.'
    ]
  },
  {
    date: '2026-11-04',
    title: 'Spells and Prodigy',
    changes: [
      'Scrying dropped, so the chosen spells fit the ten a Warlock 10 knows.',
      'Prodigy recorded as a gift from the DM at level 1, in Xanathar’s version with Persuasion expertise.',
      'Drawmij’s Instant Summons and Forbiddance marked as placeholders for level 11, not in the Book of Shadows yet.',
      'The DM allowed the rituals in the Book of Shadows.',
      'Phantasmal Killer added to the known spells: the Tome rule makes every Genie and Dao spell known.',
      'Starting array recorded: 17, 13, 13, 12, 12, 8, with the Half-Elf +1s on DEX and CON.',
      'Skill picks recorded: Arcana and Deception from the Warlock, History from INT. Prodigy’s skill pick is unused.'
    ]
  }
]

// Every skill proficiency Lucan gets at level 1 and the skill it went to
export interface SkillPick {
  source: string
  rule: string
  picks: number
  skills: string[] // fewer than picks when some go unused
}

export const skillPicks: SkillPick[] = [
  { source: 'Guild Artisan', rule: 'Background: Insight and Persuasion', picks: 2, skills: ['Insight', 'Persuasion'] },
  { source: 'Skill Versatility', rule: 'Half-Elf, Zman’s version: any one skill', picks: 1, skills: ['Investigation'] },
  { source: 'Warlock', rule: 'Two from the Warlock list', picks: 2, skills: ['Arcana', 'Deception'] },
  { source: 'INT 12', rule: 'One from the Warlock list, or a tool', picks: 1, skills: ['History'] },
  { source: 'Prodigy', rule: 'Any one skill', picks: 1, skills: [] }
]

// What the record doesn't settle, in case the DM asks
export const unplaced: { title: string; text: string }[] = []
