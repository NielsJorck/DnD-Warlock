// Lucan's entry in the character list (data/characters/index.ts)

import type { CharacterEntry } from '..'
import { character } from './character'
import { appearance, houseRules, rulings } from './lore'

export const lucan: CharacterEntry = {
  slug: 'lucan',
  name: character.name,
  tagline: `Dao Genie · Warlock ${character.level}`,
  summary: `Level ${character.level} ${character.race} ${character.className}: ${character.subclass}, ${character.pact}. ${character.identity.summary}`,
  ruleset: character.ruleset,
  epithet: character.epithet,
  motto: character.motto,
  portrait: appearance.portrait,
  nav: [
    { to: '/lucan', label: 'Sheet', exact: true },
    { to: '/lucan/session', label: 'Session', primary: true },
    { to: '/lucan/lesser-dao', label: 'Lesser Dao' },
    { to: '/lucan/spells', label: 'Spells' },
    { to: '/lucan/items', label: 'Items' },
    { to: '/lucan/vessel', label: 'Vessel' },
    { to: '/lucan/lore', label: 'Lore' },
    { to: '/lucan/levels', label: 'Levels' }
  ],
  rules: { houseRules, rulings }
}
