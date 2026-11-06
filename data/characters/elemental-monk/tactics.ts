// How the Undertow fights and works a dungeon: the plan in steps and what each
// part of their turn is spent on. Shown on the Elemental Attunement page.

export const tactics = [
  {
    title: 'Attune at the door',
    text: 'Elemental Attunement lasts 10 minutes, so it goes up before the door opens, if the DM allows it out of combat. When initiative is rolled, Uncanny Metabolism gives the Focus Point back with 1d6 + 3 hit points, once a day. Otherwise it is the first thing they do on their first turn, at no action.'
  },
  {
    title: 'Strike from 20 ft',
    text: 'On their own turn a punch reaches 20 ft: four squares, past the front line, over a pit or up to a ledge. Pick the element the target doesn’t resist (thunder for constructs, fire for things that freeze, never fire at a fire elemental), and Surprise Attack adds 2d6 against anything that hasn’t acted yet. Three strikes a turn with Flurry of Blows.'
  },
  {
    title: 'Move them, not themselves',
    text: 'Every elemental hit can force a STR save (DC 13) or move the target 10 ft toward or away. Tavern Brawler adds a free 5-ft push to the first Attack-action hit. Pull the archer off the ledge, drag the brute into the party’s reach, push the charger back out of the door, or tip anything into the pit or the trap they found earlier.'
  },
  {
    title: 'Hold the corridor',
    text: 'Enemies have to walk through 15 ft of reach to get to them, and leaving it takes an opportunity attack. In a corridor or doorway, they stand back from the front line and hit past it. When something gets next to them, the free Disengage of Patient Defense and 40 ft of speed put it back at the end of their reach.'
  },
  {
    title: 'Stay standing on 24 hit points',
    text: 'AC 18 with the cloak, and Deflect Attacks takes 1d10 + 7 off every weapon hit, cancelling most of them: a reduced-to-0 hit can be sent back for a Focus Point. Patient Defense’s Dodge for a point when surrounded, and three potions. Spells and breath are the danger: Evasion only comes at 7.'
  },
  {
    title: 'Ration the Focus',
    text: 'Three points at level 3, all back on a short rest. A fight is usually the attunement and one or two Flurries. Without points they still strike twice a turn, at the normal reach; the free Dash and Disengage keep them mobile. Ask for a short rest after a hard fight; Uncanny Metabolism is the spare.'
  }
]

export const economy = [
  {
    slot: 'Action',
    items: [
      'Attack: an Unarmed Strike at 20 ft, with an element and a push or pull; a thrown dagger at what is out of reach',
      'Grapple or Shove in place of a strike: DC 14, Prone for the party',
      'Elementalism: light the torches, dust the floor for tracks',
      'A Healer’s Kit on a dying friend (Utilize)'
    ]
  },
  {
    slot: 'Bonus action',
    items: ['A bonus Unarmed Strike, free', 'Flurry of Blows: two strikes for a Focus Point', 'Step of the Wind: Dash free, Disengage too for a point', 'Patient Defense: Disengage free, Dodge too for a point', 'A Potion of Healing'],
    note: 'One a turn: Flurry for damage, the free strike when the points are low, Step or Patience when something reaches them.'
  },
  {
    slot: 'Reaction',
    items: ['Deflect Attacks on a weapon hit, and a redirect for a point', 'An opportunity attack at 15 ft while attuned'],
    note: 'Long-Limbed works only on their own turn, so the reach on others’ turns is 15 ft attuned and 5 ft without.'
  },
  {
    slot: 'No action',
    items: ['Elemental Attunement at the start of the turn', 'Uncanny Metabolism on initiative', 'Surprise Attack on the first round', 'Tavern Brawler’s push and rerolled 1s'],
    note: 'Stunning Strike joins at level 5: a Focus Point on a hit, CON save or Stunned.'
  }
]
