// The Storm-Hammer's equipment. Nothing is played yet: the `owned` items are his
// starting kit as pitched to the DM, and the sheet's numbers use them (plain
// plate, a +1 amulet). Rules text is paraphrased from the 2014 sources.
// Paintings live in public/images/ (WebP) with the originals in art/.

import { type Item, groupBySlot } from '../item-types'

export const mundaneGear = [
  { name: 'Diamonds for Revivify', where: 'Pouch', note: '300 gp each, consumed by the spell. Worth carrying two' },
  { name: 'Diamond dust', where: 'Pouch', note: '100 gp, consumed by Greater Restoration' },
  { name: 'Smith’s tools', where: 'Carried', note: 'Hammer, tongs, files: he keeps his own plate in repair' },
  { name: 'Prayer book', where: 'Pack', note: 'Kord’s storm litanies, the storm sigil on its cover. Acolyte' },
  { name: 'Incense and vestments', where: 'Pack', note: 'Five sticks of incense and the temple’s blue vestments. Acolyte' },
  { name: 'Warhammer', where: 'Carried', note: 'A spare from the temple forge: 1d8 bludgeoning, 1d10 in two hands' },
  { name: 'Explorer’s pack', where: 'Pack', note: 'Bedroll, mess kit, tinderbox, torches, rations, waterskin and 50 ft of rope' }
]

