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
  name: 'The Lightless Hunter', // working title until they have a name
  epithet: 'Who Waits Where the Torchlight Ends',
  level: 3,
  species: 'Human',
  className: 'Ranger',
  subclass: 'Gloom Stalker',
  background: 'Guide',
  backgroundDetail: 'A guide of the Sword Mountain passes',
  ruleset,
  motto: 'The dark is not empty. It is mine.',
  concept: 'An ambush archer who goes first and shoots first, and who is invisible in the dark to anything that sees with darkvision.',

  // The campaign's array 16, 15, 14, 12, 10, 8, then the Guide's +2 DEX and +1 WIS
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
  speed: 30,
  darkvision: 60, // from Umbral Sight; humans have none of their own
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

  languages: [
    { name: 'Common', note: 'Every character' },
    { name: 'Dwarvish', note: 'Creation: the old roads and delves of the mountains are dwarven' },
    { name: 'Goblin', note: 'Creation: what is usually living in those delves now' },
    { name: 'Orc', note: 'Deft Explorer' },
    { name: 'Giant', note: 'Deft Explorer' }
  ],

  skills: [
    { name: 'Stealth', ability: 'dex', source: 'Guide' },
    { name: 'Survival', ability: 'wis', source: 'Guide' },
    { name: 'Perception', ability: 'wis', source: 'Human (Skillful)', expertise: 'Deft Explorer' },
    { name: 'Athletics', ability: 'str', source: 'Ranger' },
    { name: 'Insight', ability: 'wis', source: 'Ranger' },
    { name: 'Investigation', ability: 'int', source: 'Ranger' }
  ] as { name: string; ability: AbilityKey; source: string; expertise?: string }[],
  toolProficiencies: [{ name: 'Cartographer’s tools', source: 'Guide' }],
  armorWeapons: 'Light and medium armor · shields · simple and martial weapons',
  weaponMastery: [
    { weapon: 'Longbow', mastery: 'Slow', effect: 'A hit that deals damage cuts the target’s speed by 10 ft until the start of their next turn' },
    { weapon: 'Scimitar', mastery: 'Nick', effect: 'The Light weapon’s extra attack is part of the Attack action instead of a bonus action, once a turn' }
  ],

  feats: [
    {
      name: 'Magic Initiate (Druid)',
      source: 'Origin feat · Guide',
      level: 1,
      to: '/gloom-stalker/spells',
      summary: 'Guidance and Message, and Healing Word once per long rest without a slot. Wisdom casts them: DC 13, attack +5.',
      detail:
        'Healing Word can also be cast with ranger slots, since 2024 Magic Initiate lets you use any slots you have. That is the party’s emergency pick-up from 60 ft as a bonus action. Guidance goes on the trap-finder’s and lock-picker’s checks between fights. Message has no spoken part in the 2024 book, so it carries plans in the dark without breaking a hide.',
      uses: 'Healing Word 1 / long rest'
    },
    {
      name: 'Alert',
      source: 'Origin feat · Human (Versatile)',
      level: 1,
      summary: 'Adds the proficiency bonus to initiative. Right after rolling initiative, can swap it with a willing ally’s.',
      detail:
        'With Dread Ambusher’s Wisdom on top, initiative is +9: they act first in nearly every fight, which is when Ambusher’s Leap and the opening Dreadful Strike matter. The swap hands a high roll to whoever needs to go first instead (a controller with Web), and can’t be used if either of them is incapacitated.'
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
      summary: 'Expertise in Perception (+7, passive 17). Two more languages: Orc and Giant.'
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
        'Ambusher’s Leap: at the start of their first turn in each combat their speed rises by 10 ft until the end of that turn. Dreadful Strike is chosen after the hit, works with the bow or the scimitar, and has as many uses as the Wisdom modifier (3) per long rest. It becomes 2d8 with Stalker’s Flurry at level 11.',
      uses: 'Dreadful Strike 3 / long rest'
    },
    {
      name: 'Umbral Sight',
      source: 'Gloom Stalker',
      level: 3,
      summary: 'Darkvision 60 ft. While entirely in darkness, they are invisible to any creature that relies on darkvision to see them there.',
      detail:
        'Invisible to a creature means its attacks against them have disadvantage and theirs against it have advantage, and it can’t target them with effects that need sight. Most things living in a dungeon see by darkvision, so this is the build’s engine. It ends the moment light reaches them: a torch sheds bright light for 20 ft and dim light 20 ft beyond, and dim light isn’t darkness. Blindsight, tremorsense, truesight and anything carrying its own light see them normally.'
    },
    {
      name: 'Gloom Stalker Spells',
      source: 'Gloom Stalker',
      level: 3,
      to: '/gloom-stalker/spells?tab=later',
      summary: 'Always prepared: Disguise Self now, Rope Trick at 5, Fear at 9 (Greater Invisibility at 13, Seeming at 17).'
    },
    {
      name: 'Resourceful',
      source: 'Human',
      summary: 'Heroic Inspiration after every long rest: reroll any one die right after rolling it, and keep the new roll.'
    },
    {
      name: 'Skillful',
      source: 'Human',
      summary: 'Proficiency in one skill: Perception, which Deft Explorer then doubles.'
    },
    {
      name: 'Versatile',
      source: 'Human',
      summary: 'An Origin feat of their choice: Alert.'
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
  { id: 'healingWord', name: 'Healing Word (Magic Initiate)', max: 1, recharge: 'long', note: 'Without a slot' },
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
  bladeAttack: mod('dex') + pb, // scimitar and shortsword are finesse
  bladeDamage: mod('dex'),
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
