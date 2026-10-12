// Lucan's equipment: requested magic items, carried gear and Vessel stores.
// Every requested item is assumed accepted until the DM rules on the DM page.
// Rules text is paraphrased from the 2014 sources.

export type ItemGroup = 'requested' | 'gear' | 'vessel'
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Varies'

export interface Item {
  slug: string
  name: string
  group: ItemGroup
  source?: string
  rarity?: Rarity
  type: string
  attunement?: string
  role: string
  effect: string
  rules: string[]
  forCharacter?: string
  caveat?: string
  charges?: string
  room?: string // Vessel room slug
  slot?: ItemSlot // where it is worn or kept; Vessel stores have none
  onSheet?: boolean // its numbers are already on the character sheet
  variants?: ItemVariant[]
  defaultVariant?: string // variant id requested unless the DM picks another
  glyph: string
  art?: ItemArt
}

// Official versions of the same item, e.g. tattoo sizes or +1/+2/+3.
export interface ItemVariant {
  id: string
  label: string
  rarity: Rarity
  effect: string
}

export interface ItemArt {
  src: string // under public/
  alt: string
  caption: string
  focus?: string // CSS object-position for cropped thumbnails
  prompt: string // brief for generating a painted version at the same path
}

export const groupLabels: Record<ItemGroup, string> = {
  requested: 'Requested',
  gear: 'Class feature',
  vessel: 'Vessel stores'
}

// Where an item is worn. A max means only that many can be worn at once.
export type ItemSlot = 'ring' | 'bracers' | 'cloak' | 'head' | 'body' | 'belt' | 'tattoo' | 'ioun' | 'worn' | 'held' | 'carried'

export const slots: Record<ItemSlot, { label: string; max?: number; rule: string }> = {
  ring: { label: 'Rings', max: 4, rule: 'Up to four rings, as allowed at this table' },
  bracers: { label: 'Bracers', max: 1, rule: 'One pair of bracers' },
  cloak: { label: 'Cloak', max: 1, rule: 'One cloak' },
  head: { label: 'Headwear', max: 1, rule: 'One mask, hat or helm' },
  body: { label: 'Robe', max: 1, rule: 'One robe' },
  belt: { label: 'Belt', max: 1, rule: 'One belt' },
  tattoo: { label: 'Tattoos', rule: 'No limit beyond attunement' },
  ioun: { label: 'Ioun stones', rule: 'They orbit his head; no limit beyond attunement' },
  worn: { label: 'Other worn', rule: 'Jewelry and ornaments; no limit beyond attunement' },
  held: { label: 'Held', rule: 'Rods, wands, staffs and foci, swapped in hand as needed' },
  carried: { label: 'Carried', rule: 'Kept in a pouch or pack' }
}

export const variantOf = (item: Item, id?: string) =>
  item.variants?.find(v => v.id === (id || item.defaultVariant)) ?? item.variants?.[0]

