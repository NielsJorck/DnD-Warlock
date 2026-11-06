// The Whisper-Knife's powers: a rogue has no spellbook, so this list takes its
// place. Psionic powers, the rogue options he chooses to use, the Alert feat's
// swap and the Wood Elf spells, each with the level it arrives at (`ready` at
// level 3, `future` up to 12). Rules text is paraphrased from the 2024 Player’s
// Handbook. Numbers are level 3's unless a power arrives later (DEX 20 from 4).
//
// nuxt.config.ts imports this file to list the power pages, so it must not
// import anything at runtime.

import type { School } from '../shared'

export type PowerStatus = 'ready' | 'future'
export type PowerKind = 'Psionic' | 'Rogue' | 'Feat' | 'Wood Elf'
// What it takes on his turn, for the filters and the session page
export type PowerWhen = 'action' | 'bonus' | 'reaction' | 'free'
// What it spends: a psi die, a use per rest, Sneak Attack dice, or nothing
export type PowerCost = 'psi' | 'daily' | 'sneak' | 'free'

export interface Power {
  slug: string
  name: string
  kind: PowerKind
  source: string // the feature it comes from
  level: number // the character level it arrives at
  status: PowerStatus
  when: PowerWhen
  timing: string
  range?: string
  duration?: string
  cost: string
  costKind: PowerCost
  concentration?: boolean
  spell?: { level: number; school: School; components: string } // the Wood Elf spells
  role: string // a few words on what it does for him
  summary: string // the rules, paraphrased
  options?: { name: string; cost?: string; effect: string }[]
  grows?: string // how it changes on the way to level 12
  notes?: string // how it fits the build
  attack?: boolean // a blade attack roll
  save?: string
  damage?: string
  dice?: string // the roll the pages offer
}

export const statusLabels: Record<PowerStatus, string> = {
  ready: 'Ready',
  future: 'Later'
}

export const statusTone: Record<PowerStatus, string> = {
  ready: 'border-gold/50 bg-gold/10 text-gold-light',
  future: 'border-topaz/40 bg-topaz/10 text-topaz'
}

// Full class strings so Tailwind can see them
export const kindTone: Record<PowerKind, { text: string; border: string; bg: string; hex: string; glyph: string }> = {
  Psionic: { text: 'text-amethyst', border: 'border-amethyst/40', bg: 'bg-amethyst/10', hex: '#a682dc', glyph: '◈' },
  Rogue: { text: 'text-gold-light', border: 'border-gold/40', bg: 'bg-gold/10', hex: '#d6a84f', glyph: '⚔' },
  Feat: { text: 'text-topaz', border: 'border-topaz/40', bg: 'bg-topaz/10', hex: '#e3a640', glyph: '✦' },
  'Wood Elf': { text: 'text-jade', border: 'border-jade/40', bg: 'bg-jade/10', hex: '#4fb39a', glyph: '❦' }
}

export const whenLabels: Record<PowerWhen, string> = {
  action: 'Action',
  bonus: 'Bonus action',
  reaction: 'Reaction',
  free: 'No action'
}

export const costLabels: Record<PowerCost, string> = {
  psi: 'Spends a psi die',
  daily: 'Once per long rest',
  sneak: 'Sneak Attack dice',
  free: 'Free'
}

