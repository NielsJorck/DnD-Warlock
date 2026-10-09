// The Genie Vessel: Lucan's extradimensional home, modelled on
// Mordenkainen's Magnificent Mansion.

export interface VesselRoom {
  slug: string
  name: string
  glyph: string
  summary: string
  details: string[]
}

export const vessel = {
  name: 'The Genie Vessel',
  form: 'A gold ring set with a faceted crystal, worn on Lucan’s hand, that also serves as his spellcasting focus',
  intro:
    'More than a container: a fully stocked, extradimensional home, workshop and refuge, modelled on Mordenkainen’s Magnificent Mansion. Its furnishings, comforts and supplies reflect the Vessel’s identity of earth, stone, crystal and mineral.',
  features: [
    {
      name: 'Extradimensional residence',
      text: 'A permanent, comfortable home with a foyer and several rooms that can be customized.'
    },
    {
      name: 'Fully stocked household',
      text: 'Food, drink, furnishings, lighting, baths, household supplies and workshop materials are always on hand.'
    },
    {
      name: 'Harmless attendants',
      text: 'Magical servants cook, clean, mend, fetch, organize, light fires and serve guests. They can’t attack or directly harm anyone.'
    },
    {
      name: 'Noncombat magic items',
      text: 'Household, scholarly, restorative, artistic or purely decorative magic items can be built into the rooms.'
    },
    {
      name: 'Bag of Holding function',
      text: 'The Vessel can store and retrieve objects like a Bag of Holding. Stored items stay part of its contents until moved out.'
    },
    {
      name: 'Enter at will',
      text: 'Bottled Respite has no long-rest limit. Lucan can step in and out of the Vessel as often as he likes.',
      homebrew: true
    },
    {
      name: '10-minute short rest',
      text: 'From Sanctuary Vessel: ten minutes inside counts as a short rest, and Hit Dice spent there restore +4 (PB) HP. With at-will entry, that can happen more than once a day.'
    },
    {
      name: 'Room adaptation',
      text: 'The layout and furnishings can change to suit Lucan’s needs, as long as they stay noncombat and decorative in purpose.'
    }
  ],
  rules: [
    'Furnishings and created provisions are meant to be used inside the Vessel.',
    'A magic item taken out of the Vessel stays part of its inventory, and the DM rules on how it works outside.',
    'A separate Bag of Holding isn’t needed. Any other extradimensional item needs a DM ruling on how it interacts with the Vessel.'
  ]
}

export const rooms: VesselRoom[] = [
  {
    slug: 'foyer-and-entry-hall',
    name: 'Foyer & Entry Hall',
    glyph: '⛩',
    summary:
      'The Vessel’s arrival point: a broad chamber of warm stone, crystal lamps, mineral inlays and carved doors leading to the rest of the residence.',
    details: [
      'Invited guests are greeted, guided and made comfortable here.',
      'Sanctuary Vessel and Bottled Respite both deliver visitors here.'
    ]
  },
  {
    slug: 'great-hall-and-dining-room',
    name: 'Great Hall & Dining Room',
    glyph: '♜',
    summary:
      'The social heart of the Vessel: a long communal hall for meals, conversation, celebrations, planning and hospitality.',
    details: ['A grand stone table, comfortable seating, mineral chandeliers and room for the whole party and their guests.']
  },
  {
    slug: 'kitchen-and-pantry',
    name: 'Kitchen & Pantry',
    glyph: '⚘',
    summary:
      'A working magical kitchen with ovens, hearths, counters and preparation tables, and a pantry that always seems better stocked than it should be.',
    details: ['Built for everyday meals and elaborate feasts alike.']
  },
  {
    slug: 'bathhouse-and-laundry',
    name: 'Bathhouse & Laundry',
    glyph: '♨',
    summary:
      'Warm mineral pools, showers, washing stations and a laundry alcove. Crystal windows and softly glowing stone give it the feel of a private underground spa.',
    details: ['The most natural place to recover after a hard road.']
  },
  {
    slug: 'library-and-study',
    name: 'Library & Study',
    glyph: '✎',
    summary:
      'Stone shelves, crystal reading lamps, maps, writing desks, translation references and research tables. A quiet room for study, letters and planning.',
    details: ['Where the Book of Shadows is studied and new rituals are copied in.']
  },
  {
    slug: 'workshop-and-repair-hall',
    name: 'Workshop & Repair Hall',
    glyph: '⚒',
    summary:
      'A practical room for crafting, inspection, maintenance and small repairs, with mineral workbenches, tool racks, measuring instruments, clamps and a fireproof work area.',
    details: ['Lucan’s jeweler’s bench lives here, where he cuts stones, appraises pieces and checks their authenticity.']
  },
  {
    slug: 'guest-quarters-and-resting-chambers',
    name: 'Guest Quarters & Resting Chambers',
    glyph: '☾',
    summary:
      'Private bedrooms, shared guest rooms, comfortable sitting areas and quieter rooms for meditation or recovery.',
    details: ['Furniture, lighting and textiles in each room can be changed to suit the guest.']
  },
  {
    slug: 'storage-vault-and-vessel-stores',
    name: 'Storage Vault & Vessel Stores',
    glyph: '▤',
    summary:
      'A secure, organized area for supplies, preserved food, tools, clothing, documents and other things that belong inside the Vessel.',
    details: ['Labeled shelves, locked cabinets and deep mineral alcoves. Things stored with the Bag of Holding function end up here.']
  },
  {
    slug: 'conservatory-and-quiet-garden',
    name: 'Conservatory & Quiet Garden',
    glyph: '❦',
    summary:
      'A calm space of crystal windows, mineral planters, indoor fountains, comfortable seating and carefully controlled light.',
    details: ['For reading, conversation, reflection and harmless decoration.']
  },
  {
    slug: 'servant-galleries-and-maintenance-passages',
    name: 'Servant Galleries & Passages',
    glyph: '⋔',
    summary:
      'Hidden galleries, cupboards, stairways and service corridors behind the visible rooms.',
    details: ['They explain how the Vessel stays fully stocked and spotless while the attendants keep out of sight.']
  }
]

export const roomBySlug = Object.fromEntries(rooms.map(r => [r.slug, r]))
