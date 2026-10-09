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
  { rule: 'Extra feat at level 1', detail: 'Every character gets an additional feat. Lucan takes Telekinetic.' },
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
    ruling: 'Bag of Holding stays outside the Vessel',
    detail: 'Until the DM rules that combining the two extradimensional spaces is safe. The Vessel already has a Bag of Holding function.'
  },
  {
    ruling: 'The Rod of the Pact Keeper is shaped as a dagger',
    detail: 'An ornate dagger with a Dimension Shard blade. The shape is flavor only: mechanically it is still a rod, not a weapon.'
  },
  {
    ruling: 'The Barrier Tattoo is the pact',
    detail: 'Flavored as Lucan’s contract with Zahir, written in Primordial (Terran) across his arms and torso. It works exactly like a Rare Barrier Tattoo.'
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
      'Several wishlist items come from 2021–2023 books: Fizban’s Treasury of Dragons (FTD), Glory of the Giants (BGG), The Book of Many Things (BMT) and Phandelver and Below (PaBTSO). They are listed on the 2014 site, but they are newer than the core supplements.',
    items: ['jesters-mask', 'amethyst-lodestone', 'orb-of-skoraeus', 'stirring-scaled-ornament', 'stirring-dragon-touched-focus', 'mind-crystal-quickened']
  },
  {
    id: 'acquiring-items',
    topic: 'Items',
    question: 'How can Lucan get new items: only as loot, or can he buy or commission them?',
    context:
      'Lucan is a guild-trained jeweler and appraiser. If buying or crafting is possible, which rarities are available and roughly what do they cost?'
  },
  {
    id: 'bonus-stacking',
    topic: 'Items',
    question: 'Do spell attack and DC bonuses from different items stack, or is there a cap?',
    context:
      'In the 2014 rules, bonuses from differently named items stack. The Rod (+2) with the Jester’s Mask (+3) would give spell DC 22 and attack +14. Adding the Robe of the Archmagi (+2) would push that even higher.',
    items: ['rod-of-the-pact-keeper', 'jesters-mask', 'robe-of-the-archmagi', 'wand-of-the-war-mage']
  },
  {
    id: 'upgrade-in-place',
    topic: 'Items',
    question: 'Can current items be upgraded in place and keep their flavor?',
    context:
      'For example, the Rare Barrier Tattoo becoming the Very Rare one as the pact deepens, or the Rod’s Dimension Shard blade being re-cut into a +3 Rod. The alternative is finding the new item and swapping.',
    items: ['barrier-tattoo-large', 'rod-of-the-pact-keeper-3']
  },
  {
    id: 'pearl-pact-slots',
    topic: 'Items',
    question: 'Does a Pearl of Power work with Pact Magic slots?',
    context:
      'The pearl restores a slot of 3rd level or lower, but all of Lucan’s pact slots are 5th level. Read strictly, it does nothing for him. Would it restore a 5th-level pact slot instead?',
    items: ['pearl-of-power']
  },
  {
    id: 'belt-darkvision',
    topic: 'Items',
    question: 'Would the Belt of Dwarvenkind’s darkvision override the campaign’s 30-ft Half-Elf darkvision?',
    context: 'The belt grants darkvision 60 ft. The house rule reduces Half-Elf darkvision to 30 ft.',
    items: ['belt-of-dwarvenkind']
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
    id: 'rod-weapon',
    topic: 'Items',
    question: 'Could a future item count as both a rod and a weapon without changing its rules?',
    context: 'The Rod of the Pact Keeper is shaped as a dagger, but mechanically it is only a rod.',
    items: ['rod-of-the-pact-keeper']
  },
  {
    id: 'vessel-extradimensional',
    topic: 'Genie Vessel',
    question: 'How does the Genie Vessel interact with other extradimensional spaces?',
    context:
      'For now a Bag of Holding stays outside the Vessel. The same question applies to a Portable Hole, Handy Haversack or similar item.'
  },
  {
    id: 'vessel-items-outside',
    topic: 'Genie Vessel',
    question: 'How do Vessel items work when Lucan takes them outside?',
    context:
      'They stay part of the Vessel’s inventory. Can he carry the Helm of Comprehending Languages or the Eyes of Minute Seeing on an adventure, and do they keep working normally?',
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
    { label: 'Current', text: 'Legal under the policy and part of the build.' },
    { label: 'Option', text: 'Legal, but not selected.' },
    { label: 'Needs DM approval', text: 'Outside the policy or dependent on a ruling.' }
  ]
}

export const openQuestions = {
  immediate: [
    'Pick the next ritual for Book of Ancient Secrets. Find Familiar is the leading candidate.',
    'Check the candidate spells against the party’s actual encounters before changing the spell list.',
    'Decide the level-12 improvement: a feat, an ability score increase or an invocation change.'
  ],
  items: [
    'Compare suggestions with the five attuned items whenever a specific reward or purchase comes up.',
    'Keep the Robe of Thayan Arcana out unless the DM explicitly approves it.'
  ],
  closed: [
    'Ruleset: 2014 5e + Tasha’s, not 2024-only material.',
    'Sources: official content on 2014.5e.tools, plus recorded campaign homebrew.',
    'Race: Half-Elf. Patron: Dao Genie (Zahir). Pact: Tome.',
    'Feats: Telekinetic, Crusher, Resilient (CON).',
    'Terran selected as the Half-Elf language.',
    'Dwarvish selected as the Guild Artisan language.',
    'Mind Sliver replaced Gravity Spike.',
    'Contact Other Plane removed from the plan.',
    'Far Step chosen over Dimension Door.',
    'Vessel contents are tracked separately from ordinary items.'
  ]
}
