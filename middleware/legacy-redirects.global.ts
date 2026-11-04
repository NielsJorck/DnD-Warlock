import { spellBySlug } from '~/data/characters/lucan/spells'
import { itemBySlug } from '~/data/characters/lucan/items'
import { roomBySlug } from '~/data/characters/lucan/vessel'

// Keeps links to the old Nuxt Content pages working.
const pages: Record<string, string> = {
  'dnd-5e-warlock': '/lucan',
  'page-library': '/',
  'known-spells': '/lucan/spells',
  'spell-reference': '/lucan/spells?tab=all',
  'spell-compendium': '/lucan/spells?tab=all',
  'current-items-and-suggestions': '/lucan/items',
  'item-reference': '/lucan/items',
  'item-compendium': '/lucan/items',
  'rod-of-pact-keeper-flavored': '/lucan/items/pact-keepers-crystal-dagger',
  'genie-vessel': '/lucan/vessel',
  'zahir-ibn-kharum': '/lucan/lore',
  'homebrew-and-dm-rulings': '/rules',
  'allowed-sources': '/rules',
  'open-questions': '/rules#lucan'
}

const renamedItems: Record<string, string> = {
  // Consolidated into the campaign's patron items
  ...Object.fromEntries(['barrier-tattoo', 'barrier-tattoo-rare', 'barrier-tattoo-large', 'illuminators-tattoo'].map(s => [s, '/lucan/items/the-golden-pact'])),
  ...Object.fromEntries(['rod-of-the-pact-keeper', 'rod-of-the-pact-keeper-plus-2', 'rod-of-the-pact-keeper-3', 'dagger-shaped-rod'].map(s => [s, '/lucan/items/pact-keepers-crystal-dagger'])),
  'illusionists-bracers': '/lucan/items/bracers-of-the-dao-pact',
  'bag-of-holding-function': '/lucan/vessel',
  'stirring-scaled-ornament': '/lucan/items/scaled-ornament',
  // No longer requested
  ...Object.fromEntries(
    ['bracers-of-defense', 'pearl-of-power', 'mind-crystal', 'mind-crystal-quickened', 'wand-of-web', 'dragon-touched-focus', 'stirring-dragon-touched-focus', 'orb-of-skoraeus', 'robe-of-the-archmagi', 'tome-of-leadership-and-influence', 'belt-of-dwarvenkind'].map(s => [s, '/lucan/items'])
  )
}

// Lucan's pages sat at the root before the site had more than one character
const movedToLucan = ['session', 'lesser-dao', 'spells', 'items', 'vessel', 'lore', 'levels', 'dm']

function legacyTarget(path: string): string | undefined {
  const parts = path.replace(/\/+$/, '').split('/').filter(Boolean)
  if (movedToLucan.includes(parts[0])) {
    if (parts.length === 2 && parts[0] === 'items' && renamedItems[parts[1]]) return renamedItems[parts[1]]
    return `/lucan/${parts.join('/')}`
  }
  if (parts.length !== 1) return
  // Old export appended a 6-character hash to duplicate pages
  const slug = parts[0].replace(/-[0-9a-f]{6}$/, '')
  if (pages[slug]) return pages[slug]
  if (roomBySlug[slug]) return `/lucan/vessel#${slug}`
  if (spellBySlug[slug]) return `/lucan/spells/${slug}`
  if (itemBySlug[slug]) return `/lucan/items/${slug}`
  if (renamedItems[slug]) return renamedItems[slug]
}

export default defineNuxtRouteMiddleware(to => {
  const target = legacyTarget(to.path)
  if (!target || target === to.path) return
  // Keep the query and hash (a spellbook tab, a Vessel room) unless the target sets its own
  const dest = /[?#]/.test(target) ? target : { path: target, query: to.query, hash: to.hash }
  return navigateTo(dest, { redirectCode: 301, replace: true })
})
