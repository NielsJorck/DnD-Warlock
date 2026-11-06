// The Lightless Hunter's story, a first draft: a guide of the Sword Mountain
// passes who came back alone from the dark. What's still to settle is listed in
// `open`. Questions for the DM, house rules and rulings are at the bottom and
// show on /rules. No portrait yet: `portraitPrompt` is the brief for one.

import type { HouseRule, OpenQuestion, Ruling } from '../../campaign'

export const story = {
  paragraphs: [
    'They grew up leading mule trains and prospectors through the Sword Mountains, where the weather turns in an hour and the old dwarven roads drop without warning into tunnels nobody has mapped. A good guide gets the client home. A famous one gets the client home from places no one else would take them, and they meant to be famous.',
    'Then a delve collapsed behind a prospecting party they had led underground. Three days in the dark followed, with something moving in the tunnels that could see the prospectors perfectly well, and could not see them at all. They came out alone, with eyes that had learned the dark and a habit of standing just past the edge of the lantern light, where whatever is hunting looks for prey and finds nothing.',
    'Since then they take the jobs that go underground, and charge for it. The patron’s expedition is the best-paid commission the mountains have offered in years. A guide who brings a party back from a long-lost site never has to ask for work again, and one who doesn’t has already been through that once.'
  ],
  open: [
    'Their name.',
    'Who the lost prospectors were, and whether the patron’s long-lost site has anything to do with the delve that collapsed.',
    'Where they learned the ranger’s craft and the druid’s spells: an old guide, a circle in the foothills, or the dark itself.',
    'What hunted the prospectors in the tunnels, and whether it is still down there.',
    'How the patron found them, and why the patron wants this guide in particular.'
  ]
}

export const appearance = {
  paragraphs: [
    'A lean human in their late twenties, weathered by mountain wind, with close-cropped dark hair, an old scar along the jaw and pale grey eyes that seem to catch what little light there is.',
    'They dress for the dark: studded leather dyed charcoal and stitched with nothing that shines, a hooded mantle the color of wet slate, soft-soled boots, and a longbow wrapped in black cord so it never glints. A cartographer’s case hangs at the hip, full of maps drawn in their own hand, and a sprig of mistletoe is tied at the quiver strap.',
    'On their forearms are the Bracers of Archery, dark leather over blackened bronze worked with a crescent moon. They keep to the edge of every lit room without seeming to think about it.'
  ],
  // The art brief for a portrait at /images/the-lightless-hunter.webp (not shown on the site)
  portraitPrompt:
    'Painted fantasy portrait, 3:4, head and shoulders to waist. A lean, androgynous human ranger in their late twenties, close-cropped dark hair, a scar along the jaw, pale grey eyes reflecting faint light. Charcoal studded leather, a slate-grey hooded mantle with the hood back, a black-corded longbow over one shoulder, dark bronze bracers engraved with a crescent moon. They stand in a dwarven tunnel at the edge of distant torchlight, half their face lit warm, half lost in blue-black shadow. Moody chiaroscuro, muted palette, no text.'
}

// The third section of the lore page: why the Sword Mountains, in the flyer's words
// "what draws you to the Sword Mountains"
export const commission = {
  name: 'The Sword Mountains',
  title: 'Why they took the commission',
  paragraphs: [
    'The mountains are theirs: every pass, every ruined waystation, every dwarven road that turns into a tunnel. No one else the patron could hire has walked as many of them, and fewer have come back up from as deep.',
    'Reputation is the obvious reason. The quieter one is the delve. Somewhere under the same mountains are the bones of the party they lost, and whatever saw in the dark that day. A long-lost site, a patron who pays well and three other people who can hold their own: it is the closest thing to a second chance they have been offered.'
  ],
  creed: 'Walk where the light ends. Wait. Let them come to you.'
}

export const hooks = [
  'Marks scratched in the tunnels of the lost site match the ones they left during the three days in the dark.',
  'A rival guide claims the patron hired the wrong person, and turns up in the mountains with a party of their own.',
  'Something in the deep levels doesn’t rely on darkvision, and Umbral Sight doesn’t fool it.',
  'One of the lost prospectors is alive, and isn’t who they were.'
]

export const houseRules: HouseRule[] = []

export const rulings: Ruling[] = []

// Asked of the DM; when one is answered, record it under `rulings` and take it off here
export const questions: OpenQuestion[] = [
  {
    question: 'Bracers of Archery as the starting uncommon item?',
    detail: 'Not a +1 weapon, and they don’t touch the attack roll, but +2 damage on every arrow is close to one. If that’s against the spirit of the rule, the fallback is the Cloak of Elvenkind.'
  },
  {
    question: 'Umbral Sight and the party’s light',
    detail:
      'It only works while they are entirely in darkness. When an ally carries a torch (bright light 20 ft, dim light 20 ft more) or a Light cantrip, their square is lit and the invisibility is off. Is scouting ahead of the light, or the party moving dark where it can, how the DM sees it working? And how will the table know which monsters rely on darkvision, as opposed to blindsight or tremorsense?'
  },
  {
    question: 'Entangle on a stone floor?',
    detail: 'The 2024 text grows the plants from the ground in a 20-ft square without saying the ground has to be soil. Does it work in a worked-stone dungeon? It decides whether Entangle is worth preparing.'
  }
]
