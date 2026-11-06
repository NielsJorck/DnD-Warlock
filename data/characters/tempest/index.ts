// The Tempest Cleric's entry in the character list (data/characters/index.ts)

import type { CharacterEntry } from '..'
import { character } from './character'
import { appearance, houseRules, questions, rulings } from './lore'

export const tempest: CharacterEntry = {
  slug: 'tempest',
  name: character.name,
  tagline: `Tempest Cleric ${character.level} · Concept`,
  summary: `Level ${character.level} ${character.race} ${character.className}: ${character.subclass}, servant of ${character.deity}. ${character.concept} A possible replacement for Lucan, with his gear pitched to the DM.`,
  ruleset: character.ruleset,
  epithet: character.epithet,
  motto: character.motto,
  portrait: appearance.portrait,
  nav: [
    { to: '/tempest', label: 'Sheet', exact: true },
    { to: '/tempest/session', label: 'Session', primary: true },
    { to: '/tempest/spells', label: 'Spells' },
    { to: '/tempest/items', label: 'Items' },
    { to: '/tempest/lore', label: 'Lore' },
    { to: '/tempest/levels', label: 'Levels' }
  ],
  rules: { houseRules, rulings, questions }
}
