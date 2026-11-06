// The Warrior of the Elements' entry in the character list (data/characters/index.ts)

import type { CharacterEntry } from '..'
import { character } from './character'
import { houseRules, questions, rulings } from './lore'

export const elementalMonk: CharacterEntry = {
  slug: 'elemental-monk',
  name: character.name,
  tagline: `Elements Monk ${character.level} · Concept`,
  summary: `Level ${character.level} ${character.species} ${character.className}: ${character.subclass}, a ${character.background.toLowerCase()} the sea threw back. ${character.concept} For the Sword Mountains expedition; the Bugbear and the uncommon item both wait on the DM.`,
  ruleset: character.ruleset,
  epithet: character.epithet,
  motto: character.motto,
  // No portrait yet: the sheet and lore pages show an emblem instead
  nav: [
    { to: '/elemental-monk', label: 'Sheet', exact: true },
    { to: '/elemental-monk/session', label: 'Session', primary: true },
    { to: '/elemental-monk/techniques', label: 'Techniques' },
    { to: '/elemental-monk/items', label: 'Items' },
    { to: '/elemental-monk/lore', label: 'Lore' },
    { to: '/elemental-monk/levels', label: 'Levels' }
  ],
  rules: { houseRules, rulings, questions }
}
