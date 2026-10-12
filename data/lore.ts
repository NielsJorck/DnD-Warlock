// Story, campaign rules and open decisions.

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

export const homebrew = [
  { rule: 'Extra feat at level 1', detail: 'Every character gets an additional feat. Lucan takes Spell Savant from Zman’s 5e Tweaks: +1 CHA and an extra 5th-level slot once per long rest.' },
  { rule: 'Half-Elf darkvision is 30 ft', detail: 'Reduced from the usual 60 ft.' },
  { rule: 'Skill Versatility → Investigation', detail: 'The Half-Elf skill choice grants Investigation.' },
  {
    rule: 'Patron spells are spells known',
    detail: 'The Genie expanded list counts as additional spells known, not just extra options to choose from.'
  },
  { rule: 'Agonizing Blast: once per target', detail: '+CHA damage applies once per target per casting, not once per beam.' },
  { rule: 'Repelling Blast: once per target', detail: 'The 10-ft push applies once per target per casting, not once per beam.' },
  { rule: 'Attunement limit 10', detail: 'Instead of the usual 3.' },
  {
    rule: 'Bottled Respite at will',
    detail: 'Bottled Respite normally can’t be used again until a long rest. In this campaign Lucan can enter the Vessel whenever he wants.'
  }
]

export const rulings = [
  { ruling: 'Robe of Thayan Arcana is not approved', detail: 'Excluded from the build and from all numbers.' },
  {
    ruling: 'The Rod of the Pact Keeper is shaped as a dagger',
    detail: 'An ornate dagger with a Dimension Shard blade. The shape is flavor only: mechanically it is still a rod, not a weapon.'
  },
  {
    ruling: 'Zahir can upgrade his gifts',
    detail: 'The Barrier Tattoo and the Rod of the Pact Keeper were given by the patron. A bigger version comes from Zahir fusing more power into the same item, so it keeps its flavor.'
  },
  {
    ruling: 'Spell attack and DC bonuses stack',
    detail: 'Bonuses from different items add together with no cap, e.g. the Rod (+2) and the Jester’s Mask (+3) for spell DC 22 and attack +14.'
  },
  {
    ruling: 'The Barrier Tattoo is the pact',
    detail: 'Flavored as Lucan’s contract with Zahir, written in Primordial (Terran) across his arms and torso. It works exactly like a Rare Barrier Tattoo.'
  },
  {
    ruling: 'Up to four magic rings',
    detail: 'The table allows four worn rings instead of the usual limit. Other slots follow the books: one cloak, one pair of bracers, one belt, one robe and one piece of headwear.'
  }
]

export interface DmQuestion {
  id: string
  topic: 'Sources' | 'Items' | 'Genie Vessel'
  question: string
  context: string
  items?: string[] // item slugs the answer affects
}

// Questions for the DM. Listed on /dm with answer fields and summarised on /rules.
export const dmQuestions: DmQuestion[] = [
  {
    id: 'later-books',
    topic: 'Sources',
    question: 'Do the later books on 2014.5e.tools count as allowed sources?',
    context:
      'Several requested items come from 2021–2023 books: Fizban’s Treasury of Dragons (FTD) and The Book of Many Things (BMT). They are listed on the 2014 site, but they are newer than the core supplements.',
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
    id: 'bracers-agonizing',
    topic: 'Items',
    question: 'With Illusionist’s Bracers, does the bonus-action Eldritch Blast count as a separate casting for Agonizing and Repelling Blast?',
    context:
      'The house rule applies them once per target per casting. The site assumes the second casting adds another +5 damage and another 10-ft push to the same target.',
    items: ['illusionists-bracers']
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

export const sourcePolicy = {
  baseline: '2014 D&D 5e plus Tasha’s Cauldron of Everything',
  index: { label: '2014.5e.tools', url: 'https://2014.5e.tools/' },
  allowed: [
    'Official 2014 core books: Player’s Handbook, Dungeon Master’s Guide, Monster Manual.',
    'Official 2014-era supplements: Xanathar’s, Tasha’s, Volo’s, Mordenkainen’s Tome of Foes and similar.',
    'Official adventure and setting books, such as Rime of the Frostmaiden and Dungeon of the Mad Mage, where the specific option appears on the 2014 site.',
    'Ritual spells from any class list, legally copied into the Book of Shadows.'
  ],
  excluded: [
    '2024-only rules and the revised 2024 books.',
    'Content that only appears on the non-2014 5e.tools site.',
    'Unearthed Arcana, third-party material and unapproved homebrew.',
    'The 2024 “Sphinx of Wonder” familiar.',
    'Robe of Thayan Arcana.'
  ],
  labels: [
    { label: 'Requested', text: 'Every listed magic item. Assumed accepted until the DM rules on it on the DM page.' },
    { label: 'On the sheet', text: 'Requested items whose numbers the character sheet already uses.' }
  ]
}

export const openQuestions = {
  immediate: [
    'Pick the next ritual for Book of Ancient Secrets. Find Familiar is the leading candidate.',
    'Check the candidate spells against the party’s actual encounters before changing the spell list.',
    'Decide the level-12 improvement: a feat, an ability score increase or an invocation change.'
  ],
  items: [
    'Update the sheet once the DM has ruled on the requested items and their versions.',
    'Keep the Robe of Thayan Arcana out unless the DM explicitly approves it.'
  ],
  closed: [
    'Ruleset: 2014 5e + Tasha’s, not 2024-only material.',
    'Sources: official content on 2014.5e.tools, plus recorded campaign homebrew.',
    'Race: Half-Elf. Patron: Dao Genie (Zahir). Pact: Tome.',
    'Feats: Spell Savant (replaced Telekinetic), Crusher, Resilient (CON).',
    'Terran selected as the Half-Elf language.',
    'Dwarvish selected as the Guild Artisan language.',
    'Mind Sliver replaced Gravity Spike.',
    'Mage Hand replaced Lightning Lure.',
    'Illusionist’s Bracers chosen over Bracers of Defense: AC 17, two Eldritch Blasts a turn.',
    'Contact Other Plane removed from the plan.',
    'Far Step chosen over Dimension Door.',
    'Vessel contents are tracked separately from ordinary items.'
  ]
}