export const items: Item[] = [
  // ── Requested: on the sheet now ──────────────────────────
  {
    slug: 'barrier-tattoo',
    name: 'Barrier Tattoo',
    group: 'requested',
    onSheet: true,
    source: 'TCE',
    rarity: 'Rare',
    type: 'Wondrous item (tattoo)',
    slot: 'tattoo',
    attunement: 'Required',
    role: 'Core defense',
    effect: 'AC 15 + DEX (max +2) while unarmored',
    variants: [
      { id: 'small', label: 'Small', rarity: 'Uncommon', effect: 'AC 12 + DEX while unarmored: AC 14 for Lucan with the Ring' },
      { id: 'medium', label: 'Medium', rarity: 'Rare', effect: 'AC 15 + DEX (max +2) while unarmored: AC 17 for Lucan' },
      { id: 'large', label: 'Large', rarity: 'Very Rare', effect: 'AC 18 while unarmored, DEX doesn’t add: AC 19 for Lucan' }
    ],
    defaultVariant: 'medium',
    rules: [
      'Applied by a magic needle in ink that looks like liquid metal. For Lucan, the protective imagery is the text of his pact with Zahir.',
      'While not wearing armor, Lucan’s AC is set by the tattoo’s size: 12 + DEX (small), 15 + DEX to a maximum of +2 (medium) or a flat 18 (large).',
      'He can use a shield and still gain the benefit. It counts as unarmored, so it stacks with Bracers of Defense.'
    ],
    forCharacter: 'The tattoo is Lucan’s pact with Zahir, written in Primordial (the Terran dialect, in Dwarvish script) across his arms and torso in liquid-gold ink. A band beneath the collarbones carries the pact’s principle, the names of the two parties run down his arms, and a seal over the sternum frames a cut-gem diagram. The contract itself is what turns blows aside. The sheet uses the medium tattoo, which provides 16 of his 17 AC. With the large one, the pact deepens and the script spreads further across his body: AC 19.',
    caveat: 'A gift from Zahir, so a larger tattoo comes from him fusing more power into this one. It stays the same item and the same attunement.',
    glyph: '◈',
    art: {
      src: '/images/barrier-tattoo.svg',
      alt: 'A half-elf’s arms and torso covered in glowing gold runes: a band across the chest, columns down both arms and the sternum, and a circular seal around a gem diagram over the heart.',
      caption: 'The pact, written in Terran. The runes really spell it out: “A deal made is a deal kept” across the chest, Zahir ibn Kharum and Lucan Beryll down the arms, “Sworn in stone” down the sternum and “Sealed in gold” around the seal.',
      focus: '50% 45%',
      prompt: 'Fantasy character art, D&D 5e. The bare arms and torso of a male half-elf warlock, cropped from the chin to the waist so his face isn’t shown. A magic Barrier Tattoo in metallic liquid-gold ink covers him: bands of angular Primordial Terran script (runes in the style of the Dwarvish alphabet) run down each arm from shoulder to wrist and in an arc across the chest beneath the collarbones; a column of runes runs down the sternum; over the heart a circular seal of runes surrounds a brilliant-cut gemstone diagram; faceted, crystalline geometric linework at the shoulders, ribs and wrists like a gemcutter’s diagrams. The ink glows faintly gold. It reads as a binding contract with a Noble Dao, a genie of elemental earth. Dark obsidian background, dramatic warm rim light, no text, no watermark.'
    }
  },
  {
    slug: 'illusionists-bracers',
    name: 'Illusionist’s Bracers',
    group: 'requested',
    onSheet: true,
    source: 'GGR',
    rarity: 'Very Rare',
    type: 'Wondrous item',
    slot: 'bracers',
    attunement: 'Required (spellcaster)',
    role: 'Double Eldritch Blast',
    effect: 'After casting a cantrip, cast it again as a bonus action on the same turn',
    rules: [
      'While wearing the bracers, whenever Lucan casts a cantrip, he can use a bonus action on the same turn to cast that cantrip a second time.',
      'The bonus-action spell rule is satisfied: the only other spell that turn is a cantrip with a casting time of 1 action.'
    ],
    forCharacter:
      'Broad gold cuffs engraved with the last lines of the pact and both signatures, so the tattoo’s script ends on them at each wrist. In genie stories cuffs mark a servant; Lucan’s mark a signed agreement. Two castings of Eldritch Blast a turn: four beams instead of two. Because Agonizing and Repelling Blast apply once per target per casting here, the second casting adds another +5 damage and another 10-ft push to the same target. That is 20 ft of pushing through Spike Growth every turn. Genie’s Wrath and Crusher stay once per turn.',
    caveat:
      'Only one pair of bracers can be worn, so they take the place of Bracers of Defense: AC 17 instead of 19. The second casting also competes for the bonus action with Elemental Gift flight and Far Step.',
    glyph: '⟁'
  },
  {
    slug: 'ring-of-protection',
    name: 'Ring of Protection',
    group: 'requested',
    onSheet: true,
    source: 'DMG',
    rarity: 'Rare',
    type: 'Ring',
    slot: 'ring',
    attunement: 'Required',
    role: 'Core defense',
    effect: '+1 AC and +1 to all saving throws',
    rules: ['Grants a +1 bonus to AC and saving throws while worn.'],
    glyph: '◯'
  },
  {
    slug: 'stone-of-good-luck',
    name: 'Stone of Good Luck',
    group: 'requested',
    onSheet: true,
    source: 'DMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (luckstone)',
    slot: 'carried',
    attunement: 'Required',
    role: 'General defense',
    effect: '+1 to ability checks and saving throws',
    rules: ['While this polished agate is on Lucan’s person, he gains a +1 bonus to ability checks and saving throws.'],
    forCharacter: 'Also adds +1 to initiative, since initiative is a DEX check. A polished agate is a fitting keepsake for a jeweler.',
    glyph: '◆'
  },
  {
    slug: 'rod-of-the-pact-keeper',
    name: 'Rod of the Pact Keeper',
    group: 'requested',
    onSheet: true,
    source: 'DMG',
    rarity: 'Rare',
    type: 'Rod (shaped as an ornate dagger)',
    slot: 'held',
    attunement: 'Required (warlock)',
    role: 'Spellcasting',
    effect: '+2 spell attack and save DC; regain one pact slot per long rest',
    variants: [
      { id: '+1', label: '+1', rarity: 'Uncommon', effect: '+1 spell attack and warlock save DC: DC 18, attack +10' },
      { id: '+2', label: '+2', rarity: 'Rare', effect: '+2 spell attack and warlock save DC: DC 19, attack +11' },
      { id: '+3', label: '+3', rarity: 'Very Rare', effect: '+3 spell attack and warlock save DC: DC 20, attack +12' }
    ],
    defaultVariant: '+2',
    rules: [
      'While holding the rod, Lucan gains a bonus to spell attack rolls and to the saving throw DCs of his warlock spells: +1, +2 or +3, set by its rarity.',
      'As an action while holding it, he can regain one warlock spell slot. This can’t be used again until he finishes a long rest.',
      'It looks like a dagger, but it is a rod: the shape is flavor only and doesn’t make it a weapon.'
    ],
    forCharacter: 'Lucan’s rod is an ornate dagger whose blade is a Dimension Shard: faceted amethyst crystal carved with spirals, its colour deepening to rose and then a fiery orange at the tip. The black grip is bound in gold Celtic-knot filigree at the pommel, collar and blade seat. It is a jeweler’s piece made for a Dao’s warlock. The sheet uses the +2 rod: spell DC 17 → 19 and spell attack +9 → +11. The recovered slot is a full 5th-level pact slot. It is a gift from Zahir, who can fuse more power into the same Dimension Shard to make it a +3 rod.',
    caveat: 'The bonus applies only while it is held.',
    glyph: '🗡',
    art: {
      src: '/images/rod-of-the-pact-keeper.png',
      alt: 'An ornate dagger with a black grip bound in gold knotwork filigree. Its blade is faceted amethyst crystal carved with spirals, shading to pink and then fiery orange at the tip.',
      caption: 'The Rod of the Pact Keeper as Lucan carries it: a gold-filigreed hilt holding a Dimension Shard in place of a blade.',
      focus: '45% 45%',
      prompt: 'Fantasy item illustration, D&D 5e. An ornate dagger that is actually a magic rod, shown diagonally, the whole item in view. The blade is a single long crystal shard, a "Dimension Shard": faceted amethyst-purple crystal engraved with spiral swirls, its colour shifting along the length to rose-pink and ending in a glowing fiery orange-red tip. The grip is black, bound in gold Celtic-knot filigree at the flared pommel cap, the collar and the seat of the blade, with no crossguard and no gems. Master jeweler’s craftsmanship in the style of a Noble Dao, a genie of elemental earth: gold, crystal, precision. Plain white background, no hands, no text, no watermark.'
    }
  },

  // ── Carried, non-Vessel gear ─────────────────────────────
  {
    slug: 'genie-vessel-ring',
    name: 'The Genie Vessel (Ring)',
    group: 'gear',
    onSheet: true,
    source: 'TCE',
    type: 'Ring (Genie’s Vessel, Tiny object)',
    slot: 'ring',
    role: 'Patron vessel and spellcasting focus',
    effect: 'Lucan’s Genie’s Vessel: a spellcasting focus and the doorway to his extradimensional home',
    rules: [
      'Granted by the Genie patron at 1st level, so it’s a class feature rather than a magic item and doesn’t take an attunement slot.',
      'A Tiny object that Lucan can use as a spellcasting focus for his warlock spells.',
      'AC equals his spell save DC (19). HP equals his warlock level + proficiency bonus (14). Immune to poison and psychic damage.',
      'Bottled Respite and Sanctuary Vessel take Lucan, and up to five willing companions, inside it.',
      'If it is destroyed or lost, Lucan can perform a 1-hour ceremony to receive a replacement from Zahir. The ceremony can be done during a short or long rest, and the old vessel is destroyed if it still exists.'
    ],
    forCharacter: 'Zahir’s Vessel is a gold ring set with a single long, faceted crystal: amethyst violet shot through with sapphire blue and flashes of copper, like a geode turned inside out. Clawed gold prongs hold the stone, and the openwork shoulders carry smaller amethysts, sapphires and diamonds. Behind that stone lie the halls, vaults and workshops of Lucan’s private home.',
    caveat: 'Anything that targets objects can hit the ring. If it is destroyed while Lucan is inside, he and any guests are ejected.',
    glyph: '💍',
    art: {
      src: '/images/genie-vessel-ring.png',
      alt: 'A gold ring with openwork shoulders set with small amethysts, sapphires and diamonds, holding a long faceted crystal of violet, blue and copper in clawed gold prongs.',
      caption: 'The Genie Vessel: a Dao’s jewel worn on Lucan’s hand, with a whole residence inside the stone.',
      focus: '50% 35%',
      prompt: 'Fantasy item illustration, D&D 5e. A magic ring standing upright on dark slate, three-quarter view, the whole ring in view. A heavy gold band whose openwork shoulders are pierced like filigree vines and set with small faceted amethysts, sapphires and diamonds. On top, held by sharp, clawed gold prongs, sits a single long, pointed crystal: faceted amethyst-violet shot through with sapphire blue and fiery copper flashes, glowing faintly from within, as if a whole world is inside it. Master jeweler’s craftsmanship in the style of a Noble Dao, a genie of elemental earth: gold, crystal, precision. Dark, moody background with warm rim light, no hands, no text, no watermark.'
    }
  },

  // ── Vessel stores ────────────────────────────────────────
  {
    slug: 'decanter-of-endless-water',
    name: 'Decanter of Endless Water',
    group: 'vessel',
    source: 'DMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    role: 'Fresh or salt water on demand',
    effect: 'Speak a command word for a stream, fountain or geyser of water',
    rules: [
      'Stream: 1 gallon. Fountain: 5 gallons. Geyser: 30 gallons in a gushing jet 30 ft long and 1 ft wide.',
      'The water can be fresh or salt.',
      'Keeping the geyser going takes a bonus action each turn. A creature hit by it makes a DC 13 STR save or takes 1d4 bludgeoning damage and falls prone.'
    ],
    forCharacter: 'Feeds the Bathhouse pools and Conservatory fountains.',
    room: 'bathhouse-and-laundry',
    glyph: '⚱'
  },
  {
    slug: 'cleansing-stone',
    name: 'Cleansing Stone',
    group: 'vessel',
    source: 'ERLW',
    rarity: 'Common',
    type: 'Wondrous item',
    role: 'Instant cleaning',
    effect: 'Cast the cleaning effect of Prestidigitation at will',
    rules: [
      'A 1-ft stone sphere etched with mystic sigils.',
      'Anyone touching it can use an action to clean or soil objects in a 1-ft cube, as with Prestidigitation.'
    ],
    room: 'bathhouse-and-laundry',
    glyph: '●'
  },
  {
    slug: 'chest-of-preserving',
    name: 'Chest of Preserving',
    group: 'vessel',
    source: 'WDMM',
    rarity: 'Common',
    type: 'Wondrous item',
    role: 'Preservation',
    effect: 'Food and other perishables inside don’t age or decay',
    rules: [
      'Food and other perishable items don’t age or decay while inside the chest.',
      'The chest is 2½ ft long, 1½ ft wide and 1 ft tall with a half-barrel lid, and weighs 25 lb.',
      'Its lock can be picked with thieves’ tools and a DC 15 Dexterity check. Smashing the lock or any other part of the chest makes it nonmagical.'
    ],
    forCharacter: 'Holds preserved food and reference samples of rare minerals and organic gems such as pearl and amber.',
    caveat: 'Never force it open: a broken lock ruins the magic and everything inside starts to age again.',
    room: 'storage-vault-and-vessel-stores',
    glyph: '▣'
  },
  {
    slug: 'everbright-lantern',
    name: 'Everbright Lantern',
    group: 'vessel',
    source: 'ERLW',
    rarity: 'Common',
    type: 'Wondrous item',
    role: 'Fuel-free lighting',
    effect: 'A bullseye lantern lit by a continual-flame dragonshard',
    rules: [
      'Works like a bullseye lantern (a bright cone and dim light beyond it) but needs no oil.',
      'The light lasts indefinitely, though it can be shuttered.'
    ],
    room: 'library-and-study',
    glyph: '✺'
  },
  {
    slug: 'bottle-of-boundless-coffee',
    name: 'Bottle of Boundless Coffee',
    group: 'vessel',
    source: 'SCC',
    rarity: 'Common',
    type: 'Wondrous item',
    role: 'Hospitality',
    effect: 'A bottle that keeps coffee at the temperature it was poured and refills itself',
    rules: ['Produces coffee and keeps it at the right temperature. A small luxury for long nights of study.'],
    room: 'kitchen-and-pantry',
    glyph: '☕'
  },
  {
    slug: 'cauldron-of-plenty',
    name: 'Cauldron of Plenty',
    group: 'vessel',
    source: 'IDRotF',
    rarity: 'Rare',
    type: 'Wondrous item',
    role: 'Food for guests',
    effect: 'Turns water into hot stew: one meal for four people per gallon, three times a day',
    charges: '3 / dawn',
    rules: [
      'Pour water into the cauldron and stir it for 1 minute, and it becomes a hearty, hot stew. Each gallon is one nourishing meal for up to four people.',
      'It holds up to 30 gallons. The stew stays hot while in the cauldron and cools naturally once removed; the outside stays safe to touch.',
      'It can make stew three times, then stops working until the next dawn.',
      'A 4-ft-wide green-aged copper cauldron, 50 lb, with a lid, side handles and five clawed feet. Satyrs and nymphs holding ladles are embossed on its sides.'
    ],
    forCharacter: 'Enough to feed a full table of guests in the Great Hall three times a day. Hospitality is part of how Lucan does business.',
    room: 'kitchen-and-pantry',
    glyph: '⚗'
  },
  {
    slug: 'hewards-handy-spice-pouch',
    name: 'Heward’s Handy Spice Pouch',
    group: 'vessel',
    source: 'XGE',
    rarity: 'Common',
    type: 'Wondrous item',
    role: 'Seasoning',
    charges: '10 charges, regains 1d6 + 4 at dawn',
    effect: 'Pull out a pinch of any nonmagical seasoning',
    rules: [
      'Expend 1 charge to produce a pinch of any nonmagical spice or seasoning, such as salt, pepper, saffron or cilantro.'
    ],
    room: 'kitchen-and-pantry',
    glyph: '✿'
  },
  {
    slug: 'alchemy-jug',
    name: 'Alchemy Jug',
    group: 'vessel',
    source: 'DMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    role: 'Liquid supply',
    effect: 'Produce one chosen liquid a day, up to a set quantity',
    rules: [
      'Speak a command word to choose a liquid. Daily limits include fresh water (8 gal), salt water (12 gal), beer (4 gal), honey (1 gal), wine (1 gal), vinegar (2 gal), mayonnaise (2 gal) and oil (1 qt).',
      'It can also make acid or basic poison in small amounts. In the Vessel it is used only for domestic liquids.',
      'Once it has produced its maximum, it can’t make more until the next dawn. It pours 2 gallons per minute.'
    ],
    room: 'kitchen-and-pantry',
    glyph: '⚱'
  },
  {
    slug: 'orb-of-time',
    name: 'Orb of Time',
    group: 'vessel',
    source: 'XGE',
    rarity: 'Common',
    type: 'Wondrous item',
    role: 'Timekeeping',
    effect: 'Tells whether it is morning, afternoon, evening or night outside',
    rules: ['Holding the orb, Lucan can use an action to learn the time of day outside — useful in a windowless extradimensional home.'],
    room: 'foyer-and-entry-hall',
    glyph: '◔'
  },
  {
    slug: 'helm-of-comprehending-languages',
    name: 'Helm of Comprehending Languages',
    group: 'vessel',
    source: 'DMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    role: 'Translation',
    effect: 'Cast Comprehend Languages at will',
    rules: ['While wearing the helm, Lucan can use an action to cast Comprehend Languages from it at will.'],
    forCharacter: 'Covers most of what the Comprehend Languages ritual would do, so that ritual is a lower priority while the helm is in the Library.',
    room: 'library-and-study',
    glyph: '⛑'
  },
  {
    slug: 'eyes-of-minute-seeing',
    name: 'Eyes of Minute Seeing',
    group: 'vessel',
    source: 'DMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (lenses)',
    role: 'Close inspection',
    effect: 'Advantage on sight-based Investigation within 1 ft',
    rules: [
      'These crystal lenses fit over the eyes and greatly improve vision within 1 ft.',
      'Darkvision isn’t affected, but the wearer has advantage on Investigation checks that rely on sight while searching an area or studying an object within that range.'
    ],
    forCharacter: 'The ultimate jeweler’s loupe, made for appraisal and checking authenticity. Pairs with his Investigation proficiency.',
    room: 'workshop-and-repair-hall',
    glyph: '◎'
  },
  {
    slug: 'rope-of-mending',
    name: 'Rope of Mending',
    group: 'vessel',
    source: 'XGE',
    rarity: 'Common',
    type: 'Wondrous item',
    role: 'Self-repairing rope',
    effect: 'A cut piece rejoins when its ends are held together for 1 minute',
    rules: [
      'You can cut this 50-ft coil of hemp rope into any number of smaller pieces.',
      'Holding the ends of two pieces together for 1 minute rejoins them. It can’t be joined to other ropes.'
    ],
    room: 'workshop-and-repair-hall',
    glyph: '➰'
  },

  // ── Requested: further items ─────────────────────────────
  // Roughly by value to Lucan.
  {
    slug: 'bracers-of-defense',
    name: 'Bracers of Defense',
    group: 'requested',
    source: 'DMG',
    rarity: 'Rare',
    type: 'Wondrous item',
    slot: 'bracers',
    attunement: 'Required',
    role: 'Defense',
    effect: '+2 AC with no armor and no shield',
    rules: ['While wearing these bracers, Lucan gains a +2 bonus to AC if he is wearing no armor and using no shield.'],
    forCharacter: 'The defensive alternative to the Illusionist’s Bracers: AC 19 with the medium Barrier Tattoo, which counts as no armor.',
    caveat: 'Only one pair of bracers can be worn. These would replace the Illusionist’s Bracers and give up the second Eldritch Blast each turn.',
    glyph: '⛉'
  },
  {
    slug: 'jesters-mask',
    name: 'Jester’s Mask',
    group: 'requested',
    source: 'BMT',
    rarity: 'Legendary',
    type: 'Wondrous item (mask)',
    slot: 'head',
    attunement: 'Required (bard, sorcerer or warlock)',
    role: 'Biggest DC and attack boost',
    effect: '+3 to spell attack rolls and save DCs of Charisma spells',
    rules: [
      'Charismatic Focus: usable as a spellcasting focus. +3 to spell attack rolls and spell save DCs that use Charisma.',
      'Marvelous Escape: when a creature hits Lucan with an attack roll, he can use his reaction to take no damage and teleport up to 30 ft to a space he can see. Once per dawn.',
      'Topsy-Turvy: treat a natural 1 on a d20 as a 20. Once per dawn.'
    ],
    forCharacter:
      'Worn, not held, so it doesn’t take a hand. It stacks with the Rod: spell DC 22 and spell attack +14. The escape doubles as a free dodge that also protects concentration.',
    glyph: '☽'
  },
  {
    slug: 'ioun-stone-of-mastery',
    name: 'Ioun Stone of Mastery',
    group: 'requested',
    source: 'DMG',
    rarity: 'Legendary',
    type: 'Wondrous item (ioun stone)',
    slot: 'ioun',
    attunement: 'Required',
    role: 'Everything +1',
    effect: '+1 proficiency bonus',
    rules: ['While this pale green prism orbits Lucan’s head, his proficiency bonus increases by 1.'],
    forCharacter:
      'PB 5 raises spell DC and attack, proficient saves (CON for concentration, WIS, CHA), skills, Genie’s Wrath damage, Elemental Gift uses (5) and the Sanctuary Vessel healing. A crystal prism suits a jeweler.',
    glyph: '⬙'
  },
  {
    slug: 'amethyst-lodestone',
    name: 'Amethyst Lodestone',
    group: 'requested',
    onSheet: true,
    source: 'FTD',
    rarity: 'Very Rare',
    type: 'Wondrous item',
    slot: 'carried',
    attunement: 'Required',
    role: 'Forced movement and flight',
    charges: '6 charges, regains 1d6 at dawn',
    effect: 'Push a creature 20 ft (DC 18 STR), fly, or cast Reverse Gravity',
    rules: [
      'While carried: advantage on Strength saving throws.',
      'While held, spend charges: Flight (bonus action, 1 charge): flying speed equal to walking speed for 10 minutes, can hover.',
      'Gravitational Thrust (action, 1 charge): a creature within 60 ft makes a DC 18 Strength save or is pushed up to 20 ft in a direction of Lucan’s choice.',
      'Reverse Gravity (action, 3 charges): casts the 7th-level spell (save DC 18).'
    ],
    forCharacter:
      'Made for the Spike Growth combo: a 20-ft push through spikes is 8d4 piercing, and the direction is free, so it can drag targets sideways or toward him. It also gives a 7th-level control spell and more flight than Elemental Gift’s four uses.',
    caveat: 'The DC is fixed at 18, not his spell DC. Charges need it held, so he has to draw it (and stow it again to keep a hand free for Eldritch Blast).',
    glyph: '⬢'
  },
  {
    slug: 'cloak-of-displacement',
    name: 'Cloak of Displacement',
    group: 'requested',
    onSheet: true,
    source: 'DMG',
    rarity: 'Rare',
    type: 'Wondrous item (cloak)',
    slot: 'cloak',
    attunement: 'Required',
    role: 'Defense',
    effect: 'Attacks against Lucan have disadvantage',
    rules: [
      'Creatures have disadvantage on attack rolls against him.',
      'After he takes damage, the effect stops until the start of his next turn. It is suppressed while he is incapacitated, restrained or otherwise unable to move.'
    ],
    forCharacter: 'Disadvantage makes up for the lower AC (17) that comes with the Illusionist’s Bracers: most attacks miss, which also means fewer concentration saves for Spike Growth.',
    caveat: 'Only one cloak can be worn, so it is worn instead of the Cloak of Protection or the Mantle of Spell Resistance.',
    glyph: '≋'
  },
  {
    slug: 'staff-of-power',
    name: 'Staff of Power',
    group: 'requested',
    source: 'DMG',
    rarity: 'Very Rare',
    type: 'Staff',
    slot: 'held',
    attunement: 'Required (sorcerer, warlock or wizard)',
    role: 'Defense and extra spells',
    charges: '20 charges, regains 2d8 + 4 at dawn',
    effect: '+2 AC, saving throws and spell attack rolls; casts Wall of Force, Hold Monster and more',
    rules: [
      'While held: +2 to AC, saving throws and spell attack rolls (not save DC).',
      'Spells from charges use his own DC: Cone of Cold, Fireball (5th), Globe of Invulnerability, Hold Monster, Levitate, Lightning Bolt (5th), Magic Missile, Ray of Enfeeblement, Wall of Force.',
      'Also a +2 quarterstaff, with Power Strike and Retributive Strike.'
    ],
    forCharacter: 'Wall of Force and a second Hold Monster without spending pact slots.',
    caveat: 'Must be held. With the Rod in the other hand, Lucan has no free hand for Eldritch Blast’s somatic component.',
    glyph: '⚚'
  },
  {
    slug: 'scaled-ornament',
    name: 'Scaled Ornament',
    group: 'requested',
    source: 'FTD',
    rarity: 'Rare',
    type: 'Wondrous item (jewelry)',
    slot: 'worn',
    attunement: 'Required',
    role: 'AC and mental defense',
    effect: '+1 AC; immune to charm and fear',
    variants: [
      { id: 'slumbering', label: 'Slumbering', rarity: 'Uncommon', effect: 'Advantage on saves to avoid or end being charmed or frightened' },
      { id: 'stirring', label: 'Stirring', rarity: 'Rare', effect: '+1 AC; immune to charm and fear; chosen allies within 30 ft get advantage against both' },
      { id: 'wakened', label: 'Wakened', rarity: 'Very Rare', effect: 'Stirring, plus once per dawn: take no damage of the hoard dragon’s breath type and regain that many HP instead' },
      { id: 'ascendant', label: 'Ascendant', rarity: 'Legendary', effect: 'Wakened, plus a flying speed equal to his walking speed, with hover' }
    ],
    defaultVariant: 'stirring',
    rules: [
      'Grows in power with its tier. Slumbering: advantage on saves to avoid or end being charmed or frightened.',
      'Stirring: +1 to AC, and Lucan can’t be charmed or frightened. Creatures of his choice within 30 ft have advantage on saves to avoid or end those conditions.',
      'Wakened: once per dawn, as a reaction to damage of the breath type of the dragon whose hoard woke it, he takes no damage and regains that many HP instead.',
      'Ascendant: a flying speed equal to his walking speed, and he can hover.'
    ],
    forCharacter: 'A dragon-scale brooch or pendant suits a jeweler. Cheap AC, and it shuts off conditions that would waste his turns and helps the party too.',
    glyph: '❖'
  },
  {
    slug: 'mantle-of-spell-resistance',
    name: 'Mantle of Spell Resistance',
    group: 'requested',
    source: 'DMG',
    rarity: 'Rare',
    type: 'Wondrous item (cloak)',
    slot: 'cloak',
    attunement: 'Required',
    role: 'Defense against spells',
    effect: 'Advantage on saving throws against spells',
    rules: ['While wearing this cloak, Lucan has advantage on saving throws against spells.'],
    caveat: 'Only one cloak can be worn, and Lucan wears the Cloak of Displacement, so this one means a swap.',
    glyph: '⛆'
  },
  {
    slug: 'wand-of-the-war-mage',
    name: 'Wand of the War Mage',
    group: 'requested',
    source: 'DMG',
    rarity: 'Rare',
    type: 'Wand',
    slot: 'held',
    attunement: 'Required (spellcaster)',
    role: 'Eldritch Blast accuracy',
    effect: '+2 to spell attack rolls; ignore half cover',
    variants: [
      { id: '+1', label: '+1', rarity: 'Uncommon', effect: '+1 to spell attack rolls; ignore half cover' },
      { id: '+2', label: '+2', rarity: 'Rare', effect: '+2 to spell attack rolls; ignore half cover' },
      { id: '+3', label: '+3', rarity: 'Very Rare', effect: '+3 to spell attack rolls; ignore half cover' }
    ],
    defaultVariant: '+2',
    rules: ['While held: a bonus to spell attack rolls set by its rarity, and his spell attacks ignore half cover.'],
    forCharacter: 'More Eldritch Blast hits.',
    caveat: 'Doesn’t raise save DCs. Must be held, so with the Rod in the other hand there is no free hand for Eldritch Blast.',
    glyph: '⟋'
  },
  {
    slug: 'ring-of-free-action',
    name: 'Ring of Free Action',
    group: 'requested',
    source: 'DMG',
    rarity: 'Rare',
    type: 'Ring',
    slot: 'ring',
    attunement: 'Required',
    role: 'Mobility defense',
    effect: 'Magic can’t paralyze or restrain him or reduce his speed',
    rules: [
      'Difficult terrain doesn’t cost him extra movement.',
      'Magic can neither reduce his speed nor cause him to be paralyzed or restrained.'
    ],
    forCharacter: 'Hold Person and Web can’t lock him down. He can walk through his own Spike Growth at full speed, though he still takes the damage.',
    glyph: '◌'
  },
  {
    slug: 'cloak-of-protection',
    name: 'Cloak of Protection',
    group: 'requested',
    source: 'DMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    slot: 'cloak',
    attunement: 'Required',
    role: 'Defense upgrade',
    effect: '+1 AC and +1 to all saving throws',
    rules: ['Grants a +1 bonus to AC and saving throws while worn.'],
    forCharacter: 'A straightforward upgrade: AC 18 and CON saves at +11 for concentration. It stacks with the Ring of Protection.',
    caveat: 'Only one cloak can be worn, and Lucan wears the Cloak of Displacement, so this one means a swap.',
    glyph: '⛨'
  },
  {
    slug: 'ring-of-spell-storing',
    name: 'Ring of Spell Storing',
    group: 'requested',
    onSheet: true,
    source: 'DMG',
    rarity: 'Rare',
    type: 'Ring',
    slot: 'ring',
    attunement: 'Required',
    role: 'Spell flexibility',
    effect: 'Stores up to 5 levels of spells for later casting',
    rules: [
      'Any creature can cast a spell of 1st through 5th level into the ring by touching it. The spell has no effect and is stored instead.',
      'The wearer can cast a stored spell using the original caster’s slot level, DC, attack bonus and spellcasting ability.'
    ],
    forCharacter:
      'One of Lucan’s 5th-level pact slots fills the whole ring. It works better if party casters store low-level utility spells, or if Lucan banks a slot before a short rest.',
    glyph: '◍'
  },
  {
    slug: 'gem-of-seeing',
    name: 'Gem of Seeing',
    group: 'requested',
    source: 'DMG',
    rarity: 'Rare',
    type: 'Wondrous item',
    slot: 'carried',
    attunement: 'Required',
    role: 'Truesight',
    charges: '3 charges, regains 1d3 at dawn',
    effect: 'Truesight 120 ft for 10 minutes while peering through the gem',
    rules: ['Use an action and expend 1 charge. For 10 minutes, Lucan has truesight out to 120 ft when looking through the gem.'],
    forCharacter: 'A strong gem theme. Sees through illusions and invisibility, and reveals shapechangers.',
    glyph: '◇'
  },
  {
    slug: 'sending-stones',
    name: 'Sending Stones',
    group: 'requested',
    source: 'DMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (pair)',
    slot: 'carried',
    role: 'Long-range communication',
    effect: 'Cast Sending to the bearer of the paired stone, once per dawn',
    rules: [
      'Two matched stones. Touching one, use an action to cast Sending; the target is the bearer of the other stone.',
      'Once used, neither stone can be used again until the next dawn.'
    ],
    forCharacter: 'No attunement. Natural for a guild network or for checking in with Zahir’s agents.',
    glyph: '⁂'
  },
  {
    slug: 'illuminators-tattoo',
    name: 'Illuminator’s Tattoo',
    group: 'requested',
    onSheet: true,
    source: 'TCE',
    rarity: 'Common',
    type: 'Wondrous item (tattoo)',
    slot: 'tattoo',
    attunement: 'Required',
    role: 'Secret writing',
    effect: 'Write with a fingertip; once per dawn, make a page of writing visible only to one named creature',
    rules: [
      'Applied by a magic needle that becomes the ink of the tattoo: calligraphy, writing implements and the like.',
      'While the tattoo is on his skin, Lucan can write with his fingertip as if it were an ink pen that never runs out.',
      'As an action, he touches up to one page of writing and speaks a creature’s name. For 24 hours the writing is invisible to everyone except him and that creature. Either of them can end this by touching the script. Once per dawn.'
    ],
    forCharacter:
      'A contract-maker’s tattoo. He can draft and sign terms anywhere, and hide a deal’s wording from everyone but the other party. The calligraphy could continue the liquid-gold Terran script of his pact.',
    caveat: 'Takes an attunement slot for a utility effect. It is the ninth of his ten.',
    glyph: '✒'
  }
]

