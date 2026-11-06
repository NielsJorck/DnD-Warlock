// The Tempest Cleric: a concept for a possible replacement for Lucan, built at
// level 10 on the 2014 rules so he can join at the party's level. Nothing here
// is played yet, and his gear is pitched to the DM (items.ts). The numbers the
// pages show are worked out from these values in `stats` at the bottom; his
// spells are in spells.ts and his level history in levels.ts.

import type { RulesetId } from '../../campaign'
import { abilityOrder, allSkills, modifier, type RollStats } from '~/composables/useCharacter'
import type { AbilityKey, Feature } from '../shared'

export const character = {
  name: 'The Storm-Hammer', // working title until he has a name
  epithet: 'Voice of the Storm Lord',
  level: 10,
  race: 'Hill Dwarf',
  className: 'Cleric',
  subclass: 'Tempest Domain',
  deity: 'Kord',
  deityTitle: 'the Storm Lord',
  background: 'Acolyte',
  backgroundDetail: 'Struck by lightning at the altar',
  ruleset: '2014' as RulesetId,
  motto: 'O Radiant Lord of the Storms, grant me strength.',
  concept: 'A heavily armored storm cleric who punishes enemies both for staying close and for trying to escape.',

  // The array 17, 16, 11, 10, 10, 8, then Hill Dwarf +2 CON and +1 WIS. Every feat
  // slot up to level 10 goes to a feat, so no score rises before level 12.
  baseScores: { str: 8, dex: 11, con: 16, int: 10, wis: 17, cha: 10 } as Record<AbilityKey, number>,
  racialIncreases: { con: 2, wis: 1 } as Partial<Record<AbilityKey, number>>,
  // STR 21 is the Stormgirdle's: it sets Strength to 21 whatever the score underneath
  abilities: { str: 21, dex: 11, con: 18, int: 10, wis: 18, cha: 10 } as Record<AbilityKey, number>,
  saveProficiencies: ['wis', 'cha'] as AbilityKey[],

  proficiencyBonus: 4,
  size: 'Medium',
  // d8: 8 at level 1, then the fixed 5 a level, plus CON +4 and Dwarven Toughness +1 every level
  maxHp: 103,
  hitDice: '10d8',
  speed: 25,
  darkvision: 60,
  slots: [4, 3, 3, 3, 2], // 1st to 5th
  channelDivinity: 2, // per short rest
  attunementMax: 10, // the table's limit

  // Item bonuses on the sheet: the Amulet of the Devout, +1 (its version is picked in items.ts)
  itemBonuses: {
    spell: 1, // spell attack rolls and spell save DCs; at this table bonuses from different items stack
    spellSource: 'Amulet'
  },

  ac: {
    total: 20,
    breakdown: [
      { label: 'Plate', value: 18 },
      { label: 'Sentinel Shield', value: 2 }
    ],
    withPlus2: 22 // if the plate is +2
  },

  languages: [
    { name: 'Common', note: 'Hill Dwarf' },
    { name: 'Dwarvish', note: 'Hill Dwarf' },
    { name: 'Giant', note: 'Acolyte' },
    { name: 'Primordial', note: 'Acolyte: Auran, the speech of wind and storm' }
  ],

  // The cleric list gives Insight and Religion. The Acolyte gives the same two, and a
  // repeated proficiency can be swapped for another of the same kind (PHB, chapter 4).
  skills: [
    { name: 'Insight', ability: 'wis', source: 'Cleric' },
    { name: 'Religion', ability: 'int', source: 'Cleric' },
    { name: 'Athletics', ability: 'str', source: 'Acolyte, in place of the repeated Insight' },
    { name: 'Perception', ability: 'wis', source: 'Acolyte, in place of the repeated Religion', advantage: 'Sentinel Shield' }
  ] as { name: string; ability: AbilityKey; source: string; advantage?: string }[],
  toolProficiencies: [{ name: 'Smith’s tools', source: 'Hill Dwarf' }],
  armorWeapons: 'All armor · shields · simple and martial weapons',

  feats: [
    {
      name: 'War Caster',
      source: 'PHB · the table’s level-1 feat',
      level: 1,
      summary: 'Advantage on Constitution saves to keep concentration. Somatic components with the staff and shield in hand. A spell instead of an opportunity attack.',
      detail:
        'Clerics aren’t proficient in Constitution saves, so this is what keeps Spirit Guardians up. The opportunity-attack spell must take one action and target only that creature: Booming Blade, which hits and then goes off for 2d8 more as soon as the creature keeps walking.'
    },
    {
      name: 'Magic Initiate (Wizard)',
      source: 'PHB · Seeker Guild',
      summary: 'Booming Blade and Shocking Grasp, and Shield once per long rest. Intelligence is the casting ability: spell attack +5, DC 13 with the amulet.',
      detail:
        'A feat from the Seeker Guild, on top of the ones his levels give. Booming Blade doesn’t use the casting ability at all: it is a staff attack with 1d8 thunder more on a hit, and 2d8 more if the target moves of its own will before his next turn. Shocking Grasp does (+5 with the amulet, and advantage against metal armor). It is for getting out of a crowd, since the target can’t take reactions, and it deals lightning, so Thunderbolt Strike can push. Shield gives +5 AC until his next turn, for the reaction.',
      uses: 'Shield once / long rest'
    },
    {
      name: 'Elemental Adept',
      source: 'PHB',
      level: 4,
      summary: 'His spells of one type ignore resistance, and 1s on their damage dice count as 2s. Thunder or lightning: still to decide.',
      detail:
        'Spells only: not Wrath of the Storm, Divine Strike, the staff or the Stormgirdle, and Destructive Wrath already maxes the dice it is used on. Thunder covers more of what he casts: Booming Blade every turn, Thunderwave, Shatter, Destructive Wave and the plate’s Thunder Step. Lightning covers only Call Lightning and Shocking Grasp, but lightning resistance is the more common one (demons have it). Immunity stops either. With thunder, his own Shatter ignores the Stormgirdle’s resistance if he is caught in it.'
    },
    {
      name: 'Shield Master',
      source: 'PHB',
      level: 8,
      summary: 'After the Attack action, a bonus-action shove with the shield. +2 to Dexterity saves against effects that target only him. On a successful Dexterity save for half damage, the reaction makes it none.',
      detail:
        'The shove needs the Attack action, and Booming Blade is the Cast a Spell action, so whether it can follow a melee cantrip is a question for the DM. Athletics +9 lands it: prone gives allies advantage in melee, and a 5-ft push keeps the creature inside Spirit Guardians. The no-damage save spends the reaction that Wrath of the Storm, Shield and the Guardian Emblem also want.',
      to: '/rules?ruleset=2014#tempest'
    }
  ] as Feature[],

  features: [
    {
      name: 'Spellcasting',
      source: 'Cleric',
      level: 1,
      to: '/tempest/spells',
      summary: 'Wisdom: DC 17, spell attack +9 with the Amulet of the Devout. 14 spells prepared each day from the whole cleric list, plus the ten Tempest spells, always prepared. Slots 4 / 3 / 3 / 3 / 2.'
    },
    {
      name: 'Bonus Proficiencies',
      source: 'Tempest Domain',
      level: 1,
      summary: 'Heavy armor and martial weapons.'
    },
    {
      name: 'Wrath of the Storm',
      source: 'Tempest Domain',
      level: 1,
      summary: 'When a creature within 5 ft that he can see hits him, his reaction deals it 2d8 lightning or thunder, his choice (DC 17 Dexterity save for half).',
      detail: 'Lightning when Thunderbolt Strike should push it 10 ft away, thunder when it should stay in Spirit Guardians. It is a class feature, not a spell, so Elemental Adept doesn’t touch it.',
      uses: '4 / long rest (WIS)'
    },
    {
      name: 'Channel Divinity',
      source: 'Cleric',
      level: 2,
      summary: 'Turn Undead (DC 17 Wisdom save) or Destructive Wrath. The Amulet of the Devout adds one free use a day.',
      uses: '2 / short rest · +1 / day'
    },
    {
      name: 'Destructive Wrath',
      source: 'Tempest Domain',
      level: 2,
      to: '/tempest/session#attacks',
      summary: 'When he rolls lightning or thunder damage, a Channel Divinity makes it the maximum instead of rolling.'
    },
    {
      name: 'Destroy Undead',
      source: 'Cleric',
      level: 5,
      summary: 'Undead of CR 1 or lower that fail against Turn Undead are destroyed.'
    },
    {
      name: 'Thunderbolt Strike',
      source: 'Tempest Domain',
      level: 6,
      summary: 'When he deals lightning damage to a Large or smaller creature, he can push it up to 10 ft away.',
      detail:
        'Lightning only: Wrath of the Storm (if he picks lightning), Shocking Grasp, the staff’s Lightning and Lightning Strike, the Stormgirdle’s bolt and Call Lightning. Booming Blade, Divine Strike and Shatter are thunder and don’t push.'
    },
    {
      name: 'Divine Strike',
      source: 'Tempest Domain',
      level: 8,
      summary: 'Once on each of his turns, a weapon hit deals 1d8 thunder more (2d8 from level 14).',
      detail: 'Booming Blade is a weapon attack, so it counts.',
      uses: 'Once per turn'
    },
    {
      name: 'Divine Intervention',
      source: 'Cleric',
      level: 10,
      summary: 'An action to call on Kord: it works if a d100 rolls 10 or lower.',
      detail: 'If Kord answers, he can’t ask again for 7 days. If not, he can try again after a long rest.'
    },
    {
      name: 'Dwarven Toughness',
      source: 'Hill Dwarf',
      summary: '+1 hit point per level, 10 at level 10.'
    },
    {
      name: 'Dwarven Resilience',
      source: 'Hill Dwarf',
      summary: 'Resistance to poison damage and advantage on saves against poison.'
    },
    {
      name: 'Speed and Darkvision',
      source: 'Hill Dwarf',
      summary: 'Speed 25 ft, never slowed by heavy armor. Darkvision 60 ft.'
    },
    {
      name: 'Stonecunning',
      source: 'Hill Dwarf',
      summary: 'History checks about the origin of stonework count as proficient, with double the proficiency bonus (+8).'
    },
    {
      name: 'Shelter of the Faithful',
      source: 'Acolyte',
      summary: 'He and his companions get free healing and care at temples of Kord, and the support of the faithful there.'
    }
  ] as Feature[]
}

