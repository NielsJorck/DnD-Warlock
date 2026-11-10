// The Lightless Hunter's story, a first draft: a wood elf smuggler of the
// tunnels under the Sword Mountains who came back alone from the dark. What's
// still to settle is listed in `open`. Questions for the DM, house rules and
// rulings are at the bottom and show on /rules. The portrait was made from
// `portraitPrompt`.

import type { HouseRule, OpenQuestion, Ruling } from '../../campaign'

export const story = {
  paragraphs: [
    'He was born in the forest at the feet of the Sword Mountains and left it young, for the coast towns and the money that moves along them. The money that pays best stays off the toll roads, and under the mountains run the old dwarven roads: tunnels nobody has mapped, where no patrol will follow and an elf needs no lantern. For years he ran goods through them for whoever paid, and learned every turning.',
    'Then a run went wrong. A tunnel collapsed behind the crew, and three days followed in the dark with something moving in the passages that could see the smugglers perfectly well, and could not see him at all. He came out alone, with eyes that had learned the deep dark, hair gone white, and a habit of standing just past the edge of the lantern light, where whatever is hunting looks for prey and finds nothing.',
    'The people who paid for that cargo still want to know where it went, and the watch in two towns knows the face. The patron’s expedition pays well, asks nothing about the past, and goes where neither will follow. A smuggler who brings a party back from a long-lost site has a new name to trade on. One who doesn’t has already been through that once.'
  ],
  open: [
    'His name.',
    'Who the lost crew were, what they were carrying, and whether the patron’s long-lost site has anything to do with the tunnel that collapsed.',
    'Where he learned the ranger’s craft and its spells: an old poacher, the wood elves he left behind, or the dark itself.',
    'What hunted the crew in the tunnels, and whether it is still down there.',
    'Who still wants the lost cargo, and whether the patron knows who they are.'
  ]
}

export const appearance = {
  paragraphs: [
    'A lean wood elf, young by elven reckoning, who came out of the dark changed: gaunt and hollow-cheeked, with ashen grey skin the sun never quite brought back, a thin scar across the cheek and jaw, and hair gone white where it shows under the hood. His pale grey eyes sit in a smeared band of soot and seem to catch what little light there is.',
    'He dresses for the dark: charcoal studded leather crossed with belts and stitched with nothing that shines, a ragged hooded mantle the color of wet slate, and a dark scarf he pulls up against tunnel dust and down to talk. The longbow rides unstrung across his back beside the quiver, with a sprig of mistletoe tied to its strap. A scimitar, a roll of thieves’ tools and a short crowbar hang at his belt.',
    'On his forearms are the Bracers of Archery, dark leather over blackened bronze worked with crescent moons. Five knotted cords are tied around his left wrist, one for each of the crew who didn’t come out. He keeps to the edge of every lit room without seeming to think about it, and candles near him have a habit of going out.'
  ],
  portrait: {
    src: '/images/the-lightless-hunter.webp', // original in art/the-lightless-hunter.original.webp
    alt: 'The Lightless Hunter, a gaunt wood elf in a ragged dark hood before a carved dwarven archway: ashen skin, white hair at the temple, a band of soot across pale grey eyes, a scarf around his neck, crescent-moon bracers, knotted cords on one wrist, a bow and quiver on his back and a hand on the hilt at his hip'
  },
  // The prompt the portrait was made from (the candle didn't make it into the painting).
  // Negative prompt: bow in hand, bowstring, strung bow, bow passing through body, two
  // bows, extra fingers, extra arms, fire magic, glowing hands, bright lighting, shiny
  // armor, magic effects, text, watermark
  portraitPrompt:
    'Fantasy character portrait, D&D 5e, shown from the knees up, 3:4 portrait orientation. A lean, wiry male wood elf ranger stands in a ruined dwarven tunnel lit only by a single candle, body turned three-quarters toward the viewer, looking straight at the viewer, still and watchful. His deep slate-grey hood is up, shading a gaunt, hollow-cheeked face with high elven cheekbones and ashen, almost grey skin; the tip of a pointed ear shows at the hood’s edge. A thin pale scar runs along his jaw, a band of soot is smeared across his eyes, and a dark scarf is pulled down and bunched loosely around his neck. His eyes glow a faint pale silver, like an animal’s eyes catching light. A single lock of white hair escapes the hood at one temple. He wears matte charcoal studded leather with nothing that shines, a slate-grey hooded mantle falling to mid-thigh, and dark leather bracers over blackened bronze engraved with a crescent moon on both forearms. An unstrung longbow, a straight dark stave wrapped in black cord, is slung across his back with a quiver of arrows; only the top of the stave and the arrow fletchings show above his right shoulder, and a sprig of mistletoe is tied to the quiver strap. His right hand rests on the hilt of a scimitar at his hip, beside a small rolled leather tool case. His left hand is raised beside a candle on a stone ledge, two fingers closing on its flame; five thin knotted cords are tied around that wrist. The last of the flame casts a faint warm glow up across his face and fingers. Behind him a carved dwarven archway recedes into blue-black darkness. Cold blue-black palette with one warm accent, dramatic chiaroscuro, highly detailed digital painting, no text, no watermark.'
}

