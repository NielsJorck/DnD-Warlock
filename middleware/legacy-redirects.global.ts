import { spellBySlug } from '~/data/spells'
import { itemBySlug } from '~/data/items'
import { roomBySlug } from '~/data/vessel'

// Keeps links to the old Nuxt Content pages working.
const pages: Record<string, string> = {
  'dnd-5e-warlock': '/',
  'page-library': '/',
  'known-spells': '/spells',
  'spell-reference': '/spells?tab=all',
  'spell-compendium': '/spells?tab=all',
  'current-items-and-suggestions': '/items',
  'item-reference': '/items',
  'item-compendium': '/items',
  'rod-of-pact-keeper-flavored': '/items/pact-keepers-crystal-dagger',
  'genie-vessel': '/vessel',
  'zahir-ibn-kharum': '/lore',
  'homebrew-and-dm-rulings': '/rules',
  'allowed-sources': '/rules',
  'open-questions': '/rules'
}

const renamedItems: Record<string, string> = {
  // Consolidated into the campaign's patron items
  ...Object.fromEntries(['barrier-tattoo', 'barrier-tattoo-rare', 'barrier-tattoo-large', 'illuminators-tattoo'].map(s => [s, '/items/the-golden-pact'])),
  ...Object.fromEntries(['rod-of-the-pact-keeper', 'rod-of-the-pact-keeper-plus-2', 'rod-of-the-pact-keeper-3', 'dagger-shaped-rod'].map(s => [s, '/items/pact-keepers-crystal-dagger'])),
  'illusionists-bracers': '/items/bracers-of-the-dao-pact',
  'bag-of-holding-function': '/vessel',
  'stirring-scaled-ornament': '/items/scaled-ornament',
  // No longer requested
  ...Object.fromEntries(
    ['bracers-of-defense', 'pearl-of-power', 'mind-crystal', 'mind-crystal-quickened', 'wand-of-web', 'dragon-touched-focus', 'stirring-dragon-touched-focus', 'orb-of-skoraeus', 'robe-of-the-archmagi', 'tome-of-leadership-and-influence', 'belt-of-dwarvenkind'].map(s => [s, '/items'])
  )
}

function legacyTarget(path: string): string | undefined {
  const parts = path.replace(/\/+$/, '').split('/').filter(Boolean)
  if (parts.length === 2 && parts[0] === 'items') return renamedItems[parts[1]]
  if (parts.length !== 1) return
  // Old export appended a 6-character hash to duplicate pages
  const slug = parts[0].replace(/-[0-9a-f]{6}$/, '')
  if (pages[slug]) return pages[slug]
  if (roomBySlug[slug]) return `/vessel#${slug}`
  if (spellBySlug[slug]) return `/spells/${slug}`
  if (itemBySlug[slug]) return `/items/${slug}`
  if (renamedItems[slug]) return renamedItems[slug]
}

export default defineNuxtRouteMiddleware(to => {
  const target = legacyTarget(to.path)
  if (target && target !== to.path) return navigateTo(target, { redirectCode: 301, replace: true })
})
