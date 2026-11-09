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
  // What `homebrew` is called on the Rules page and the character list, when it isn't homebrew
  homebrewLabel?: { title: string; noun: string }
  rulings: Ruling[]
  sourcePolicy?: { baseline: string; allowed: string[]; excluded: string[] }
  // A homebrew rulebook, served as-is from public/
  rulebook?: { title: string; version: string; src: string; note: string }
  // The one array every character uses, highest first, when the ruleset has one;
  // without it the levels pages check against allowedArrays
  startingArray?: number[]
  // How many items a character can be attuned to
  attunementLimit: number
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
  },
  attunementLimit: 10
}

// The new campaign, from the DM's "Adventurers Wanted" flyer: a patron's
// expedition to a long-lost site in the Sword Mountains, mostly dungeon crawling.
// None of the 2014 homebrew applies here.
const rules2024: Ruleset = {
  id: '2024',
  name: 'D&D 5e (2024)',
  status: 'In use',
  summary:
    'The Sword Mountains expedition: a patron of some means hires four adventurers to explore a long-lost site and recover the knowledge and craft lost there. Mostly dungeon crawling, little social play. The 2024 Player’s Handbook as written, with none of the 2014 table’s homebrew.',
  reference: { label: '5e.tools', url: 'https://5e.tools/' },
  homebrew: [
    { rule: 'Start at level 3', detail: 'Experienced adventurers, a party of four. The campaign could reach level 12 eventually, over years of play.' },
    { rule: 'Stat array 16, 15, 14, 12, 10, 8', detail: 'Every character assigns the same six scores, then adds the background’s +2 and +1 (or +1 to all three) as the 2024 rules say, to any scores by the DM’s ruling.' },
    { rule: 'Background grants an Origin feat', detail: 'As in the 2024 Player’s Handbook, though by the DM’s ruling it can be any Origin feat.' },
    { rule: '200 gp to start', detail: 'Per character, after travel expenses, on top of the normal class and background equipment.' },
    { rule: 'A Potion of Healing', detail: 'Each character starts with one, besides the normal equipment.' },
    { rule: 'One uncommon magic item', detail: 'Each character starts with one uncommon magic item, which the DM has to approve. No +1 weapons or armor.' }
  ],
  homebrewLabel: { title: 'Character Creation', noun: 'character-creation rules' },
  rulings: [
    {
      ruling: 'Background increases and feat chosen freely',
      detail:
        'The DM doesn’t tie them to the background: its +2 and +1 (or +1 to all three) can go to any scores, and the Origin feat can be any Origin feat, not just the one the background lists.'
    }
  ],
  sourcePolicy: {
    baseline: '2024 Player’s Handbook',
    allowed: ['Classes, subclasses, species and backgrounds from the 2024 Player’s Handbook.', 'The starting magic item from the 2024 Dungeon Master’s Guide, with the DM’s approval.'],
    excluded: ['The 2014 table’s homebrew: extra level-1 feat, starting arrays, INT proficiencies, attunement limit 10 and the rest.', 'Options from other books unless the DM approves them.', '+1 weapons and armor as the starting item.']
  },
  startingArray: [16, 15, 14, 12, 10, 8],
  attunementLimit: 3
}

export const rulesets: Record<RulesetId, Ruleset> = { '2014': rules2014, '2024': rules2024 }
export const rulesetList = [rules2014, rules2024]
export const isRulesetId = (id: unknown): id is RulesetId => rulesetList.some(r => r.id === id)

// The Rules page, opened on one ruleset
export const rulesPath = (id: RulesetId) => `/rules?ruleset=${id}`
