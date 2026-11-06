import { spells } from './data/characters/lucan/spells'
import { items } from './data/characters/lucan/items'
import { spells as tempestSpells } from './data/characters/tempest/spells'
import { items as tempestItems } from './data/characters/tempest/items'
import { powers as soulknifePowers } from './data/characters/soulknife/powers'
import { items as soulknifeItems } from './data/characters/soulknife/items'
import { spells as gloomStalkerSpells } from './data/characters/gloom-stalker/spells'
import { items as gloomStalkerItems } from './data/characters/gloom-stalker/items'
import { techniques as monkTechniques } from './data/characters/elemental-monk/techniques'
import { items as monkItems } from './data/characters/elemental-monk/items'

// GitHub Pages serves a project site from /<repo>/; the deploy workflow sets
// NUXT_APP_BASE_URL. Locally it stays '/'.
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  devServer: { port: 8000 },
  app: {
    baseURL,
    head: {
      title: 'Character Codex',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Character codex for a D&D 5e campaign, played by the 2014 and 2024 rules.' },
        { name: 'theme-color', content: '#0b0a09' },
        // Private campaign notes: keep search engines out
        { name: 'robots', content: 'noindex, nofollow' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },
  nitro: {
    prerender: {
      // The crawler only finds pages that something links to, so list every
      // spell and item explicitly.
      crawlLinks: true,
      // A query (/lucan/spells?tab=book) is the same static file, so rendering it
      // again would only overwrite that file with another tab's HTML.
      ignore: [(route: string) => route.includes('?')],
      routes: [
        '/',
        ...spells.map(s => `/lucan/spells/${s.slug}`),
        ...items.map(i => `/lucan/items/${i.slug}`),
        ...tempestSpells.map(s => `/tempest/spells/${s.slug}`),
        ...tempestItems.map(i => `/tempest/items/${i.slug}`),
        ...soulknifePowers.map(p => `/soulknife/powers/${p.slug}`),
        ...soulknifeItems.map(i => `/soulknife/items/${i.slug}`),
        ...gloomStalkerSpells.map(s => `/gloom-stalker/spells/${s.slug}`),
        ...gloomStalkerItems.map(i => `/gloom-stalker/items/${i.slug}`),
        ...monkTechniques.map(t => `/elemental-monk/techniques/${t.slug}`),
        ...monkItems.map(i => `/elemental-monk/items/${i.slug}`)
      ]
    }
  }
})