export const items: Item[] = [
  {
    slug: 'stormgirdle',
    name: 'Stormgirdle',
    group: 'owned',
    source: 'EGW',
    rarity: 'Legendary',
    type: 'Wondrous item (belt), a Vestige of Divergence',
    slot: 'belt',
    attunement: 'Required',
    role: 'Kord’s belt, and the center of his faith',
    effect: 'Strength 21. Resistance to lightning and thunder. Once a day, a storm avatar for 1 minute',
    charges: 'Storm Avatar 1 / dawn',
    rules: [
      'His Strength is 21 while he wears it, unless his own score is higher. This is the dormant state, the one it starts in.',
      'Resistance to lightning and thunder damage.',
      'Storm Avatar: an action turns him into a storm avatar for 1 minute, once per dawn. He is immune to lightning and thunder damage, and his weapon hits deal thunder instead of bludgeoning (lightning instead of piercing or slashing).',
      'As a storm avatar, a bonus action on each turn strikes one creature he can see within 30 ft: DC 15 Dexterity save, 3d6 lightning, half on a success.',
      'A vestige can grow with its wielder. Awakened: Strength 23, a 4d6 bolt, and a 30-ft flying speed as an avatar. Exalted: Strength 25, a 5d6 bolt, and Control Weather once per dawn.'
    ],
    forCharacter:
      'Strength 21 without spending anything on it: +5 on the staff, Athletics +9 for Shield Master’s shoves, and plate’s Strength 15 covered. The avatar’s bolt is lightning, so Thunderbolt Strike pushes the target 10 ft and Destructive Wrath can max it (18). As an avatar the staff deals thunder, so Destructive Wrath can max its weapon die too. The avatar takes an action, and the bolt the bonus action Spiritual Weapon wants: it suits a long fight more than a short one.',
    caveat: 'Legendary, so it needs the DM’s yes to start with it. Whether it awakens in play is the DM’s story.',
    glyph: 'ϟ',
    art: {
      src: '/images/stormgirdle.webp', // original in art/stormgirdle.original.webp
      alt: 'The Stormgirdle on a stone plinth under a lightning-split sky: a wide leather belt banded with iron plates of glowing blue lightning runes, its buckle a bearded storm god’s face with blazing blue eyes, and STORMGIRDLE carved into the stone below.',
      caption: 'The Stormgirdle, its buckle the bearded face of the storm.',
      focus: '50% 40%'
    }
  },
  {
    slug: 'staff-of-thunder-and-lightning',
    name: 'Staff of Thunder and Lightning',
    group: 'owned',
    source: 'DMG',
    rarity: 'Very Rare',
    type: 'Staff (quarterstaff)',
    slot: 'held',
    attunement: 'Required',
    role: 'His weapon, in one hand beside the shield',
    effect: '+2 quarterstaff, +11 to hit for 1d6 + 7. Five storms, each once a day',
    charges: 'Each property 1 / dawn',
    rules: [
      'A +2 magic quarterstaff. Quarterstaffs are versatile: 1d6 in one hand, 1d8 in two.',
      'Lightning: when he hits with a melee attack, 2d6 lightning more.',
      'Thunder: when he hits with a melee attack, a thunderclap heard 300 ft away. The target makes a DC 17 Constitution save or is stunned until the end of his next turn.',
      'Lightning Strike: an action sends a bolt down a line 120 ft long and 5 ft wide. DC 17 Dexterity save, 9d6 lightning, half on a success.',
      'Thunderclap: an action. Every other creature within 60 ft makes a DC 17 Constitution save: 2d6 thunder and deafened for 1 minute, or half damage and not deafened.',
      'Thunder and Lightning: an action that uses Lightning Strike and Thunderclap together without spending their own uses.',
      'Each property, once used, can’t be used again until the next dawn.'
    ],
    forCharacter:
      'Destructive Wrath on Lightning Strike is his biggest number: 54 lightning down the whole line. Thunder on a Booming Blade hit sets it up, since a stunned creature fails Dexterity saves. The Lightning property’s 2d6 is lightning, so Thunderbolt Strike can push. Its properties aren’t spells, so Elemental Adept doesn’t touch them and the DCs are the staff’s own 17.',
    caveat: 'A quarterstaff already works one-handed with a shield, so the earlier idea of reworking it into a warhammer isn’t needed. A warhammer’s d8 would add one point on average.',
    glyph: '⚚',
    art: {
      src: '/images/staff-of-thunder-and-lightning.webp',
      alt: 'The Staff of Thunder and Lightning upright on a crag in a lightning storm: a dark shaft carved with glowing blue runes and bound in silver bands, a spiked iron foot, and a three-pronged silver head holding a crackling blue crystal.',
      caption: 'Runes down the shaft, a storm crystal in its three prongs.',
      focus: '50% 20%'
    }
  },
  {
    slug: 'sentinel-shield',
    name: 'Sentinel Shield',
    group: 'owned',
    source: 'DMG · TCE',
    rarity: 'Uncommon',
    type: 'Shield, bearing a Guardian Emblem',
    slot: 'held',
    attunement: 'Required by a cleric or paladin (the emblem)',
    role: 'The shield of the temple that was struck',
    effect: '+2 AC. Advantage on initiative and Perception. Turns 3 critical hits a day into normal hits',
    charges: 'Emblem: 3, all back at dawn',
    rules: [
      'Sentinel Shield: +2 AC like any shield. While he holds it, he has advantage on initiative rolls and Wisdom (Perception) checks.',
      'Guardian Emblem: an action attaches it to armor or a shield, or takes it off. It has 3 charges.',
      'When he or a creature he can see within 30 ft suffers a critical hit, his reaction spends a charge to make it a normal hit. All charges return at dawn.'
    ],
    forCharacter:
      'Advantage on initiative makes up for his Dexterity 11, and advantage on Perception adds 5 to his passive Perception: 23. The emblem takes his reaction, the one Wrath of the Storm, Shield and Shield Master also want.',
    caveat: 'Two official uncommon items. The emblem attaches to any shield as written, so carrying both as one heirloom needs no new rules.',
    glyph: '◉',
    art: {
      src: '/images/sentinel-shield.webp',
      alt: 'A round shield of iron and lapis-blue stone veined with lightning, its rim worked in knotwork: a carved storm cloud around a single glowing blue eye, above a winged, bearded dwarven face and three blue gems.',
      caption: 'The storm eye of the sentinel, Kord’s emblem below it.'
    }
  },
  {
    slug: 'boots-of-speed',
    name: 'Boots of Speed',
    group: 'owned',
    source: 'DMG',
    rarity: 'Rare',
    type: 'Wondrous item (boots)',
    slot: 'feet',
    attunement: 'Required',
    role: 'Takes Spirit Guardians to the enemy',
    effect: 'Bonus action: speed 25 → 50 ft, and opportunity attacks against him have disadvantage',
    charges: '10 minutes / long rest',
    rules: [
      'A bonus action clicks the heels: his walking speed doubles and creatures making opportunity attacks against him have disadvantage. Clicking again ends it.',
      'Once they have been used for 10 minutes in total, they stop working until he finishes a long rest.'
    ],
    forCharacter:
      'The bonus action competes with Spiritual Weapon and Healing Word, so they go on before a fight or on a quiet turn. Whether walking the Spirit Guardians aura onto enemies hurts them is a question for the DM.',
    glyph: '⟫',
    art: {
      src: '/images/boots-of-speed.webp',
      alt: 'A pair of heavy fur-cuffed dwarven boots of dark leather and riveted iron with glowing lightning bolts on the shins and toe caps, on wet black rock with burning footprints behind them and a dwarven fortress under a storm.',
      caption: 'Lightning on the toe caps and scorched footprints behind.',
      focus: '30% 50%'
    }
  },
  {
    slug: 'stormforged-plate',
    name: 'Stormforged Plate',
    group: 'owned',
    homebrew: true,
    source: 'DMG',
    rarity: 'Varies',
    type: 'Armor (plate)',
    slot: 'armor',
    role: 'Dwarven plate in Kord’s blue',
    effect: 'AC 18, 20 with the shield. Perhaps +2, and Thunder Step once a day',
    rules: [
      'Plate: AC 18. It needs Strength 15 (the Stormgirdle covers it) and gives disadvantage on Stealth. A dwarf keeps his full speed in it.',
      'Magic armor adds its bonus to AC and needs no attunement.',
      'The homebrew ask: Thunder Step once a day. He teleports up to 90 ft, taking one willing creature along if he likes, and each creature within 10 ft of where he left makes a Constitution save against his spell DC (17): 3d10 thunder, half on a success.'
    ],
    variants: [
      { id: 'plain', label: 'Plate', rarity: 'Common', effect: 'Mundane plate: AC 18, 20 with the shield. What the sheet uses' },
      { id: 'plus1', label: 'Plate +1', rarity: 'Rare', effect: 'AC 19, 21 with the shield' },
      { id: 'plus2', label: 'Plate +2', rarity: 'Very Rare', effect: 'AC 20, 22 with the shield' }
    ],
    defaultVariant: 'plus2',
    forCharacter:
      'Thunder Step is thunder damage: Destructive Wrath maxes it to 30, and Elemental Adept (thunder) applies, since he casts it as a spell. It gets him out of a crowd, or carries a friend out of one.',
    caveat: 'The Thunder Step is homebrew and needs the DM’s yes, and so does whether it makes the armor need attunement. The same ask could sit on the boots instead.',
    glyph: '⛨',
    art: {
      src: '/images/stormforged-plate.webp',
      alt: 'A suit of dwarven plate on a stand in a forge temple: dark iron enameled in deep blue with bronze knotwork, a storm cloud and lightning bolt on the breastplate, a glowing bolt on the pauldron and a blue knotwork tabard, with a hammer and a storm-sigil prayer book at its feet.',
      caption: 'Forged in the temple, the storm sigil on its breastplate.',
      focus: '50% 35%'
    }
  },
  {
    slug: 'amulet-of-the-devout',
    name: 'Amulet of the Devout',
    group: 'owned',
    source: 'TCE',
    rarity: 'Varies',
    type: 'Wondrous item (holy symbol)',
    slot: 'worn',
    attunement: 'Required by a cleric or paladin',
    role: 'A higher DC, and one more Destructive Wrath a day',
    effect: '+1 to spell attacks and spell save DCs (+2 or +3 in rarer versions). One free Channel Divinity a day',
    charges: 'Free Channel Divinity 1 / dawn',
    rules: [
      'A holy symbol inlaid with precious stones or metals. While he wears it, he adds its bonus to his spell attack rolls and the save DCs of his spells.',
      'Once per dawn, he can use Channel Divinity without spending a use.'
    ],
    variants: [
      { id: 'plus1', label: '+1', rarity: 'Uncommon', effect: 'DC 17, spell attack +9' },
      { id: 'plus2', label: '+2', rarity: 'Rare', effect: 'DC 18, spell attack +10' },
      { id: 'plus3', label: '+3', rarity: 'Very Rare', effect: 'DC 19, spell attack +11' }
    ],
    defaultVariant: 'plus1',
    forCharacter:
      'His holy symbol and the focus for his spells. The sheet counts the +1: DC 17 and spell attack +9, and +5 and DC 13 for his Magic Initiate spells, which it raises too. The prayer round its rim: “O Radiant Lord of the Storms, guide my steps, grant me strength, shield me always, fill me with your light, cleanse my fear.” At this table spell bonuses from different items add up (a DM ruling), so a later focus would stack with it.',
    caveat: 'Which version is the DM’s pick; the sheet counts the +1.',
    glyph: '✦',
    art: {
      src: '/images/amulet-of-the-devout.webp',
      alt: 'A silver medallion on a heavy chain over blue velvet: a golden lightning bolt on a disc of blue stone veined with lightning, the rim engraved with a prayer to the Radiant Lord of the Storms.',
      caption: 'A prayer to the Radiant Lord of the Storms round its rim.'
    }
  }
]

export const owned = items.filter(i => i.group === 'owned')
export const bySlot = (list: Item[]) => groupBySlot(list, owned)
export const itemBySlug = Object.fromEntries(items.map(i => [i.slug, i]))
