// Rules for the whole table, shared by every character. Each character's own
// house rules and rulings live in data/characters/<slug>/ and are listed on /rules too.

import arrayFile from '~/sourcematerial/standard-arrays.txt?raw'

export interface HouseRule {
  rule: string
  detail: string
}

export interface Ruling {
  ruling: string
  detail: string
}

// A character's own section of /rules
export interface CharacterRules {
  houseRules: HouseRule[]
  rulings: Ruling[]
  dmQuestions: { id: string; question: string }[]
  dmPage: string // where the DM answers the questions
}

export const campaign = {
  name: 'Character Codex',
  ruleset: 'D&D 5e (2014) + Tasha’s'
}

// The allowed starting arrays (every D&D 4e point-buy result), highest score first
export const allowedArrays = arrayFile
  .trim()
  .split(/\r?\n/)
  .map(line => line.split(',').map(Number))

export const homebrew: HouseRule[] = [
  {
    rule: 'Starting arrays',
    detail: `Starting ability scores come from one of ${allowedArrays.length} allowed arrays, every result of the D&D 4e point buy, instead of the 5e standard array or point buy.`
  },
  { rule: 'Extra feat at level 1', detail: 'Every character gets an additional feat at level 1.' },
  { rule: 'Half-Elf darkvision is 30 ft', detail: 'Reduced from the usual 60 ft.' },
  { rule: 'Half-Elf Skill Versatility: one skill', detail: 'One skill of your choice instead of two.' },
  {
    rule: 'Intelligence grants proficiencies',
    detail: 'Each point of INT modifier gives an extra language and an extra skill or tool proficiency, at creation and whenever the modifier rises. INT can replace DEX for initiative.'
  },
  {
    rule: 'Pact of the Tome: patron spells are spells known',
    detail: 'The patron’s expanded spell list counts as additional spells known, not just extra options to choose from.'
  },
  { rule: 'Repelling Blast: once per target', detail: 'The 10-ft push applies once per target per casting, not once per beam.' },
  { rule: 'Attunement limit 10', detail: 'Instead of the usual 3.' }
]

export const rulings: Ruling[] = [
  {
    ruling: 'Agonizing Blast works as written',
    detail: 'The DM reverted the once-per-target house rule: add your CHA modifier to every Eldritch Blast beam that hits. Repelling Blast keeps its once-per-target homebrew.'
  },
  {
    ruling: 'Spell attack and DC bonuses stack',
    detail: 'Bonuses from different items add together with no cap, e.g. a +1 focus and a +3 item give +4 to the spell save DC and spell attacks.'
  },
  {
    ruling: 'Up to four magic rings',
    detail: 'The table allows four worn rings instead of the usual limit. Other slots follow the books: one cloak, one pair of bracers, one belt, one robe and one piece of headwear.'
  }
]

// The table's homebrew rulebook, served as-is from public/
export const tweaksPdf = {
  title: 'Zman’s 5e Tweaks',
  version: 'v2.0',
  src: '/docs/zmans-5e-tweaks.pdf',
  note: 'The table’s homebrew rulebook, made in The Homebrewery. Several of the house rules above come from it.'
}

export const sourcePolicy = {
  baseline: '2014 D&D 5e plus Tasha’s Cauldron of Everything',
  index: { label: '2014.5e.tools', url: 'https://2014.5e.tools/' },
  allowed: [
    'Official 2014 core books: Player’s Handbook, Dungeon Master’s Guide, Monster Manual.',
    'Official 2014-era supplements: Xanathar’s, Tasha’s, Volo’s, Mordenkainen’s Tome of Foes and similar.',
    'Official adventure and setting books, such as Rime of the Frostmaiden and Dungeon of the Mad Mage, where the specific option appears on the 2014 site.',
    'Ritual spells from any class list, legally copied into the Book of Shadows.'
  ],
  excluded: [
    '2024-only rules and the revised 2024 books.',
    'Content that only appears on the non-2014 5e.tools site.',
    'Unearthed Arcana, third-party material and unapproved homebrew.',
    'The 2024 “Sphinx of Wonder” familiar.'
  ]
}
