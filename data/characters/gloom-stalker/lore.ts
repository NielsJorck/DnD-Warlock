// The Lightless Hunter's story, a first draft: a wood elf smuggler of the
// tunnels under the Sword Mountains who came back alone from the dark. What's
// still to settle is listed in `open`. Questions for the DM, house rules and
// rulings are at the bottom and show on /rules. No portrait yet:
// `portraitPrompt` is the brief for one.

import type { HouseRule, OpenQuestion, Ruling } from '../../campaign'

export const story = {
  paragraphs: [
    'They were born in the forest at the feet of the Sword Mountains and left it young, for the coast towns and the money that moves along them. The money that pays best stays off the toll roads, and under the mountains run the old dwarven roads: tunnels nobody has mapped, where no patrol will follow and an elf needs no lantern. For years they ran goods through them for whoever paid, and learned every turning.',
    'Then a run went wrong. A tunnel collapsed behind the crew, and three days followed in the dark with something moving in the passages that could see the smugglers perfectly well, and could not see them at all. They came out alone, with eyes that had learned the deep dark and a habit of standing just past the edge of the lantern light, where whatever is hunting looks for prey and finds nothing.',
    'The people who paid for that cargo still want to know where it went, and the watch in two towns knows the face. The patron’s expedition pays well, asks nothing about the past, and goes where neither will follow. A smuggler who brings a party back from a long-lost site has a new name to trade on. One who doesn’t has already been through that once.'
  ],
  open: [
    'Their name.',
    'Who the lost crew were, what they were carrying, and whether the patron’s long-lost site has anything to do with the tunnel that collapsed.',
    'Where they learned the ranger’s craft and its spells: an old poacher, the wood elves they left behind, or the dark itself.',
    'What hunted the crew in the tunnels, and whether it is still down there.',
    'Who still wants the lost cargo, and whether the patron knows who they are.'
  ]
}

export const appearance = {
  paragraphs: [
    'A lean wood elf, young by elven reckoning and weathered by mountain wind, with close-cropped dark hair, an old scar along the jaw and pale grey eyes that seem to catch what little light there is.',
    'They dress for the dark: studded leather dyed charcoal and stitched with nothing that shines, a hooded mantle the color of wet slate, soft-soled boots, and a longbow wrapped in black cord so it never glints. A roll of thieves’ tools and a short crowbar ride at the hip, and a sprig of mistletoe is tied at the quiver strap.',
    'On their forearms are the Bracers of Archery, dark leather over blackened bronze worked with a crescent moon. They keep to the edge of every lit room without seeming to think about it, and candles near them have a habit of going out.'
  ],
  // The art brief for a portrait at /images/the-lightless-hunter.webp (not shown on the site)
  portraitPrompt:
    'Painted fantasy portrait, 3:4, head and shoulders to waist. A lean, androgynous wood elf ranger, young by elven reckoning, pointed ears, close-cropped dark hair, a scar along the jaw, pale grey eyes reflecting faint light. Charcoal studded leather, a slate-grey hooded mantle with the hood back, a black-corded longbow over one shoulder, a roll of thieves’ tools at the belt, dark bronze bracers engraved with a crescent moon. They stand in a dwarven tunnel at the edge of distant torchlight, half their face lit warm, half lost in blue-black shadow. Moody chiaroscuro, muted palette, no text.'
}

// The third section of the lore page: why the Sword Mountains, in the flyer's words
// "what draws you to the Sword Mountains"
export const commission = {
  name: 'The Sword Mountains',
  title: 'Why they took the commission',
  paragraphs: [
    'The tunnels under the mountains are theirs: every dwarven road, every bolt-hole, every passage that floods in spring. No one else the patron could hire has walked as many of them in the dark, and fewer have come back up from as deep.',
    'The pay is the obvious reason, and a clean start comes with it: an expedition is a long way from the towns where their face is known. The quieter reason is the collapse. Somewhere under the same mountains are the bones of the crew they lost, the cargo nobody delivered, and whatever saw in the dark that day. A long-lost site, a patron who pays well and three other people who can hold their own: it is the closest thing to a second chance they have been offered.'
  ],
  creed: 'Walk where the light ends. Wait. Let them come to you.'
}

export const hooks = [
  'Marks scratched in the tunnels of the lost site match the ones they left during the three days in the dark.',
  'The people who paid for the lost cargo hear about the expedition, and send someone after it to learn what the smuggler really saw down there.',
  'Something in the deep levels doesn’t rely on darkvision, and Umbral Sight doesn’t fool it.',
  'One of the lost crew is alive, and isn’t who they were.'
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
    question: 'Druidcraft’s Fire Play on a torch someone is holding?',
    detail:
      'The 2024 cantrip lights or snuffs out “a candle, a torch, or a small campfire” within 30 ft, with no save and nothing about whether it is carried. If it puts out the torch a goblin is holding, the Wood Elf’s cantrip turns the lights off for Umbral Sight once a turn. If only unattended ones, it is still the wall sconces and braziers.'
  },
  {
    question: 'Entangle on a stone floor?',
    detail: 'The 2024 text grows the plants from the ground in a 20-ft square without saying the ground has to be soil. Does it work in a worked-stone dungeon? It decides whether Entangle is worth preparing.'
  }
]
