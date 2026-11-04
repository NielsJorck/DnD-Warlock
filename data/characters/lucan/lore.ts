// Lucan's story, his own house rules and rulings, and his open decisions.
// Rules for the whole table are in data/campaign.ts.

import type { HouseRule, Ruling } from '../../campaign'

export const backstory = {
  paragraphs: [
    'Lucan Beryll is a Half-Elf whose working life was built around gemstones, precious metals and unusual minerals. Trained through a guild as a jeweler, gemcutter and appraiser, he learned to judge craftsmanship, value, provenance and authenticity — and the people on the other side of a negotiation. In his trade, reputation mattered, and so did the exact wording of an agreement.',
    'His work eventually brought him into contact with something outside ordinary commerce: a rare stone, crafted object or commission tied to Zahir, a Noble Dao of the Elemental Plane of Earth. The details of that first meeting are still open for the campaign. What matters is that Lucan did not become a servant or worshipper. He entered into an agreement.',
    'That pact shaped his magic and his outlook. Lucan favors control, positioning, careful preparation and dependable tools over reckless destruction. His command of Terran reflects his tie to the Plane of Earth, and his Vessel has become a private home of stone, crystal, mineral and worked metal.'
  ]
}

export const appearance = {
  paragraphs: [
    'Lucan dresses like someone his patron would be proud to be seen with. His head is shaved smooth except for a long black ponytail drawn through a series of gold rings, each one engraved with a single Terran rune. Gold cuffs climb the points of his half-elf ears. He is clean-shaven, with sharp features, warm olive-bronze skin and eyes like his dagger’s Dimension Shard: faceted amethyst irises that warm to rose and then a fiery orange around the pupil, glowing faintly from within.',
    'He wears a sleeveless, high-collared coat of deep umber stitched with copper geometry, open enough to show the liquid-gold contract written across his chest and down his arms. Broad gold bracers carry the last lines of the contract and both signatures, closing the script at each wrist. A wide sash holds the amethyst-bladed dagger, Zahir’s Vessel ring sits among the other rings on his fingers, and loose dark trousers gather at the ankle.',
    'When he takes to the air, sand and glittering gem-dust spiral up around his legs and trail beneath him like a genie’s tail.'
  ],
  features: [
    { label: 'Hair', text: 'Shaved head, long black ponytail threaded through engraved gold rings.' },
    { label: 'Eyes', text: 'Faintly glowing, like the Dimension Shard: amethyst at the rim, rose, then a fiery orange around the pupil.' },
    { label: 'Face', text: 'Clean-shaven, sharp features, gold cuffs on the ear points.' },
    { label: 'Pact', text: 'Liquid-gold Terran script across his chest and arms, ending in the engraved gold bracers.' },
    { label: 'Dress', text: 'Sleeveless high-collared umber coat with copper stitching, wide sash, loose dark trousers.' },
    { label: 'Flight', text: 'His legs stay visible inside a spiral of sand and gem-dust.' }
  ],
  portrait: {
    src: '/images/lucan-beryll.png', // original kept in art/lucan-beryll.original.png
    alt: 'Lucan Beryll, arms crossed, in a sleeveless umber coat with copper patterns: a shaved head with a black ponytail in gold rings, faintly glowing violet eyes, gold runes across his chest and arms, gold bracers and an amethyst-bladed dagger in his sash, among towers of dark stone and crystal.'
  },
  // Brief for generating a portrait; the result lives at portrait.src
  portraitPrompt:
    'Fantasy character portrait, D&D 5e. A male half-elf warlock of a Dao, a genie of elemental earth, shown from the knees up, standing with calm confidence. His head is shaved except for a long black ponytail threaded through a series of engraved gold rings; gold cuffs climb his pointed ears; clean-shaven, sharp features, warm olive-bronze skin. His eyes glow faintly like faceted crystal: amethyst-violet irises at the outer rim, shading to rose-pink and then a fiery orange ring around the pupil, a soft violet-orange light, subtle rather than blazing. He wears a sleeveless, high-collared coat of deep umber stitched with angular copper geometric patterns, open at the chest to show a tattoo of glowing liquid-gold angular runes (Primordial Terran script in the style of the Dwarvish alphabet) across his chest beneath the collarbones and running down both bare arms, with a circular seal over his heart. Broad engraved gold bracers on both wrists continue the runes. A wide sash at his waist holds a dagger whose blade is a faceted amethyst crystal shading to a fiery orange tip. On one hand, a gold ring set with a long faceted amethyst-and-sapphire crystal. Loose dark trousers gathered at the ankle. Sand and glittering gem-dust drift around his feet. Dark obsidian background, dramatic warm gold rim light, no text, no watermark.'
}

