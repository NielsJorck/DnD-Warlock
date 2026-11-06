// How the Lightless Hunter fights: the plan in four steps and what each part of
// their turn is spent on. Shown on the Hunter's Mark spell page.

export const tactics = [
  {
    title: 'Go first, from the dark',
    text: 'Initiative +9 (DEX, Dread Ambusher’s WIS and Alert) means they act before nearly everything. Ambusher’s Leap adds 10 ft on that first turn: move to a dark spot with a line on the target, mark it with Hunter’s Mark as the bonus action, and shoot. A hit with Dreadful Strike is 1d8 + 6, 1d6 force and 2d6 psychic, about 21.'
  },
  {
    title: 'Stay out of the light',
    text: 'While they stand entirely in darkness, anything that sees by darkvision can’t see them: their arrows have advantage and its attacks disadvantage. It ends the moment light reaches their square. A torch lights 40 ft (dim for the outer 20), and dim light isn’t darkness, so the party’s torch-bearer and a Light cantrip turn it off. Scout ahead of the light, or ask the party to move dark when it can. Blindsight, tremorsense and truesight see them normally.'
  },
  {
    title: 'Keep the mark moving',
    text: 'One Hunter’s Mark lasts the fight: when the target drops, a bonus action moves it on. Two casts a day are free; after that it costs a slot. It is concentration, so taking damage means a Constitution save (DC 10 or half the damage). The longbow’s Slow takes 10 ft off anything it hits; if something reaches them anyway, the scimitar and shortsword attack together with Nick and the bonus action stays free.'
  },
  {
    title: 'Rest where nothing can reach',
    text: 'Dungeons punish resting. At level 3, Alarm as a ritual on the one door, and a Healer’s Kit and Healing Word for whoever went down. From level 5, Rope Trick: an hour in a hidden room for up to eight, a safe short rest anywhere with headroom.'
  }
]

export const economy = [
  {
    slot: 'Action',
    items: [
      'Attack: one arrow, two from level 5',
      'Scimitar and shortsword together (Nick) if cornered',
      'Fog Cloud to cut every line of sight and pull back',
      'Hide, or Disengage, to get back into the dark',
      'Cure Wounds after the fight'
    ]
  },
  {
    slot: 'Bonus action',
    note: 'Hunter’s Mark wants it on the first turn and when a target drops; the rest of the time it is free.',
    items: ['Hunter’s Mark: cast it, or move it to a new target', 'Healing Word, free once a day', 'Drink a potion, or give one to an ally within 5 ft']
  },
  {
    slot: 'Reaction',
    note: 'Little competes for it at level 3. Sharpshooter (level 4) lets the bow fire with an enemy adjacent.',
    items: ['An opportunity attack with the scimitar']
  },
  {
    slot: 'Once a day',
    note: 'A long rest brings them all back, and Heroic Inspiration with them.',
    items: ['Dreadful Strike, 3: 2d6 psychic on a hit, chosen after it lands', 'Hunter’s Mark without a slot, 2', 'Healing Word without a slot, 1', 'Heroic Inspiration: reroll one die']
  }
]
