// Single source of truth for Lucan's sheet. Derived numbers (modifiers, saves,
// DC, attack) are computed in composables/useCharacter.ts from these values.

import type { RulesetId } from '../../campaign'

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

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
  ruleset: '2014' as RulesetId,
  motto: 'A deal made is a deal kept.',

  abilities: { str: 8, dex: 14, con: 16, int: 12, wis: 12, cha: 20 } as Record<AbilityKey, number>,
  saveProficiencies: ['con', 'wis', 'cha'] as AbilityKey[],

  proficiencyBonus: 4,
  size: 'Medium',
  maxHp: 83,
  hitDice: '10d8',
  speed: 30,
  darkvision: 30,

  // Item bonuses currently applied
  itemBonuses: {
    saves: 1, // Stone of Good Luck
    checks: 1, // Stone of Good Luck
    spell: 1, // Pact Keeper's Crystal Dagger
    spellSource: 'Dagger'
  },

  ac: {
    total: 20,
    breakdown: [
      { label: 'The Golden Pact', value: 15, base: true, note: 'Base 15 while unarmored' },
      { label: 'Dexterity', value: 2, note: 'Max +2 from the Golden Pact' },
      { label: 'Bracers of the Dao Pact', value: 2, note: 'No armor, no shield' },
      { label: 'Ioun Stone of Protection', value: 1 }
    ]
  },

  pactSlots: { count: 2, level: 5 },
  savantSlot: { count: 1, level: 5 }, // Spell Savant, long rest
  attunement: { used: 9, max: 10 },

  languages: [
    { name: 'Common', note: 'Half-Elf' },
    { name: 'Elvish', note: 'Half-Elf' },
    { name: 'Terran', note: 'Half-Elf extra language — the tongue of the Plane of Earth' },
    { name: 'Dwarvish', note: 'Guild Artisan language' },
    { name: 'Draconic', note: 'Prodigy' },
    { name: 'Undercommon', note: 'Campaign setup' }
  ],

  skills: [
    { name: 'Arcana', ability: 'int' as AbilityKey, source: 'Warlock' },
    { name: 'Deception', ability: 'cha' as AbilityKey, source: 'Warlock' },
    { name: 'History', ability: 'int' as AbilityKey, source: 'INT bonus (homebrew)' },
    { name: 'Insight', ability: 'wis' as AbilityKey, source: 'Guild Artisan' },
    { name: 'Investigation', ability: 'int' as AbilityKey, source: 'Skill Versatility (homebrew)' },
    { name: 'Persuasion', ability: 'cha' as AbilityKey, source: 'Guild Artisan · expertise from Prodigy', expertise: true }
  ] as { name: string; ability: AbilityKey; source: string; expertise?: boolean }[],
  toolProficiencies: [
    { name: 'Jeweler’s tools', source: 'Guild Artisan' },
    { name: 'Calligrapher’s supplies', source: 'Prodigy' }
  ],
  armorWeapons: 'Light armor · simple weapons',

  senses: ['Darkvision 30 ft (campaign homebrew)'],
  resistances: ['Bludgeoning (Elemental Gift — Dao)', 'Cold (Sash of Summer)'],

  feats: [
    {
      name: 'Spell Savant',
      source: 'Zman’s 5e Tweaks',
      level: 1,
      summary: '+1 CHA (to 20). One extra spell slot of your highest level, 5th for Lucan.',
      detail:
        'The extra slot rises with your highest slot level but can never be 6th level or higher. Once you cast with it, it comes back only after a long rest. Unlike pact slots, a short rest doesn’t restore it.',
      uses: 'Once / long rest',
      homebrew: true
    },
    {
      name: 'Crusher',
      source: 'TCE',
      level: 4,
      summary: '+1 CON. Once per turn, when you hit with an attack that deals bludgeoning damage, move the target 5 ft (no more than one size larger than you).',
      detail:
        'Genie’s Wrath adds bludgeoning damage to one attack hit per turn, so the first Eldritch Blast beam that hits each turn qualifies. On a critical hit with bludgeoning damage, attacks against that target have advantage until the start of your next turn.',
      uses: 'Once per turn'
    },
    {
      name: 'Resilient (Constitution)',
      source: 'PHB',
      level: 8,
      summary: '+1 CON (to 16) and proficiency in Constitution saving throws.',
      detail: 'Holds concentration on Spike Growth, Hex, Hold Monster, Wall of Stone and Far Step.'
    },
    {
      name: 'Prodigy',
      source: 'XGE · gift from the DM',
      level: 1,
      summary: 'Calligrapher’s supplies and Draconic. Expertise in Persuasion. Its skill proficiency is unused.',
      detail:
        'The DM gave it at level 1, on top of the table’s extra feat. Expertise doubles his proficiency bonus on Persuasion checks: +14 with the Stone of Good Luck. Calligraphy suits a man who drafts his own contracts.'
    }
  ] as Feature[],

  invocations: [
    {
      name: 'Agonizing Blast',
      source: 'PHB',
      summary: 'Add CHA (+5) to the damage of every Eldritch Blast beam that hits.',
      detail: 'Rules as written. The earlier once-per-target house rule was reverted by the DM.'
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
      to: '/lucan/spells?tab=book',
      summary: 'Two 1st-level rituals in the Book of Shadows; copy other rituals you find.',
      detail:
        'Rituals of a level up to half your Warlock level (rounded up — 5th at level 10) can be copied from any class. Costs 50 gp and 2 hours per spell level. The rituals are cast from the book and can’t be cast with pact slots unless known otherwise.'
    },
    {
      name: 'Gift of the Protectors',
      source: 'TCE',
      summary: 'Up to four creatures (PB) can write their names on a page of the Book of Shadows. When one of them drops to 0 HP but isn’t killed outright, it drops to 1 HP instead.',
      detail: 'Once the magic saves someone, no creature can benefit again until Lucan finishes a long rest. He can erase a name as an action by touching it.',
      uses: 'Once / long rest (total)'
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
      summary: 'Proficiency in one skill of your choice (two in the books). Lucan took Investigation.',
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
      to: '/lucan/spells',
      level: 1,
      summary: 'Two 5th-level pact slots. Every leveled spell is cast at 5th level. Slots return on a short or long rest.'
    },
    {
      name: 'Genie’s Vessel',
      source: 'Genie Patron',
      to: '/lucan/vessel',
      level: 1,
      summary:
        'A Tiny object that serves as a spellcasting focus. AC equals the spell save DC, 14 HP (level + PB), immune to poison and psychic damage.',
      detail: 'Re-created over a 1-hour ceremony if lost.'
    },
    {
      name: 'Bottled Respite',
      source: 'Genie Patron',
      to: '/lucan/vessel',
      level: 1,
      summary: 'Use an action to vanish into the Vessel for up to 8 hours (2 × PB). Leave it with a bonus action.',
      detail: 'Normally once per long rest. In this campaign Lucan can enter and leave whenever he wants.',
      uses: 'At will',
      homebrew: true
    },
    {
      name: 'Genie’s Wrath (Dao)',
      source: 'Genie Patron',
      level: 1,
      summary: 'Once per turn, an attack-roll hit deals +4 (PB) bludgeoning damage.',
      detail: 'Only one hit per turn gets the extra damage, but that is enough to make an Eldritch Blast beam a bludgeoning attack for Crusher.',
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
      to: '/lucan/spells?tab=book',
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
      to: '/lucan/vessel',
      level: 10,
      summary:
        'Up to five willing creatures within 30 ft enter the Vessel with you. Ten minutes inside counts as a short rest, and anyone spending Hit Dice adds +4 (PB) HP.',
      detail:
        'Lucan can eject any number of them with a bonus action. Everyone is ejected if he leaves, dies or the Vessel is destroyed. Entering is at will in this campaign, but the 10-minute short rest works once per long rest.',
      uses: 'Short rest once / long rest',
      homebrew: true
    },
    {
      name: 'Form of the Lesser Dao',
      source: 'Bracers of the Dao Pact',
      to: '/lucan/lesser-dao',
      summary: 'As a bonus action, Lucan becomes a Large earth genie for 10 turns: AC 20, 83 HP, two attacks a turn at +9, flight and burrowing.',
      detail: 'The form has its own hit points. When it drops to 0, any leftover damage carries over to Lucan. No spellcasting in the form, but concentration carries on. The Lesser Dao page has the full stat block.',
      uses: '2 / long rest'
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

// From the Foundry NPC sheet "Form of the Lesser Dao" (Bracers of the Dao Pact).
// The Stone of Good Luck's +1 to checks and saves carries over and is included below.
export const lesserDao = {
  name: 'Form of the Lesser Dao',
  type: 'Large elemental (dao)',
  size: 'Large',
  activation: 'Bonus action',
  turns: 10,
  uses: 2, // per long rest
  saveDc: 17,
  cr: 10,
  proficiencyBonus: 4,
  ac: 20,
  hp: 83,
  hpFormula: '5d10 + 35',
  speed: 'Walk 30 ft · burrow 30 ft · fly 30 ft (hover)',
  abilities: { str: 20, dex: 14, con: 20, int: 12, wis: 12, cha: 20 } as Record<AbilityKey, number>,
  saveProficiencies: ['con', 'wis', 'cha'] as AbilityKey[],
  itemBonus: 1,
  skills: [
    { name: 'Arcana', ability: 'int' as AbilityKey },
    { name: 'History', ability: 'int' as AbilityKey },
    { name: 'Investigation', ability: 'int' as AbilityKey },
    { name: 'Persuasion', ability: 'cha' as AbilityKey }
  ],
  resistances: ['Bludgeoning', 'Cold'],
  conditionImmunities: ['Petrified'],
  senses: 'Darkvision 120 ft',
  languages: 'Common, Dwarvish, Elvish, Terran, Undercommon',
  traits: [
    { name: 'Earth Glide', text: 'Burrows through nonmagical, unworked earth and stone without disturbing the material it moves through.' },
    { name: 'Sure-Footed', text: 'Advantage on Strength and Dexterity saving throws against effects that would knock it prone.' },
    { name: 'Shared damage', text: 'When the form drops to 0 HP it ends, and any leftover damage carries over to Lucan.' }
  ],
  multiattack: 'Two attacks, in any mix of Earthen Maul and Earth Burst.',
  attacks: [
    {
      name: 'Earthen Maul',
      kind: 'Melee · reach 5 ft · two-handed',
      toHit: 9,
      damage: '4d6+5',
      type: 'bludgeoning',
      effect: 'A Huge or smaller target makes a DC 17 Strength save or is knocked prone.'
    },
    {
      name: 'Earth Burst',
      kind: 'Ranged · 60/120 ft',
      toHit: 9,
      damage: '2d8+5',
      type: 'bludgeoning',
      effect: 'Hit or miss, the earth explodes in the target’s space: DC 17 Strength save or knocked prone.'
    },
    { name: 'Fist', kind: 'Melee · reach 5 ft', toHit: 9, damage: '2d8+5', type: 'bludgeoning' }
  ] as { name: string; kind: string; toHit: number; damage: string; type: string; effect?: string }[],

  // How the form works at this table
  rules: [
    'Lucan can’t cast spells while in the form. A spell he is already concentrating on keeps going.',
    'The form uses its own ability scores, saves and skills, so concentration saves use its Constitution.'
  ],
  tactics: [
    'Lead with Earthen Maul. A Huge or smaller target that fails the DC 17 Strength save falls prone, and the second Maul has advantage against it.',
    'Earth Burst knocks the target prone hit or miss, which sets up allies standing next to it. Ranged attacks against a prone target have disadvantage, so don’t follow it with a second Burst.',
    'Cast Spike Growth with the action and take the form with the bonus action on the same turn: the spikes keep going while the form fights. Hex also needs a bonus action, so cast it a turn earlier.',
    'Earth Glide burrows through earth and stone, a way into a fortified room or out of a bad fight.'
  ]
}

// Resources tracked by the session tracker.
export interface Resource {
  id: string
  name: string
  max: number
  recharge: 'short' | 'long' | 'never' // never: consumables that don't come back on a rest
  note: string
}

export const resources: Resource[] = [
  { id: 'pact', name: 'Pact slots (5th)', max: 2, recharge: 'short', note: 'Every leveled spell' },
  { id: 'savant', name: 'Spell Savant slot (5th)', max: 1, recharge: 'long', note: 'Extra slot for any leveled spell' },
  { id: 'dagger', name: 'Crystal Dagger: recover a slot', max: 1, recharge: 'long', note: 'Action: regain one pact slot' },
  { id: 'flight', name: 'Elemental Gift flight', max: 4, recharge: 'long', note: 'Bonus action: 30 ft fly, 10 min' },
  { id: 'lesserDao', name: 'Form of the Lesser Dao', max: 2, recharge: 'long', note: 'Bracers · bonus action, 10 turns, 83 form HP' },
  { id: 'protectors', name: 'Gift of the Protectors', max: 1, recharge: 'long', note: 'A named creature drops to 1 HP instead of 0' },
  { id: 'vesselRest', name: 'Sanctuary Vessel short rest', max: 1, recharge: 'long', note: '10 minutes inside counts as a short rest' },
  { id: 'scribing', name: 'Golden Pact: hidden writing', max: 1, recharge: 'long', note: 'Action: a page only one named creature can read' },
  { id: 'gem', name: 'Spell Gem: imbue', max: 1, recharge: 'long', note: 'Store one spell up to 6th level' },
  { id: 'wand', name: 'Lesser Wand of Lightning Bolts', max: 7, recharge: 'never', note: 'DC 15 · 1 charge = 3rd level, +1 level per extra charge. Crumbles when empty' },
  { id: 'potion', name: 'Potions of Superior Healing', max: 2, recharge: 'never', note: '8d4 + 8 HP each' }
]
