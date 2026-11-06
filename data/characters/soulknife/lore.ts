// The Whisper-Knife's story, a first draft: a wood elf burglar whose blades
// are made of thought, and who signed on for the payday. What's still to settle
// is listed in `open`. Their questions for the DM, house rules and the DM's
// rulings are at the bottom and show on /rules.

import type { HouseRule, OpenQuestion, Ruling } from '../../campaign'

export const story = {
  paragraphs: [
    'They grew up under the eaves of an old elven wood and left it young for the city, where nobody cared how quietly they walked, only how quietly they could open a door. The city taught them locks, ledges and the price of everything, and a fence on the docks taught them what the price of a thing becomes once it has been stolen.',
    'The blades came on a job gone wrong. Cornered in a vault with an empty hand and a guard at the door, they reached for a knife they didn’t have, and one formed anyway: a sliver of violet light that went where they looked and left no wound anyone could find. Since then they have never carried a weapon they meant to use. Sometimes the voices of the people nearby reach them as a murmur, and in time they learned to answer.',
    'They didn’t answer the patron’s notice for the knowledge or the craft. A long-lost site in the Sword Mountains, untouched for generations, is a vault nobody has been inside, and the reward is the largest payday they have ever been offered. They mean to be the one who opens its doors, and the one still standing when the take is shared.'
  ],
  open: [
    'Their name.',
    'Which wood they came from (the High Forest, the Neverwinter Wood…) and which city took them in.',
    'What the payday is for: a debt to the fence, a stake to stop stealing, or someone to buy free.',
    'Where the psionic gift came from, and whether anyone else knows what the blades are.',
    'How they heard of the patron, and why the patron took a thief.'
  ]
}

export const appearance = {
  paragraphs: [
    'A slight wood elf with copper-brown skin, moss-green hair cut short and tied back in one braid, and amber eyes that flicker violet when the blades form. They stand very still and seem to be somewhere else in the room until they move.',
    'They wear studded leather dyed charcoal under a hooded grey-green cloak that drinks the light, soft boots, and a belt of pouches, a roll of thieves’ tools and a chalk-stained hand. A shortbow rides on their back; the only blades anyone sees are the ones that aren’t there a moment later.',
    'When they fight, a translucent violet knife takes shape in each empty hand, thrown or swung, and fades as soon as it strikes.'
  ],
  // No painting yet: the sheet and lore show an emblem. A brief for generating one:
  portraitPrompt:
    'Fantasy character portrait, 3:4, painterly: a slight wood elf rogue with copper-brown skin, short moss-green hair in a single braid and amber eyes glowing faintly violet, in charcoal studded leather and a hooded grey-green elven cloak, crouched in a torchlit dungeon corridor. In each empty hand a translucent violet blade of psychic light; a shortbow on the back and a roll of thieves’ tools at the belt. Dark stone, cold shadows, the violet glow lighting the face from below.'
}

// Why they took the commission: the flyer asks what draws each adventurer to the Sword Mountains
export const commission = {
  title: 'The Payday',
  subtitle: 'What draws them to the Sword Mountains',
  paragraphs: [
    'The patron promises a significant reward for a successful expedition. For most of the party it is the second reason to go. For them it is the first: knowledge and craft lost for generations fetch a price, and a site nobody has opened in living memory is a vault with no owner left to miss what comes out of it.',
    'That makes them useful before the fighting starts. They are the one who reads the doors, finds the traps, opens the locks and goes first into the dark, because the first one in sees the take first. What they owe the others in return, and what they keep for themselves, is the story still to be told.'
  ],
  creed: 'Every lock has a price.'
}

export const hooks = [
  'Someone from the city recognizes them at the patron’s table and knows what they really did for a living.',
  'The site holds a vault built to keep thieves out, and its makers knew about minds like theirs.',
  'The voices they sometimes hear grow louder in the deep places, and one of them answers back.',
  'The patron asks them, alone, to bring back one thing from the site and not tell the others.'
]

export const houseRules: HouseRule[] = []

export const rulings: Ruling[] = []

// Asked of the DM; when one is answered, record it under `rulings` and take it off here
export const questions: OpenQuestion[] = [
  {
    question: 'Cloak of Elvenkind as the starting uncommon item?',
    detail: 'Advantage on Stealth and disadvantage on Perception checks to spot them, while the hood is up. No bonus to weapons or armor. Alternatives: Boots of Elvenkind or Gloves of Thievery.'
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
  }
]
