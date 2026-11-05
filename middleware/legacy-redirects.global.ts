// Lucan's pages sat at the root (/session, /spells/hex…) before the site had
// more than one character. Those URLs redirect to /lucan/…, keeping the query
// and hash (a spellbook tab, a Vessel room).

const movedToLucan = ['session', 'lesser-dao', 'spells', 'items', 'vessel', 'lore', 'levels', 'dm']

// Items that were renamed or dropped while the pages were still at the root
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

function legacyTarget(path: string): string | undefined {
  const parts = path.replace(/\/+$/, '').split('/').filter(Boolean)
  if (!movedToLucan.includes(parts[0])) return
  if (parts.length === 2 && parts[0] === 'items' && renamedItems[parts[1]]) return renamedItems[parts[1]]
  return `/lucan/${parts.join('/')}`
}

export default defineNuxtRouteMiddleware(to => {
  const target = legacyTarget(to.path)
  if (!target || target === to.path) return
  return navigateTo({ path: target, query: to.query, hash: to.hash }, { redirectCode: 301, replace: true })
})
