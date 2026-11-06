// The Undertow's techniques: a monk has no spellbook, so this list takes its
// place. Martial arts and the Focus techniques, the Warrior of the Elements'
// features, the Bugbear's traits and the Tavern Brawler feat, each with the level
// it arrives at (`ready` at level 3, `future` up to 12). Rules text is
// paraphrased from the 2024 Player’s Handbook; the Bugbear's from Monsters of
// the Multiverse. Numbers are level 3's unless a technique arrives later
// (DEX 20 from 4, a d8 Martial Arts die from 5).
//
// nuxt.config.ts imports this file to list the technique pages, so it must not
// import anything at runtime.

import type { School } from '../shared'

export type TechniqueStatus = 'ready' | 'future'
export type TechniqueKind = 'Monk' | 'Elements' | 'Bugbear' | 'Feat'
// What it takes on their turn, for the filters and the session page
export type TechniqueWhen = 'action' | 'bonus' | 'reaction' | 'free'
// What it spends: Focus Points, a use per long rest, or nothing
export type TechniqueCost = 'focus' | 'daily' | 'free'

export interface Technique {
  slug: string
  name: string
  kind: TechniqueKind
  source: string // the feature it comes from
  level: number // the character level it arrives at
  status: TechniqueStatus
  when: TechniqueWhen
  timing: string
  range?: string
  duration?: string
  cost: string
  costKind: TechniqueCost
  spell?: { level: number; school: School; components: string } // Elementalism
  role: string // a few words on what it does for them
  summary: string // the rules, paraphrased
  options?: { name: string; cost?: string; effect: string }[]
  grows?: string // how it changes on the way to level 12
  notes?: string // how it fits the build
  attack?: boolean // an Unarmed Strike attack roll
  save?: string
  damage?: string
  dice?: string // the roll the pages offer
}

export const statusLabels: Record<TechniqueStatus, string> = {
  ready: 'Ready',
  future: 'Later'
}

export const statusTone: Record<TechniqueStatus, string> = {
  ready: 'border-gold/50 bg-gold/10 text-gold-light',
  future: 'border-topaz/40 bg-topaz/10 text-topaz'
}

// Full class strings so Tailwind can see them
export const kindTone: Record<TechniqueKind, { text: string; border: string; bg: string; hex: string; glyph: string }> = {
  Monk: { text: 'text-gold-light', border: 'border-gold/40', bg: 'bg-gold/10', hex: '#d6a84f', glyph: '◎' },
  Elements: { text: 'text-jade', border: 'border-jade/40', bg: 'bg-jade/10', hex: '#4fb39a', glyph: '≋' },
  Bugbear: { text: 'text-verdigris', border: 'border-verdigris/40', bg: 'bg-verdigris/10', hex: '#7fb07a', glyph: '❖' },
  Feat: { text: 'text-topaz', border: 'border-topaz/40', bg: 'bg-topaz/10', hex: '#e3a640', glyph: '✦' }
}

export const whenLabels: Record<TechniqueWhen, string> = {
  action: 'Action',
  bonus: 'Bonus action',
  reaction: 'Reaction',
  free: 'No action'
}

export const costLabels: Record<TechniqueCost, string> = {
  focus: 'Spends Focus',
  daily: 'Once per long rest',
  free: 'Free'
}

