// The Storm-Hammer's spells. Rules text is paraphrased from the 2014 sources.
// A cleric prepares from his whole class list after each long rest; the
// `prepared` ones here are his starting set, and `higher` says what a bigger
// slot adds (he has 4 / 3 / 3 / 3 / 2 slots of 1st to 5th level).

import type { School } from '../shared'

export type SpellStatus = 'known' | 'domain' | 'prepared' | 'candidate' | 'future'
export type SpellAccess = 'Cleric' | 'Tempest Domain' | 'Magic Initiate'

export interface Spell {
  slug: string
  name: string
  level: number // 0 for a cantrip
  school: School
  castingTime: string
  range: string
  components: string
  material?: string
  duration: string
  concentration: boolean
  ritual: boolean
  source: string // PHB, XGE, TCE, SCAG
  access: SpellAccess
  status: SpellStatus
  role: string // a few words on what it does for him
  summary: string // the spell, paraphrased
  higher?: string // what a higher slot adds, in his slot levels
  notes?: string // how it fits the Storm-Hammer
  damage?: string // e.g. '3d8 radiant'
  save?: string // e.g. 'WIS'
  attack?: boolean // makes a spell attack (Booming Blade's is a weapon attack: false)
  // Dice the session page rolls, by slot level; healing includes his +4
  dice?: Partial<Record<number, string>>
  // Deals that damage: Destructive Wrath can max it. With two kinds of damage in
  // `dice`, the lightning or thunder dice come first (Destructive Wave: 5d10+5d10)
  storm?: 'lightning' | 'thunder'
}

export const statusLabels: Record<SpellStatus, string> = {
  known: 'Known',
  domain: 'Tempest Domain',
  prepared: 'Prepared',
  candidate: 'Candidate',
  future: 'Future'
}

export const statusTone: Record<SpellStatus, string> = {
  known: 'border-gold/50 bg-gold/10 text-gold-light',
  domain: 'border-sapphire/50 bg-sapphire/10 text-sapphire',
  prepared: 'border-gold/40 text-gold-light',
  candidate: 'border-quartz/40 bg-quartz/10 text-quartz',
  future: 'border-topaz/40 bg-topaz/10 text-topaz'
}

export const accessTone: Record<SpellAccess, string> = {
  Cleric: 'text-gold-light',
  'Tempest Domain': 'text-sapphire',
  'Magic Initiate': 'text-amethyst'
}

// Ready to cast today: cantrips and Magic Initiate, the domain spells and the prepared ones
export const ready = (s: Spell) => s.status === 'known' || s.status === 'domain' || s.status === 'prepared'