export const powers: Power[] = [
  // ── Psionic ───────────────────────────────────────────────
  {
    slug: 'psychic-blades',
    name: 'Psychic Blades',
    kind: 'Psionic',
    source: 'Soulknife · Psychic Blades',
    level: 3,
    status: 'ready',
    when: 'action',
    timing: 'Part of the Attack action, or an opportunity attack',
    range: 'Melee, or thrown 60 ft (120 at disadvantage)',
    duration: 'Vanishes after the attack',
    cost: 'At will',
    costKind: 'free',
    role: 'His weapon, made of thought',
    attack: true,
    damage: '1d6 + 4 psychic',
    dice: '1d6+4',
    summary:
      'Whenever he takes the Attack action or makes an opportunity attack, a blade of psychic energy forms in a free hand and he attacks with it. It counts as a simple melee weapon with the Finesse and Thrown (60/120 ft) properties and deals 1d6 psychic plus the ability modifier on a hit. It has the Vex mastery, on top of the two masteries he picked. The blade vanishes the moment it hits or misses and leaves no mark. After attacking with it on his turn, a bonus action makes one more attack with a second blade, melee or thrown, if the other hand is free; its die is a d4.',
    options: [
      { name: 'Blade', cost: 'Attack action', effect: '+6 to hit, 1d6 + 4 psychic. Melee, or thrown 60 ft' },
      { name: 'Second blade', cost: 'Bonus action', effect: '+6 to hit, 1d4 + 4 psychic, after a blade attack on the same turn, with the other hand free' },
      { name: 'Vex', cost: 'On a hit', effect: 'Advantage on his next attack against that creature before the end of his next turn' }
    ],
    grows: 'DEX 20 at level 4: +7 to hit and 1d6 + 5. +8 at 5 and +9 at 9 as proficiency rises. Soul Blades at 9: a missed blade can add a psi die, and a thrown one can carry him with it.',
    notes:
      'Nothing to buy, carry or lose, no ammunition to pick up, and psychic is the damage type least often resisted. Both blades are Finesse, so either can carry Sneak Attack. Vex chains into the second blade: if the first hits without Sneak Attack, the second has advantage and gets it. The second blade needs the other hand empty, so the lantern or the crowbar goes back on the belt before a fight.'
  },
  {
    slug: 'psi-bolstered-knack',
    name: 'Psi-Bolstered Knack',
    kind: 'Psionic',
    source: 'Soulknife · Psionic Power',
    level: 3,
    status: 'ready',
    when: 'free',
    timing: 'When a check he is proficient in fails',
    range: 'Self',
    cost: 'One psi die, only if it works',
    costKind: 'psi',
    role: 'Turns a failed lock, trap or climb into a success',
    dice: '1d6',
    summary:
      'When he fails an ability check using a skill or tool he is proficient in, he can roll a Psionic Energy Die and add it to the check, which may turn the failure into a success. The die is spent only if the check then succeeds.',
    grows: 'A d6 at level 3, a d8 from 5, a d10 from 11. From 7, Reliable Talent already makes every proficient roll at least a 10, so the die covers the last few points.',
    notes:
      'Free to try: a die that doesn’t save the check comes back. Thieves’ Tools, Stealth, Perception, Acrobatics and Investigation all qualify, so it backs up every trap and every lock. It goes on after the result is known, but only on checks: not attacks, not saves.'
  },
  {
    slug: 'psychic-whispers',
    name: 'Psychic Whispers',
    kind: 'Psionic',
    source: 'Soulknife · Psionic Power',
    level: 3,
    status: 'ready',
    when: 'action',
    timing: 'Magic action',
    range: 'Up to 2 creatures he can see (his proficiency bonus)',
    duration: 'Hours equal to the die roll',
    cost: 'One psi die; the first use after a long rest is free',
    costKind: 'psi',
    role: 'A silent link to the party',
    dice: '1d6',
    summary:
      'He chooses up to his proficiency bonus of creatures he can see and rolls a Psionic Energy Die. For that many hours, each chosen creature can speak telepathically with him and he with it, while the two are within a mile of each other. No shared language is needed, but a creature that knows no language can’t use it, and any of them can end its own link at any time. The first use after each long rest costs no die.',
    grows: 'Three creatures from level 5 and four from 9, enough for the whole party. The links last longer as the die grows.',
    notes:
      'Cast it at the dungeon door, on the free use. The link runs through him: each ally talks to the rogue, not to each other, so the rogue relays. Scouting ahead, he can report what is round the corner without a sound. At level 3 it covers two of the other three, so it goes to the two who most need to hear.'
  },

  // ── Rogue ─────────────────────────────────────────────────
  {
    slug: 'sneak-attack',
    name: 'Sneak Attack',
    kind: 'Rogue',
    source: 'Rogue · Sneak Attack',
    level: 1,
    status: 'ready',
    when: 'free',
    timing: 'Once per turn, on a hit',
    range: 'A Finesse or ranged weapon',
    cost: 'Once per turn',
    costKind: 'free',
    role: 'Where the damage comes from',
    damage: '2d6, the weapon’s type',
    dice: '2d6',
    summary:
      'Once per turn, when he hits a creature with an attack roll using a Finesse or ranged weapon, he deals extra damage if he has advantage on the roll. He doesn’t need advantage if an ally of his is within 5 ft of the target, that ally isn’t incapacitated, and he doesn’t have disadvantage. The extra damage is the weapon’s type: psychic from a blade.',
    grows: '2d6 at level 3, 3d6 at 5, 4d6 at 7, 5d6 at 9 and 6d6 at 11. From 5, Cunning Strike can trade some of the dice for an effect.',
    notes:
      'Once per turn, not per round: an opportunity attack on an enemy’s turn can deal it again. Ways to get advantage: Steady Aim, hiding first (an Invisible attacker has advantage), Vex from a blade that hit, or a friend’s Help. Without advantage, a friend standing next to the target is enough.'
  },
  {
    slug: 'cunning-action',
    name: 'Cunning Action',
    kind: 'Rogue',
    source: 'Rogue · Cunning Action',
    level: 2,
    status: 'ready',
    when: 'bonus',
    timing: 'Bonus action',
    cost: 'Every turn',
    costKind: 'free',
    role: 'Dash, Disengage or Hide every turn',
    summary: 'On each of his turns, a bonus action takes the Dash, Disengage or Hide action.',
    options: [
      { name: 'Dash', effect: 'Extra movement equal to his speed: 35 ft more, 45 with Longstrider' },
      { name: 'Disengage', effect: 'His movement doesn’t provoke opportunity attacks for the rest of the turn' },
      {
        name: 'Hide',
        effect:
          'A DC 15 Stealth check while heavily obscured or behind three-quarters or total cover, and out of every enemy’s line of sight. On a success he is Invisible while hidden, and the check’s total is the DC to find him with Perception. It ends when he makes a sound louder than a whisper, an enemy finds him, he makes an attack roll, or he casts a spell with a verbal component.'
      }
    ],
    notes:
      'It shares the bonus action with the second blade and Steady Aim, so each turn is one of the three. Hide pays twice: the next attack is made while Invisible, so it has advantage and Sneak Attack applies, and an Invisible creature has advantage on initiative. Stealth is +8, with advantage when the Cloak of Elvenkind’s hood is up.'
  },
  {
    slug: 'steady-aim',
    name: 'Steady Aim',
    kind: 'Rogue',
    source: 'Rogue · Steady Aim',
    level: 3,
    status: 'ready',
    when: 'bonus',
    timing: 'Bonus action, if he hasn’t moved this turn',
    cost: 'Every turn',
    costKind: 'free',
    role: 'Advantage without help, for a Sneak Attack',
    summary: 'As a bonus action, he gives himself advantage on his next attack roll this turn. He can do it only if he hasn’t moved this turn, and afterwards his speed is 0 until the end of the turn.',
    notes:
      'Advantage from a perch, so Sneak Attack is certain without a friend next to the target: throw a blade from 60 ft and stay put. It costs the second blade. Useless after a step, so the choice comes before moving.'
  },

  // ── Feat ──────────────────────────────────────────────────
  {
    slug: 'initiative-swap',
    name: 'Initiative Swap',
    kind: 'Feat',
    source: 'Alert · Origin feat from the Criminal',
    level: 1,
    status: 'ready',
    when: 'free',
    timing: 'Right after rolling initiative',
    cost: 'Every combat',
    costKind: 'free',
    role: 'Hands his high initiative to a friend',
    summary:
      'Immediately after rolling initiative, he can swap his initiative with one willing ally in the same combat. Neither of them can be incapacitated. Alert also adds his proficiency bonus to initiative, for +6.',
    notes:
      'He usually rolls high. When it matters more that someone else goes first (the controller with a spell that ends the fight, the healer next to a friend at 0 HP), he trades. Taking a low roll costs a scout little if he was hidden anyway.'
  },

  // ── Wood Elf ──────────────────────────────────────────────
  {
    slug: 'druidcraft',
    name: 'Druidcraft',
    kind: 'Wood Elf',
    source: 'Wood Elf · Elven Lineage',
    level: 1,
    status: 'ready',
    when: 'action',
    timing: 'Action',
    range: '30 ft',
    duration: 'Instantaneous',
    cost: 'At will',
    costKind: 'free',
    spell: { level: 0, school: 'Transmutation', components: 'V, S' },
    role: 'Snuffs a torch from 30 ft',
    summary:
      'Whispering to the spirits of nature, he makes one of these happen within range: a tiny, harmless sign that predicts the weather where he is for the next 24 hours; a flower blooming or a seed pod opening; a harmless sensory effect such as falling leaves, a puff of wind or the faint smell of skunk; or a candle, a torch or a small campfire lighting or going out.',
    notes:
      'Putting out a torch from 30 ft is the dungeon use: darkness that his darkvision sees through and a guard with a torch doesn’t. The Wood Elf spells use Wisdom here (DC 12, attack +4), though Druidcraft needs neither.'
  },
  {
    slug: 'longstrider',
    name: 'Longstrider',
    kind: 'Wood Elf',
    source: 'Wood Elf · Elven Lineage',
    level: 3,
    status: 'ready',
    when: 'action',
    timing: 'Action',
    range: 'Touch',
    duration: '1 hour',
    cost: 'Once per long rest, no slot',
    costKind: 'daily',
    spell: { level: 1, school: 'Transmutation', components: 'V, S, M (a pinch of dirt)' },
    role: '+10 ft of speed for an hour',
    summary: 'He touches a creature, and its speed rises by 10 ft until the spell ends.',
    notes:
      'No concentration, and it lasts an hour. On himself: speed 45, and 90 with Cunning Action’s Dash. Or on the slowest friend before the doors open. A rogue has no spell slots, so it is once per long rest.'
  },

  // ── Later ─────────────────────────────────────────────────
  {
    slug: 'cunning-strike',
    name: 'Cunning Strike',
    kind: 'Rogue',
    source: 'Rogue · Cunning Strike',
    level: 5,
    status: 'future',
    when: 'free',
    timing: 'When he deals Sneak Attack damage',
    cost: 'Sneak Attack dice',
    costKind: 'sneak',
    role: 'Trades damage for a trip, poison or a free retreat',
    save: 'DC 8 + DEX + proficiency: 16 at level 5',
    summary:
      'When he deals Sneak Attack damage, he can give up some of its dice for one effect. The dice are removed before rolling, and the effect happens right away. The save DC is 8 + his Dexterity modifier + his proficiency bonus.',
    options: [
      { name: 'Poison', cost: '1d6', effect: 'The target makes a CON save or is Poisoned for 1 minute, repeating the save at the end of each of its turns. Needs a Poisoner’s Kit on him' },
      { name: 'Trip', cost: '1d6', effect: 'A Large or smaller target makes a DEX save or falls Prone' },
      { name: 'Withdraw', cost: '1d6', effect: 'Right after the attack, he moves up to half his speed without provoking opportunity attacks' }
    ],
    grows: 'Improved Cunning Strike at 11: two effects on one Sneak Attack.',
    notes:
      'Withdraw frees the bonus action: hit, step away, and the second blade or Steady Aim is still there. Trip gives every friend in melee advantage until it stands. Poison needs a Poisoner’s Kit (50 gp), one reason to ask whether the Criminal’s duplicate Thieves’ Tools can become one.'
  },
  {
    slug: 'uncanny-dodge',
    name: 'Uncanny Dodge',
    kind: 'Rogue',
    source: 'Rogue · Uncanny Dodge',
    level: 5,
    status: 'future',
    when: 'reaction',
    timing: 'Reaction, when an attacker he can see hits him',
    cost: 'His reaction',
    costKind: 'free',
    role: 'Halves a hit',
    summary: 'When an attacker he can see hits him with an attack roll, his reaction halves the attack’s damage against him.',
    notes: 'The reaction otherwise goes to an opportunity attack with a blade, which can carry a second Sneak Attack in the round. Halving a big hit is usually worth more on a 43-HP rogue.'
  },
  {
    slug: 'pass-without-trace',
    name: 'Pass without Trace',
    kind: 'Wood Elf',
    source: 'Wood Elf · Elven Lineage',
    level: 5,
    status: 'future',
    when: 'action',
    timing: 'Action',
    range: 'Self, a 30-ft emanation',
    duration: 'Concentration, up to 1 hour',
    cost: 'Once per long rest, no slot',
    costKind: 'daily',
    concentration: true,
    spell: { level: 2, school: 'Abjuration', components: 'V, S, M (ashes from burned mistletoe)' },
    role: 'The whole party sneaks at +10',
    summary: 'A veil of shadows and silence radiates from him. He and each creature he chooses within 30 ft get +10 to Stealth checks and can’t be tracked except by magic. A creature that gets the bonus leaves no tracks.',
    notes: 'The armored friend with disadvantage on Stealth still has a fair chance with +10, and a party that arrives unseen gets the first strike. Concentration, but nothing else he has needs it.'
  },
  {
    slug: 'evasion',
    name: 'Evasion',
    kind: 'Rogue',
    source: 'Rogue · Evasion',
    level: 7,
    status: 'future',
    when: 'free',
    timing: 'On a Dexterity save against damage',
    cost: 'Always on',
    costKind: 'free',
    role: 'Fire, breath and dart traps miss him',
    summary: 'When an effect lets him make a Dexterity save to take only half damage, he takes none on a success and only half on a failure. It doesn’t work while he is incapacitated.',
    notes: 'His Dexterity save is +8 by level 7. Fireballs, breath weapons and the hall full of darts mostly come to nothing.'
  },
  {
    slug: 'reliable-talent',
    name: 'Reliable Talent',
    kind: 'Rogue',
    source: 'Rogue · Reliable Talent',
    level: 7,
    status: 'future',
    when: 'free',
    timing: 'On any check he is proficient in',
    cost: 'Always on',
    costKind: 'free',
    role: 'A DC 15 lock always opens',
    summary: 'Whenever he makes an ability check that uses a skill or tool he is proficient in, a d20 roll of 9 or lower counts as a 10.',
    notes: 'At level 7, Stealth never comes in under 21 and Thieves’ Tools never under 18, so a DC 15 lock or trap always yields. Psi-Bolstered Knack is then only for the hard ones.'
  },
  {
    slug: 'homing-strikes',
    name: 'Homing Strikes',
    kind: 'Psionic',
    source: 'Soulknife · Soul Blades',
    level: 9,
    status: 'future',
    when: 'free',
    timing: 'When a blade attack misses',
    cost: 'One psi die, only if it then hits',
    costKind: 'psi',
    role: 'A missed blade gets a second chance',
    dice: '1d8',
    summary: 'If he makes an attack roll with a Psychic Blade and misses, he can roll a Psionic Energy Die and add it to the roll. If that makes it hit, the die is spent.',
    notes: 'Sneak Attack lands more often, and like the Knack a die that doesn’t save the attack comes back.'
  },
  {
    slug: 'psychic-teleportation',
    name: 'Psychic Teleportation',
    kind: 'Psionic',
    source: 'Soulknife · Soul Blades',
    level: 9,
    status: 'future',
    when: 'bonus',
    timing: 'Bonus action',
    range: '10 × the die roll, in feet',
    cost: 'One psi die',
    costKind: 'psi',
    role: 'Throw a blade and arrive with it',
    dice: '1d8',
    summary: 'He forms a Psychic Blade, spends a Psionic Energy Die and rolls it, and throws the blade at an unoccupied space he can see, up to 10 times the roll in feet away. He teleports to that space, and the blade vanishes.',
    notes: 'Across a chasm, up onto a ledge, past bars he can see through. A d8 averages 45 ft. It takes the bonus action the second blade wants.'
  },
  {
    slug: 'improved-cunning-strike',
    name: 'Improved Cunning Strike',
    kind: 'Rogue',
    source: 'Rogue · Improved Cunning Strike',
    level: 11,
    status: 'future',
    when: 'free',
    timing: 'When he deals Sneak Attack damage',
    cost: 'Sneak Attack dice',
    costKind: 'sneak',
    role: 'Two Cunning Strikes at once',
    summary: 'He can use up to two Cunning Strike effects when he deals Sneak Attack damage, paying the dice for each.',
    notes: 'Trip and Withdraw together: knock it down and walk away free, for 2 of the 6d6.'
  }
]

export const powerBySlug = Object.fromEntries(powers.map(p => [p.slug, p]))
