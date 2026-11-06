// The Storm-Hammer's story, a first draft: the acolyte struck by lightning.
// What's still to settle is listed in `open`. His questions for the DM, his
// house rules and the DM's rulings are at the bottom and show on /rules.

import type { HouseRule, OpenQuestion, Ruling } from '../../campaign'

export const story = {
  paragraphs: [
    'He was an acolyte in a mountain temple of Kord, a hall of iron and lapis cut into a peak where the storms break first. He kept the forge fires, polished the temple’s great shield and sang the storm litanies, and never expected the god to answer.',
    'Then lightning came through the roof in the middle of a rite and struck him at the altar. He should have died. He woke with the storm still in him: eyes that flicker blue when he is angry, a voice that carries like thunder, and the certainty that Kord had chosen him to carry the storm out of the temple and into the world.',
    'The temple that was struck sent him out with its sentinel shield, Kord’s emblem on its face. He fights the way a storm breaks on a mountain: he plants himself among the enemy, and anyone who stays is battered, and anyone who runs is struck down.'
  ],
  open: [
    'His name.',
    'The setting, and with it Kord’s place there: the Storm Lord of Greyhawk and of Exandria.',
    'How Lucan bows out, and how the Storm-Hammer meets the party.',
    'The Seeker Guild: how he came to it, and why it taught a cleric Booming Blade, Shocking Grasp and Shield.',
    'Where the Stormgirdle came from, and whether it wakes further in play.'
  ]
}

export const appearance = {
  paragraphs: [
    'A broad, weathered hill dwarf with a heavy brow and pale storm-blue eyes that glow when the lightning in him stirs. His brown beard is long and split into thick braids bound with silver rings, and more braids hold back his hair.',
    'He wears dwarven plate enameled in deep blue and worked with bronze knotwork: a storm cloud and a lightning bolt across the breastplate, a glowing bolt on each pauldron, a blue knotwork tabard down the front and a fur-lined blue cloak behind. The Stormgirdle’s storm-faced buckle sits at his waist, and the Amulet of the Devout hangs on a heavy chain over his chest.',
    'He holds the Staff of Thunder and Lightning in his right hand like a standard, its crystal head spitting sparks, with the round Sentinel Shield and its storm eye on his left arm. Lightning crackles round his fur-cuffed Boots of Speed and leaves scorched footprints behind him.'
  ],
  portrait: {
    src: '/images/the-storm-hammer.webp', // original in art/the-storm-hammer.original.webp
    alt: 'The Storm-Hammer, a broad dwarf in blue-enameled plate under a lightning storm: a braided brown beard in silver rings, glowing blue eyes, a lightning pendant and a storm-faced belt buckle, a rune-carved staff with a crackling crystal head in his right hand and a round shield with a storm eye on his left arm.'
  }
}

export const kord = {
  name: 'Kord',
  title: 'The Storm Lord',
  paragraphs: [
    'Kord is the god of storms, strength and battle. He prizes courage and strength tested in a fair fight, and his clerics are expected to stand in the storm rather than shelter from it.',
    'The Stormgirdle is branded with his symbol: a relic of his champions, and the reason the belt sits at the center of the Storm-Hammer’s faith rather than being just a strong item.'
  ],
  prayer: 'O Radiant Lord of the Storms, guide my steps, grant me strength, shield me always.'
}

export const hooks = [
  'Another relic of Kord turns up, and the Stormgirdle stirs toward its awakened state.',
  'The temple that was struck wants its shield back, or wants to know why the god chose him.',
  'A storm that won’t break hangs over a region, and the faithful expect Kord’s chosen to answer it.',
  'A rival champion of Kord challenges him to prove his strength in a fair fight.'
]

export const houseRules: HouseRule[] = []

export const rulings: Ruling[] = []

// Asked of the DM; when one is answered, record it under `rulings` and take it off here
export const questions: OpenQuestion[] = [
  {
    question: 'Can the Shield Master shove follow a melee cantrip?',
    detail: 'As written the bonus-action shove needs the Attack action, and Booming Blade or Shocking Grasp is the Cast a Spell action. The ask: allow it after a cantrip that makes a melee attack.'
  },
  {
    question: 'Thunder Step on the plate, once a day?',
    detail: 'At his spell DC (17), 3d10 thunder to creatures next to where he left. Or on the boots instead. Does it make the armor need attunement?'
  },
  {
    question: 'Tasha’s optional cleric features?',
    detail: 'Harness Divine Power (a Channel Divinity buys back a slot of up to 2nd level, twice a day), Blessed Strikes (1d8 radiant on a cantrip or weapon hit, in place of Divine Strike’s thunder), Cantrip Versatility and the extra cleric spells.'
  },
  {
    question: 'Does walking Spirit Guardians onto enemies hurt them?',
    detail: 'The 2014 wording hurts a creature that enters the aura or starts its turn there. Does it count as entering when he moves the aura onto it, at double speed with the Boots of Speed?'
  },
  {
    question: 'Which items does he start with?',
    detail: 'The Stormgirdle is legendary and the staff very rare. And can the Stormgirdle awaken in play?'
  }
]