export const zahir = {
  name: 'Zahir ibn Kharum',
  title: 'Noble Dao of the Elemental Plane of Earth',
  paragraphs: [
    'Zahir is a powerful Noble Dao whose interests center on stone, crystal, gemstones, precious metals, craftsmanship, wealth and permanence. He values things that endure: structures, treasures, reputations and obligations.',
    'He does not see Lucan as a worshipper. Their relationship rests on negotiation, mutual obligation and trust in the agreement itself. Zahir can be demanding, calculating and precise, but he holds himself to the same standard he holds Lucan to. The pact can grow tense whenever the exact wording of a deal matters, yet it has a stable foundation: Zahir considers his own word binding.'
  ],
  principle: 'A deal made is a deal kept.',
  hooks: [
    'Zahir asks Lucan to locate, appraise, recover or authenticate rare minerals and magical artifacts.',
    'Zahir tests whether Lucan honors the spirit of an agreement as well as its letter.',
    'A seemingly valuable object may matter because of its provenance, its ownership or an old obligation.',
    'The Genie Vessel slowly reveals Zahir’s taste for permanence, luxury and controlled spaces.'
  ]
}

export const houseRules: HouseRule[] = [
  {
    rule: 'Bottled Respite at will',
    detail: 'Bottled Respite normally can’t be used again until a long rest. In this campaign Lucan can enter and leave the Vessel whenever he wants. The Sanctuary Vessel short rest still works only once per long rest.'
  },
  {
    rule: 'Patron-bound items',
    detail: 'The Golden Pact, the Bracers of the Dao Pact and the Pact Keeper’s Crystal Dagger are campaign items tied to Zahir. The pact and the bracers are bound to Lucan and can’t be removed.'
  }
]

export const rulings: Ruling[] = [
  {
    ruling: 'Prodigy is a gift from the DM',
    detail:
      'Lucan has Prodigy from level 1, on top of the table’s extra feat and the ASI feats at 4 and 8. He uses the Xanathar’s version: Persuasion expertise, Calligrapher’s supplies and Draconic. Its skill pick is unused. Zman’s 5e Tweaks prints its own Prodigy, with +1 to an ability score instead of expertise, but doesn’t list Prodigy among its changed or added feats.'
  },
  { ruling: 'Book of Shadows rituals approved', detail: 'The DM allowed the rituals in Lucan’s Book of Shadows as they are.' },
  { ruling: 'Robe of Thayan Arcana is not approved', detail: 'Excluded from the build and from all numbers.' },
  {
    ruling: 'The Golden Pact',
    detail:
      'The Barrier Tattoo and the Illuminator’s Tattoo were consolidated into one bound artifact: the pact written across his body. AC 15 + DEX (max +2), a spellcasting focus, fingertip writing, and a page hidden from all but one reader once per long rest. It grows new glyphs as Lucan’s power grows.'
  },
  {
    ruling: 'Bracers of the Dao Pact',
    detail: 'They replace the requested Illusionist’s Bracers: +2 AC with no armor or shield, and the Form of the Lesser Dao twice per long rest. Bound to Lucan and can’t be removed or replaced.'
  },
  {
    ruling: 'Pact Keeper’s Crystal Dagger',
    detail:
      'It replaces the Rod of the Pact Keeper. It keeps the slot recovery but gives +1 instead of +2, and is a real returning +1 dagger that deals extra force and bludgeoning damage.'
  }
]

export interface DmQuestion {
  id: string
  topic: 'Sources' | 'Items' | 'Genie Vessel'
  question: string
  context: string
  items?: string[] // item slugs the answer affects
}