export interface Resource {
  id: string
  name: string
  max: number
  recharge: 'short' | 'long' // the staff's, the girdle's and the emblem's come back at dawn: a long rest here
  note: string
}

// What the session page tracks besides hit points and spell slots
export const resources: Resource[] = [
  { id: 'channel', name: 'Channel Divinity', max: 2, recharge: 'short', note: 'Destructive Wrath or Turn Undead' },
  { id: 'devout', name: 'Amulet: free Channel Divinity', max: 1, recharge: 'long', note: 'Once per dawn, without spending a use' },
  { id: 'wrath', name: 'Wrath of the Storm', max: 4, recharge: 'long', note: 'Reaction when hit in melee: 2d8, DEX save' },
  { id: 'shield', name: 'Shield (Magic Initiate)', max: 1, recharge: 'long', note: 'Reaction: +5 AC until his next turn' },
  { id: 'emblem', name: 'Guardian Emblem', max: 3, recharge: 'long', note: 'Reaction: a critical hit becomes a normal hit' },
  { id: 'avatar', name: 'Storm Avatar', max: 1, recharge: 'long', note: 'Stormgirdle · action, 1 minute' },
  { id: 'staffLightning', name: 'Staff: Lightning', max: 1, recharge: 'long', note: 'On a hit: 2d6 lightning more' },
  { id: 'staffThunder', name: 'Staff: Thunder', max: 1, recharge: 'long', note: 'On a hit: DC 17 CON or stunned' },
  { id: 'staffStrike', name: 'Staff: Lightning Strike', max: 1, recharge: 'long', note: 'Action: 120-ft line, 9d6 lightning, DC 17 DEX' },
  { id: 'staffClap', name: 'Staff: Thunderclap', max: 1, recharge: 'long', note: 'Action: 60 ft, 2d6 thunder and deafened, DC 17 CON' },
  { id: 'staffBoth', name: 'Staff: Thunder and Lightning', max: 1, recharge: 'long', note: 'Action: Strike and Clap together' },
  { id: 'boots', name: 'Boots of Speed', max: 10, recharge: 'long', note: 'Minutes of use; one is marked each time they go on' },
  { id: 'intervention', name: 'Divine Intervention', max: 1, recharge: 'long', note: 'd100 of 10 or lower. If Kord answers, not again for 7 days' }
]

