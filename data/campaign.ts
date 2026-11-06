// The table's rules. The group keeps two separate rulesets, one for the 2014
// books and one for the 2024 books, and each character plays by one of them
// (the `ruleset` in their entry in data/characters/). Each character's own house
// rules and rulings live in data/characters/<slug>/ and are listed on /rules
// under their ruleset.

import arrayFile from '~/sourcematerial/standard-arrays.txt?raw'

export interface HouseRule {
  rule: string
  detail: string
}

export interface Ruling {
  ruling: string
  detail: string
}

// Asked of the DM and not answered yet; an answer moves it to the rulings
export interface OpenQuestion {
  question: string
  detail: string
}

// A character's own section of /rules
export interface CharacterRules {
  houseRules: HouseRule[]
  rulings: Ruling[]
  questions?: OpenQuestion[]
}

export type RulesetId = '2014' | '2024'

export interface Ruleset {
  id: RulesetId
  name: string
  status: 'In use' | 'In progress'
  summary: string
  reference: { label: string; url: string }
  homebrew: HouseRule[]
  rulings: Ruling[]
  sourcePolicy?: { baseline: string; allowed: string[]; excluded: string[] }
  // A homebrew rulebook, served as-is from public/
  rulebook?: { title: string; version: string; src: string; note: string }
}

export const campaign = {
  name: 'Character Codex'
}

// The allowed starting arrays (every D&D 4e point-buy result), highest score first
export const allowedArrays = arrayFile
  .trim()
  .split(/\r?\n/)
  .map(line => line.split(',').map(Number))

const rules2014: Ruleset = {
  id: '2014',
  name: 'D&D 5e (2014)',
  status: 'In use',
  summary: 'The 2014 books plus Tasha’s Cauldron of Everything, with the table’s homebrew and the DM’s rulings.',
  reference: { label: '2014.5e.tools', url: 'https://2014.5e.tools/' },
  homebrew: [
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
  ],
  rulings: [
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
  ],
  sourcePolicy: {
    baseline: '2014 D&D 5e plus Tasha’s Cauldron of Everything',
    allowed: [
      'Official 2014 core books: Player’s Handbook, Dungeon Master’s Guide, Monster Manual.',
      'Every official 2014 supplement: Xanathar’s, Tasha’s, Volo’s, Mordenkainen’s Tome of Foes, and later ones such as Fizban’s Treasury of Dragons and The Book of Many Things.',
      'Official adventure and setting books, such as Rime of the Frostmaiden and Dungeon of the Mad Mage, where the specific option appears on the 2014 site.',
      'Ritual spells from any class list, legally copied into the Book of Shadows.'
    ],
    excluded: [
      '2024-only rules, the revised 2024 books and anything only on the non-2014 5e.tools site, unless the DM approves it.',
      'Unearthed Arcana, third-party material and unapproved homebrew.',
      'The 2024 “Sphinx of Wonder” familiar.'
    ]
  },
  rulebook: {
    title: 'Zman’s 5e Tweaks',
    version: 'v2.0',
    src: '/docs/zmans-5e-tweaks.pdf',
    note: 'The table’s homebrew rulebook for the 2014 Player’s Handbook, made in The Homebrewery. Several of the house rules above come from it.'
  }
}

// Still being worked out by the group: add its homebrew, rulings and source
// policy here as they're agreed, and set the status to 'In use'.
const rules2024: Ruleset = {
  id: '2024',
  name: 'D&D 5e (2024)',
  status: 'In progress',
  summary: 'A separate ruleset for the revised 2024 books, which the group is still working out.',
  reference: { label: '5e.tools', url: 'https://5e.tools/' },
  homebrew: [],
  rulings: []
}

export const rulesets: Record<RulesetId, Ruleset> = { '2014': rules2014, '2024': rules2024 }
export const rulesetList = [rules2014, rules2024]
export const isRulesetId = (id: unknown): id is RulesetId => rulesetList.some(r => r.id === id)

// The Rules page, opened on one ruleset
export const rulesPath = (id: RulesetId) => `/rules?ruleset=${id}`
