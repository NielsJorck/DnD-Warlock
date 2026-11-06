// The Whisper-Knife's equipment for the campaign start: the 2024 Rogue's 100 gp
// (option B) and the Criminal's package, the DM's 200 gp and Potion of Healing, and the
// one uncommon magic item, pitched to the DM. Rules text is paraphrased from the
// 2024 books. No paintings yet, so the items show their glyphs.
//
// nuxt.config.ts imports this file to list the item pages, so it must only
// import relative files with no runtime dependencies.

import { type Item, groupBySlot } from '../item-types'

// Coins are counted in copper: 100 cp to the gold piece, 10 to the silver
export function coins(cp: number) {
  const gp = Math.floor(cp / 100)
  const sp = Math.floor((cp % 100) / 10)
  const c = cp % 10
  const parts = [gp && `${gp} gp`, sp && `${sp} sp`, c && `${c} cp`].filter(Boolean)
  return parts.length ? parts.join(' ') : '0 gp'
}

export const gold = {
  sources: [
    { label: 'The DM’s starting gold', cp: 20000, note: 'Per character, after travel expenses' },
    { label: 'Rogue equipment', cp: 10000, note: 'Option B: 100 gp instead of package A, which brings a bow, leather armor and a second set of Thieves’ Tools he wouldn’t use' },
    { label: 'Criminal equipment', cp: 1600, note: 'Package A: two daggers, Thieves’ Tools, a crowbar, two pouches, traveler’s clothes and 16 gp' }
  ],
  purchases: [
    { name: 'Studded leather armor', cp: 4500, note: 'AC 12 + DEX: AC 16' },
    { name: 'Shortsword', cp: 1000, note: 'Steel up close, with Vex' },
    { name: 'Dagger ×4', cp: 800, note: 'Six with the Criminal’s two: throwing steel, picked up after the fight' },
    { name: 'Burglar’s Pack', cp: 1600, note: 'What package A would have brought' },
    { name: 'Potion of Healing ×2', cp: 10000, note: 'Three with the DM’s' },
    { name: 'Climber’s Kit', cp: 2500, note: 'Anchored, a fall stops 25 ft below the anchor' },
    { name: 'Healer’s Kit', cp: 500, note: 'Ten uses: stabilize without a Medicine check' },
    { name: 'Mirror', cp: 500, note: 'Steel, for looking round corners and under doors' },
    { name: 'Caltrops', cp: 100, note: 'A bag, for a corridor behind him' },
    { name: 'Pole, 10 ft', cp: 5, note: 'For floor tiles that look too clean' },
    { name: 'Chalk ×5', cp: 5, note: 'Marks on the walls of the way back' }
  ],
  plan: 'The rest is kept: the Poisoner’s Kit (50 gp) for Cunning Strike at level 5 is covered, with room for a third potion.'
}

export const goldIn = gold.sources.reduce((sum, s) => sum + s.cp, 0)
export const goldSpent = gold.purchases.reduce((sum, p) => sum + p.cp, 0)
export const goldLeft = goldIn - goldSpent

export const mundaneGear = [
  { name: 'Studded leather armor', where: 'Worn', note: 'Bought: AC 16 with DEX 18, no Stealth penalty' },
  { name: 'Daggers ×6', where: 'Bandolier', note: 'Two from the Criminal, four bought. 1d4 piercing, Finesse, Light, thrown 20/60, Nick mastery: steel for what psychic damage can’t touch' },
  { name: 'Shortsword', where: 'Belt', note: 'Bought. 1d6 piercing, Finesse, Light, Vex mastery' },
  { name: 'Thieves’ Tools', where: 'Belt', note: 'Criminal package' },
  { name: 'Burglar’s Pack', where: 'Pack', note: 'Bought. Backpack, ball bearings, bell, 10 candles, crowbar, hooded lantern, 7 flasks of oil, 5 days of rations, rope, tinderbox, waterskin' },
  { name: 'Crowbar', where: 'Pack', note: 'Criminal package; the pack brings a second' },
  { name: 'Pouches ×2 and traveler’s clothes', where: 'Pack', note: 'Criminal package' },
  { name: 'Climber’s Kit', where: 'Pack', note: 'Bought. Pitons, boot tips, gloves and a harness' },
  { name: 'Healer’s Kit', where: 'Belt', note: 'Bought. 10 uses, tracked on the session page' },
  { name: 'Mirror, caltrops, 10-ft pole, chalk', where: 'Pack', note: 'Bought. The trap-finder’s odds and ends' }
]