// Questions for the DM. Listed on /lucan/dm with answer fields and summarised on /rules.
export const dmQuestions: DmQuestion[] = [
  {
    id: 'later-books',
    topic: 'Sources',
    question: 'Do the later books on 2014.5e.tools count as allowed sources?',
    context:
      'Several wishlist items come from 2021–2023 books: Fizban’s Treasury of Dragons (FTD) and The Book of Many Things (BMT). They are listed on the 2014 site, but they are newer than the core supplements.',
    items: ['jesters-mask', 'amethyst-lodestone', 'scaled-ornament']
  },
  {
    id: 'acquiring-items',
    topic: 'Items',
    question: 'How can Lucan get new items: only as loot, or can he buy or commission them?',
    context:
      'Lucan is a guild-trained jeweler and appraiser. If buying or crafting is possible, which rarities are available and roughly what do they cost?'
  },
  {
    id: 'golden-pact-growth',
    topic: 'Items',
    question: 'How does the Golden Pact grow with Lucan?',
    context: 'Its description says new glyphs appear as his powers grow, each one marking a new ability. Do they appear at set levels, from story beats, or when Zahir grants them?',
    items: ['the-golden-pact']
  },
  {
    id: 'lesser-dao-dc',
    topic: 'Items',
    question: 'What is the Strength save DC to avoid being knocked prone by the Lesser Dao’s Earthen Maul and Earth Burst?',
    context:
      'On the Foundry sheet, Earthen Maul’s save field says DC 18 and Earth Burst’s says DC 16, but both descriptions say DC 17. The site uses DC 17 for both until you confirm.',
    items: ['bracers-of-the-dao-pact']
  },
  {
    id: 'vessel-bag-of-holding',
    topic: 'Genie Vessel',
    question: 'Can the Genie Vessel work as a Bag of Holding?',
    context:
      'Lucan stores items in the Vessel and takes them out as he would from a Bag of Holding, and they work as normal outside. The site assumes you accept this, so he carries no separate Bag of Holding.',
    items: ['helm-of-comprehending-languages', 'eyes-of-minute-seeing']
  }
]

export const openQuestions = {
  immediate: [
    'Check the candidate spells against the party’s actual encounters before changing the spell list.',
    'Decide the level-12 improvement: a feat, an ability score increase or an invocation change.'
  ],
  items: [
    'Ask the DM about wishlist items when a shopping or loot opportunity comes up.',
    'Keep the Robe of Thayan Arcana out unless the DM explicitly approves it.'
  ],
  closed: [
    'Ruleset: 2014 5e + Tasha’s, not 2024-only material.',
    'Sources: official content on 2014.5e.tools, plus recorded campaign homebrew.',
    'Race: Half-Elf. Patron: Dao Genie (Zahir). Pact: Tome.',
    'Campaign start: the Foundry sheet is the character’s source of truth.',
    'Abilities: STR 8, DEX 14, CON 16, INT 12, WIS 12, CHA 20. Max HP 83.',
    'Feats: Spell Savant (replaced Telekinetic), Crusher, Resilient (CON), Prodigy (a gift from the DM at level 1, Xanathar’s version with expertise in Persuasion).',
    'Terran selected as the Half-Elf language, Dwarvish as the Guild Artisan language, Draconic from Prodigy.',
    'Items consolidated: the Golden Pact, Bracers of the Dao Pact and Pact Keeper’s Crystal Dagger replace the Barrier and Illuminator’s Tattoos, Illusionist’s Bracers and Rod of the Pact Keeper.',
    'Ring of Protection, Cloak of Displacement and Amethyst Lodestone are not owned; they moved to the wishlist.',
    'Hex and Mind Spike added; Banishment is not known.',
    'Phantasmal Killer is known: the Tome rule makes every Genie and Dao spell known.',
    'Scrying dropped, so the chosen spells fit the ten a Warlock 10 knows.',
    'Drawmij’s Instant Summons and Forbiddance are placeholders for level 11, not in the Book of Shadows yet.',
    'All ritual-wishlist spells are now in the Book of Shadows, with eight more.',
    'Agonizing Blast house rule reverted: +CHA on every beam that hits, as written.',
    'Mind Sliver replaced Gravity Spike.',
    'Mage Hand replaced Lightning Lure.',
    'Far Step chosen over Dimension Door.',
    'Vessel contents are tracked separately from ordinary items.'
  ]
}
