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
  'rod-of-pact-keeper-flavored': '/items/rod-of-the-pact-keeper',
  'genie-vessel': '/vessel',
  'zahir-ibn-kharum': '/lore',
  'homebrew-and-dm-rulings': '/rules',
  'allowed-sources': '/rules',
  'open-questions': '/rules'
}

const renamedItems: Record<string, string> = {
  'barrier-tattoo-rare': '/items/barrier-tattoo',
  'rod-of-the-pact-keeper-plus-2': '/items/rod-of-the-pact-keeper',
  'bag-of-holding-function': '/vessel',
  'dagger-shaped-rod': '/items/rod-of-the-pact-keeper'
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