export const items: Item[] = [
  {
    slug: 'cloak-of-elvenkind',
    name: 'Cloak of Elvenkind',
    group: 'owned',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (cloak)',
    slot: 'cloak',
    attunement: 'Required',
    role: 'The one uncommon item, pitched to the DM',
    effect: 'Hood up: advantage on Stealth checks, and disadvantage on Perception checks to perceive him',
    rules: [
      'While he wears it with the hood up, Wisdom (Perception) checks made to perceive him have disadvantage, and he has advantage on Dexterity (Stealth) checks.',
      'Pulling the hood up or down takes an action.'
    ],
    forCharacter:
      'Stealth +8 with advantage while scouting ahead, and any guard looking for him rolls at disadvantage. It works with Hide in a fight too: the DC 15 Stealth check is almost certain with the hood up, and a hidden rogue attacks Invisible, with advantage and Sneak Attack. The sheet counts it.',
    caveat: 'Needs the DM’s yes as the starting uncommon item. Whether the 2024 wording still takes an action to pull the hood up or down is worth checking.',
    glyph: '❦'
  },
  {
    slug: 'potion-of-healing',
    name: 'Potion of Healing',
    group: 'owned',
    source: 'XPHB',
    rarity: 'Common',
    type: 'Potion',
    slot: 'carried',
    quantity: 3,
    role: 'One from the DM, two bought',
    effect: 'Regain 2d4 + 2 hit points. Drinking it, or giving it to a creature within 5 ft, is a bonus action',
    rules: [
      'A creature that drinks it regains 2d4 + 2 hit points.',
      'Drinking it, or administering it to another creature within 5 ft, takes a bonus action in the 2024 rules.',
      '50 gp each.'
    ],
    forCharacter: 'A bonus action, so it competes with the second blade and Cunning Action rather than the attack. The session page counts the three.',
    glyph: '⚱'
  },

  // ── Wishlist: other uncommon items worth the one pick ─────
  {
    slug: 'boots-of-elvenkind',
    name: 'Boots of Elvenkind',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (boots)',
    slot: 'feet',
    role: 'The cloak’s alternative, with no attunement',
    effect: 'Silent steps on any surface, and advantage on Stealth checks to move silently',
    rules: ['While he wears them, his steps make no sound, whatever the surface.', 'He has advantage on Dexterity (Stealth) checks that rely on moving silently.'],
    forCharacter: 'No attunement, but the advantage covers sound only, where the cloak’s covers every Stealth check and makes him harder to spot.',
    caveat: 'The 2024 wording of the advantage may be broader or narrower than this; check it before asking.',
    glyph: '⟫'
  },
  {
    slug: 'gloves-of-thievery',
    name: 'Gloves of Thievery',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (gloves)',
    slot: 'worn',
    role: 'For a DM who loves locks',
    effect: 'Invisible while worn. +5 to Sleight of Hand checks and to Dexterity checks to pick locks',
    rules: ['The gloves are invisible while worn.', 'While wearing them, he gets +5 to Dexterity (Sleight of Hand) checks and to Dexterity checks made to pick locks.'],
    forCharacter: 'Thieves’ Tools +11. Strong at level 3, less so from 7, when Reliable Talent already makes a DC 15 lock certain.',
    caveat: 'The bonus is from the 2014 version; check the 2024 wording.',
    glyph: '✋'
  },
  {
    slug: 'bag-of-holding',
    name: 'Bag of Holding',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    slot: 'carried',
    role: 'For the party’s loot',
    effect: 'Holds 500 lb, up to 64 cubic ft, and always weighs 15 lb',
    rules: [
      'The bag holds up to 500 pounds, not exceeding a volume of 64 cubic feet, and weighs 15 pounds however full it is. Retrieving an item from it takes an action (Utilize).',
      'If it is overloaded, pierced or torn, it bursts and is destroyed, scattering its contents into the Astral Plane.',
      'Placing it inside another extradimensional space, such as a Portable Hole, destroys both and opens a gate to the Astral Plane.'
    ],
    forCharacter: 'An expedition to recover lost craft will bring back more than four packs hold. Worth it only if nobody else in the party takes one.',
    glyph: '◫'
  }
]

export const owned = items.filter(i => i.group === 'owned')
export const bySlot = (list: Item[]) => groupBySlot(list, owned)
export const itemBySlug = Object.fromEntries(items.map(i => [i.slug, i]))
