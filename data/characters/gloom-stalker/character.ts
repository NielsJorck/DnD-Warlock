// The Lightless Hunter: a Gloom Stalker concept for the Sword Mountains campaign,
// built at level 3 on the 2024 rules (the campaign's start). Nothing here is
// played yet, and the one uncommon item is pitched to the DM (items.ts). The
// numbers the pages show are worked out from these values in `stats` at the
// bottom; spells are in spells.ts and the level plan in levels.ts.

import { type RulesetId, rulesets } from '../../campaign'
import { abilityOrder, allSkills, modifier, type RollStats } from '~/composables/useCharacter'
import type { AbilityKey, Feature } from '../shared'

const ruleset: RulesetId = '2024'

export const character = {
  name: 'The Lightless Hunter', // working title until he has a name
  epithet: 'Who Waits Where the Torchlight Ends',
  level: 3,
  species: 'Wood Elf',
  className: 'Ranger',
  subclass: 'Gloom Stalker',
  background: 'Criminal',
  backgroundDetail: 'A smuggler of the tunnels under the Sword Mountains',
  ruleset,
  motto: 'The dark is not empty. It is mine.',
  concept: 'An ambush archer who goes first and shoots first, sees 120 ft into the dark, and is invisible there to anything that relies on darkvision.',

  // The campaign's array 16, 15, 14, 12, 10, 8, then +2 DEX and +1 WIS. The
  // Criminal's own scores are DEX, CON and INT; the DM lets the background's
  // increases and feat be picked freely (the 2024 rulings in data/campaign.ts).
  baseScores: { str: 12, dex: 16, con: 14, int: 10, wis: 15, cha: 8 } as Record<AbilityKey, number>,
  backgroundIncreases: { dex: 2, wis: 1 } as Partial<Record<AbilityKey, number>>,
  abilities: { str: 12, dex: 18, con: 14, int: 10, wis: 16, cha: 8 } as Record<AbilityKey, number>,
  saveProficiencies: ['str', 'dex'] as AbilityKey[],

  proficiencyBonus: 2,
  size: 'Medium',
  // d10: 10 at level 1, then the fixed 6 a level, plus CON +2 every level
  maxHp: 28,
  hitDie: 10,
  hitDice: '3d10',
  speed: 35, // Wood Elf
  darkvision: 120, // the Wood Elf's 60 ft, and Umbral Sight adds 60 more
  slots: [3], // 1st level only, until level 5
  attunementMax: rulesets[ruleset].attunementLimit,

  // The Bracers of Archery, as pitched: +2 damage on ranged attacks with a longbow or shortbow
  itemBonuses: {
    bowDamage: 2,
    bowSource: 'Bracers'
  },

  ac: {
    total: 16,
    breakdown: [
      { label: 'Studded leather', value: 12 },
      { label: 'DEX', value: 4 }
    ]
  },

  // 2024: Common and two standard languages at creation; neither species nor background adds any
  languages: [
    { name: 'Common', note: 'Every character' },
    { name: 'Elvish', note: 'Creation: the wood he grew up in' },
    { name: 'Dwarvish', note: 'Creation: the old roads and delves of the mountains are dwarven' },
    { name: 'Goblin', note: 'Deft Explorer: what is usually living in those delves now' },
    { name: 'Orc', note: 'Deft Explorer: who else holds the Sword Mountains' }
  ],

  skills: [
    { name: 'Sleight of Hand', ability: 'dex', source: 'Criminal' },
    { name: 'Stealth', ability: 'dex', source: 'Criminal' },
    { name: 'Perception', ability: 'wis', source: 'Wood Elf (Keen Senses)', expertise: 'Deft Explorer' },
    { name: 'Athletics', ability: 'str', source: 'Ranger' },
    { name: 'Investigation', ability: 'int', source: 'Ranger' },
    { name: 'Survival', ability: 'wis', source: 'Ranger' }
  ] as { name: string; ability: AbilityKey; source: string; expertise?: string }[],
  toolProficiencies: [{ name: 'Thieves’ Tools', source: 'Criminal' }],
  armorWeapons: 'Light and medium armor · shields · simple and martial weapons',
  weaponMastery: [
    { weapon: 'Longbow', mastery: 'Slow', effect: 'A hit that deals damage cuts the target’s speed by 10 ft until the start of their next turn' },
    { weapon: 'Scimitar', mastery: 'Nick', effect: 'The Light weapon’s extra attack is part of the Attack action instead of a bonus action, once a turn' }
  ],

  feats: [
    {
      name: 'Alert',
      source: 'Origin feat · Criminal',
      level: 1,
      summary: 'Adds the proficiency bonus to initiative. Right after rolling initiative, can swap it with a willing ally’s.',
      detail:
        'The Criminal’s own feat, kept by choice when the DM freed it. With Dread Ambusher’s Wisdom on top, initiative is +9: he acts first in nearly every fight, which is when Ambusher’s Leap and the opening Dreadful Strike matter. The swap hands a high roll to whoever needs to go first instead (a controller with Web), and can’t be used if either of them is incapacitated. Magic Initiate (Druid), for Healing Word and Guidance, was the runner-up.'
    }
  ] as Feature[],

  features: [
    {
      name: 'Spellcasting',
      source: 'Ranger',
      level: 1,
      to: '/gloom-stalker/spells',
      summary: 'Wisdom: DC 13, spell attack +5. Four spells prepared from the ranger list, plus Hunter’s Mark and Disguise Self always prepared. Three 1st-level slots.',
      detail: 'After a long rest one prepared spell can be swapped for another ranger spell. A prepared spell with the Ritual tag can be cast as a ritual: 10 minutes longer and no slot. A druidic focus (the sprig of mistletoe) serves as the focus.'
    },
    {
      name: 'Favored Enemy',
      source: 'Ranger',
      level: 1,
      to: '/gloom-stalker/spells/hunters-mark',
      summary: 'Hunter’s Mark is always prepared, and can be cast twice per long rest without a slot. Three times from level 5, four from level 9.',
      uses: '2 / long rest'
    },
    {
      name: 'Weapon Mastery',
      source: 'Ranger',
      level: 1,
      summary: 'The mastery properties of two kinds of weapon: the longbow’s Slow and the scimitar’s Nick. One can be changed after a long rest.',
      detail: 'Slow: a longbow hit that deals damage takes 10 ft off the target’s speed until the start of their next turn, which keeps melee away from an archer. Nick: with the scimitar and shortsword, the second blade’s attack comes as part of the Attack action, so the bonus action stays free for Hunter’s Mark.'
    },
    {
      name: 'Deft Explorer',
      source: 'Ranger',
      level: 2,
      summary: 'Expertise in Perception (+7, passive 17). Two more languages: Goblin and Orc.'
    },
    {
      name: 'Fighting Style: Archery',
      source: 'Ranger',
      level: 2,
      summary: '+2 to attack rolls with ranged weapons. The longbow hits at +8.'
    },
    {
      name: 'Dread Ambusher',
      source: 'Gloom Stalker',
      level: 3,
      to: '/gloom-stalker/session#attacks',
      summary: 'Wisdom added to initiative. +10 ft speed on the first turn of each combat. Dreadful Strike: once per turn, a weapon hit deals 2d6 psychic more.',
      detail:
        'Ambusher’s Leap: at the start of his first turn in each combat his speed rises by 10 ft until the end of that turn, to 45. Dreadful Strike is chosen after the hit, works with the bow or the scimitar, and has as many uses as the Wisdom modifier (3) per long rest. It becomes 2d8 with Stalker’s Flurry at level 11.',
      uses: 'Dreadful Strike 3 / long rest'
    },
    {
      name: 'Umbral Sight',
      source: 'Gloom Stalker',
      level: 3,
      summary: 'Darkvision 60 ft more, to 120 ft. While entirely in darkness, he is invisible to any creature that relies on darkvision to see him there.',
      detail:
        'Invisible to a creature means its attacks against him have disadvantage and his against it have advantage, and it can’t target him with effects that need sight. Most things living in a dungeon see by darkvision, so this is the build’s engine, and at 120 ft he sees twice as far into the dark as the goblins and orcs do. It ends the moment light reaches him: a torch sheds bright light for 20 ft and dim light 20 ft beyond, and dim light isn’t darkness. Blindsight, tremorsense, truesight and anything carrying its own light see him normally.'
    },
    {
      name: 'Gloom Stalker Spells',
      source: 'Gloom Stalker',
      level: 3,
      to: '/gloom-stalker/spells?tab=later',
      summary: 'Always prepared: Disguise Self now, Rope Trick at 5, Fear at 9 (Greater Invisibility at 13, Seeming at 17).'
    },
    {
      name: 'Elven Lineage: Wood Elf',
      source: 'Wood Elf',
      level: 1,
      to: '/gloom-stalker/spells?tab=all&q=wood%20elf',
      summary: 'Speed 35. Druidcraft at will, Longstrider from level 3 and Pass without Trace from level 5, each once per long rest without a slot. Wisdom casts them: DC 13, attack +5.',
      detail:
        'Both spells are always prepared, so they take none of the ranger’s prepared picks, and ranger slots can cast them again. Druidcraft’s Fire Play lights or snuffs out a candle, torch or small campfire within 30 ft: the quickest way to put a room back in the dark.',
      uses: 'Longstrider 1 / long rest'
    },
    { name: 'Darkvision', source: 'Wood Elf', level: 1, summary: '60 ft of his own, which Umbral Sight extends to 120 ft. Dim light as bright, darkness as dim light, in shades of gray.' },
    { name: 'Fey Ancestry', source: 'Wood Elf', level: 1, summary: 'Advantage on saves to avoid or end the Charmed condition.' },
    { name: 'Keen Senses', source: 'Wood Elf', level: 1, summary: 'Proficiency in Perception (one of Insight, Perception or Survival), which Deft Explorer then doubles.' },
    {
      name: 'Trance',
      source: 'Wood Elf',
      level: 1,
      summary: 'He doesn’t need sleep, and magic can’t put him to sleep. A long rest takes 4 hours of trancelike meditation, during which he stays conscious.',
      detail: 'Conscious through the night, and done resting four hours before the others: the natural last watch in a dungeon camp.'
    }
  ] as Feature[]
}

