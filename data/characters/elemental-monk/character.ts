// The Undertow: a Bugbear Warrior of the Elements built for the Sword Mountains
// expedition on the 2024 rules, at the campaign's starting level 3. Nothing is
// played yet. The Bugbear comes from Monsters of the Multiverse, not the 2024
// Player's Handbook, so it needs the DM's yes (a question in lore.ts), and so
// does the uncommon item (items.ts). The numbers the pages show are worked out
// from these values in `stats` at the bottom; the techniques are in
// techniques.ts and the level history in levels.ts.

import { rulesets, type RulesetId } from '../../campaign'
import { abilityOrder, allSkills, modifier, type RollStats } from '~/composables/useCharacter'
import type { AbilityKey, Feature } from '../shared'

export const character = {
  name: 'The Undertow', // working title until they have a name
  epithet: 'The Tide That Reaches',
  level: 3,
  species: 'Bugbear',
  className: 'Monk',
  subclass: 'Warrior of the Elements',
  background: 'Sailor',
  backgroundDetail: 'A deckhand the sea threw back',
  ruleset: '2024' as RulesetId,
  motto: 'The tide never chases. It reaches, and it pulls.',
  concept: 'A long-armed brawler whose fists strike from 20 ft away in fire, frost or thunder, and drag what they hit into the pit or out of the doorway.',

  // The campaign's array 16, 15, 14, 12, 10, 8, then the Sailor's +2 DEX and +1 WIS
  baseScores: { str: 12, dex: 16, con: 14, int: 10, wis: 15, cha: 8 } as Record<AbilityKey, number>,
  backgroundIncreases: { dex: 2, wis: 1 } as Partial<Record<AbilityKey, number>>,
  abilities: { str: 12, dex: 18, con: 14, int: 10, wis: 16, cha: 8 } as Record<AbilityKey, number>,
  saveProficiencies: ['str', 'dex'] as AbilityKey[],

  // The Cloak of Protection, pitched to the DM as the uncommon item: +1 to AC and every save
  itemBonuses: { ac: 1, saves: 1 },

  proficiencyBonus: 2,
  size: 'Medium',
  // d8: 8 at level 1, then the fixed 5 a level, plus CON +2 every level
  maxHp: 24,
  hitDie: 8,
  hitDice: '3d8',
  speed: 40, // 30, and Unarmored Movement's +10
  darkvision: 60,
  attunementMax: rulesets['2024'].attunementLimit,

  ac: {
    total: 18,
    breakdown: [
      { label: 'Unarmored', value: 10 },
      { label: 'DEX', value: 4 },
      { label: 'WIS', value: 3 },
      { label: 'Cloak of Protection', value: 1 }
    ]
  },

  // 2024: Common and two standard languages at creation
  languages: [
    { name: 'Common', note: 'Every character' },
    { name: 'Goblin', note: 'A standard language, picked at creation: a bugbear’s first tongue' },
    { name: 'Dwarvish', note: 'A standard language, picked at creation: the old holds of the Sword Mountains' }
  ],

  skills: [
    { name: 'Acrobatics', ability: 'dex', source: 'Sailor' },
    { name: 'Perception', ability: 'wis', source: 'Sailor' },
    { name: 'Stealth', ability: 'dex', source: 'Bugbear (Sneaky)' },
    { name: 'Athletics', ability: 'str', source: 'Monk' },
    { name: 'Insight', ability: 'wis', source: 'Monk' }
  ] as { name: string; ability: AbilityKey; source: string }[],
  toolProficiencies: [
    { name: 'Carpenter’s Tools', source: 'Monk: one artisan’s tool or instrument. A ship’s carpenter’s, and they seal or pry open doors' },
    { name: 'Navigator’s Tools', source: 'Sailor' }
  ],
  armorWeapons: 'No armor or shields · simple weapons · martial weapons with Light',

  feats: [
    {
      name: 'Tavern Brawler',
      source: 'Origin feat · Sailor',
      level: 1,
      summary: 'Unarmed Strike damage dice that roll a 1 are rerolled. Once per turn, an Unarmed Strike hit with the Attack action also pushes the target 5 ft away, no save.',
      detail:
        'Also proficiency with improvised weapons, and a 1d4 + STR punch that a monk never needs. The push stacks with Elemental Strikes’ 10 ft, and the rerolls lift every Martial Arts die, three or four of them a turn.',
      to: '/elemental-monk/techniques/tavern-brawler'
    }
  ] as Feature[],

  features: [
    {
      name: 'Martial Arts',
      source: 'Monk',
      level: 1,
      to: '/elemental-monk/techniques/martial-arts',
      summary: 'Unarmed Strikes and monk weapons use DEX and a d6 Martial Arts die: +6 to hit, 1d6 + 4. A bonus action makes one more Unarmed Strike. Grapple and Shove use DEX: DC 14.'
    },
    { name: 'Unarmored Defense', source: 'Monk', level: 1, summary: 'With no armor or shield, AC is 10 + DEX + WIS: 17, and 18 with the cloak.' },
    {
      name: 'Monk’s Focus',
      source: 'Monk',
      level: 2,
      to: '/elemental-monk/techniques?tab=ready',
      summary: 'Three Focus Points, all back on a short or long rest. Save DC 13. They fuel Flurry of Blows, Patient Defense, Step of the Wind and Elemental Attunement.',
      uses: '3 · short rest'
    },
    { name: 'Unarmored Movement', source: 'Monk', level: 2, summary: 'Speed +10 ft with no armor or shield: 40 ft. +15 from level 6, +20 from 10.' },
    {
      name: 'Uncanny Metabolism',
      source: 'Monk',
      level: 2,
      to: '/elemental-monk/techniques/uncanny-metabolism',
      summary: 'On rolling initiative, every spent Focus Point comes back, with 1d6 + 3 hit points.',
      uses: 'Once per long rest'
    },
    {
      name: 'Deflect Attacks',
      source: 'Monk',
      level: 3,
      to: '/elemental-monk/techniques/deflect-attacks',
      summary: 'Reaction to a bludgeoning, piercing or slashing hit: 1d10 + 7 less damage. Brought to 0, a Focus Point sends 2d6 + 4 back at someone (DEX save).'
    },
    {
      name: 'Elemental Attunement',
      source: 'Warrior of the Elements',
      level: 3,
      to: '/elemental-monk/techniques/elemental-attunement',
      summary: 'A Focus Point at the start of the turn, for 10 minutes: Unarmed Strikes reach 10 ft further, deal acid, cold, fire, lightning or thunder, and can push or pull the target 10 ft (STR save).',
      detail: 'With the Bugbear’s long arms, a punch reaches 20 ft on their own turn and 15 ft for opportunity attacks. This is the build.'
    },
    {
      name: 'Manipulate Elements',
      source: 'Warrior of the Elements',
      level: 3,
      to: '/elemental-monk/techniques/elementalism',
      summary: 'The Elementalism cantrip, cast with Wisdom: a breeze, a cup of water, embers that light a torch, a word in the dust.'
    },
    {
      name: 'Long-Limbed',
      source: 'Bugbear',
      to: '/elemental-monk/techniques/long-limbed',
      summary: 'A melee attack on their own turn reaches 5 ft further: 10 ft with a fist or a dagger, 20 ft while attuned.'
    },
    {
      name: 'Surprise Attack',
      source: 'Bugbear',
      to: '/elemental-monk/techniques/surprise-attack',
      summary: 'A hit on a creature that hasn’t taken a turn yet in the fight deals 2d6 more.',
      detail: 'Whether that is every hit or once a turn is a DM question: the text sets no limit.'
    },
    {
      name: 'Sneaky',
      source: 'Bugbear',
      summary: 'Proficiency in Stealth. They can move through and stop in a space big enough for a Small creature without squeezing.',
      detail: 'Crawlspaces, narrow tunnels and half-collapsed doorways that would stop most Medium adventurers.'
    },
    { name: 'Powerful Build', source: 'Bugbear', summary: 'They count as one size larger for how much they can carry, push, drag or lift.' },
    { name: 'Fey Ancestry', source: 'Bugbear', summary: 'Advantage on saves to avoid or end the Charmed condition.' },
    { name: 'Darkvision', source: 'Bugbear', summary: '60 ft: dim light as bright, darkness as dim light, in shades of gray.' }
  ] as Feature[]
}