export const spells: Spell[] = [
  // ── Cantrips ──────────────────────────────────────────────
  {
    slug: 'toll-the-dead',
    name: 'Toll the Dead',
    level: 0,
    school: 'Necromancy',
    castingTime: '1 action',
    range: '60 ft',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'XGE',
    access: 'Cleric',
    status: 'known',
    role: 'Damage at range',
    save: 'WIS',
    damage: '2d12 necrotic, 2d8 if unhurt',
    dice: { 0: '2d12' },
    summary:
      'A mournful bell sounds around a creature he can see within range. On a failed WIS save it takes 2d8 necrotic damage, or 2d12 if it is missing any of its hit points. One more die at level 11.',
    notes:
      'His action when an enemy stays out of reach. Most targets are hurt by the time he casts it, so 2d12 is the usual roll; against an unhurt one it is 2d8. Necrotic, so Destructive Wrath and Elemental Adept don’t touch it.'
  },
  {
    slug: 'word-of-radiance',
    name: 'Word of Radiance',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: '5 ft',
    components: 'V, M',
    material: 'a holy symbol',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'XGE',
    access: 'Cleric',
    status: 'known',
    role: 'Damage when surrounded',
    save: 'CON',
    damage: '2d6 radiant',
    dice: { 0: '2d6' },
    summary:
      'He speaks a divine word and radiance bursts from him. Each creature he chooses that he can see within 5 ft makes a CON save or takes 2d6 radiant damage. One more die at level 11.',
    notes:
      'Worth more than Booming Blade only when three or more enemies crowd him, since the staff hit also carries Divine Strike. It never hurts allies, and it adds to Spirit Guardians against a crowd that has closed in.'
  },
  {
    slug: 'guidance',
    name: 'Guidance',
    level: 0,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'known',
    role: 'Ability-check support',
    summary:
      'Touch a willing creature. Once before the spell ends, it can roll a d4 and add it to one ability check of its choice, before or after rolling. Then the spell ends.',
    notes: 'Concentration, so not in a fight: casting it would end Spirit Guardians. Out of combat it goes on every check that matters.'
  },
  {
    slug: 'thaumaturgy',
    name: 'Thaumaturgy',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '30 ft',
    components: 'V',
    duration: 'Up to 1 minute',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'known',
    role: 'Signs of the Storm Lord',
    summary:
      'A minor wonder within range: his voice booms up to three times as loud, flames flicker, brighten, dim or change color, the ground trembles harmlessly, a sound such as a rumble of thunder rings out from a point he picks, an unlocked door or window flies open or slams shut, or his eyes change. Up to three of the 1-minute effects can run at once, and he can end one as an action.',
    notes: 'Thunder in his voice, a tremor underfoot, lightning in his eyes. The sound from a point he picks makes a fair distraction.'
  },
  {
    slug: 'spare-the-dying',
    name: 'Spare the Dying',
    level: 0,
    school: 'Necromancy',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'known',
    role: 'Stabilize a dying ally',
    summary: 'Touch a living creature at 0 hit points and it becomes stable. No effect on undead or constructs.',
    notes:
      'Free, but it takes his action and a touch. Healing Word costs a slot, yet works from 60 ft as a bonus action and puts the ally back in the fight.'
  },

  // ── Magic Initiate (Wizard) ───────────────────────────────
  {
    slug: 'booming-blade',
    name: 'Booming Blade',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Self (5-ft radius)',
    components: 'S, M',
    material: 'a melee weapon worth at least 1 sp',
    duration: '1 round',
    concentration: false,
    ritual: false,
    source: 'TCE',
    access: 'Magic Initiate',
    status: 'known',
    role: 'Melee attack that punishes leaving',
    damage: '1d8 thunder on a hit, 2d8 thunder if it moves',
    dice: { 0: '1d8' },
    storm: 'thunder',
    summary:
      'He makes a melee attack with the weapon against one creature within 5 ft. On a hit it takes the attack’s normal effects and 1d8 thunder damage more, and booming energy wraps it until the start of his next turn. If it willingly moves 5 ft or more before then, it takes 2d8 thunder damage and the spell ends. At level 11: 2d8 on a hit, 3d8 for moving.',
    notes:
      'His usual action from the second round: +11 with the staff for 1d6 + 7, plus 1d8 thunder from the spell and 1d8 from Divine Strike. Only willing movement sets off the 2d8, so a push or a shove doesn’t, and War Caster lets him cast it as an opportunity attack. It is a weapon attack, so INT plays no part, and Elemental Adept (thunder) covers the spell’s dice but not Divine Strike.'
  },
  {
    slug: 'shocking-grasp',
    name: 'Shocking Grasp',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Magic Initiate',
    status: 'known',
    role: 'Lightning push and a way out',
    attack: true,
    damage: '2d8 lightning',
    dice: { 0: '2d8' },
    storm: 'lightning',
    summary:
      'Lightning leaps from his hand to a creature he tries to touch. He makes a melee spell attack, with advantage if the target wears metal armor. On a hit it takes 2d8 lightning damage and can’t take reactions until the start of its next turn. One more die at level 11.',
    notes:
      'Magic Initiate runs on INT, so the attack is only +5, even with the amulet. Use it to walk away without an opportunity attack, or for the lightning: Thunderbolt Strike pushes a Large or smaller target 10 ft. A spell attack, not a weapon attack, so no Divine Strike.'
  },
  {
    slug: 'shield',
    name: 'Shield',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 reaction',
    range: 'Self',
    components: 'V, S',
    duration: '1 round',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Magic Initiate',
    status: 'known',
    role: 'Emergency +5 AC',
    summary:
      'When he is hit by an attack or targeted by Magic Missile, an invisible barrier gives him +5 AC until the start of his next turn, including against the triggering attack, and Magic Missile deals him no damage.',
    notes:
      'Once per long rest without a slot, at 1st level. His cleric slots can’t power it, since the feat took it from the wizard list and wizard isn’t one of his classes. AC 20 becomes 25, but it takes the reaction Wrath of the Storm, the Guardian Emblem and Shield Master also want.'
  },

  // ── Tempest Domain (always prepared) ──────────────────────
  {
    slug: 'fog-cloud',
    name: 'Fog Cloud',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '120 ft',
    components: 'V, S',
    duration: 'Concentration, up to 1 hour',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Block sight, cover a retreat',
    summary:
      'A 20-ft-radius sphere of fog fills a point within range and spreads around corners. The area is heavily obscured. It lasts until the spell ends or a wind of at least 10 mph disperses it.',
    higher: 'Radius 40 ft from a 2nd-level slot, 60 ft from a 3rd, 80 ft from a 4th, 100 ft from a 5th.',
    notes:
      'Concentration, so it means dropping Spirit Guardians. Best for blinding a line of archers or covering a retreat. His own Gust of Wind blows it away.'
  },
  {
    slug: 'thunderwave',
    name: 'Thunderwave',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Self (15-ft cube)',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Close-range blast and push',
    save: 'CON',
    damage: '2d8 thunder',
    dice: { 1: '2d8', 2: '3d8', 3: '4d8', 4: '5d8', 5: '6d8' },
    storm: 'thunder',
    summary:
      'A wave of thunder sweeps out from him. Each creature in a 15-ft cube starting at him makes a CON save: on a failure it takes 2d8 thunder damage and is pushed 10 ft away, on a success half damage and no push. Unsecured objects wholly in the area are pushed 10 ft too, and the boom carries 300 ft.',
    higher: '3d8 from a 2nd-level slot, 4d8 from a 3rd, 5d8 from a 4th, 6d8 from a 5th.',
    notes:
      'It pushes on its own, since thunder doesn’t trigger Thunderbolt Strike, and a creature pushed 10 ft from beside him is still inside Spirit Guardians’ 15 ft. The cube catches allies too. A push isn’t willing movement, so it won’t set off Booming Blade.'
  },
  {
    slug: 'gust-of-wind',
    name: 'Gust of Wind',
    level: 2,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Self (60-ft line)',
    components: 'V, S, M',
    material: 'a legume seed',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Push back, clear fog and gas',
    save: 'STR',
    summary:
      'A strong wind 60 ft long and 10 ft wide blasts from him in a direction he chooses. A creature that starts its turn in the line makes a STR save or is pushed 15 ft away along it, and moving toward him through the line costs double. The wind disperses gas and vapor and puts out candles, torches and other unprotected flames. A bonus action on each of his turns can turn the line.',
    notes:
      'Concentration, so it costs Spirit Guardians, and turning the line takes the bonus action Spiritual Weapon wants. Mostly for blowing away a poison cloud or his own Fog Cloud, or holding a bridge or corridor.'
  },
  {
    slug: 'shatter',
    name: 'Shatter',
    level: 2,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 ft',
    components: 'V, S, M',
    material: 'a chip of mica',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Area thunder, no concentration',
    save: 'CON',
    damage: '3d8 thunder',
    dice: { 2: '3d8', 3: '4d8', 4: '5d8', 5: '6d8' },
    storm: 'thunder',
    summary:
      'A painfully loud ringing erupts at a point within range. Each creature in a 10-ft-radius sphere makes a CON save, taking 3d8 thunder damage on a failure or half on a success. A creature made of stone, crystal, metal or other inorganic material saves with disadvantage, and nonmagical objects in the area that no one is wearing or carrying take the damage too.',
    higher: '4d8 from a 3rd-level slot, 5d8 from a 4th, 6d8 from a 5th.',
    notes:
      'No concentration, so it goes off beside Spirit Guardians. Upcast it is a good Destructive Wrath target: 48 from a 5th-level slot. If he is caught in it the Stormgirdle halves it, unless he took Elemental Adept (thunder), which ignores his own resistance too.'
  },
  {
    slug: 'call-lightning',
    name: 'Call Lightning',
    level: 3,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '120 ft',
    components: 'V, S',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Repeatable lightning bolts',
    save: 'DEX',
    damage: '3d10 lightning',
    dice: { 3: '3d10', 4: '4d10', 5: '5d10' },
    storm: 'lightning',
    summary:
      'A storm cloud 10 ft tall with a 60-ft radius forms in the air above him; the spell fails if there is no room for it. A bolt strikes a point he chooses under the cloud, and each creature within 5 ft of it makes a DEX save, taking 3d10 lightning damage on a failure or half on a success. On each of his turns he can use his action to call another bolt. Cast outdoors in a storm, it takes control of that storm instead, and the damage rises by 1d10.',
    higher: '4d10 from a 4th-level slot, 5d10 from a 5th.',
    notes:
      'Concentration, so it ends Spirit Guardians, and every bolt takes the action Booming Blade wants. Each bolt is lightning: Thunderbolt Strike pushes every Large or smaller creature it hurts 10 ft, and Destructive Wrath can max one (50 from a 5th-level slot). For flyers, spread-out enemies and real storms.'
  },
  {
    slug: 'sleet-storm',
    name: 'Sleet Storm',
    level: 3,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '150 ft',
    components: 'V, S, M',
    material: 'a pinch of dust and a few drops of water',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Wide control that breaks concentration',
    save: 'DEX (CON to keep concentration)',
    summary:
      'Freezing rain and sleet fill a cylinder 20 ft tall with a 40-ft radius. The area is heavily obscured, exposed flames go out, and the icy ground is difficult terrain. A creature that enters the area for the first time on a turn or starts its turn there makes a DEX save or falls prone. A creature that starts its turn there while concentrating must pass a CON save against his DC or lose its spell.',
    notes:
      'Concentration, so it trades away Spirit Guardians, but it can shut down an enemy caster and a whole group at once. Cast it at range, away from himself and his friends.'
  },
  {
    slug: 'control-water',
    name: 'Control Water',
    level: 4,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '300 ft',
    components: 'V, S, M',
    material: 'a drop of water and a pinch of dust',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Command rivers, lakes and seas',
    save: 'STR (Whirlpool)',
    damage: '2d8 bludgeoning (Whirlpool)',
    dice: { 4: '2d8', 5: '2d8' },
    summary:
      'He controls the freestanding water in a cube up to 100 ft on a side, with one effect at a time; on later turns an action repeats it or picks another. Flood raises the water up to 20 ft, or on open water sends a 20-ft wave across the area that can capsize vessels. Part Water opens a trench through it. Redirect Flow sends water any way he likes, even up walls. Whirlpool, in water at least 50 ft square and 25 ft deep, pulls everything within 25 ft 10 ft toward it, and a creature in the vortex makes a STR save or takes 2d8 bludgeoning damage and is caught.',
    notes:
      'Rarely a fight spell for him, and it costs Spirit Guardians. Its place is at sea or on a river: parting a moat, swamping a boat or turning a current.'
  },
  {
    slug: 'ice-storm',
    name: 'Ice Storm',
    level: 4,
    school: 'Evocation',
    castingTime: '1 action',
    range: '300 ft',
    components: 'V, S, M',
    material: 'a pinch of dust and a few drops of water',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Long-range area damage',
    save: 'DEX',
    damage: '2d8 bludgeoning + 4d6 cold',
    dice: { 4: '2d8+4d6', 5: '3d8+4d6' },
    summary:
      'Hail hard as rock pounds a cylinder 20 ft in radius and 40 ft high. Each creature in it makes a DEX save, taking 2d8 bludgeoning and 4d6 cold damage on a failure or half on a success. The hail leaves the area difficult terrain until the end of his next turn.',
    higher: 'Bludgeoning 3d8 from a 5th-level slot.',
    notes:
      'No concentration, so it lands beside Spirit Guardians, and its 300 ft reaches enemies the aura can’t. Bludgeoning and cold, so Destructive Wrath and Elemental Adept don’t apply.'
  },
  {
    slug: 'destructive-wave',
    name: 'Destructive Wave',
    level: 5,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Self (30-ft radius)',
    components: 'V',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'His biggest area blast',
    save: 'CON',
    damage: '5d10 thunder + 5d10 radiant',
    dice: { 5: '5d10+5d10' },
    storm: 'thunder',
    summary:
      'He strikes the ground and divine energy ripples out from him. Each creature he chooses within 30 ft makes a CON save. On a failure it takes 5d10 thunder damage and 5d10 radiant or necrotic damage (his choice), and is knocked prone. On a success it takes half and stays on its feet.',
    notes:
      'No concentration and it spares allies, so it fits a crowd once Spirit Guardians is up. Destructive Wrath maxes the thunder half: 50 + 5d10 radiant. Prone enemies give melee attackers advantage, his Booming Blade included, and lose half their movement standing up.'
  },
  {
    slug: 'insect-plague',
    name: 'Insect Plague',
    level: 5,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '300 ft',
    components: 'V, S, M',
    material: 'a few grains of sugar, some kernels of grain and a smear of fat',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Tempest Domain',
    status: 'domain',
    role: 'Lasting damage zone',
    save: 'CON',
    damage: '4d10 piercing',
    dice: { 5: '4d10' },
    summary:
      'Biting locusts swarm in a 20-ft-radius sphere that spreads around corners. The area is lightly obscured and difficult terrain. Each creature in it when it appears makes a CON save, taking 4d10 piercing damage on a failure or half on a success, and so does a creature that enters it for the first time on a turn or ends its turn there.',
    notes:
      'Concentration, so it replaces Spirit Guardians rather than adding to it. Worth it when enemies hold a place he can’t reach, such as archers on a wall.'
  },

  // ── Prepared ──────────────────────────────────────────────
  {
    slug: 'healing-word',
    name: 'Healing Word',
    level: 1,
    school: 'Evocation',
    castingTime: '1 bonus action',
    range: '60 ft',
    components: 'V',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Bonus-action pick-up',
    dice: { 1: '1d4+4', 2: '2d4+4', 3: '3d4+4', 4: '4d4+4', 5: '5d4+4' },
    summary: 'A creature he can see within range regains 1d4 + 4 hit points. No effect on undead or constructs.',
    higher: '2d4 + 4 from a 2nd-level slot, 3d4 + 4 from a 3rd, 4d4 + 4 from a 4th, 5d4 + 4 from a 5th.',
    notes:
      'The way to get a downed ally up from a distance. It takes the bonus action Spiritual Weapon wants, and after a bonus-action spell he can cast only a cantrip that turn: Booming Blade, but not Spirit Guardians.'
  },
  {
    slug: 'bless',
    name: 'Bless',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '30 ft',
    components: 'V, S, M',
    material: 'a sprinkling of holy water',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Party attack and save bonus',
    summary: 'Up to three creatures within range add 1d4 to every attack roll and saving throw they make until the spell ends.',
    higher: 'One more creature per slot level: four from a 2nd-level slot, up to seven from a 5th.',
    notes:
      'A strong spell he will seldom run, since it needs the concentration Spirit Guardians holds. Worth it when the aura can’t reach the enemy, or in a fight decided by saving throws.'
  },
  {
    slug: 'command',
    name: 'Command',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '60 ft',
    components: 'V',
    duration: '1 round',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'One-word control',
    save: 'WIS',
    summary:
      'He speaks a one-word command to a creature he can see. On a failed WIS save it obeys on its next turn: Approach (it comes toward him, stopping within 5 ft), Drop (it lets go of what it holds), Flee (it moves away), Grovel (it falls prone) or Halt (it neither moves nor acts), or another word. No effect on undead, on a creature that doesn’t understand his language, or if the command is directly harmful to it.',
    higher: 'One more creature per slot level (five from a 5th-level slot), all within 30 ft of each other.',
    notes:
      'No concentration, so it works with Spirit Guardians up. “Approach” walks an enemy into the aura, taking the damage as it enters, and “Halt” or “Grovel” wastes its turn.'
  },
  {
    slug: 'spiritual-weapon',
    name: 'Spiritual Weapon',
    level: 2,
    school: 'Evocation',
    castingTime: '1 bonus action',
    range: '60 ft',
    components: 'V, S',
    duration: '1 minute',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Bonus-action attacks every turn',
    attack: true,
    damage: '1d8 + 4 force',
    dice: { 2: '1d8+4', 3: '1d8+4', 4: '2d8+4', 5: '2d8+4' },
    summary:
      'A floating spectral weapon appears within range for the duration, or until he casts the spell again. As he casts it, he can make a melee spell attack against a creature within 5 ft of the weapon, dealing 1d8 + 4 force damage on a hit. On each later turn, a bonus action moves it up to 20 ft and attacks again.',
    higher: 'Every two slot levels add 1d8: 2d8 + 4 from a 4th- or 5th-level slot.',
    notes:
      'No concentration, so it runs beside Spirit Guardians, attacking at +9 for a minute. A bonus-action spell leaves only a cantrip for that turn, so it comes on the second turn, with Booming Blade. Each later swing takes the bonus action Healing Word, the Boots of Speed and the Shield Master shove also want.'
  },
  {
    slug: 'aid',
    name: 'Aid',
    level: 2,
    school: 'Abjuration',
    castingTime: '1 action',
    range: '30 ft',
    components: 'V, S, M',
    material: 'a tiny strip of white cloth',
    duration: '8 hours',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Party hit-point buffer',
    summary: 'Up to three creatures within range each gain 5 to their hit point maximum and current hit points for the duration.',
    higher: '+10 from a 3rd-level slot, +15 from a 4th, +20 from a 5th.',
    notes:
      'Cast it after a long rest so it covers most of the day; he can count himself among the three. It raises the maximum, unlike temporary hit points, so healing fills it back up.'
  },
  {
    slug: 'lesser-restoration',
    name: 'Lesser Restoration',
    level: 2,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Cure a condition',
    summary: 'Touch a creature to end one disease or one of these conditions on it: blinded, deafened, paralyzed or poisoned.',
    notes:
      'The staff’s Thunderclap deafens allies within 60 ft as well, and this clears it. Ending a friend’s paralysis can matter more than any damage he deals that turn.'
  },
  {
    slug: 'spirit-guardians',
    name: 'Spirit Guardians',
    level: 3,
    school: 'Conjuration',
    castingTime: '1 action',
    range: 'Self (15-ft radius)',
    components: 'V, S, M',
    material: 'a holy symbol',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'The core of the build',
    save: 'WIS',
    damage: '3d8 radiant',
    dice: { 3: '3d8', 4: '4d8', 5: '5d8' },
    summary:
      'Spirits circle him out to 15 ft for the duration, angelic or fey to look at for a good or neutral caster, and he can leave out any creatures he can see as he casts it. An affected creature moves at half speed in the area. When one enters the area for the first time on a turn or starts its turn there, it makes a WIS save, taking 3d8 radiant damage on a failure or half on a success (necrotic for an evil caster).',
    higher: '4d8 from a 4th-level slot, 5d8 from a 5th.',
    notes:
      'The heart of how he fights: cast it on the first turn, and War Caster’s advantage keeps it up through the hits. Every other concentration spell on this list is a trade against it. Whether walking the aura onto an enemy counts as it entering is a question for the DM.'
  },
  {
    slug: 'revivify',
    name: 'Revivify',
    level: 3,
    school: 'Necromancy',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S, M',
    material: 'diamonds worth 300 gp, which the spell consumes',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Undo a death within a minute',
    summary:
      'Touch a creature that died within the last minute and it returns to life with 1 hit point. It can’t revive a creature that died of old age or restore missing body parts.',
    notes:
      'Always carry the diamonds. It needs a touch and a 3rd-level slot, the level Spirit Guardians uses, so keep one spare in a hard fight.'
  },
  {
    slug: 'dispel-magic',
    name: 'Dispel Magic',
    level: 3,
    school: 'Abjuration',
    castingTime: '1 action',
    range: '120 ft',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'End a spell',
    summary:
      'Choose a creature, object or magical effect within range. Any spell of 3rd level or lower on it ends. For each spell of 4th level or higher, he makes a WIS check against DC 10 + the spell’s level, ending it on a success.',
    higher: 'A 4th-level slot ends spells of 4th level or lower outright, a 5th-level slot those of 5th or lower.',
    notes:
      'His check is only +4, since a spellcasting ability check adds no proficiency, so upcast it against anything big. The answer to an enemy’s Hold Person on a friend or a wall of force in the way.'
  },
  {
    slug: 'mass-healing-word',
    name: 'Mass Healing Word',
    level: 3,
    school: 'Evocation',
    castingTime: '1 bonus action',
    range: '60 ft',
    components: 'V',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Pick up several allies at once',
    dice: { 3: '1d4+4', 4: '2d4+4', 5: '3d4+4' },
    summary:
      'Up to six creatures he chooses that he can see within range each regain 1d4 + 4 hit points. No effect on undead or constructs.',
    higher: '2d4 + 4 from a 4th-level slot, 3d4 + 4 from a 5th.',
    notes:
      'For when two or more allies are down. A bonus-action spell, so the rest of that turn is limited to a cantrip such as Booming Blade.'
  },
  {
    slug: 'death-ward',
    name: 'Death Ward',
    level: 4,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S',
    duration: '8 hours',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Survive one killing blow',
    summary:
      'Touch a creature. The first time damage would drop it to 0 hit points, it drops to 1 instead and the spell ends. While the spell lasts, an effect that would kill it outright without dealing damage is negated instead, which also ends the spell.',
    notes:
      'No concentration and 8 hours long, so it goes on before a big fight: on himself in the front line, or on the ally most likely to fall. It costs one of his three 4th-level slots for the day.'
  },
  {
    slug: 'banishment',
    name: 'Banishment',
    level: 4,
    school: 'Abjuration',
    castingTime: '1 action',
    range: '60 ft',
    components: 'V, S, M',
    material: 'an item distasteful to the target',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Remove one threat',
    save: 'CHA',
    summary:
      'A creature he can see makes a CHA save or is banished. One native to this plane goes to a harmless demiplane, where it is incapacitated, and comes back when the spell ends. One from another plane is sent home, and if the spell lasts the full minute it doesn’t return.',
    higher: 'Two creatures from a 5th-level slot.',
    notes:
      'Concentration, so it ends Spirit Guardians: keep it for one creature that outclasses the rest of the fight. A fiend, elemental or celestial held for the full minute is gone for good.'
  },
  {
    slug: 'guardian-of-faith',
    name: 'Guardian of Faith',
    level: 4,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '30 ft',
    components: 'V',
    duration: '8 hours',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'A guardian with no concentration',
    save: 'DEX',
    damage: '20 radiant (60 in all)',
    summary:
      'A Large spectral guardian, indistinct but for a gleaming sword and a shield bearing Kord’s symbol, hovers in an unoccupied space within range. A hostile creature that moves to a space within 10 ft of it for the first time on a turn makes a DEX save, taking 20 radiant damage on a failure or half on a success. It vanishes once it has dealt 60 damage in all.',
    notes:
      'No concentration, so it stacks with Spirit Guardians: put it beside him or in a doorway enemies must pass. Only a creature that moves in triggers it, not one already standing there when it appears.'
  },
  {
    slug: 'greater-restoration',
    name: 'Greater Restoration',
    level: 5,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S, M',
    material: 'diamond dust worth at least 100 gp, which the spell consumes',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'prepared',
    role: 'Cure serious afflictions',
    summary:
      'Touch a creature to remove one level of exhaustion, or to end one of these on it: a charm or petrification, one curse (including attunement to a cursed item), any reduction to one of its ability scores, or one effect reducing its hit point maximum.',
    notes: 'Carry the diamond dust. It frees an ally charmed into fighting the party, which Lesser Restoration can’t.'
  },

  // ── Candidates ────────────────────────────────────────────
  {
    slug: 'guiding-bolt',
    name: 'Guiding Bolt',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '120 ft',
    components: 'V, S',
    duration: '1 round',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'Ranged burst and advantage',
    attack: true,
    damage: '4d6 radiant',
    dice: { 1: '4d6', 2: '5d6', 3: '6d6', 4: '7d6', 5: '8d6' },
    summary:
      'A flash of light streaks at a creature within range. On a hit with a ranged spell attack it takes 4d6 radiant damage, and the next attack roll against it before the end of his next turn has advantage.',
    higher: '5d6 from a 2nd-level slot, 6d6 from a 3rd, 7d6 from a 4th, 8d6 from a 5th.',
    notes:
      'A ranged hit at +9 when he can’t close in, though with an enemy beside him it rolls at disadvantage. Toll the Dead does the job without a slot most turns, so it earns a place only for fights at range.'
  },
  {
    slug: 'shield-of-faith',
    name: 'Shield of Faith',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 bonus action',
    range: '60 ft',
    components: 'V, S, M',
    material: 'a small parchment with a bit of holy text written on it',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: '+2 AC',
    summary: 'A shimmering field surrounds a creature he chooses within range, giving it +2 AC for the duration.',
    notes:
      'Concentration, so it can’t run beside Spirit Guardians, which does far more. Only worth a place on a day with a fragile ally to protect and little to fight.'
  },
  {
    slug: 'sanctuary',
    name: 'Sanctuary',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 bonus action',
    range: '30 ft',
    components: 'V, S, M',
    material: 'a small silver mirror',
    duration: '1 minute',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'Ward a creature from attacks',
    save: 'WIS',
    summary:
      'He wards a creature within range. Anyone who targets it with an attack or a harmful spell must first make a WIS save, or choose a new target or lose the attack or spell. It doesn’t stop area effects. The spell ends if the warded creature attacks or casts a spell that affects an enemy.',
    notes:
      'No concentration. Best on a fragile or freshly revived ally; on himself it ends the moment he attacks.'
  },
  {
    slug: 'detect-magic',
    name: 'Detect Magic',
    level: 1,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Self (30 ft)',
    components: 'V, S',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: true,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'Sense magic',
    summary:
      'He senses magic within 30 ft. As an action he can see a faint aura around any visible creature or object bearing magic and learn its school, if any. Blocked by 1 ft of stone, 1 inch of common metal, a thin sheet of lead or 3 ft of wood or dirt.',
    notes:
      'A cleric can cast a ritual only if he has it prepared, so it costs one of his 14 prepared spells. On a day of exploring, cast as a ritual it costs no slot.'
  },
  {
    slug: 'silence',
    name: 'Silence',
    level: 2,
    school: 'Illusion',
    castingTime: '1 action',
    range: '120 ft',
    components: 'V, S',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: true,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'Shut down casters',
    summary:
      'No sound can be made within or pass through a 20-ft-radius sphere. Creatures and objects wholly inside are immune to thunder damage, creatures there are deafened, and no one can cast a spell with a verbal component inside it.',
    notes:
      'Works against him: anyone inside is immune to Booming Blade, Divine Strike, Shatter and the thunder half of Destructive Wave, and he can’t cast most of his spells in it. Booming Blade has no verbal component, so he can still cast it inside, but only the staff’s own damage counts. Concentration, so it costs Spirit Guardians as well.'
  },
  {
    slug: 'hold-person',
    name: 'Hold Person',
    level: 2,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '60 ft',
    components: 'V, S, M',
    material: 'a small, straight piece of iron',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'Paralyze a humanoid',
    save: 'WIS',
    summary:
      'A humanoid he can see makes a WIS save or is paralyzed for the duration. It repeats the save at the end of each of its turns, ending the spell on itself on a success.',
    higher: 'One more humanoid per slot level: two from a 3rd-level slot, three from a 4th, four from a 5th, all within 30 ft of each other.',
    notes:
      'Every hit he lands from within 5 ft is a critical, doubling the staff’s, Booming Blade’s and Divine Strike’s dice. But it needs concentration, so it costs Spirit Guardians, and a held creature can’t move to set off Booming Blade’s 2d8.'
  },
  {
    slug: 'spirit-shroud',
    name: 'Spirit Shroud',
    level: 3,
    school: 'Necromancy',
    castingTime: '1 bonus action',
    range: 'Self',
    components: 'V, S',
    duration: 'Concentration, up to 1 minute',
    concentration: true,
    ritual: false,
    source: 'TCE',
    access: 'Cleric',
    status: 'candidate',
    role: 'Melee damage booster',
    damage: '1d8 radiant per hit',
    dice: { 3: '1d8', 4: '1d8', 5: '2d8' },
    summary:
      'Intangible spirits of the dead surround him. Until the spell ends, his attacks that hit a creature within 10 ft of him deal 1d8 more damage, radiant, necrotic or cold as he chooses when casting, and a creature that takes it can’t regain hit points until the start of his next turn. Any creature he chooses that starts its turn within 10 ft of him loses 10 ft of speed until the start of his next turn.',
    higher: '2d8 from a 5th-level slot.',
    notes:
      'An alternative to Spirit Guardians against one big enemy: a bonus action, so he can cast it and still use Booming Blade the same turn. Spiritual Weapon’s hits count when the target is within 10 ft of him. Both need concentration, so never the two together.'
  },
  {
    slug: 'freedom-of-movement',
    name: 'Freedom of Movement',
    level: 4,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S, M',
    material: 'a leather strap, bound around the arm or a similar appendage',
    duration: '1 hour',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'No grapples, no paralysis',
    summary:
      'For the duration, difficult terrain doesn’t slow the creature he touches, and magic can’t reduce its speed, paralyze it or restrain it. It can spend 5 ft of movement to slip free of nonmagical restraints or a grapple, and being underwater doesn’t hamper its movement or attacks.',
    notes:
      'No concentration. Good on himself against grapplers and paralyzing foes, and it lets him cross the ground his own Ice Storm or Sleet Storm makes difficult at full speed.'
  },
  {
    slug: 'holy-weapon',
    name: 'Holy Weapon',
    level: 5,
    school: 'Evocation',
    castingTime: '1 bonus action',
    range: 'Touch',
    components: 'V, S',
    duration: 'Concentration, up to 1 hour',
    concentration: true,
    ritual: false,
    source: 'XGE',
    access: 'Cleric',
    status: 'candidate',
    role: 'Radiant damage on every weapon hit',
    save: 'CON (burst)',
    damage: '2d8 radiant per hit',
    dice: { 5: '2d8' },
    summary:
      'A weapon he touches sheds bright light in a 30-ft radius and dim light 30 ft beyond, becomes magical if it isn’t already, and deals 2d8 radiant damage more on each hit. As a bonus action he can end the spell in a burst: each creature he chooses within 30 ft of the weapon makes a CON save, taking 4d8 radiant damage and blinded for 1 minute on a failure, or half and not blinded on a success. A blinded creature repeats the save at the end of each of its turns.',
    notes:
      'Best on an ally who attacks several times a turn; on his own staff it adds 2d8 to one hit a turn. Concentration for up to an hour, so it costs Spirit Guardians, and it takes one of his two 5th-level slots.'
  },
  {
    slug: 'mass-cure-wounds',
    name: 'Mass Cure Wounds',
    level: 5,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 ft',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'Big group heal',
    dice: { 5: '3d8+4' },
    summary:
      'Healing washes out from a point within range. Up to six creatures he chooses in a 30-ft-radius sphere around it each regain 3d8 + 4 hit points. No effect on undead or constructs.',
    notes:
      'About 17 hit points to each of up to six allies for his action, against 6 or 7 each from Mass Healing Word’s bonus action. It takes one of the two 5th-level slots Destructive Wave also wants.'
  },
  {
    slug: 'commune',
    name: 'Commune',
    level: 5,
    school: 'Divination',
    castingTime: '1 minute',
    range: 'Self',
    components: 'V, S, M',
    material: 'incense and a vial of holy or unholy water',
    duration: '1 minute',
    concentration: false,
    ritual: true,
    source: 'PHB',
    access: 'Cleric',
    status: 'candidate',
    role: 'Three questions for Kord',
    summary:
      'He contacts his god or a divine proxy and asks up to three yes-or-no questions before the spell ends, getting a true answer to each. A god isn’t all-knowing, so an answer can be “unclear”, and a short phrase may replace a one-word answer that would mislead. Each casting after the first before a long rest adds a 25% chance of no answer at all.',
    notes: 'Prepared, he can cast it as a ritual in 11 minutes and keep his 5th-level slots for the fight.'
  },

  // ── Future: 6th level, from level 11 ──────────────────────
  {
    slug: 'heal',
    name: 'Heal',
    level: 6,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 ft',
    components: 'V, S',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'future',
    role: 'One huge heal',
    summary:
      'A creature he can see within range regains 70 hit points, and any blindness, deafness and diseases on it end. No effect on constructs or undead.',
    notes: 'His one 6th-level slot from level 11. Seventy hit points, not rolled, is close to a full refill for any ally.'
  },
  {
    slug: 'heroes-feast',
    name: 'Heroes’ Feast',
    level: 6,
    school: 'Conjuration',
    castingTime: '10 minutes',
    range: '30 ft',
    components: 'V, S, M',
    material: 'a gem-encrusted bowl worth at least 1,000 gp, which the spell consumes',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'future',
    role: 'A day of protection for the party',
    summary:
      'He calls up a great feast that takes an hour to eat and then vanishes; up to twelve creatures can share it. When the hour is over, each one is cured of all diseases and poison, is immune to poison and to being frightened, and has advantage on WIS saves for 24 hours. Its hit point maximum also rises by 2d10 for that time, and it gains as many hit points.',
    notes: 'A dwarf’s kind of spell, and a feast in Kord’s honor. The 1,000-gp bowl makes it a night-before-the-battle spell.'
  },
  {
    slug: 'blade-barrier',
    name: 'Blade Barrier',
    level: 6,
    school: 'Evocation',
    castingTime: '1 action',
    range: '90 ft',
    components: 'V, S',
    duration: 'Concentration, up to 10 minutes',
    concentration: true,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'future',
    role: 'Wall of whirling blades',
    save: 'DEX',
    damage: '6d10 slashing',
    dice: { 6: '6d10' },
    summary:
      'A wall of whirling magical blades appears within range: straight and up to 100 ft long, or a ring up to 60 ft across, either way 20 ft high and 5 ft thick. It gives three-quarters cover to creatures behind it, and its space is difficult terrain. A creature that enters the wall for the first time on a turn or starts its turn there makes a DEX save, taking 6d10 slashing damage on a failure or half on a success.',
    notes:
      'Concentration, so it replaces Spirit Guardians. Thunderwave, Thunderbolt Strike and the Shield Master shove can drive enemies into it.'
  },
  {
    slug: 'word-of-recall',
    name: 'Word of Recall',
    level: 6,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '5 ft',
    components: 'V',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    source: 'PHB',
    access: 'Cleric',
    status: 'future',
    role: 'Teleport home to a temple',
    summary:
      'He and up to five willing creatures within 5 ft teleport instantly to a sanctuary he chose earlier, appearing in the nearest unoccupied spaces to it. He chooses the sanctuary by casting the spell in a place dedicated or strongly tied to his god, such as a temple; anywhere else that fails, and without a sanctuary the spell does nothing.',
    notes: 'A temple of Kord, where his Acolyte background already gives the party shelter, is the natural anchor. The emergency exit for him and five friends.'
  }
]

export const spellBySlug = Object.fromEntries(spells.map(s => [s.slug, s]))
