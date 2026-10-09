import { spells } from './data/spells'
import { items } from './data/items'

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
      title: 'Lucan Beryll — Dao Genie Warlock',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Character codex for Lucan Beryll, a level 10 Half-Elf Dao Genie warlock (D&D 5e 2014).' },
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
      routes: [
        '/',
        '/dm',
        ...spells.map(s => `/spells/${s.slug}`),
        ...items.map(i => `/items/${i.slug}`)
      ]
    }
  }
})
