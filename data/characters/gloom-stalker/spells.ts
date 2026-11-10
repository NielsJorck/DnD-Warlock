// The Lightless Hunter's spells. Rules text is paraphrased from the 2024 Player's
// Handbook. A ranger prepares a set number of spells from the ranger list and can
// swap one after each long rest; the `prepared` ones here are the starting four.
// The Wood Elf's lineage spells (`known`) come on top and are cast with Wisdom.
// At level 3 there are three 1st-level slots; 2nd-level spells open at level 5.
// Kept apart from the 2014 spell text Lucan and the Storm-Hammer use.

import type { School } from '../shared'

export type SpellStatus = 'known' | 'always' | 'prepared' | 'candidate' | 'future'
export type SpellAccess = 'Ranger' | 'Favored Enemy' | 'Gloom Stalker' | 'Wood Elf'

export interface Spell {
  slug: string
  name: string
  level: number // 0 for a cantrip
  school: School
  castingTime: string
  range: string
  components: string
  material?: string
  duration: string
  concentration: boolean
  ritual: boolean
  source: string // XPHB: the 2024 Player's Handbook
  access: SpellAccess
  status: SpellStatus
  role: string // a few words on what it does for him
  summary: string // the spell, paraphrased
  higher?: string // what a higher slot adds
  notes?: string // how it fits the build
  damage?: string
  heal?: boolean // the dice are healing, not damage
  save?: string
  attack?: boolean
  opensAt?: number // character level it becomes castable, for future spells
  // Dice the session page rolls, by slot level; healing includes his +3
  dice?: Partial<Record<number, string>>
}

export const statusLabels: Record<SpellStatus, string> = {
  known: 'Wood Elf',
  always: 'Always prepared',
  prepared: 'Prepared',
  candidate: 'Candidate',
  future: 'Future'
}

export const statusTone: Record<SpellStatus, string> = {
  known: 'border-jade/50 bg-jade/10 text-jade',
  always: 'border-sapphire/50 bg-sapphire/10 text-sapphire',
  prepared: 'border-gold/40 text-gold-light',
  candidate: 'border-quartz/40 bg-quartz/10 text-quartz',
  future: 'border-topaz/40 bg-topaz/10 text-topaz'
}

export const accessTone: Record<SpellAccess, string> = {
  Ranger: 'text-gold-light',
  'Favored Enemy': 'text-gold-light',
  'Gloom Stalker': 'text-sapphire',
  'Wood Elf': 'text-jade'
}

// Ready to cast today: the Wood Elf's two, the always-prepared ones and the prepared four
export const ready = (s: Spell) => s.status === 'known' || s.status === 'always' || s.status === 'prepared'

// No spoken component: under the 2024 Hide action, casting a spell with a verbal
// component ends the Invisible condition from hiding
export const silent = (s: Spell) => !/\bV\b/.test(s.components)