export interface Resource {
  id: string
  name: string
  max: number
  recharge: 'short' | 'long' | 'none' // 'none': spent for good, like potions and arrows
  note: string
}

// What the session page tracks besides hit points and spell slots
export const resources: Resource[] = [
  { id: 'mark', name: 'Hunter’s Mark, free casts', max: 2, recharge: 'long', note: 'Favored Enemy: without a slot' },
  { id: 'dreadful', name: 'Dreadful Strike', max: 3, recharge: 'long', note: '2d6 psychic on a weapon hit, once a turn' },
  { id: 'longstrider', name: 'Longstrider (Wood Elf)', max: 1, recharge: 'long', note: 'Without a slot' },
  { id: 'potions', name: 'Potions of Healing', max: 3, recharge: 'none', note: 'Bonus action: 2d4 + 2' },
  { id: 'arrows', name: 'Arrows', max: 60, recharge: 'none', note: 'Half of those shot can be found after a fight' },
  { id: 'healersKit', name: 'Healer’s Kit', max: 10, recharge: 'none', note: 'Stabilize a dying creature' }
]

// ── Derived numbers ─────────────────────────────────────────
const mod = (k: AbilityKey) => modifier(character.abilities[k])
const pb = character.proficiencyBonus

const skillList = allSkills.map(s => {
  const prof = character.skills.find(p => p.name === s.name)
  const expertise = !!prof?.expertise
  return { ...s, proficient: !!prof, expertise, source: prof?.source, expertiseFrom: prof?.expertise, bonus: mod(s.ability) + (prof ? pb * (expertise ? 2 : 1) : 0) }
})
const skill = (name: string) => skillList.find(s => s.name === name)!.bonus