export const techniques: Technique[] = [
  // ── Monk ──────────────────────────────────────────────────
  {
    slug: 'martial-arts',
    name: 'Martial Arts',
    kind: 'Monk',
    source: 'Monk · Martial Arts',
    level: 1,
    status: 'ready',
    when: 'action',
    timing: 'The Attack action, or a bonus action for one more strike',
    range: 'Reach 10 ft on their turn (Long-Limbed), 20 ft attuned',
    cost: 'At will',
    costKind: 'free',
    role: 'Fists and feet, with DEX and a d6',
    attack: true,
    damage: '1d6 + 4 bludgeoning, or an element while attuned',
    dice: '1d6+4',
    summary:
      'Unarmed and wearing no armor or shield, a monk fights with three benefits. Martial Arts Die: an Unarmed Strike or a monk weapon (simple weapons, and martial weapons with the Light property) can roll a d6 in place of its normal damage. Dexterous Attacks: DEX can replace STR for their attack and damage rolls, and for the DC of the Grapple and Shove options of an Unarmed Strike. Bonus Unarmed Strike: a bonus action makes one more Unarmed Strike.',
    options: [
      { name: 'Strike', cost: 'Attack action', effect: '+6 to hit, 1d6 + 4 bludgeoning' },
      { name: 'Bonus strike', cost: 'Bonus action', effect: 'One more Unarmed Strike, no Focus Point' },
      { name: 'Grapple', cost: 'In place of a strike', effect: 'STR or DEX save (the target’s pick) against DC 14, or Grappled. One size larger at most, a hand free' },
      { name: 'Shove', cost: 'In place of a strike', effect: 'STR or DEX save against DC 14, or pushed 5 ft or knocked Prone' }
    ],
    grows: 'DEX 20 at level 4: +7 to hit and 1d6 + 5. A d8 at 5, with Extra Attack; a d10 at 11. +8 at 5 and +9 at 9 as proficiency rises.',
    notes:
      'Every attack the build cares about is an Unarmed Strike: Elemental Attunement’s reach and elements, Tavern Brawler’s rerolls and push all need one. Grapple and Shove are Unarmed Strikes too, so a Shove can knock something Prone for the party’s melee, whose attacks from 5 ft then have advantage. Their own strikes from further away would have disadvantage against it, so it is for others to follow up. Whether the reach applies to Grapple and Shove is a DM question.'
  },
  {
    slug: 'flurry-of-blows',
    name: 'Flurry of Blows',
    kind: 'Monk',
    source: 'Monk · Monk’s Focus',
    level: 2,
    status: 'ready',
    when: 'bonus',
    timing: 'Bonus action',
    range: 'As the Unarmed Strike',
    cost: '1 Focus Point',
    costKind: 'focus',
    role: 'Two strikes for the bonus action',
    attack: true,
    dice: '1d6+4',
    damage: '1d6 + 4 each',
    summary: 'They spend 1 Focus Point to make two Unarmed Strikes as a bonus action.',
    grows: 'Three strikes from level 10 (Heightened Focus).',
    notes:
      'Three strikes on the turn instead of two, each with the element, the reach and a chance at Elemental Strikes’ push or pull. On the first round, every one of them can carry Surprise Attack if the DM reads it as every hit. With three Focus Points at level 3, it is one Flurry and the attunement per fight, or two Flurries with Uncanny Metabolism’s refill.'
  },
  {
    slug: 'patient-defense',
    name: 'Patient Defense',
    kind: 'Monk',
    source: 'Monk · Monk’s Focus',
    level: 2,
    status: 'ready',
    when: 'bonus',
    timing: 'Bonus action',
    range: 'Self',
    duration: 'Dodge lasts until the start of their next turn',
    cost: 'Free, or 1 Focus Point for the Dodge',
    costKind: 'focus',
    role: 'Walk away, or turtle up',
    summary: 'They take the Disengage action as a bonus action. Or they spend 1 Focus Point to take both Disengage and Dodge as a bonus action: attacks against them have disadvantage and they have advantage on DEX saves, until their next turn.',
    options: [
      { name: 'Disengage', cost: 'Free', effect: 'No opportunity attacks this turn' },
      { name: 'Disengage + Dodge', cost: '1 Focus Point', effect: 'Attacks against them at disadvantage, DEX saves with advantage' }
    ],
    grows: 'From level 10, the Focus version also gives temporary hit points: two rolls of the Martial Arts die.',
    notes: 'With 20 ft of reach they rarely need it: an enemy has to walk through the fists to get close. When something does get next to them, the free Disengage and 40 ft of speed put the fight back at reach.'
  },
  {
    slug: 'step-of-the-wind',
    name: 'Step of the Wind',
    kind: 'Monk',
    source: 'Monk · Monk’s Focus',
    level: 2,
    status: 'ready',
    when: 'bonus',
    timing: 'Bonus action',
    range: 'Self',
    cost: 'Free, or 1 Focus Point for Disengage too',
    costKind: 'focus',
    role: '80 ft of movement, or a long jump',
    summary: 'They take the Dash action as a bonus action. Or they spend 1 Focus Point to take both Disengage and Dash as a bonus action, and their jump distance is doubled for the turn.',
    options: [
      { name: 'Dash', cost: 'Free', effect: '40 ft more this turn' },
      { name: 'Disengage + Dash', cost: '1 Focus Point', effect: 'Out of reach with no opportunity attacks, and jumps doubled: a 24-ft running long jump with STR 12' }
    ],
    grows: 'From level 10, a willing Large or smaller creature within 5 ft can come along for the turn.',
    notes: 'The free Dash makes them the fastest in the party at 80 ft a turn: first to the lever, the fallen friend or the archer on the ledge. The doubled jump crosses pits.'
  },
  {
    slug: 'uncanny-metabolism',
    name: 'Uncanny Metabolism',
    kind: 'Monk',
    source: 'Monk · Uncanny Metabolism',
    level: 2,
    status: 'ready',
    when: 'free',
    timing: 'On rolling initiative',
    range: 'Self',
    cost: 'Once per long rest',
    costKind: 'daily',
    role: 'A full Focus refill and a heal',
    dice: '1d6+3',
    summary: 'When they roll initiative, they can regain every spent Focus Point. If they do, they roll the Martial Arts die and regain that many hit points plus their monk level.',
    grows: 'The heal grows with the Martial Arts die and the monk level: 1d8 + 5 at level 5.',
    notes: 'The reason to attune before a fight: spend a Focus Point on Elemental Attunement at the dungeon door, and the refill on initiative gives it back. Save it for the fight that matters, or for the second fight of the day when the points are gone.'
  },
  {
    slug: 'deflect-attacks',
    name: 'Deflect Attacks',
    kind: 'Monk',
    source: 'Monk · Deflect Attacks',
    level: 3,
    status: 'ready',
    when: 'reaction',
    timing: 'Reaction, when an attack hits them',
    range: 'Self; the redirect 5 ft (melee) or 60 ft (ranged)',
    cost: 'Free; 1 Focus Point to redirect',
    costKind: 'free',
    role: '12 damage off a hit, and sometimes back',
    dice: '1d10+7',
    save: 'DEX DC 13 against the redirect',
    summary:
      'When an attack roll hits them and its damage includes bludgeoning, piercing or slashing, they take a reaction to reduce the attack’s total damage by 1d10 + their DEX modifier + their monk level. If that brings it to 0, they can spend 1 Focus Point to redirect the force: a creature they can see within 5 ft (for a melee attack) or within 60 ft and not behind total cover (for a ranged one) makes a DEX save or takes two rolls of the Martial Arts die + DEX, of the attack’s damage type.',
    options: [
      { name: 'Reduce', cost: 'Reaction', effect: '1d10 + 7 less damage from the hit' },
      { name: 'Redirect', cost: '1 Focus Point', effect: 'After reducing it to 0: DEX save DC 13 or 2d6 + 4' }
    ],
    grows: '1d10 + 8 at level 4 with DEX 20, then +1 a level. From 13, any damage type.',
    notes: 'With 24 hit points it is the thing that keeps them standing: an orc’s greataxe at 1d12 + 3 is often cancelled entirely. The reaction also takes their opportunity attack, so they choose between the two.'
  },

  // ── Warrior of the Elements ───────────────────────────────
  {
    slug: 'elemental-attunement',
    name: 'Elemental Attunement',
    kind: 'Elements',
    source: 'Warrior of the Elements · Elemental Attunement',
    level: 3,
    status: 'ready',
    when: 'free',
    timing: 'At the start of their turn',
    range: 'Self',
    duration: '10 minutes, or until Incapacitated',
    cost: '1 Focus Point',
    costKind: 'focus',
    role: 'Fists that reach 20 ft and push or pull 10',
    attack: true,
    damage: '1d6 + 4 acid, cold, fire, lightning or thunder',
    dice: '1d6+4',
    save: 'STR DC 13 or moved 10 ft',
    summary:
      'At the start of their turn, they can spend 1 Focus Point to fill themselves with elemental energy for 10 minutes, or until they have the Incapacitated condition. While it lasts, their Unarmed Strikes reach 10 ft further. Elemental Strikes: when an Unarmed Strike hits, it can deal acid, cold, fire, lightning or thunder damage instead of its normal type, their choice. When it does, they can also force the target to make a STR save; on a failure, they move it up to 10 ft toward or away from them.',
    options: [
      { name: 'Reach', cost: 'While attuned', effect: 'Unarmed Strikes reach 15 ft, and 20 ft on their own turn with Long-Limbed' },
      { name: 'Elemental Strikes', cost: 'On a hit', effect: 'Acid, cold, fire, lightning or thunder instead of bludgeoning, picked per hit' },
      { name: 'Push or pull', cost: 'With an element', effect: 'STR save DC 13, or moved up to 10 ft toward or away from them' }
    ],
    grows: 'The DC rises with WIS and proficiency: 14 at level 5. Elemental Burst arrives at 6, a fly and swim speed while attuned at 11 (Stride of the Elements).',
    notes:
      'The build. Bugbear arms add 5 ft to every melee attack on their own turn, so they punch from 20 ft: four squares, past the front line, across a pit, up to a ledge. Enemies have to walk 15 ft through their reach to hit back, and an opportunity attack waits for them at 15 ft. Each hit picks the element the target doesn’t resist and can drag it 10 ft: into the pit, off the ledge, into the party’s reach, or back out of the doorway. Ten minutes covers a fight and often the next room.'
  },
  {
    slug: 'elementalism',
    name: 'Elementalism',
    kind: 'Elements',
    source: 'Warrior of the Elements · Manipulate Elements',
    level: 3,
    status: 'ready',
    when: 'action',
    timing: 'Action (Magic)',
    range: '30 ft',
    duration: 'Instantaneous; a sculpted shape lasts 1 hour',
    cost: 'At will',
    costKind: 'free',
    spell: { level: 0, school: 'Transmutation', components: 'V, S' },
    role: 'Small tricks of air, earth, fire and water',
    summary:
      'They always know this cantrip, and Wisdom is its casting ability. One effect within range. Beckon Air: a breeze in a 5-ft cube that ripples cloth, stirs dust and closes open doors and shutters that nobody is holding. Beckon Earth: a thin layer of dust or sand over a 5-ft square, or one word in their handwriting in dirt or sand. Beckon Fire: harmless embers and coloured, scented smoke in a 5-ft cube; the embers light candles, torches and lamps there. Beckon Water: a cool mist over a 5-ft cube, or a cup of clean water that evaporates after a minute. Sculpt Element: dirt, sand, fire, smoke, mist or water in a 1-ft cube takes a crude shape for an hour.',
    notes: 'Dungeon use: Beckon Earth dusts a floor to show footprints or a pressure plate, Beckon Air tests for a draught behind a wall, Beckon Fire lights the torches from 30 ft, and Beckon Water is a drink when the waterskins run dry. A sculpted smoke figure makes a fine distraction.'
  },

  // ── Bugbear ───────────────────────────────────────────────
  {
    slug: 'long-limbed',
    name: 'Long-Limbed',
    kind: 'Bugbear',
    source: 'Bugbear · Long-Limbed',
    level: 1,
    status: 'ready',
    when: 'free',
    timing: 'Every melee attack on their own turn',
    range: '+5 ft reach',
    cost: 'Always on',
    costKind: 'free',
    role: 'The other 5 ft of the 20',
    summary: 'When they make a melee attack on their turn, their reach for it is 5 ft greater than normal.',
    notes: 'Only on their own turn: opportunity attacks keep the normal reach, which is 15 ft while attuned. Unattuned, it still puts a fist or a dagger 10 ft out.'
  },
  {
    slug: 'surprise-attack',
    name: 'Surprise Attack',
    kind: 'Bugbear',
    source: 'Bugbear · Surprise Attack',
    level: 1,
    status: 'ready',
    when: 'free',
    timing: 'On a hit against a creature that hasn’t acted yet',
    range: 'Any attack roll',
    cost: 'Always on',
    costKind: 'free',
    role: '2d6 more in the first round',
    dice: '2d6',
    damage: '2d6, the attack’s damage type',
    summary: 'If they hit a creature with an attack roll, the creature takes an extra 2d6 damage if it hasn’t taken a turn yet in the current combat.',
    notes:
      'Going first matters: a 2024 monk with DEX 18 has initiative +4, and anything that acts before them is out of reach of it. The text sets no limit per turn, so three hits on the first round (strike and Flurry) could add 6d6. Every hit, once a turn or once a fight is a DM question; the session page offers it on every hit until told otherwise.'
  },

  // ── Feat ──────────────────────────────────────────────────
  {
    slug: 'tavern-brawler',
    name: 'Tavern Brawler',
    kind: 'Feat',
    source: 'Origin feat · Sailor',
    level: 1,
    status: 'ready',
    when: 'free',
    timing: 'On an Unarmed Strike’s damage, and on a hit with the Attack action',
    range: 'Self; the push 5 ft',
    cost: 'Always on; the push once per turn',
    costKind: 'free',
    role: 'Better fists, and a shove with every turn’s first hit',
    summary:
      'Enhanced Unarmed Strike: an Unarmed Strike that hits can deal 1d4 + STR bludgeoning instead of its normal damage. Damage Rerolls: when they roll a damage die for an Unarmed Strike, they can reroll it if it rolls a 1, and must use the new roll. Improvised Weaponry: proficiency with improvised weapons. Push: when they hit a creature with an Unarmed Strike as part of the Attack action on their turn, they can deal damage and also push it 5 ft away. Once per turn.',
    options: [
      { name: 'Rerolls', cost: 'Every strike', effect: 'A Martial Arts die that shows 1 is rolled again: the d6 averages 4.1 instead of 3.5' },
      { name: 'Push', cost: 'Once per turn', effect: '5 ft away on an Attack-action hit, no save' },
      { name: 'Improvised', cost: 'Always', effect: 'Proficient with chair legs, bottles and torches' }
    ],
    notes:
      'The Sailor’s feat, and the best Origin feat a monk can get from a background that gives DEX and WIS. The push has no save and stacks with Elemental Strikes’ 10 ft: 15 ft from one hit when the STR save fails. Not on Flurry of Blows, which is a bonus action, not the Attack action. The 1d4 + STR is worse than the Martial Arts die and never used.'
  },

  // ── Later ─────────────────────────────────────────────────
  {
    slug: 'slow-fall',
    name: 'Slow Fall',
    kind: 'Monk',
    source: 'Monk · Slow Fall',
    level: 4,
    status: 'future',
    when: 'reaction',
    timing: 'Reaction, when they fall',
    range: 'Self',
    cost: 'Free',
    costKind: 'free',
    role: 'Falls stop hurting',
    summary: 'When they fall, they can take a reaction to reduce the falling damage by five times their monk level.',
    notes: '20 points off at level 4, enough for a 40-ft drop. In a dungeon of pits and collapsing floors, the one to go down the hole first.'
  },
  {
    slug: 'extra-attack',
    name: 'Extra Attack',
    kind: 'Monk',
    source: 'Monk · Extra Attack',
    level: 5,
    status: 'future',
    when: 'action',
    timing: 'The Attack action',
    cost: 'Free',
    costKind: 'free',
    role: 'Two strikes with the action',
    attack: true,
    dice: '1d8+5',
    damage: '1d8 + 5 each, at level 5',
    summary: 'They attack twice instead of once whenever they take the Attack action on their turn.',
    notes: 'With the bonus strike, three Unarmed Strikes a turn for free and four with Flurry: 1d8 + 5 each, every one of them with an element, the reach and a push or pull.'
  },
  {
    slug: 'stunning-strike',
    name: 'Stunning Strike',
    kind: 'Monk',
    source: 'Monk · Stunning Strike',
    level: 5,
    status: 'future',
    when: 'free',
    timing: 'On a hit with an Unarmed Strike or monk weapon, once per turn',
    range: 'As the strike',
    duration: 'Until the start of their next turn',
    cost: '1 Focus Point',
    costKind: 'focus',
    role: 'Stun the big one from 20 ft away',
    save: 'CON DC 14 at level 5',
    summary:
      'Once per turn, when they hit a creature with a monk weapon or an Unarmed Strike, they can spend 1 Focus Point. The target makes a CON save; on a failure it is Stunned until the start of their next turn. On a success its speed is halved until then, and the next attack roll against it has advantage.',
    notes: 'Even a success helps the party. From 20 ft away, the Stunned creature can’t reach them anyway; the rest of the party gets advantage on it. Focus is the limit: five points at level 5 are shared with Flurry, the attunement and the redirect.'
  },
  {
    slug: 'empowered-strikes',
    name: 'Empowered Strikes',
    kind: 'Monk',
    source: 'Monk · Empowered Strikes',
    level: 6,
    status: 'future',
    when: 'free',
    timing: 'On an Unarmed Strike’s damage',
    cost: 'Free',
    costKind: 'free',
    role: 'Force damage, without attuning',
    summary: 'Whenever they deal damage with an Unarmed Strike, it can deal force damage or its normal type.',
    notes: 'Force is rarely resisted. Attuned, the five elements plus force cover almost everything; unattuned, it saves a Focus Point against things that resist bludgeoning.'
  },
  {
    slug: 'elemental-burst',
    name: 'Elemental Burst',
    kind: 'Elements',
    source: 'Warrior of the Elements · Elemental Burst',
    level: 6,
    status: 'future',
    when: 'action',
    timing: 'Action (Magic)',
    range: '20-ft-radius sphere within 120 ft',
    cost: '2 Focus Points',
    costKind: 'focus',
    role: 'A fireball of their own',
    dice: '3d8',
    damage: '3d8 of one element, half on a save',
    save: 'DEX DC 14',
    summary: 'As a Magic action, they spend 2 Focus Points to burst elemental energy in a 20-ft-radius sphere centred on a point within 120 ft. They pick acid, cold, fire, lightning or thunder; each creature in it makes a DEX save, taking three rolls of the Martial Arts die on a failure and half on a success.',
    grows: '3d10 from level 11.',
    notes: 'For a room of goblins or a swarm, when single strikes waste the turn. It costs the action, so no Extra Attack that turn, and two Focus Points.'
  },
  {
    slug: 'evasion',
    name: 'Evasion',
    kind: 'Monk',
    source: 'Monk · Evasion',
    level: 7,
    status: 'future',
    when: 'free',
    timing: 'On a DEX save for half damage',
    cost: 'Always on',
    costKind: 'free',
    role: 'Fireballs and traps do nothing',
    summary: 'When they are subjected to an effect that allows a DEX save for half damage, they take no damage on a success and half on a failure. Not while Incapacitated.',
    notes: 'DEX saves at +7 or better: most breath weapons, fireballs and dart traps will do nothing at all.'
  },
  {
    slug: 'acrobatic-movement',
    name: 'Acrobatic Movement',
    kind: 'Monk',
    source: 'Monk · Acrobatic Movement',
    level: 9,
    status: 'future',
    when: 'free',
    timing: 'Their movement, on their turn',
    cost: 'Always on',
    costKind: 'free',
    role: 'Run up walls and across water',
    summary: 'Without armor or a shield, they can move along vertical surfaces and across liquids on their turn without falling during the movement.',
    notes: 'Up a shaft, across an underground lake, along the wall past a trapped floor. They must end the turn somewhere that holds them.'
  },
  {
    slug: 'heightened-focus',
    name: 'Heightened Focus',
    kind: 'Monk',
    source: 'Monk · Heightened Focus',
    level: 10,
    status: 'future',
    when: 'bonus',
    timing: 'With Flurry, Patient Defense or Step of the Wind',
    cost: 'As the technique',
    costKind: 'focus',
    role: 'The three Focus techniques get better',
    summary: 'Flurry of Blows makes three Unarmed Strikes instead of two. Patient Defense with a Focus Point also gives temporary hit points equal to two rolls of the Martial Arts die. Step of the Wind with a Focus Point can bring a willing Large or smaller creature within 5 ft along until the end of the turn.',
    notes: 'Five strikes a turn with Flurry. Step of the Wind carrying a friend out of a closing trap or a monster’s reach.'
  },
  {
    slug: 'self-restoration',
    name: 'Self-Restoration',
    kind: 'Monk',
    source: 'Monk · Self-Restoration',
    level: 10,
    status: 'future',
    when: 'free',
    timing: 'At the end of each of their turns',
    cost: 'Always on',
    costKind: 'free',
    role: 'Shrug off charms, fear and poison',
    summary: 'At the end of each of their turns, they can remove one of the Charmed, Frightened or Poisoned conditions from themselves. Going without food and drink no longer gives them Exhaustion.',
    notes: 'With Fey Ancestry already guarding against charms, little holds them for long.'
  },
  {
    slug: 'stride-of-the-elements',
    name: 'Stride of the Elements',
    kind: 'Elements',
    source: 'Warrior of the Elements · Stride of the Elements',
    level: 11,
    status: 'future',
    when: 'free',
    timing: 'While Elemental Attunement is active',
    cost: 'Always on while attuned',
    costKind: 'free',
    role: 'Fly and swim at full speed',
    summary: 'While Elemental Attunement is active, they also have a fly speed and a swim speed equal to their speed.',
    notes: 'Flight at 60 ft with 20 ft of reach: nothing on the ground or in the air is out of their range.'
  }
]

export const techniqueBySlug = Object.fromEntries(techniques.map(t => [t.slug, t]))
