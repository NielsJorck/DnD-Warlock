// The Lightless Hunter's equipment. Nothing is played yet: the `owned` items are
// the starting kit as pitched to the DM (the campaign allows one uncommon item,
// no +1 weapons or armor), and the sheet's numbers use them. Mundane gear comes
// from the Ranger's and the Criminal's equipment packages plus what the 200 gp
// bought; `gold` keeps the sums. Rules text is paraphrased from the 2024 books.
// No paintings yet.

import { type Item, groupBySlot } from '../item-types'

export const mundaneGear = [
  { name: 'Studded leather armor', where: 'Worn', note: 'AC 12 + DEX, no Stealth penalty. Ranger package' },
  { name: 'Longbow', where: 'Held', note: '1d8 piercing, range 150/600 ft, two-handed, Slow mastery. Ranger package' },
  { name: 'Scimitar', where: 'Belt', note: '1d6 slashing, finesse, light, Nick mastery. Ranger package' },
  { name: 'Shortsword', where: 'Belt', note: '1d6 piercing, finesse, light: the scimitar’s partner. Ranger package' },
  { name: 'Daggers ×2', where: 'Belt', note: '1d4 piercing, finesse, light, thrown 20/60 ft. Criminal package' },
  { name: 'Arrows ×60', where: 'Quivers', note: '20 from the Ranger package and 40 bought. Three quivers of 20: one from the package, two bought' },
  { name: 'Druidic focus', where: 'Belt', note: 'A sprig of mistletoe: the focus for ranger spells. Ranger package' },
  { name: 'Thieves’ tools', where: 'Belt', note: 'DEX + proficiency, +6: locks and traps. Criminal package' },
  { name: 'Crowbar', where: 'Pack', note: 'Advantage on Strength checks where its leverage applies: stuck doors, lids, grates. Criminal package' },
  { name: 'Explorer’s pack', where: 'Pack', note: 'Backpack, bedroll, oil, rations, rope, tinderbox, torches and a waterskin. Ranger package' },
  { name: 'Traveler’s clothes, 2 pouches', where: 'Pack', note: 'Criminal package' },
  { name: 'Climber’s kit', where: 'Pack', note: 'Bought, 25 gp. Pitons, boot tips, gloves and a harness: anchored, a fall stops 25 ft below the anchor' },
  { name: 'Healer’s kit', where: 'Pack', note: 'Bought, 5 gp. Ten uses: stabilize a dying creature without a Medicine check' },
  { name: 'Caltrops', where: 'Pouch', note: 'Bought, 1 gp. A 5-ft square: DC 15 DEX or 1 piercing and speed 0 until its next turn' }
]

// Where the starting gold came from and went. Prices from the 2024 Player's Handbook.
export const gold = {
  sources: [
    { name: 'The patron’s purse, after travel', gp: 200 },
    { name: 'Ranger equipment, package A', gp: 7 },
    { name: 'Criminal equipment, package A', gp: 16 }
  ],
  purchases: [
    { name: 'Potions of Healing ×2', gp: 100, note: 'Three in all with the DM’s one' },
    { name: 'Climber’s kit', gp: 25, note: 'Shafts, cliffs and the mountain passes' },
    { name: 'Healer’s kit', gp: 5, note: 'Stabilizing without a roll: there is no Healing Word to fall back on' },
    { name: 'Arrows ×40', gp: 2, note: 'Sixty in all' },
    { name: 'Quivers ×2', gp: 2, note: 'A 2024 quiver holds 20 arrows' },
    { name: 'Caltrops', gp: 1, note: 'To slow a chase down a corridor' }
  ],
  reserveNote: 'Kept back for arrows, another potion after the first delve, or toward the 200-gp acorn Summon Beast needs at level 5.'
}
export const goldTotal = gold.sources.reduce((sum, s) => sum + s.gp, 0)
export const goldSpent = gold.purchases.reduce((sum, p) => sum + p.gp, 0)
export const goldLeft = goldTotal - goldSpent

