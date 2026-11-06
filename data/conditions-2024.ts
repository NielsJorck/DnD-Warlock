// The 2024 conditions, paraphrased short enough for a tooltip at the table.
// The 2014 wording, which Lucan and the Storm-Hammer use, is in conditions.ts.
export const conditions: { name: string; effect: string }[] = [
  { name: 'Blinded', effect: 'Can’t see; fails any check that needs sight. Attacks against you have advantage, yours have disadvantage.' },
  { name: 'Charmed', effect: 'Can’t attack the charmer or target it with damaging abilities or magic; it has advantage on checks to interact socially with you.' },
  { name: 'Deafened', effect: 'Can’t hear; fails any check that needs hearing.' },
  { name: 'Frightened', effect: 'Disadvantage on checks and attacks while the source is in sight; can’t willingly move closer to it.' },
  { name: 'Grappled', effect: 'Speed 0. Disadvantage on attacks against anyone but the grappler, who can drag you. Escape: an action, Athletics or Acrobatics against its DC.' },
  { name: 'Incapacitated', effect: 'No actions, bonus actions or reactions, and no speaking. Concentration ends. Disadvantage on initiative.' },
  { name: 'Invisible', effect: 'Advantage on initiative. Attacks against you have disadvantage and yours have advantage, unless the creature can see you.' },
  { name: 'Paralyzed', effect: 'Incapacitated, speed 0. Fails STR and DEX saves. Attacks against you have advantage; hits from within 5 ft are critical.' },
  { name: 'Petrified', effect: 'Turned to stone: incapacitated, speed 0, resistance to all damage. Fails STR and DEX saves; attacks against you have advantage.' },
  { name: 'Poisoned', effect: 'Disadvantage on attack rolls and ability checks.' },
  { name: 'Prone', effect: 'Crawl, or stand up for half your speed. Disadvantage on attacks. Attacks from within 5 ft have advantage, from farther away disadvantage.' },
  { name: 'Restrained', effect: 'Speed 0. Disadvantage on attacks and DEX saves; attacks against you have advantage.' },
  { name: 'Stunned', effect: 'Incapacitated. Fails STR and DEX saves; attacks against you have advantage.' },
  { name: 'Unconscious', effect: 'Incapacitated and prone, drops what it holds, speed 0. Fails STR and DEX saves; attacks have advantage, and hits from within 5 ft are critical.' }
]

// 2024 Exhaustion: each level is −2 to every d20 test and −5 ft of speed; level 6 is death.
// A long rest removes one level.
export const exhaustionEffect = (level: number) =>
  level >= 6 ? 'Death' : level ? `−${level * 2} to every d20 test, speed −${level * 5} ft` : 'None'