// ── Derived numbers ─────────────────────────────────────────
const mod = (k: AbilityKey) => modifier(character.abilities[k])
const pb = character.proficiencyBonus

const skillList = allSkills.map(s => {
  const prof = character.skills.find(p => p.name === s.name)
  return { ...s, proficient: !!prof, expertise: false, source: prof?.source, advantage: prof?.advantage, bonus: mod(s.ability) + (prof ? pb : 0) }
})
const skill = (name: string) => skillList.find(s => s.name === name)!.bonus

const spellBonus = character.itemBonuses.spell

export const stats = {
  spellDcBase: 8 + pb + mod('wis'),
  spellDc: 8 + pb + mod('wis') + spellBonus,
  spellAttackBase: pb + mod('wis'),
  spellAttack: pb + mod('wis') + spellBonus,
  // Magic Initiate (Wizard) runs on Intelligence; the amulet raises it too
  initiateDc: 8 + pb + mod('int') + spellBonus,
  initiateAttack: pb + mod('int') + spellBonus,
  staffAttack: mod('str') + pb + 2, // +2 quarterstaff, STR from the Stormgirdle
  staffDamage: mod('str') + 2,
  wrathUses: Math.max(1, mod('wis')),
  prepared: mod('wis') + character.level,
  initiative: mod('dex'), // with advantage from the Sentinel Shield
  athletics: skill('Athletics'),
  passive: {
    perception: 10 + skill('Perception') + 5, // advantage (Sentinel Shield) adds 5
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
