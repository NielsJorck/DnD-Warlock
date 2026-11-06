// How the Whisper-Knife fights and works a dungeon: the plan in steps and what
// each part of his turn is spent on. Shown on the Psychic Blades power page.

export const tactics = [
  {
    title: 'Go first, unseen',
    text: 'Scout ahead of the party in the dark with darkvision, Stealth +8 and the cloak’s advantage. Alert puts initiative at +6, and starting a fight hidden means starting it Invisible: advantage on initiative too. The first blade then comes from hiding, with advantage and Sneak Attack. When the party’s controller or healer needs to act first instead, Alert’s swap hands them his roll.'
  },
  {
    title: 'Find Sneak Attack every turn',
    text: 'A friend next to the target is enough, so the blade goes at whatever the front line is fighting. Alone, there are three ways to advantage: Steady Aim from where he stands, Hide before the attack (DC 15, with cover or darkness), or Vex. If the first blade hits without Sneak Attack, Vex gives the second blade advantage, and that one gets it.'
  },
  {
    title: 'Never stand where the enemy wants him',
    text: 'AC 16 and 27 hit points don’t hold a doorway. Throw from 60 ft, and use Cunning Action to Disengage or Hide when something reaches him. From level 5, Cunning Strike’s Withdraw does the retreat for a d6 of Sneak Attack, and Uncanny Dodge halves the hit that gets through.'
  },
  {
    title: 'Keep the party talking without a sound',
    text: 'Psychic Whispers at the dungeon door, on the free use: two allies at level 3, the whole party from 5. While scouting, he reports the guards, the door and the trap ahead in silence. The link runs only through him, so he relays between the others.'
  },
  {
    title: 'Traps and locks are his job',
    text: 'Passive Perception 16 spots most traps before they spring, Investigation +3 works out how they trigger, and Thieves’ Tools +6 disarms them and opens locks. When a check fails, Psi-Bolstered Knack adds a d6 and costs nothing unless it saves the check. The mirror, the 10-ft pole and the chalk go first; his hands go last.'
  },
  {
    title: 'Steel for what the blades can’t hurt',
    text: 'Constructs such as animated armor, flying swords and golems are usually immune to psychic damage, and a site of lost craft may well keep some. Against them he throws daggers: with Nick, two in one Attack action (1d4 + 4, then 1d4) and the bonus action still free. Up close, the shortsword’s Vex gives the next attack advantage, and Sneak Attack with it.'
  }
]

export const economy = [
  {
    slot: 'Action',
    items: [
      'Attack: a Psychic Blade, melee or thrown 60 ft; or two thrown daggers with Nick against what psychic damage can’t touch',
      'Psychic Whispers before a dungeon (a Magic action)',
      'Thieves’ Tools on a lock or trap, a Healer’s Kit on a dying friend (Utilize)',
      'Longstrider on himself or a slow friend',
      'Hide or Dash when the bonus action is taken'
    ]
  },
  {
    slot: 'Bonus action',
    items: ['The second blade, 1d4 + 4', 'Cunning Action: Dash, Disengage or Hide', 'Steady Aim, before moving', 'A Potion of Healing'],
    note: 'One a turn, and most turns want two of these. Steady Aim or Hide buys Sneak Attack; the second blade buys damage.'
  },
  {
    slot: 'Reaction',
    items: ['An opportunity attack with a blade, which can carry a second Sneak Attack in the round', 'Uncanny Dodge from level 5'],
    note: 'Sneak Attack is once per turn, not per round, so a reaction attack on an enemy’s turn can deal it again.'
  },
  {
    slot: 'No action',
    items: ['Sneak Attack on a hit, once per turn', 'Psi-Bolstered Knack when a check fails', 'Initiative Swap right after rolling initiative', 'Cunning Strike from level 5'],
    note: 'Advantage sources: Steady Aim, hidden (Invisible), Vex, a friend’s Help. Without advantage, an ally next to the target is enough.'
  }
]
