// The Undertow's equipment for the campaign start: the 2024 Monk's and the
// Sailor's packages (option A of each), the DM's 200 gp and Potion of Healing,
// and the one uncommon magic item, pitched to the DM. Rules text is paraphrased
// from the 2024 books. No paintings yet, so the items show their glyphs.
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
    { label: 'Monk equipment', cp: 1100, note: 'Package A: a spear, five daggers, Carpenter’s Tools, an Explorer’s Pack and 11 gp. Option B is 50 gp, about 10 gp more once the pack and tools are bought back' },
    { label: 'Sailor equipment', cp: 2000, note: 'Package A: a dagger, Navigator’s Tools, rope, traveler’s clothes and 20 gp' }
  ],
  purchases: [
    { name: 'Potion of Healing ×2', cp: 10000, note: 'Three with the DM’s: the front line with 24 hit points wants them' },
    { name: 'Climber’s Kit', cp: 2500, note: 'Anchored, a fall stops 25 ft below the anchor' },
    { name: 'Healer’s Kit', cp: 500, note: 'Ten uses: stabilize without a Medicine check' },
    { name: 'Hooded lantern', cp: 500, note: 'Darkvision is theirs alone; the lantern is for the others behind them' },
    { name: 'Grappling hook', cp: 200, note: 'On the second rope, up ledges and across chasms' },
    { name: 'Crowbar', cp: 200, note: 'Advantage on STR checks where leverage helps' },
    { name: 'Caltrops', cp: 100, note: 'A bag, scattered behind them in a corridor they mean to hold at reach' }
  ],
  plan: 'The rest is kept. Nothing on the way to level 5 needs buying; a third bought potion or an Alchemist’s Fire is within reach.'
}

export const goldIn = gold.sources.reduce((sum, s) => sum + s.cp, 0)
export const goldSpent = gold.purchases.reduce((sum, p) => sum + p.cp, 0)
export const goldLeft = goldIn - goldSpent

export const mundaneGear = [
  { name: 'Daggers ×6', where: 'Sash', note: 'Five from the Monk, one from the Sailor. Monk weapons: +6, 1d6 + 4 piercing with the Martial Arts die, thrown 20/60 ft. For flyers out of reach and things nobody should touch' },
  { name: 'Spear', where: 'Back', note: 'Monk package. A monk weapon (1d6, or 1d8 + 4 two-handed), thrown 20/60 ft. Rarely used: the fists reach further' },
  { name: 'Carpenter’s Tools', where: 'Pack', note: 'Monk package. Seal or pry open a door or container, DC 20' },
  { name: 'Navigator’s Tools', where: 'Pack', note: 'Sailor package. Plot a course, find north, keep the way back on a map' },
  { name: 'Explorer’s Pack', where: 'Pack', note: 'Monk package. Backpack, bedroll, 2 flasks of oil, 10 days of rations, rope, tinderbox, 10 torches, waterskin' },
  { name: 'Rope and traveler’s clothes', where: 'Pack', note: 'Sailor package: a second rope for the grappling hook' },
  { name: 'Climber’s Kit', where: 'Pack', note: 'Bought. Pitons, boot tips, gloves and a harness' },
  { name: 'Healer’s Kit', where: 'Belt', note: 'Bought. 10 uses, tracked on the session page' },
  { name: 'Hooded lantern, grappling hook, crowbar, caltrops', where: 'Pack', note: 'Bought. The dungeon odds and ends' }
]

export const items: Item[] = [
  {
    slug: 'cloak-of-protection',
    name: 'Cloak of Protection',
    group: 'owned',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (cloak)',
    slot: 'cloak',
    attunement: 'Required',
    role: 'The one uncommon item, pitched to the DM',
    effect: '+1 to Armor Class and to every saving throw',
    rules: ['While they wear the cloak, they gain a +1 bonus to Armor Class and saving throws.'],
    forCharacter:
      'A monk wears no armor and holds no shield, so every point of AC has to come from DEX, WIS or an item like this. AC 18 now and 19 with DEX 20 at level 4, and +1 to every save, including the WIS and CON saves a monk isn’t proficient in until level 14. Not a +1 weapon or armor, and nothing else in the build depends on it. The sheet counts it.',
    caveat: 'Needs the DM’s yes as the starting uncommon item. Alternatives below: the Stone of Good Luck or the Periapt of Wound Closure.',
    glyph: '⛨'
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
    forCharacter: 'A bonus action, so it competes with Flurry of Blows and the bonus strike. With 80 ft of movement they are also the one who gets a potion to a fallen friend. The session page counts the three.',
    glyph: '⚱'
  },

  // ── Wishlist: other uncommon items worth the one pick ─────
  {
    slug: 'stone-of-good-luck',
    name: 'Stone of Good Luck',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    slot: 'worn',
    attunement: 'Required',
    role: 'The cloak’s alternative: checks instead of AC',
    effect: '+1 to ability checks and saving throws',
    rules: ['While this polished agate is on their person, they gain a +1 bonus to ability checks and saving throws.'],
    forCharacter: 'The same +1 to saves as the cloak, and +1 to every check (Athletics to climb, Perception for traps, Stealth) in place of the AC. The cloak keeps a monk with 24 hit points standing; the stone is better outside fights.',
    glyph: '◈'
  },
  {
    slug: 'periapt-of-wound-closure',
    name: 'Periapt of Wound Closure',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    slot: 'worn',
    attunement: 'Required',
    role: 'Never bleed out, and heal twice as much on a rest',
    effect: 'Stabilize at the start of each turn while dying; Hit Point Dice heal double',
    rules: [
      'While they wear it, they stabilize whenever they are dying at the start of their turn.',
      'Whenever they roll a Hit Point Die to regain hit points, they double the number of hit points it restores.'
    ],
    forCharacter: 'A d8 Hit Die with CON +2 restores 13 on average instead of 6.5: a short rest heals most of a fight. Good for a long dungeon day with few long rests.',
    caveat: 'Check the 2024 wording of the stabilizing; the 2014 version is what is described here.',
    glyph: '✚'
  },
  {
    slug: 'necklace-of-adaptation',
    name: 'Necklace of Adaptation',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    slot: 'worn',
    attunement: 'Required',
    role: 'For flooded tunnels and poisoned air',
    effect: 'Breathe normally in any environment, and advantage on saves against harmful gases and vapors',
    rules: [
      'While they wear it, they can breathe normally in any environment.',
      'They have advantage on saving throws made against harmful gases and vapors, such as Cloudkill and Stinking Cloud, inhaled poisons and some breath weapons.'
    ],
    forCharacter: 'A long-lost site under a mountain may have flooded halls and bad air. With Stride of the Elements’ swim speed from level 11, nowhere underwater is out of reach.',
    caveat: 'The second sentence is the 2014 wording; check the 2024 text before asking.',
    glyph: '❍'
  }
]

export const owned = items.filter(i => i.group === 'owned')
export const bySlot = (list: Item[]) => groupBySlot(list, owned)
export const itemBySlug = Object.fromEntries(items.map(i => [i.slug, i]))