// Items Lucan wears or carries on the sheet now
export const wornNow = items.filter(i => i.onSheet)

export function bySlot(list: Item[]) {
  return (Object.keys(slots) as ItemSlot[])
    .map(slot => {
      const worn = wornNow.filter(i => i.slot === slot)
      return { slot, ...slots[slot], worn, full: !!slots[slot].max && worn.length >= slots[slot].max!, items: list.filter(i => i.slot === slot) }
    })
    .filter(g => g.items.length)
}

export const itemBySlug = Object.fromEntries(items.map(i => [i.slug, i]))

export const sourceNames: Record<string, string> = {
  PHB: 'Player’s Handbook',
  DMG: 'Dungeon Master’s Guide',
  XGE: 'Xanathar’s Guide to Everything',
  TCE: 'Tasha’s Cauldron of Everything',
  ERLW: 'Eberron: Rising from the Last War',
  IDRotF: 'Icewind Dale: Rime of the Frostmaiden',
  WDMM: 'Waterdeep: Dungeon of the Mad Mage',
  SCC: 'Strixhaven: A Curriculum of Chaos',
  GGR: 'Guildmasters’ Guide to Ravnica',
  BMT: 'The Book of Many Things',
  FTD: 'Fizban’s Treasury of Dragons',
  BGG: 'Bigby Presents: Glory of the Giants',
  PaBTSO: 'Phandelver and Below: The Shattered Obelisk'
}
