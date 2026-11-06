// The Soulknife's entry in the character list (data/characters/index.ts)

import type { CharacterEntry } from '..'
import { character } from './character'
import { houseRules, questions, rulings } from './lore'

export const soulknife: CharacterEntry = {
  slug: 'soulknife',
  name: character.name,
  tagline: `Soulknife ${character.level} · Concept`,
  summary: `Level ${character.level} ${character.species} ${character.className}: ${character.subclass}, a ${character.background.toLowerCase()} in it for the payday. ${character.concept} Built for the Sword Mountains expedition, with his uncommon item pitched to the DM.`,
  ruleset: character.ruleset,
  epithet: character.epithet,
  motto: character.motto,
  nav: [
    { to: '/soulknife', label: 'Sheet', exact: true },
    { to: '/soulknife/session', label: 'Session', primary: true },
    { to: '/soulknife/powers', label: 'Powers' },
    { to: '/soulknife/items', label: 'Items' },
    { to: '/soulknife/lore', label: 'Lore' },
    { to: '/soulknife/levels', label: 'Levels' }
  ],
  rules: { houseRules, rulings, questions }
}