export const spells: Spell[] = [
  // ── Wood Elf (Elven Lineage), cast with Wisdom ───────────
  {
    slug: 'druidcraft',
    name: 'Druidcraft',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '30 ft',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Wood Elf',
    status: 'known',
    role: 'Snuff out a torch from 30 ft',
    summary:
      'Whispering to the spirits of nature, you make one of these happen within range. Weather Sensor: a tiny, harmless effect that predicts the weather where you are for the next 24 hours. Bloom: a flower blossoms, a seed pod opens or a leaf bud bursts. Sensory Effect: a harmless sensory effect, such as falling leaves, a gentle breeze, an animal’s call or a faint odor, filling a 5-ft cube. Fire Play: you light or snuff out a candle, a torch or a small campfire.',
    notes:
      'Fire Play is the point for a Gloom Stalker: the brazier in a guard room or the torch on the wall goes out from 30 ft, and the room is dark again, which is where Umbral Sight works. Whether a torch someone is holding counts is a question for the DM. It has a spoken part, so casting it ends a hide: put the light out first, then hide. Sensory Effect makes a noise down the wrong corridor.'
  },
  {
    slug: 'longstrider',
    name: 'Longstrider',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S, M',
    material: 'a pinch of dirt',
    duration: '1 hour',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Wood Elf',
    status: 'known',
    role: '+10 ft of speed for an hour',
    summary: 'The creature you touch has its speed increased by 10 ft until the spell ends.',
    higher: 'One more creature for each slot level above 1st.',
    notes:
      'Elven Lineage: always prepared from level 3, once a day without a slot, and with ranger slots after that. No concentration, so it sits under Hunter’s Mark, and an hour covers a dungeon level: speed 45, and 55 on the first turn of a fight with Ambusher’s Leap. Or on the party’s slowest member, so the whole group can keep up with a retreat.'
  },

  // ── Always prepared ──────────────────────────────────────────
  {
    slug: 'hunters-mark',
    name: 'Hunter’s Mark',
    level: 1,
    school: 'Divination',
    castingTime: '1 bonus action',
    range: '90 ft',
    components: 'V',
    duration: 'Concentration, up to 1 hour',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Favored Enemy',
    status: 'always',
    role: 'His quarry: 1d6 force on every hit',
    damage: '1d6 force',
    dice: { 1: '1d6' },
    summary:
      'Mark a creature you can see within range as your quarry. Until the spell ends, your attack hits against it deal 1d6 force damage more, and you have advantage on Wisdom (Perception or Survival) checks to find it. If it drops to 0 hit points first, a bonus action moves the mark to another creature you can see within range.',
    higher: 'A 3rd- or 4th-level slot lets concentration last up to 8 hours, a 5th-level one up to 24 hours. The damage doesn’t grow.',
    notes:
      'Favored Enemy casts it twice a day without a slot (three times from level 5, four from 9). One mark lasts the whole fight and moves from body to body, so it is usually one cast per fight. Force damage is almost never resisted. It is his concentration spell: everything else he could concentrate on competes with it.'
  },
  {
    slug: 'disguise-self',
    name: 'Disguise Self',
    level: 1,
    school: 'Illusion',
    castingTime: '1 action',
    range: 'Self',
    components: 'V, S',
    duration: '1 hour',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Gloom Stalker',
    status: 'always',
    role: 'Look like someone else for an hour',
    summary:
      'You, your clothes, armor, weapons and gear look different until the spell ends: up to a foot taller or shorter, heavier or thinner, but the same basic shape. Touch gives it away, and a creature that takes the Study action to examine you can see through it with an Intelligence (Investigation) check against your spell DC.',
    notes:
      'The Gloom Stalker’s free spell. Little use in a dungeon fight, more when the party needs to walk past a gate or into a camp of the mountain tribes, which the campaign says will be rare.'
  },

  // ── Prepared: the starting four ──────────────────────────────
  {
    slug: 'goodberry',
    name: 'Goodberry',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: 'Self',
    components: 'V, S, M',
    material: 'a sprig of mistletoe',
    duration: '24 hours',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'prepared',
    role: 'Ten berries: a hit point and a day’s food each',
    summary: 'Ten magic berries appear in your hand for the duration. A creature can eat one as a bonus action: it regains 1 hit point and is fed for the day.',
    notes:
      'His one healing spell, in place of Cure Wounds. Cast after a long rest, one slot lasts the whole day: ten hit points handed out a berry at a time, and nobody has to carry rations on a long delve. Eating is a bonus action, so a berry costs no one their attack, and there is no concentration to drop Hunter’s Mark. A berry for an ally at 0 hit points would get them back up, if the DM lets one be fed to someone who can’t eat it themselves (asked on the Rules page). It heals far less than Cure Wounds did: the real healing is potions and Hit Point Dice.'
  },
  {
    slug: 'alarm',
    name: 'Alarm',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 minute or ritual',
    range: '30 ft',
    components: 'V, S, M',
    material: 'a bell and silver wire',
    duration: '8 hours',
    concentration: false,
    ritual: true,
    source: 'XPHB',
    access: 'Ranger',
    status: 'prepared',
    role: 'Guards the camp while the party rests',
    summary:
      'Ward a door, a window, or an area no bigger than a 20-ft cube. Whenever a creature touches or enters it during the next 8 hours, you are alerted, unless it is one of the creatures you named when casting. The alarm is either a hand bell heard within 60 ft, or a mental ping that wakes you if you are within 1 mile.',
    notes:
      'As a ritual it costs no slot. A dungeon crawl means resting with enemies around: the mental alarm on the one door to the room they are holed up in. Rope Trick takes over from level 5 when there is somewhere to hang a rope.'
  },
  {
    slug: 'detect-magic',
    name: 'Detect Magic',
    level: 1,
    school: 'Divination',
    castingTime: '1 action or ritual',
    range: 'Self',
    components: 'V, S',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: true,
    source: 'XPHB',
    access: 'Ranger',
    status: 'prepared',
    role: 'Find magic traps and magic loot',
    summary:
      'For the duration you sense magic within 30 ft. An action shows a faint aura around a visible creature or object that bears magic, and its school of magic if it has one. 1 ft of stone or dirt, 1 inch of common metal, a thin sheet of lead or 3 ft of wood blocks it.',
    notes:
      'A ritual, so no slot, and 10 minutes of looking at a suspicious door or a hoard. A magical trap shows before anyone touches it. If the party’s caster has it too, swap it for Ensnaring Strike or Entangle.'
  },
  {
    slug: 'fog-cloud',
    name: 'Fog Cloud',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '120 ft',
    components: 'V, S',
    duration: 'Concentration, up to 1 hour',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'prepared',
    role: 'The way out: cut every line of sight',
    summary:
      'A 20-ft-radius sphere of fog fills a point within range and stays for the duration. Its area is heavily obscured. A wind of at least 10 mph scatters it.',
    higher: 'The radius grows by 20 ft for each slot level above 1st.',
    notes:
      'The emergency spell: across a corridor, it stops archers and casters seeing the party while everyone pulls back. It costs Hunter’s Mark, since both are concentration. Fog isn’t darkness, so Umbral Sight doesn’t help inside it; anything in it is blinded the same way he is.'
  },

  // ── Candidates: other 1st-level ranger spells ───────────────
  {
    slug: 'ensnaring-strike',
    name: 'Ensnaring Strike',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 bonus action, right after hitting with a weapon',
    range: 'Self',
    components: 'V',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'candidate',
    role: 'Pin one brute in place',
    save: 'STR',
    damage: '1d6 piercing a turn',
    dice: { 1: '1d6', 2: '2d6', 3: '3d6' },
    summary:
      'As your weapon hits, vines grasp the target. It makes a Strength save (a Large or bigger creature has advantage) or is restrained until the spell ends, taking 1d6 piercing damage at the start of each of its turns. It or a creature next to it can use an action on a Strength (Athletics) check against your DC to tear free.',
    higher: '+1d6 for each slot level above 1st.',
    notes: 'Works with arrows. Concentration, so it replaces Hunter’s Mark: worth it against one big melee creature that has to be kept off the party.'
  },
  {
    slug: 'cure-wounds',
    name: 'Cure Wounds',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'candidate',
    role: 'Real healing: 2d8 + 3 with a touch',
    heal: true,
    dice: { 1: '2d8+3', 2: '4d8+3', 3: '6d8+3' },
    summary: 'A creature you touch regains 2d8 + your Wisdom modifier hit points.',
    higher: '+2d8 for each slot level above 1st.',
    notes:
      'Goodberry took its place. Cure Wounds heals far more for the slot, about 12 against the berries’ 10 spread over a day, and all at once with a touch, without concentration. Worth swapping back in after a long rest when the party is short on healing for the day ahead.'
  },
  {
    slug: 'entangle',
    name: 'Entangle',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '90 ft',
    components: 'V, S',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'candidate',
    role: 'Restrain a group in a 20-ft square',
    save: 'STR',
    summary:
      'Grasping plants fill a 20-ft square on the ground within range, which becomes difficult terrain. Each creature other than you in it when it appears makes a Strength save or is restrained until the spell ends. A restrained creature can use an action on a Strength (Athletics) check against your DC to get free.',
    notes: 'Strong when a pack rushes down a corridor, and restrained targets give the whole party advantage. Needs plants or earth in most DMs’ eyes, so ask about a stone floor first. Concentration: it replaces Hunter’s Mark.'
  },
  {
    slug: 'speak-with-animals',
    name: 'Speak with Animals',
    level: 1,
    school: 'Divination',
    castingTime: '1 action or ritual',
    range: 'Self',
    components: 'V, S',
    duration: '10 minutes',
    concentration: false,
    ritual: true,
    source: 'XPHB',
    access: 'Ranger',
    status: 'candidate',
    role: 'Ask the rats what lives below',
    summary: 'For the duration you can understand and talk with Beasts. Their knowledge is limited to what a beast knows, but most will tell you about nearby places and monsters.',
    notes: 'A ritual, but only if prepared. Bats and rats in a dungeon have seen everything that walks through it.'
  },

  // ── Future: from level 5 and 9 ───────────────────────────────
  {
    slug: 'rope-trick',
    name: 'Rope Trick',
    level: 2,
    school: 'Transmutation',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S, M',
    material: 'a segment of rope',
    duration: '1 hour',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Gloom Stalker',
    status: 'future',
    opensAt: 5,
    role: 'A hidden room for a short rest',
    summary:
      'A rope up to 60 ft long rises upright and opens an invisible doorway at its top into an extradimensional space that holds up to eight Medium or smaller creatures. They climb in and can pull the rope up after them. Nothing passes into or out of the space, attacks and spells included, but those inside can see out through a small window around the rope. When the spell ends, anything inside drops out.',
    notes:
      'Always prepared from level 5, as a Gloom Stalker spell. An hour hidden from everything in the dungeon: a safe short rest anywhere there is headroom. No concentration.'
  },
  {
    slug: 'pass-without-trace',
    name: 'Pass without Trace',
    level: 2,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Self',
    components: 'V, S, M',
    material: 'ashes from burned mistletoe',
    duration: 'Concentration, up to 1 hour',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Wood Elf',
    status: 'future',
    opensAt: 5,
    role: '+10 to the whole party’s Stealth',
    summary: 'An aura of shadow and silence 30 ft around you. You and your allies in it have +10 on Dexterity (Stealth) checks, leave no tracks, and can’t be tracked except by magic.',
    notes: 'Elven Lineage: always prepared from level 5 and once a day without a slot, so it takes none of the ranger’s picks. The party’s ambush: everyone gets into position unseen, then initiative. Concentration, so it ends when Hunter’s Mark goes up on the first turn — which is fine, the ambush has happened by then.'
  },
  {
    slug: 'spike-growth',
    name: 'Spike Growth',
    level: 2,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '150 ft',
    components: 'V, S, M',
    material: 'seven thorns',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'future',
    opensAt: 5,
    role: 'A corridor full of hidden thorns',
    damage: '2d4 piercing per 5 ft',
    dice: { 2: '2d4' },
    summary:
      'The ground in a 20-ft-radius sphere within range sprouts hard spikes and thorns. It is difficult terrain, and a creature takes 2d4 piercing damage for every 5 ft it moves in it. The area is camouflaged: a creature that can’t see it when the spell is cast must make a Wisdom (Perception) check against your DC to notice it before entering.',
    notes: 'Cast across the corridor the enemy has to come down, then shoot them as they wade through. Concentration, so it replaces Hunter’s Mark.'
  },
  {
    slug: 'summon-beast',
    name: 'Summon Beast',
    level: 2,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '90 ft',
    components: 'V, S, M',
    material: 'a feather, tuft of fur and fish tail inside a gilded acorn worth 200+ gp',
    duration: 'Concentration, up to 1 hour',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'future',
    opensAt: 5,
    role: 'A spirit beast that fights beside him',
    summary:
      'A bestial spirit appears in an unoccupied space within range: Air (flies), Land (climbs) or Water (swims), using the Bestial Spirit stat block, whose numbers scale with the slot. It is an ally that acts right after you in initiative and obeys your commands; without one it only dodges.',
    higher: 'The spirit’s hit points, damage and attacks grow with the slot level.',
    notes: 'A body in front of the archer. The 200-gp acorn isn’t used up, but it is the whole starting purse, so it waits for treasure. Concentration: replaces Hunter’s Mark.'
  },
  {
    slug: 'silence',
    name: 'Silence',
    level: 2,
    school: 'Illusion',
    castingTime: '1 action or ritual',
    range: '120 ft',
    components: 'V, S',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: true,
    source: 'XPHB',
    access: 'Ranger',
    status: 'future',
    opensAt: 5,
    role: 'No sound in a 20-ft sphere',
    summary:
      'For the duration no sound can be made within or pass through a 20-ft-radius sphere centered on a point within range. Creatures entirely inside are deafened and immune to thunder damage, and no one inside can cast a spell with a verbal component.',
    notes: 'As a ritual, the quiet way through a creaking door or a gong-trapped hall. In a fight, centred on an enemy caster.'
  },
  {
    slug: 'fear',
    name: 'Fear',
    level: 3,
    school: 'Illusion',
    castingTime: '1 action',
    range: 'Self (30-ft cone)',
    components: 'V, S, M',
    material: 'a white feather',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'XPHB',
    access: 'Gloom Stalker',
    status: 'future',
    opensAt: 9,
    role: 'A crowd drops its weapons and runs',
    save: 'WIS',
    summary:
      'Each creature in a 30-ft cone makes a Wisdom save or drops what it is holding and is frightened for the duration. While frightened it must Dash away from you by the safest route on each of its turns. If it ends a turn where it can’t see you, it repeats the save and ends the effect on a success.',
    notes: 'Always prepared from level 9. Breaks a rush down a corridor. Concentration, so Hunter’s Mark waits.'
  },
  {
    slug: 'lightning-arrow',
    name: 'Lightning Arrow',
    level: 3,
    school: 'Transmutation',
    castingTime: '1 bonus action, as a ranged weapon attack is made',
    range: 'Self',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'future',
    opensAt: 9,
    role: 'One arrow becomes a lightning burst',
    save: 'DEX',
    damage: '4d8 lightning, 2d8 around it',
    dice: { 3: '4d8' },
    summary:
      'The arrow turns to lightning. The target takes 4d8 lightning damage on a hit, or half on a miss, instead of the weapon’s damage. Then each creature within 10 ft of it makes a Dexterity save, taking 2d8 lightning damage on a failure or half on a success.',
    higher: '+1d8 to both for each slot level above 3rd.',
    notes: 'The 2024 book reworked this spell; check its exact timing and whether it still needs concentration before preparing it at level 9.'
  },
  {
    slug: 'conjure-barrage',
    name: 'Conjure Barrage',
    level: 3,
    school: 'Conjuration',
    castingTime: '1 action',
    range: 'Self (60-ft cone)',
    components: 'V, S, M',
    material: 'a piece of ammunition or a thrown weapon',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'XPHB',
    access: 'Ranger',
    status: 'future',
    opensAt: 9,
    role: 'A cone of arrows at a crowd',
    save: 'DEX',
    damage: '5d8 force',
    dice: { 3: '5d8' },
    summary: 'Spectral copies of your arrow fill a 60-ft cone. Each creature in it makes a Dexterity save, taking 5d8 damage on a failure or half on a success.',
    higher: '+1d8 for each slot level above 3rd.',
    notes: 'The 2024 version deals force damage, I believe; check it. No concentration, so Hunter’s Mark stays up, though it adds nothing to a save spell.'
  }
]

export const spellBySlug = Object.fromEntries(spells.map(s => [s.slug, s]))
