// Every character on the site. Each one lives under /<slug>: its data in
// data/characters/<slug>/ and its pages in pages/<slug>/. Add a character by
// adding its folder and listing its entry below.

import type { CharacterRules, RulesetId } from '../campaign'
import { lucan } from './lucan'
import { tempest } from './tempest'
import { soulknife } from './soulknife'
import { gloomStalker } from './gloom-stalker'
import { elementalMonk } from './elemental-monk'

export interface CharacterNavItem {
  to: string
  label: string
  exact?: boolean
  primary?: boolean // highlighted, and the shortcut in the phone header
}

export interface CharacterEntry {
  slug: string
  name: string
  tagline: string // under the name in the header
  summary: string // on the character list
  ruleset: RulesetId // 2014 or 2024: the rules every number on their pages follows
  epithet?: string
  motto?: string // in the footer while on the character's pages
  portrait?: { src: string; alt: string }
  nav: CharacterNavItem[] // the first item is the sheet
  rules?: CharacterRules // the character's own section of /rules
}

export const characters: CharacterEntry[] = [lucan, tempest, soulknife, gloomStalker, elementalMonk]

export const characterForPath = (path: string) => characters.find(c => path === `/${c.slug}` || path.startsWith(`/${c.slug}/`))
