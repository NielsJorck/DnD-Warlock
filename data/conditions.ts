// The 2014 conditions, paraphrased short enough for a tooltip at the table.
export const conditions: { name: string; effect: string }[] = [
  { name: 'Blinded', effect: 'Can’t see; fails sight checks. Attacks against him have advantage, his attacks have disadvantage.' },
  { name: 'Charmed', effect: 'Can’t attack the charmer or target it with harmful effects; the charmer has advantage on social checks. Fey Ancestry: advantage on the save.' },
  { name: 'Deafened', effect: 'Can’t hear; fails hearing checks.' },
  { name: 'Frightened', effect: 'Disadvantage on checks and attacks while the source is in sight; can’t move closer to it.' },
  { name: 'Grappled', effect: 'Speed 0. Ends if the grappler is incapacitated or he is moved out of reach.' },
  { name: 'Incapacitated', effect: 'No actions or reactions.' },
  { name: 'Invisible', effect: 'Can’t be seen without magic. His attacks have advantage, attacks against him have disadvantage.' },
  { name: 'Paralyzed', effect: 'Incapacitated, can’t move or speak. Fails STR and DEX saves; attacks have advantage and hits within 5 ft are crits.' },
  { name: 'Petrified', effect: 'Turned to stone: incapacitated, resistance to all damage, fails STR and DEX saves.' },
  { name: 'Poisoned', effect: 'Disadvantage on attack rolls and ability checks.' },
  { name: 'Prone', effect: 'Disadvantage on attacks. Melee attacks against him have advantage, ranged ones disadvantage. Standing costs half his speed.' },
  { name: 'Restrained', effect: 'Speed 0. Disadvantage on attacks and DEX saves; attacks against him have advantage.' },
  { name: 'Stunned', effect: 'Incapacitated, can’t move, speaks falteringly. Fails STR and DEX saves; attacks against him have advantage.' },
  { name: 'Unconscious', effect: 'Incapacitated, drops what he holds and falls prone. Fails STR and DEX saves; hits within 5 ft are crits.' }
]

export const exhaustionLevels = [
  'None',
  'Disadvantage on ability checks',
  'Speed halved',
  'Disadvantage on attacks and saves',
  'Hit point maximum halved',
  'Speed 0',
  'Death'
]