// The third section of the lore page: why the Sword Mountains, in the flyer's words
// "what draws you to the Sword Mountains"
export const commission = {
  name: 'The Sword Mountains',
  title: 'Why he took the commission',
  paragraphs: [
    'The tunnels under the mountains are his: every dwarven road, every bolt-hole, every passage that floods in spring. No one else the patron could hire has walked as many of them in the dark, and fewer have come back up from as deep.',
    'The pay is the obvious reason, and a clean start comes with it: an expedition is a long way from the towns where his face is known. The quieter reason is the collapse. Somewhere under the same mountains are the bones of the crew he lost, the cargo nobody delivered, and whatever saw in the dark that day. A long-lost site, a patron who pays well and three other people who can hold their own: it is the closest thing to a second chance he has been offered.'
  ],
  creed: 'Walk where the light ends. Wait. Let them come to you.'
}

export const hooks = [
  'Marks scratched in the tunnels of the lost site match the ones he left during the three days in the dark.',
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
    detail: 'Not a +1 weapon, and they don’t touch the attack roll, but +2 damage on every arrow is close to one. If that’s against the spirit of the rule, the fallback is the Boots of Elvenkind.'
  },
  {
    question: 'Umbral Sight and the party’s light',
    detail:
      'It only works while he is entirely in darkness. When an ally carries a torch (bright light 20 ft, dim light 20 ft more) or a Light cantrip, his square is lit and the invisibility is off. Is scouting ahead of the light, or the party moving dark where it can, how the DM sees it working? And how will the table know which monsters rely on darkvision, as opposed to blindsight or tremorsense?'
  },
  {
    question: 'Druidcraft’s Fire Play on a torch someone is holding?',
    detail:
      'The 2024 cantrip lights or snuffs out “a candle, a torch, or a small campfire” within 30 ft, with no save and nothing about whether it is carried. If it puts out the torch a goblin is holding, the Wood Elf’s cantrip turns the lights off for Umbral Sight once a turn. If only unattended ones, it is still the wall sconces and braziers.'
  },
  {
    question: 'Goodberry for an ally at 0 hit points?',
    detail:
      'The 2024 spell lets a creature take a bonus action to eat a berry and regain 1 hit point, and says nothing about feeding one to someone else. Can he give a berry to an unconscious ally, the way a potion can be given, to get them back up? Goodberry is his one healing spell, so the answer decides whether it does more than feed the party.'
  },
  {
    question: 'Entangle on a stone floor?',
    detail: 'The 2024 text grows the plants from the ground in a 20-ft square without saying the ground has to be soil. Does it work in a worked-stone dungeon? It decides whether Entangle is worth preparing.'
  }
]
