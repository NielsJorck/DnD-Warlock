// The Undertow's story, a first draft: a bugbear deckhand washed off a ship in a
// storm and taught by a cliffside order to strike with the weather. What's still
// to settle is listed in `open`. Their questions for the DM, house rules and the
// DM's rulings are at the bottom and show on /rules.

import type { HouseRule, OpenQuestion, Ruling } from '../../campaign'

export const story = {
  paragraphs: [
    'They signed onto a coaster out of a Sword Coast harbour as a young bugbear who could reach the top of the rigging from the deck, and the crew kept them for it. Long arms haul lines, pull a mate back over the rail and, when the dock bars empty out at night, settle an argument from further away than anyone expects. They learned knots, weather and fists, in about that order.',
    'A winter storm took the ship off the cliffs north of the harbour. The wave that swept them overboard should have drowned them; the undertow pulled them down, turned them over and threw them onto the rocks below a lighthouse kept by a small order of monks. The monks had watched the whole thing. They said the sea had let go of the bugbear, which it doesn’t do, and that whoever the sea lets go of has something to learn from it.',
    'The order teaches that the elements don’t hit, they reach: the tide, the wind, the fire up a chimney. Years on the cliffs taught them to reach the same way, and their fists now carry frost, flame or thunder a good stride past the end of their long arms. But the order’s oldest forms are missing pages, and its founders are said to have learned them in the Sword Mountains, in a hold that was lost before the lighthouse was built.'
  ],
  open: [
    'Their name, and their pronouns.',
    'Which harbour they sailed from (Waterdeep, Neverwinter, a village between) and what became of the rest of the crew.',
    'The order’s name and its lighthouse, and who among the monks sent them.',
    'Whether they still feel more sailor than monk, and how they get on with other goblinoids.',
    'How they came to the patron: sent by the order, or taken on for their reach.'
  ]
}

export const appearance = {
  paragraphs: [
    'A tall, lanky bugbear, seven feet when they stand straight, which is rarely: their arms hang to their knees and their knuckles are calloused from rope and stone. Shaggy grey-brown fur, stiff with salt, a broad flattened nose broken twice, and pale yellow eyes that pick out everything in the dark.',
    'They wear a loose sailcloth tunic and trousers cut off at the shin, a wide sash of knotted rope holding six daggers, bare feet with soles like tarred leather, and a grey sea cloak that the monks gave them, which keeps off more than weather. Rope burns ring their forearms, and a small faded ship is tattooed on one shoulder.',
    'When they attune, the elements gather along their arms: spray and rime, a crackle of lightning, a lick of fire. A punch lands as a lash of water or wind that strikes from 20 ft away, and the swirl around the target drags it toward them like a wave pulling back.'
  ],
  // No painting yet: the sheet and lore show an emblem. A brief for generating one:
  portraitPrompt:
    'Fantasy character portrait, 3:4, painterly: a tall lanky bugbear monk with very long arms reaching past the knees, shaggy salt-stiff grey-brown fur, pale yellow eyes and a twice-broken nose, in a loose sailcloth tunic, a knotted rope sash with throwing daggers and a grey sea cloak, barefoot, in a dark stone dungeon hall. One arm is thrust forward and a long lash of sea water, frost and crackling lightning extends far beyond the fist. Cold blue and green light from the elements, deep shadows, sea spray in the air.'
}

// Why they took the commission: the flyer asks what draws each adventurer to the Sword Mountains
export const commission = {
  title: 'The Missing Forms',
  subtitle: 'What draws them to the Sword Mountains',
  paragraphs: [
    'The patron wants the knowledge and craft lost in the Sword Mountains brought back. The order on the cliffs wants one piece of it: the first forms of its teaching, carved or written in the hold where its founders learned them, before the hold was lost. Every monk on the cliffs knows the teaching is incomplete. The old ones say the missing forms are the ones that matter.',
    'So the Undertow carries two commissions: the patron’s, which pays, and the order’s, which doesn’t. In a dungeon they are the one who reaches: the lever across the pit, the archer on the ledge, the thing that should never get to the party’s back line. What they will do if the patron wants the forms too is a story still to be told.'
  ],
  creed: 'The tide never chases. It reaches.'
}

export const hooks = [
  'Someone from their old crew turns up among the patron’s people, and remembers them as a sailor, not a monk.',
  'The hold’s walls are carved with fighters striking from far beyond their reach, and the carvings move the way they do.',
  'Goblins or bugbears have taken the upper levels of the site and expect a bugbear to take their side.',
  'An underground lake blocks the way, and the undertow in it feels like the one that once let them go.'
]

export const houseRules: HouseRule[] = []

export const rulings: Ruling[] = []

// Asked of the DM; when one is answered, record it under `rulings` and take it off here
export const questions: OpenQuestion[] = [
  {
    question: 'Bugbear from Monsters of the Multiverse?',
    detail:
      'The flyer allows the 2024 Player’s Handbook’s species, with options from other books on the DM’s approval. The 2024 rules let older species be played, with ability increases from the background as for every 2024 character. Long-Limbed is the heart of the build: 5 ft more reach on their own turn. If the answer is no, a Goliath (speed 35, Hill’s Tumble) keeps most of it with 15 ft of reach.'
  },
  {
    question: 'Surprise Attack: every hit, or once a turn?',
    detail:
      'The Bugbear text: a hit deals 2d6 more to a creature that hasn’t taken a turn yet in the combat. It sets no limit, so a strike and a Flurry on the first round could add 6d6. Is it every hit, once per turn, or once per creature?'
  },
  {
    question: 'Elemental Attunement before a fight?',
    detail:
      'It starts “at the start of your turn”, for 10 minutes. Out of combat, can they attune before opening a door, as they would cast a spell? Uncanny Metabolism then gives the Focus Point back on initiative.'
  },
  {
    question: 'Grapple and Shove at reach?',
    detail:
      'Elemental Attunement adds 10 ft to the reach of an Unarmed Strike, and Grapple and Shove are options of the Unarmed Strike in the 2024 rules. Can they shove a creature Prone, or grapple it, from 15 or 20 ft away?'
  },
  {
    question: 'Cloak of Protection as the starting uncommon item?',
    detail: '+1 to AC and saving throws. No armor or weapon bonus: a monk wears neither. Alternatives: the Stone of Good Luck or the Periapt of Wound Closure.'
  }
]
