// The Whisper-Knife's story, a first draft: a wood elf burglar whose blades
// are made of thought, and who signed on for the payday. What's still to settle
// is listed in `open`. His questions for the DM, house rules and the DM's
// rulings are at the bottom and show on /rules.

import type { HouseRule, OpenQuestion, Ruling } from '../../campaign'

export const story = {
  paragraphs: [
    'He grew up under the eaves of an old elven wood and left it young for the city, where nobody cared how quietly he walked, only how quietly he could open a door. The city taught him locks, ledges and the price of everything, and a fence on the docks taught him what the price of a thing becomes once it has been stolen.',
    'The blades came on a job gone wrong. Cornered in a vault with an empty hand and a guard at the door, he reached for a knife he didn’t have, and one formed anyway: a sliver of violet light that went where he looked and left no wound anyone could find. He still wears a bandolier of plain steel daggers, but only for the things a thought can’t cut: the guardians with no mind behind them. Sometimes the voices of the people nearby reach him as a murmur, and in time he learned to answer.',
    'He didn’t answer the patron’s notice for the knowledge or the craft. A long-lost site in the Sword Mountains, untouched for generations, is a vault nobody has been inside, and the reward is the largest payday he has ever been offered. He means to be the one who opens its doors, and the one still standing when the take is shared.'
  ],
  open: [
    'His name.',
    'Which wood he came from (the High Forest, the Neverwinter Wood…) and which city took him in.',
    'What the payday is for: a debt to the fence, a stake to stop stealing, or someone to buy free.',
    'Where the psionic gift came from, and whether anyone else knows what the blades are.',
    'How he heard of the patron, and why the patron took a thief.'
  ]
}

export const appearance = {
  paragraphs: [
    'A slight wood elf with copper-brown skin, moss-green hair cut short and tied back in one braid, and amber eyes that flicker violet when the blades form. He stands very still and seems to be somewhere else in the room until he moves.',
    'He wears studded leather dyed charcoal under a hooded grey-green cloak that drinks the light, soft boots, a bandolier of six plain throwing daggers across his chest, a shortsword at his hip, a roll of thieves’ tools and a chalk-stained hand. The blades he fights with are the ones nobody sees: they aren’t there a moment later.',
    'When he fights, a translucent violet knife takes shape in each empty hand, thrown or swung, and fades as soon as it strikes. Against things with no mind, the steel daggers fly instead.'
  ],
  // No painting yet: the sheet and lore show an emblem. A brief for generating one:
  portraitPrompt:
    'Fantasy character portrait, 3:4, painterly: a slight male wood elf rogue with copper-brown skin, short moss-green hair in a single braid and amber eyes glowing faintly violet, in charcoal studded leather and a hooded grey-green elven cloak, crouched in a torchlit dungeon corridor. In each empty hand a translucent violet blade of psychic light; a bandolier of plain steel throwing daggers across his chest and a roll of thieves’ tools at the belt. Dark stone, cold shadows, the violet glow lighting the face from below.'
}

// Why he took the commission: the flyer asks what draws each adventurer to the Sword Mountains
export const commission = {
  title: 'The Payday',
  subtitle: 'What draws him to the Sword Mountains',
  paragraphs: [
    'The patron promises a significant reward for a successful expedition. For most of the party it is the second reason to go. For him it is the first: knowledge and craft lost for generations fetch a price, and a site nobody has opened in living memory is a vault with no owner left to miss what comes out of it.',
    'That makes him useful before the fighting starts. He is the one who reads the doors, finds the traps, opens the locks and goes first into the dark, because the first one in sees the take first. What he owes the others in return, and what he keeps for himself, is the story still to be told.'
  ],
  creed: 'Every lock has a price.'
}

export const hooks = [
  'Someone from the city recognizes him at the patron’s table and knows what he really did for a living.',
  'The site holds a vault built to keep thieves out, and its makers knew about minds like his.',
  'The voices he sometimes hears grow louder in the deep places, and one of them answers back.',
  'The patron asks him, alone, to bring back one thing from the site and not tell the others.'
]

export const houseRules: HouseRule[] = []

export const rulings: Ruling[] = []

// Asked of the DM; when one is answered, record it under `rulings` and take it off here
export const questions: OpenQuestion[] = [
  {
    question: 'Cloak of Elvenkind as the starting uncommon item?',
    detail: 'Advantage on Stealth and disadvantage on Perception checks to spot him, while the hood is up. No bonus to weapons or armor. Alternatives: Boots of Elvenkind or Gloves of Thievery.'
  },
  {
    question: 'Thieves’ Tools twice: can the Criminal’s become another tool?',
    detail: 'The Rogue and the Criminal background both give proficiency with Thieves’ Tools. The ask: take the Criminal’s as a Poisoner’s Kit instead, which Cunning Strike’s Poison option needs from level 5.'
  },
  {
    question: 'How are traps found and disarmed?',
    detail: 'The 2024 Thieves’ Tools disarm a trap or pick a lock with a Dexterity check (DC 15 as listed). Does the table call it Sleight of Hand with the tools, which gives advantage to someone proficient in both? And is spotting a trap Perception, Investigation, or the trap’s own call?'
  },
  {
    question: 'Hiding in the dark from darkvision',
    detail: 'The Hide action needs heavy obscurement or three-quarters cover. Darkness is heavily obscured, but a monster with darkvision sees it as dim light. Does the table treat that darkness as cover for hiding from such a monster, or not?'
  },
  {
    question: 'The Rogue’s 100 gp instead of package A?',
    detail: 'The flyer allows the normal class and background equipment. The 2024 Rogue chooses package A or 100 gp; he takes the gold and buys his own kit (no bow, no second Thieves’ Tools), which leaves about 101 gp after shopping instead of 43.'
  }
]
