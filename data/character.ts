// Single source of truth for Lucan's sheet. Derived numbers (modifiers, saves,
// DC, attack) are computed in composables/useCharacter.ts from these values.

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export interface Feature {
  name: string
  source: string
  level?: number
  summary: string
  detail?: string
  uses?: string
  homebrew?: boolean
}

export const character = {
  name: 'Lucan Beryll',
  epithet: 'Appraiser of Stone and Promise',
  level: 10,
  race: 'Half-Elf',
  className: 'Warlock',
  subclass: 'The Genie (Dao)',
  patron: 'Zahir ibn Kharum',
  patronTitle: 'Noble Dao of the Elemental Plane of Earth',
  pact: 'Pact of the Tome',
  background: 'Guild Artisan',
  backgroundDetail: 'Jeweler · Gemcutter · Appraiser',
  ruleset: '2014 5e + Tasha’s',
  motto: 'A deal made is a deal kept.',

  abilities: { str: 8, dex: 12, con: 18, int: 10, wis: 12, cha: 20 } as Record<AbilityKey, number>,
  saveProficiencies: ['con', 'wis', 'cha'] as AbilityKey[],

  proficiencyBonus: 4,
  maxHp: 93,
  hitDice: '10d8',
  speed: 30,
  darkvision: 30,

  // Item bonuses currently applied
  itemBonuses: {
    saves: 2, // Ring of Protection +1, Stone of Good Luck +1
    checks: 1, // Stone of Good Luck
    spell: 2 // Rod of the Pact Keeper +2
  },

  ac: {
    total: 19,
    breakdown: [
      { label: 'Barrier Tattoo (Rare)', value: 15, note: 'Base 15 while unarmored' },
      { label: 'Dexterity', value: 1, note: 'Max +2 from the tattoo' },
      { label: 'Bracers of Defense', value: 2, note: 'No armor, no shield' },
      { label: 'Ring of Protection', value: 1 }
    ]
  },

  pactSlots: { count: 2, level: 5 },
  attunement: { used: 5, max: 10 },

  languages: [
    { name: 'Common', note: 'Half-Elf' },
    { name: 'Elvish', note: 'Half-Elf' },
    { name: 'Terran', note: 'Half-Elf extra language — the tongue of the Plane of Earth' },
    { name: 'Dwarvish', note: 'Guild Artisan language' }
  ],

  skills: [
    { name: 'Insight', ability: 'wis' as AbilityKey, source: 'Guild Artisan' },
    { name: 'Persuasion', ability: 'cha' as AbilityKey, source: 'Guild Artisan' },
    { name: 'Investigation', ability: 'int' as AbilityKey, source: 'Skill Versatility (homebrew)' }
  ],
  toolProficiencies: [{ name: 'Jeweler’s tools', source: 'Guild Artisan' }],

  senses: ['Darkvision 30 ft (campaign homebrew)'],
  resistances: ['Bludgeoning (Elemental Gift — Dao)'],

  feats: [
    {
      name: 'Telekinetic',
      source: 'TCE',
      level: 1,
      summary: '+1 CHA (to 20). Mage Hand is invisible, castable without components, with +30 ft range.',
      detail:
        'As a bonus action, shove one creature within 30 ft 5 ft toward or away from you. STR save vs. spell DC 17 (8 + PB + CHA) — it uses the raw DC, not the Rod-boosted one. A willing creature can choose to fail.',
      uses: 'Bonus action, at will',
      homebrew: true
    },
    {
      name: 'Crusher',
      source: 'TCE',
      level: 4,
      summary: '+1 CON. Once per turn, when you hit with an attack that deals bludgeoning damage, move the target 5 ft (no more than one size larger than you).',
      detail:
        'Genie’s Wrath adds bludgeoning damage to every hit, so Eldritch Blast qualifies. On a critical hit with bludgeoning damage, attacks against that target have advantage until the start of your next turn.',
      uses: 'Once per turn'
    },
    {
      name: 'Resilient (Constitution)',
      source: 'XGE',
      level: 8,
      summary: '+1 CON (to 18) and proficiency in Constitution saving throws.',
      detail: 'Holds concentration on Spike Growth, Hold Monster, Wall of Stone and Far Step.'
    }
  ] as Feature[],

  invocations: [
    {
      name: 'Agonizing Blast',
      source: 'PHB',
      summary: 'Add CHA (+5) to Eldritch Blast damage.',
      detail: 'Campaign wording: applies once per target per casting, not once per beam.',
      homebrew: true
    },
    {
      name: 'Repelling Blast',
      source: 'PHB',
      summary: 'An Eldritch Blast hit pushes a creature up to 10 ft away from you.',
      detail: 'Campaign wording: pushes once per target per casting, not once per beam.',
      homebrew: true
    },
    {
      name: 'Grasp of Hadar',
      source: 'XGE',
      summary: 'Once per turn, an Eldritch Blast hit can pull the creature up to 10 ft toward you.',
      detail: 'Combined with Repelling Blast, this can drag a target back and forth through Spike Growth.'
    },
    {
      name: 'Book of Ancient Secrets',
      source: 'PHB',
      summary: 'Two 1st-level rituals in the Book of Shadows; copy other rituals you find.',
      detail:
        'Rituals of a level up to half your Warlock level (rounded up — 5th at level 10) can be copied from any class. Costs 50 gp and 2 hours per spell level. The rituals are cast from the book and can’t be cast with pact slots unless known otherwise.'
    },
    {
      name: 'Gift of the Protectors',
      source: 'XGE',
      summary: 'Up to five creatures (CHA mod) who sign a page of the Book of Shadows drop to 1 HP instead of 0.',
      detail: 'Triggers once per creature per long rest. Lucan can erase a name as an action by touching it.',
      uses: 'Once per creature / long rest'
    }
  ] as Feature[],

  features: [
    {
      name: 'Fey Ancestry',
      source: 'Half-Elf',
      summary: 'Advantage on saves against being charmed; magic can’t put you to sleep.'
    },
    {
      name: 'Skill Versatility',
      source: 'Half-Elf',
      summary: 'Proficiency in two skills. In this campaign it grants Investigation.',
      homebrew: true
    },
    {
      name: 'Guild Membership',
      source: 'Guild Artisan',
      summary: 'Lodging and food from the guild when needed, plus access to guild contacts and influential patrons.'
    },
    {
      name: 'Pact Magic',
      source: 'Warlock',
      level: 1,
      summary: 'Two 5th-level pact slots. Every leveled spell is cast at 5th level. Slots return on a short or long rest.'
    },
    {
      name: 'Genie’s Vessel',
      source: 'Genie Patron',
      level: 1,
      summary:
        'A Tiny object that serves as a spellcasting focus. AC equals the spell save DC, 14 HP (level + PB), immune to poison and psychic damage.',
      detail: 'Re-created over a 1-hour ceremony if lost.'
    },
    {
      name: 'Bottled Respite',
      source: 'Genie Patron',
      level: 1,
      summary: 'Use an action to vanish into the Vessel for up to 8 hours (2 × PB). Leave it with a bonus action.',
      detail: 'Normally once per long rest. In this campaign Lucan can re-enter whenever he wants.',
      uses: 'At will',
      homebrew: true
    },
    {
      name: 'Genie’s Wrath (Dao)',
      source: 'Genie Patron',
      level: 1,
      summary: 'Once per turn, an attack-roll hit deals +4 (PB) bludgeoning damage.',
      detail: 'This is what turns Eldritch Blast into a bludgeoning attack for Crusher.',
      uses: 'Once per turn'
    },
    {
      name: 'Expanded Spell List',
      source: 'Genie Patron',
      level: 1,
      summary: 'Genie and Dao spells. In this campaign they count as additional spells known.',
      homebrew: true
    },
    {
      name: 'Pact Boon: Tome',
      source: 'Warlock',
      level: 3,
      summary: 'The Book of Shadows: three cantrips from any class (Light, Guidance, Message).'
    },
    {
      name: 'Elemental Gift (Dao)',
      source: 'Genie Patron',
      level: 6,
      summary: 'Resistance to bludgeoning damage. As a bonus action, gain a 30-ft flying speed for 10 minutes.',
      uses: '4 / long rest (PB)'
    },
    {
      name: 'Sanctuary Vessel',
      source: 'Genie Patron',
      level: 10,
      summary:
        'Up to five willing creatures within 30 ft enter the Vessel with you. Ten minutes inside counts as a short rest, and anyone spending Hit Dice adds +4 (PB) HP.',
      detail: 'Lucan can eject any number of them with a bonus action. Everyone is ejected if he leaves, dies or the Vessel is destroyed.'
    }
  ] as Feature[],

  identity: {
    summary:
      'A guild-trained jeweler whose pact is a contract, not worship. He values preparation, leverage, exact wording and durable solutions.',
    traits: [
      'Exacting without being needlessly cruel.',
      'Values craftsmanship, provenance, and promises.',
      'Sees magical items as tools with histories and obligations, not disposable upgrades.',
      'Finds creative uses for mundane objects and controlled battlefield movement.',
      'Is comfortable negotiating with dangerous beings when the terms are clear.'
    ]
  }
}

export const abilityNames: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma'
}

// Resources tracked by the session tracker.
export interface Resource {
  id: string
  name: string
  max: number
  recharge: 'short' | 'long'
  note: string
}

export const resources: Resource[] = [
  { id: 'pact', name: 'Pact slots (5th)', max: 2, recharge: 'short', note: 'Every leveled spell' },
  { id: 'rod', name: 'Rod — recover a slot', max: 1, recharge: 'long', note: 'Action: regain one pact slot' },
  { id: 'flight', name: 'Elemental Gift flight', max: 4, recharge: 'long', note: 'Bonus action: 30 ft fly, 10 min' }
]