export interface Resource {
  id: string
  name: string
  max: number
  recharge: 'short' | 'long' | 'none' // 'none': consumables, restocked by hand
  note: string
}

// What the session page tracks besides hit points and Hit Dice
export const resources: Resource[] = [
  { id: 'focus', name: 'Focus Points', max: 3, recharge: 'short', note: 'All back on a short or long rest, and once a day on rolling initiative' },
  { id: 'metabolism', name: 'Uncanny Metabolism', max: 1, recharge: 'long', note: 'On rolling initiative: every Focus Point back, and 1d6 + 3 HP' },
  { id: 'potions', name: 'Potions of Healing', max: 3, recharge: 'none', note: 'Bonus action, 2d4 + 2 · one from the DM, two bought' },
  { id: 'kit', name: 'Healer’s Kit', max: 10, recharge: 'none', note: 'Utilize: stabilize a creature at 0 HP, no Medicine check' }
]

export const elements = ['acid', 'cold', 'fire', 'lightning', 'thunder'] as const
export type Element = (typeof elements)[number]

// ── Derived numbers ─────────────────────────────────────────
const mod = (k: AbilityKey) => modifier(character.abilities[k])
const pb = character.proficiencyBonus

const skillList = allSkills.map(s => {
  const prof = character.skills.find(p => p.name === s.name)
  return {
    ...s,
    proficient: !!prof,
    expertise: false,
    source: prof?.source,
    bonus: mod(s.ability) + (prof ? pb : 0)
  }
})
const skill = (name: string) => skillList.find(s => s.name === name)!.bonus

const martialDie = 'd6'

export const stats = {
  strikeAttack: mod('dex') + pb,
  strikeDamage: mod('dex'),
  martialDie,
  strike: `1${martialDie}+${mod('dex')}`,
  weaponAttack: mod('dex') + pb, // daggers and the spear, monk weapons
  focus: 3,
  focusDc: 8 + pb + mod('wis'), // Elemental Strikes, Deflect's redirect, Stunning Strike from 5
  grappleDc: 8 + pb + mod('dex'), // Grapple and Shove, with DEX (Dexterous Attacks)
  surprise: '2d6',
  deflect: `1d10+${mod('dex') + character.level}`, // damage taken off
  redirect: `2${martialDie}+${mod('dex')}`, // two Martial Arts dice + DEX, sent back
  metabolism: `1${martialDie}+${character.level}`,
  reach: { base: 5, ownTurn: 10, attuned: 20, attunedOff: 15 },
  initiative: mod('dex'),
  passive: {
    perception: 10 + skill('Perception'),
    insight: 10 + skill('Insight'),
    investigation: 10 + skill('Investigation')
  },
  skills: skillList,
  abilities: Object.fromEntries(
    abilityOrder.map(k => {
      const proficient = character.saveProficiencies.includes(k)
      return [k, { score: character.abilities[k], check: mod(k), save: mod(k) + (proficient ? pb : 0) + character.itemBonuses.saves, proficient }]
    })
  ) as RollStats['abilities']
}
