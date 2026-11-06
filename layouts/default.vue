<script setup lang="ts">
import { rulesPath, rulesets } from '~/data/campaign'
import { characters, characterForPath, type CharacterNavItem } from '~/data/characters'

const route = useRoute()

// The character whose pages these are. Shared pages (the character list, the
// rules) keep the last character visited, so its pages stay one click away.
const lastSlug = useState('character', () => characters[0].slug)
watch(
  () => characterForPath(route.path),
  c => {
    if (c) lastSlug.value = c.slug
  },
  { immediate: true }
)
const active = computed(() => characterForPath(route.path) ?? characters.find(c => c.slug === lastSlug.value) ?? characters[0])

const nav = computed<CharacterNavItem[]>(() => [...active.value.nav, { to: '/rules', label: 'Rules' }])
const mobileNav = computed<CharacterNavItem[]>(() => [...nav.value, { to: '/', label: 'All characters', exact: true }])
const isActive = (item: CharacterNavItem) => (item.exact ? route.path === item.to : route.path.startsWith(item.to))

// The character name opens a list of the characters and the way back to all of them
const switcherOpen = ref(false)
const switcher = ref<HTMLElement | null>(null)
const closeSwitcher = (e: Event) => {
  if (!switcher.value?.contains(e.target as Node)) switcherOpen.value = false
}
onMounted(() => document.addEventListener('click', closeSwitcher))
onBeforeUnmount(() => document.removeEventListener('click', closeSwitcher))

const menuOpen = ref(false)
watch(() => route.fullPath, () => {
  menuOpen.value = false
  switcherOpen.value = false
})

// On a phone the session page's own status bar sticks to the top instead of the header
const primary = computed(() => active.value.nav.find(n => n.primary))
const onSession = computed(() => !!primary.value && route.path.startsWith(primary.value.to))
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="top-0 z-40 border-b border-gold/10 bg-obsidian-950/85 backdrop-blur-md" :class="onSession ? 'md:sticky' : 'sticky'">
      <div class="wrap flex h-[var(--header-h)] items-center gap-4">
        <div ref="switcher" class="relative min-w-0" @keydown.esc="switcherOpen = false">
          <button
            type="button"
            class="group flex min-w-0 max-w-full items-center gap-3 text-left"
            :aria-expanded="switcherOpen"
            aria-controls="character-switcher"
            @click="switcherOpen = !switcherOpen"
          >
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-gold/30 bg-obsidian-850 transition group-hover:shadow-glow">
              <GemIcon :size="20" />
            </span>
            <span class="min-w-0 leading-tight">
              <strong class="flex items-center gap-1.5 font-display text-[15px] font-semibold tracking-wider text-parchment">
                <span class="truncate">{{ active.name }}</span>
                <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 shrink-0 text-faint transition group-hover:text-gold-light" :class="switcherOpen ? 'rotate-180' : ''" fill="currentColor" aria-hidden="true">
                  <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
                </svg>
              </strong>
              <small class="block truncate text-[10.5px] uppercase tracking-[0.18em] text-faint">{{ active.tagline }}</small>
            </span>
          </button>

          <div
            v-if="switcherOpen"
            id="character-switcher"
            class="panel absolute left-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2*var(--gutter))] bg-obsidian-900 p-2"
          >
            <p class="eyebrow px-2 pb-1.5 pt-1">Characters</p>
            <NuxtLink
              v-for="c in characters"
              :key="c.slug"
              :to="c.nav[0].to"
              class="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-obsidian-800"
              @click="switcherOpen = false"
            >
              <img v-if="c.portrait" :src="publicPath(c.portrait.src)" alt="" class="h-10 w-[30px] shrink-0 rounded-md border border-gold/30 object-cover" />
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold" :class="c.slug === active.slug ? 'text-gold-light' : 'text-parchment'">{{ c.name }}</span>
                <span class="block truncate text-[11px] text-faint">{{ c.tagline }}</span>
              </span>
            </NuxtLink>
            <div class="my-1.5 border-t border-obsidian-600" />
            <NuxtLink to="/" class="flex items-center justify-between rounded-lg px-2 py-2 text-[13px] text-dim transition hover:bg-obsidian-800 hover:text-parchment" @click="switcherOpen = false">
              All characters <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>

        <nav class="ml-auto hidden h-full items-stretch gap-1 lg:flex" aria-label="Primary">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="relative flex items-center whitespace-nowrap px-2 text-[13px] font-medium transition xl:px-3"
            :class="isActive(item) ? 'text-gold-light' : 'text-dim hover:text-parchment'"
          >
            <span class="rounded-lg px-1 py-1.5" :class="item.primary && !isActive(item) ? 'text-gold/90' : ''">{{ item.label }}</span>
            <span v-if="isActive(item)" class="absolute inset-x-2 bottom-0 h-0.5 xl:inset-x-3 rounded-full bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
          </NuxtLink>
        </nav>

        <div class="ml-auto flex items-center gap-2 lg:hidden">
          <NuxtLink v-if="primary && !onSession" :to="primary.to" class="btn btn-gold px-3 py-2 text-[13px]">{{ primary.label }}</NuxtLink>
          <button
            type="button"
            class="btn h-10 w-10 p-0"
            :aria-expanded="menuOpen"
            aria-controls="mobile-nav"
            aria-label="Menu"
            @click="menuOpen = !menuOpen"
          >
            <svg viewBox="0 0 20 20" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
              <path v-if="menuOpen" d="m5 5 10 10M15 5 5 15" />
              <path v-else d="M3.5 6h13M3.5 10h13M3.5 14h13" />
            </svg>
          </button>
        </div>
      </div>

      <nav v-if="menuOpen" id="mobile-nav" class="border-t border-gold/10 lg:hidden" aria-label="Primary">
        <div class="wrap grid grid-cols-2 gap-1.5 py-3 sm:grid-cols-3">
          <NuxtLink
            v-for="item in mobileNav"
            :key="item.to"
            :to="item.to"
            class="rounded-lg border px-3 py-2.5 text-sm font-medium transition"
            :class="isActive(item) ? 'border-gold/50 bg-gold/10 text-gold-light' : 'border-obsidian-600 text-dim hover:border-obsidian-500 hover:text-parchment'"
          >{{ item.label }}</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="wrap flex-1 pb-20 pt-6 sm:pt-10">
      <slot />
    </main>

    <footer class="border-t border-gold/10">
      <div class="wrap flex flex-wrap items-center justify-between gap-3 py-6 text-[11.5px] text-faint">
        <span>
          <NuxtLink :to="rulesPath(active.ruleset)" class="hover:text-gold-light">{{ rulesets[active.ruleset].name }} rules</NuxtLink> · <NuxtLink to="/" class="hover:text-gold-light">All characters</NuxtLink>
        </span>
        <span v-if="active.motto" class="font-serif text-sm italic text-dim">“{{ active.motto }}”</span>
      </div>
    </footer>

    <DiceToasts />
  </div>
</template>
