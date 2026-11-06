// How the Storm-Hammer fights: the plan in four steps and what each part of his
// turn is spent on. Shown on the Spirit Guardians spell page.

export const tactics = [
  {
    title: 'Open with Spirit Guardians',
    text: 'Cast it on the first turn, from as close as is safe: every enemy that starts its turn within 15 ft, or walks in, takes 3d8 radiant (Wisdom save for half), and moves at half speed. War Caster keeps it up. Spiritual Weapon needs no concentration, so it runs alongside from the bonus action.'
  },
  {
    title: 'Punish staying and leaving',
    text: 'Booming Blade every turn after that: 1d6 + 7 from the staff, 1d8 thunder from Divine Strike and 1d8 from the blade. A creature that walks away takes 2d8 thunder and crawls out at half speed through the aura. If it leaves his reach, War Caster lets him cast Booming Blade as the opportunity attack, and the 2d8 goes off as soon as it keeps walking.'
  },
  {
    title: 'Move them where he wants them',
    text: 'Thunderbolt Strike pushes 10 ft whenever he deals lightning damage. A creature next to him that is pushed 10 ft is still inside the 15-ft aura. A push isn’t willing movement, so it doesn’t set off Booming Blade, but walking back in does. Shield Master shoves it prone or 5 ft away (Athletics +9) after the Attack action, or after Booming Blade if the DM allows it.'
  },
  {
    title: 'Save Destructive Wrath for a big roll',
    text: 'It maxes one lightning or thunder roll, so it is worth the most on many dice. The staff’s Lightning Strike is the best target; Destructive Wave and an upcast Shatter come next and need no concentration.'
  }
]

export const economy = [
  {
    slot: 'Action',
    items: [
      'Spirit Guardians on the first turn',
      'Booming Blade with the staff after that',
      'Toll the Dead at range, Word of Radiance when surrounded',
      'Staff: Lightning Strike or Thunderclap',
      'Destructive Wave for a crowd',
      'Storm Avatar in a long fight'
    ]
  },
  {
    slot: 'Bonus action',
    items: [
      'Spiritual Weapon: cast it, then move it and attack each turn',
      'Healing Word',
      'Shield Master shove after the Attack action (after a melee cantrip if the DM allows)',
      'Boots of Speed on or off',
      'The Stormgirdle’s bolt as a storm avatar'
    ]
  },
  {
    slot: 'Reaction',
    note: 'One a round, and five things want it. Wrath of the Storm is the default; hold it when a breath weapon (Shield Master) or a critical hit on a friend (the emblem) is likely.',
    items: [
      'Wrath of the Storm, 4 a day',
      'Guardian Emblem on a critical hit, 3 a day',
      'Shield, once a day',
      'Shield Master: no damage on a Dexterity save',
      'War Caster: Booming Blade as an opportunity attack'
    ]
  },
  {
    slot: 'Channel Divinity',
    note: '2 per short rest, and a third once a day with the Amulet of the Devout.',
    items: ['Destructive Wrath on a big lightning or thunder roll', 'Turn Undead, destroying CR 1 and lower']
  }
]
