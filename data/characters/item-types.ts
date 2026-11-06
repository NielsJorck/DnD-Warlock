// Item shapes every character's equipment uses: groups, rarities, where an item
// is worn, versions, paintings, and the books they come from.

export type ItemGroup = 'owned' | 'wishlist' | 'vessel'
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Artifact' | 'Varies'

export interface Item {
  slug: string
  name: string
  group: ItemGroup
  source?: string
  rarity?: Rarity
  type: string
  attunement?: string
  role?: string // a short line on what it does for the character, when the effect doesn’t already say it
  effect: string
  rules: string[]
  forCharacter?: string
  caveat?: string
  charges?: string
  quantity?: number
  homebrew?: boolean
  classFeature?: boolean // granted by a class feature, not a magic item
  room?: string // Vessel room slug
  slot?: ItemSlot // where it is worn or kept; Vessel stores have none
  variants?: ItemVariant[]
  defaultVariant?: string // variant id requested unless the DM picks another
  glyph: string
  art?: ItemArt
  see?: { to: string; label: string } // a page of the site that goes deeper
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
  prompt?: string // brief for generating a painted version at the same path (not shown on the site)
}

export const groupLabels: Record<ItemGroup, string> = {
  owned: 'Owned',
  wishlist: 'Wishlist',
  vessel: 'Vessel stores'
}

// Where an item is worn. A max means only that many can be worn at once.
export type ItemSlot = 'ring' | 'bracers' | 'cloak' | 'head' | 'body' | 'belt' | 'armor' | 'feet' | 'tattoo' | 'ioun' | 'worn' | 'held' | 'carried'

export const slots: Record<ItemSlot, { label: string; max?: number; rule: string }> = {
  ring: { label: 'Rings', max: 4, rule: 'Up to four rings, as allowed at this table' },
  bracers: { label: 'Bracers', max: 1, rule: 'One pair of bracers' },
  cloak: { label: 'Cloak', max: 1, rule: 'One cloak' },
  head: { label: 'Headwear', max: 1, rule: 'One mask, hat or helm' },
  body: { label: 'Robe', max: 1, rule: 'One robe' },
  belt: { label: 'Belt or sash', max: 1, rule: 'One belt or sash' },
  armor: { label: 'Armor', max: 1, rule: 'One suit of armor' },
  feet: { label: 'Boots', max: 1, rule: 'One pair of boots' },
  tattoo: { label: 'Tattoos', rule: 'No limit beyond attunement' },
  ioun: { label: 'Ioun stones', rule: 'They orbit the head; no limit beyond attunement' },
  worn: { label: 'Other worn', rule: 'Jewelry and ornaments; no limit beyond attunement' },
  held: { label: 'Held', rule: 'Weapons, shields, rods, wands and staffs, swapped in hand as needed' },
  carried: { label: 'Carried', rule: 'Kept in a pouch or pack' }
}

export const variantOf = (item: Item, id?: string) =>
  item.variants?.find(v => v.id === (id || item.defaultVariant)) ?? item.variants?.[0]

// A wishlist grouped by slot, each group headed by what's already worn there
export function groupBySlot(list: Item[], worn: Item[]) {
  return (Object.keys(slots) as ItemSlot[])
    .map(slot => {
      const inSlot = worn.filter(i => i.slot === slot)
      return { slot, ...slots[slot], worn: inSlot, full: !!slots[slot].max && inSlot.length >= slots[slot].max!, items: list.filter(i => i.slot === slot) }
    })
    .filter(g => g.items.length)
}

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
  EGW: 'Explorer’s Guide to Wildemount',
  FTD: 'Fizban’s Treasury of Dragons',
  BGG: 'Bigby Presents: Glory of the Giants',
  PaBTSO: 'Phandelver and Below: The Shattered Obelisk',
  OotA: 'Out of the Abyss (adapted)',
  TftYP: 'Tales from the Yawning Portal'
}
