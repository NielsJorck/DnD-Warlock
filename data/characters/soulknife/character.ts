// The Whisper-Knife: a Wood Elf Soulknife built for the Sword Mountains
// expedition on the 2024 rules, at the campaign's starting level 3. Nothing is
// played yet, and the uncommon item is pitched to the DM (items.ts). The numbers
// the pages show are worked out from these values in `stats` at the bottom; the
// powers are in powers.ts and the level history in levels.ts.

import { rulesets, type RulesetId } from '../../campaign'
import { abilityOrder, allSkills, modifier, type RollStats } from '~/composables/useCharacter'
import type { AbilityKey, Feature } from '../shared'

export const character = {
  name: 'The Whisper-Knife', // working title until they have a name
  epithet: 'The Blade Nobody Sees',
  level: 3,
  species: 'Wood Elf',
  className: 'Rogue',
  subclass: 'Soulknife',
  background: 'Criminal',
  backgroundDetail: 'A burglar who works for the payday',
  ruleset: '2024' as RulesetId,
  motto: 'Every lock has a price. So does every door that should have stayed shut.',
  concept: 'A scout and trap-and-lock specialist who fights with blades of thought and keeps the party talking without a sound.',

  // The campaign's array 16, 15, 14, 12, 10, 8, then the Criminal's +2 DEX and +1 CON
  baseScores: { str: 8, dex: 16, con: 15, int: 12, wis: 14, cha: 10 } as Record<AbilityKey, number>,
  backgroundIncreases: { dex: 2, con: 1 } as Partial<Record<AbilityKey, number>>,
  abilities: { str: 8, dex: 18, con: 16, int: 12, wis: 14, cha: 10 } as Record<AbilityKey, number>,
  saveProficiencies: ['dex', 'int'] as AbilityKey[],

  proficiencyBonus: 2,
  size: 'Medium',
  // d8: 8 at level 1, then the fixed 5 a level, plus CON +3 every level
  maxHp: 27,
  hitDie: 8,
  hitDice: '3d8',
  speed: 35,
  darkvision: 60,
  attunementMax: rulesets['2024'].attunementLimit,

  ac: {
    total: 16,
    breakdown: [
      { label: 'Studded leather', value: 12 },
      { label: 'DEX', value: 4 }
    ]
  },

  // 2024: Common and two standard languages at creation; Thieves' Cant brings one more
  languages: [
    { name: 'Common', note: 'Every character' },
    { name: 'Elvish', note: 'A standard language, picked at creation' },
    { name: 'Dwarvish', note: 'A standard language, picked at creation: the old holds of the Sword Mountains' },
    { name: 'Thieves’ Cant', note: 'Rogue' },
    { name: 'Goblin', note: 'Rogue: Thieves’ Cant’s extra language. Goblins and their kin fill old dungeons' }
  ],

  skills: [
    { name: 'Sleight of Hand', ability: 'dex', source: 'Criminal' },
    { name: 'Stealth', ability: 'dex', source: 'Criminal', expertise: true, advantage: 'Cloak of Elvenkind, hood up' },
    { name: 'Perception', ability: 'wis', source: 'Wood Elf (Keen Senses)', expertise: true },
    { name: 'Acrobatics', ability: 'dex', source: 'Rogue' },
    { name: 'Insight', ability: 'wis', source: 'Rogue' },
    { name: 'Investigation', ability: 'int', source: 'Rogue' },
    { name: 'Deception', ability: 'cha', source: 'Rogue' }
  ] as { name: string; ability: AbilityKey; source: string; expertise?: boolean; advantage?: string }[],
  toolProficiencies: [{ name: 'Thieves’ Tools', source: 'Rogue, and again from the Criminal (a DM question)' }],
  armorWeapons: 'Light armor · simple weapons · martial weapons with Finesse or Light',
  weaponMastery: [
    { weapon: 'Shortbow', mastery: 'Vex', note: 'A hit gives advantage on the next attack against the target' },
    { weapon: 'Dagger', mastery: 'Nick', note: 'The Light weapon’s extra attack becomes part of the Attack action' },
    { weapon: 'Psychic Blade', mastery: 'Vex', note: 'Built into the blade, on top of the two above' }
  ],

  feats: [
    {
      name: 'Alert',
      source: 'Origin feat · Criminal',
      level: 1,
      summary: 'Proficiency bonus added to initiative: +6. Right after rolling initiative, they can swap it with a willing ally in the same combat.',
      detail:
        'Neither of the two can be incapacitated for the swap. A rogue who scouts ahead wants to act first, and when going first matters more for someone else (the party’s controller, a healer at a dying friend), they hand the high roll over.',
      to: '/soulknife/powers/initiative-swap'
    }
  ] as Feature[],

  features: [
    {
      name: 'Expertise',
      source: 'Rogue',
      level: 1,
      summary: 'Double proficiency in Stealth (+8) and Perception (+6, passive 16).',
      detail: 'Two more at level 6: Sleight of Hand and Investigation are the plan. Expertise is for skills; Thieves’ Tools stay at +6.'
    },
    {
      name: 'Sneak Attack',
      source: 'Rogue',
      level: 1,
      to: '/soulknife/powers/sneak-attack',
      summary: 'Once per turn, 2d6 more on a hit with a Finesse or ranged weapon, with advantage or with an ally next to the target.',
      uses: 'Once per turn'
    },
    { name: 'Thieves’ Cant', source: 'Rogue', level: 1, summary: 'The secret mix of dialect, jargon and signs of thieves, and one more language: Goblin.' },
    {
      name: 'Weapon Mastery',
      source: 'Rogue',
      level: 1,
      summary: 'The mastery properties of two kinds of weapons: Shortbow (Vex) and Dagger (Nick). They can change the two after a long rest.',
      detail: 'The Psychic Blade carries Vex on its own and doesn’t count against the two. Vex: a hit gives advantage on the next attack against that creature before the end of their next turn. Nick: the extra attack from a second Light weapon is made as part of the Attack action instead of the bonus action.'
    },
    {
      name: 'Cunning Action',
      source: 'Rogue',
      level: 2,
      to: '/soulknife/powers/cunning-action',
      summary: 'A bonus action on each turn to Dash, Disengage or Hide.'
    },
    {
      name: 'Steady Aim',
      source: 'Rogue',
      level: 3,
      to: '/soulknife/powers/steady-aim',
      summary: 'A bonus action gives advantage on the next attack this turn, if they haven’t moved. Speed 0 for the rest of the turn.'
    },
    {
      name: 'Psionic Power',
      source: 'Soulknife',
      level: 3,
      to: '/soulknife/powers?tab=ready',
      summary: 'Four Psionic Energy Dice, d6s. One comes back on a short rest, all on a long rest. They fuel Psi-Bolstered Knack and Psychic Whispers.',
      uses: '4d6 · 1 back per short rest'
    },
    {
      name: 'Psi-Bolstered Knack',
      source: 'Soulknife',
      level: 3,
      to: '/soulknife/powers/psi-bolstered-knack',
      summary: 'A failed check with a skill or tool they are proficient in gets a psi die added. The die is spent only if the check then succeeds.'
    },
    {
      name: 'Psychic Whispers',
      source: 'Soulknife',
      level: 3,
      to: '/soulknife/powers/psychic-whispers',
      summary: 'Telepathy with up to two creatures they can see, for hours equal to a psi die. The first use after a long rest is free.'
    },
    {
      name: 'Psychic Blades',
      source: 'Soulknife',
      level: 3,
      to: '/soulknife/powers/psychic-blades',
      summary: 'A blade of thought for every attack: +6 to hit, 1d6 + 4 psychic, melee or thrown 60 ft, with Vex. A bonus action throws or swings a second for 1d4 + 4.'
    },
    {
      name: 'Elven Lineage: Wood Elf',
      source: 'Wood Elf',
      level: 1,
      summary: 'Speed 35. Druidcraft at will, Longstrider once per long rest from level 3, Pass without Trace from level 5. Wisdom casts them: DC 12, attack +4.',
      to: '/soulknife/powers?tab=all&q=wood%20elf'
    },
    { name: 'Darkvision', source: 'Wood Elf', summary: '60 ft: dim light as bright, darkness as dim light, in shades of gray.' },
    { name: 'Fey Ancestry', source: 'Wood Elf', summary: 'Advantage on saves to avoid or end the Charmed condition.' },
    { name: 'Keen Senses', source: 'Wood Elf', summary: 'Proficiency in Perception (one of Insight, Perception or Survival).' },
    {
      name: 'Trance',
      source: 'Wood Elf',
      summary: 'They don’t need sleep, and magic can’t put them to sleep. A long rest takes 4 hours of trancelike meditation, during which they stay conscious.',
      detail: 'Conscious through the night: a natural last watch while the others sleep.'
    }
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
  { id: 'psi', name: 'Psionic Energy Dice', max: 4, recharge: 'long', note: 'd6 · one comes back on a short rest, all on a long rest' },
  { id: 'whispers', name: 'Psychic Whispers: free use', max: 1, recharge: 'long', note: 'The first use after a long rest spends no die' },
  { id: 'longstrider', name: 'Longstrider', max: 1, recharge: 'long', note: 'Wood Elf · once per long rest, no slot needed' },
  { id: 'potions', name: 'Potions of Healing', max: 3, recharge: 'none', note: 'Bonus action, 2d4 + 2 · one from the DM, two bought' },
  { id: 'kit', name: 'Healer’s Kit', max: 10, recharge: 'none', note: 'Utilize: stabilize a creature at 0 HP, no Medicine check' }
]

// ── Derived numbers ─────────────────────────────────────────
const mod = (k: AbilityKey) => modifier(character.abilities[k])
const pb = character.proficiencyBonus

const skillList = allSkills.map(s => {
  const prof = character.skills.find(p => p.name === s.name)
  return {
    ...s,
    proficient: !!prof,
    expertise: !!prof?.expertise,
    source: prof?.source,
    advantage: prof?.advantage,
    bonus: mod(s.ability) + (prof ? pb * (prof.expertise ? 2 : 1) : 0)
  }
})
const skill = (name: string) => skillList.find(s => s.name === name)!.bonus

export const stats = {
  bladeAttack: mod('dex') + pb,
  bladeDamage: mod('dex'),
  blade: `1d6+${mod('dex')}`,
  secondBlade: `1d4+${mod('dex')}`,
  weaponAttack: mod('dex') + pb, // every Finesse or ranged weapon
  sneakDice: Math.ceil(character.level / 2),
  sneak: `${Math.ceil(character.level / 2)}d6`,
  psiDie: 'd6',
  psiDice: 4,
  psiTelepathy: pb, // Psychic Whispers: creatures linked
  initiative: mod('dex') + pb, // Alert
  tools: mod('dex') + pb, // Thieves' Tools
  // Wood Elf spells, cast with Wisdom
  elfDc: 8 + pb + mod('wis'),
  elfAttack: pb + mod('wis'),
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