export const stats = {
  spellDc: 8 + pb + mod('wis'),
  spellAttack: pb + mod('wis'),
  // DEX, Dread Ambusher's WIS and Alert's proficiency bonus
  initiative: mod('dex') + mod('wis') + pb,
  initiativeParts: [
    { label: 'DEX', value: mod('dex') },
    { label: 'WIS (Dread Ambusher)', value: mod('wis') },
    { label: 'Alert', value: pb }
  ],
  bowAttack: mod('dex') + pb + 2, // Archery fighting style
  bowDamage: mod('dex') + character.itemBonuses.bowDamage,
  bladeAttack: mod('dex') + pb, // scimitar, shortsword and daggers are finesse
  bladeDamage: mod('dex'),
  tools: mod('dex') + pb, // Thieves' Tools
  dreadfulUses: Math.max(1, mod('wis')),
  prepared: 4,
  potion: '2d4+2',
  passive: {
    perception: 10 + skill('Perception'),
    insight: 10 + skill('Insight'),
    investigation: 10 + skill('Investigation')
  },
  skills: skillList,
  abilities: Object.fromEntries(
    abilityOrder.map(k => {
      const proficient = character.saveProficiencies.includes(k)
      return [k, { score: character.abilities[k], check: mod(k), save: mod(k) + (proficient ? pb : 0), proficient }]
    })
  ) as RollStats['abilities']
}
