// The Gloom Stalker's entry in the character list (data/characters/index.ts)

import type { CharacterEntry } from '..'
import { character } from './character'
import { houseRules, questions, rulings } from './lore'

export const gloomStalker: CharacterEntry = {
  slug: 'gloom-stalker',
  name: character.name,
  tagline: `Gloom Stalker ${character.level} · Concept`,
  summary: `Level ${character.level} ${character.species} ${character.className}: ${character.subclass}, ${character.background.toLowerCase()} of the Sword Mountain passes. ${character.concept} For the Sword Mountains expedition, with one uncommon item pitched to the DM.`,
  ruleset: character.ruleset,
  epithet: character.epithet,
  motto: character.motto,
  // No portrait yet: the sheet and lore pages show an emblem instead
  nav: [
    { to: '/gloom-stalker', label: 'Sheet', exact: true },
    { to: '/gloom-stalker/session', label: 'Session', primary: true },
    { to: '/gloom-stalker/spells', label: 'Spells' },
    { to: '/gloom-stalker/items', label: 'Items' },
    { to: '/gloom-stalker/lore', label: 'Lore' },
    { to: '/gloom-stalker/levels', label: 'Levels' }
  ],
  rules: { houseRules, rulings, questions }
}