export const items: Item[] = [
  {
    slug: 'bracers-of-archery',
    name: 'Bracers of Archery',
    group: 'owned',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (bracers)',
    slot: 'bracers',
    attunement: 'Required',
    role: 'The one uncommon item: two more damage on every arrow',
    effect: 'Proficiency with longbows and shortbows, and +2 damage on ranged attacks made with them',
    rules: [
      'While wearing them, you have proficiency with the longbow and the shortbow.',
      'You gain a +2 bonus to damage rolls on ranged attacks made with those weapons.',
      'They need attunement, one of the three slots the 2024 rules allow.'
    ],
    forCharacter:
      'Every arrow is 1d8 + 6. With Extra Attack at level 5 that is +4 a round, and it never runs out the way Dreadful Strike and Hunter’s Mark casts do. The proficiency is wasted on a ranger; the damage is the point. The sheet counts them.',
    caveat:
      'The campaign allows one uncommon item and rules out +1 weapons and armor. These aren’t a weapon and don’t touch the attack roll, but +2 damage on every arrow is close to what a +1 bow would add, so they need the DM’s clear yes. If not, the Boots of Elvenkind are the fallback.',
    glyph: '➶'
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
    effect: 'Regain 2d4 + 2 hit points. Drinking it, or giving it to someone within 5 ft, is a bonus action',
    rules: [
      'A creature that drinks it regains 2d4 + 2 hit points.',
      'In the 2024 rules drinking a potion, or administering it to a creature within 5 ft, takes a bonus action.',
      '50 gp each in the Player’s Handbook.'
    ],
    forCharacter: 'A bonus action means they can still shoot on the turn they drink. It competes with Hunter’s Mark for that bonus action.',
    glyph: '⚗'
  },
  {
    slug: 'boots-of-elvenkind',
    name: 'Boots of Elvenkind',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (boots)',
    slot: 'feet',
    role: 'The fallback if the DM says no to the bracers',
    effect: 'Silent steps on any surface, and advantage on Stealth checks',
    rules: ['While you wear them, your steps make no sound, whatever the surface you are moving across.', 'You have advantage on Dexterity (Stealth) checks.'],
    forCharacter:
      'Always on, with nothing to switch on and no attunement. Stealth +6 with advantage takes the 2024 Hide action’s DC 15 from a 60% chance to about 84%. Umbral Sight already hides them in the dark from anything using darkvision, and Pass without Trace adds +10 from level 5, so the boots count most at levels 3 and 4, in lit rooms, and against creatures that don’t see by darkvision. No risk with the DM: nothing like a +1 weapon.',
    caveat:
      'Only one uncommon item at the start, so this replaces the bracers rather than joining them. The wording here is the 2024 version as D&D Beyond gives it; the older text limited the advantage to checks that rely on moving silently, so confirm the printed 2024 text with the DM.',
    glyph: '⟫'
  },
  {
    slug: 'cloak-of-elvenkind',
    name: 'Cloak of Elvenkind',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (cloak)',
    slot: 'cloak',
    attunement: 'Required',
    role: 'Stronger stealth than the boots, for an attunement slot and the hood',
    effect: 'Hood up: Wisdom (Perception) checks to see them have disadvantage, and they have advantage on Stealth checks',
    rules: [
      'While you wear it with the hood up, Wisdom (Perception) checks made to perceive you have disadvantage, and you have advantage on Dexterity (Stealth) checks.',
      'Pulling the hood up or down takes an action.'
    ],
    forCharacter:
      'Umbral Sight covers the dark; the cloak covers everything else, including the creatures that don’t rely on darkvision and the rooms with light. Stealth +6 with advantage like the boots, and watchers roll Perception with disadvantage on top (about −5 to a passive score). The cost is attunement and remembering to have the hood up.',
    caveat: 'Only one uncommon item at the start, so this replaces the bracers rather than joining them. Check the 2024 wording of the hood’s timing.',
    glyph: '◭'
  },
  {
    slug: 'quiver-of-ehlonna',
    name: 'Quiver of Ehlonna',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item',
    slot: 'worn',
    role: 'Every arrow on one hip',
    effect: 'Three compartments: 60 arrows, 18 javelins and 6 long objects such as bows, always weighing 2 lb',
    rules: [
      'Each of its three compartments connects to an extradimensional space: one holds up to sixty arrows or bolts, one up to eighteen javelins, one up to six long objects such as bows, quarterstaffs or spears.',
      'You can draw any item it holds as you would from a normal quiver or scabbard.'
    ],
    forCharacter: 'Comfort more than power: all sixty arrows in one quiver instead of three, and the longbow stowed when the blades come out. No attunement.',
    caveat: 'An alternative to the bracers, not an addition: one uncommon item at the start.',
    glyph: '⇶'
  },
  {
    slug: 'eyes-of-the-eagle',
    name: 'Eyes of the Eagle',
    group: 'wishlist',
    source: 'XDMG',
    rarity: 'Uncommon',
    type: 'Wondrous item (lenses)',
    slot: 'worn',
    attunement: 'Required',
    role: 'Sees everything first',
    effect: 'Advantage on Wisdom (Perception) checks that rely on sight; in clear visibility, fine detail at great distance',
    rules: [
      'While you wear these crystal lenses, you have advantage on Wisdom (Perception) checks that rely on sight.',
      'In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 ft across.'
    ],
    forCharacter: 'Perception is already +7 with Expertise; advantage would add 5 to the passive, 22. Spotting the ambush is the other half of springing one. In a dark dungeon the distance part rarely matters.',
    caveat: 'An alternative to the bracers, not an addition: one uncommon item at the start.',
    glyph: '◉'
  }
]

export const owned = items.filter(i => i.group === 'owned')
export const bySlot = (list: Item[]) => groupBySlot(list, owned)
export const itemBySlug = Object.fromEntries(items.map(i => [i.slug, i]))
