<script setup lang="ts">
const nav = [
  { to: '/', label: 'Sheet', exact: true },
  { to: '/session', label: 'Session' },
  { to: '/lesser-dao', label: 'Lesser Dao' },
  { to: '/spells', label: 'Spells' },
  { to: '/items', label: 'Items' },
  { to: '/vessel', label: 'Vessel' },
  { to: '/lore', label: 'Lore' },
  { to: '/rules', label: 'Rules' },
  { to: '/dm', label: 'DM' }
]
const route = useRoute()
const isActive = (item: (typeof nav)[number]) => (item.exact ? route.path === item.to : route.path.startsWith(item.to))

const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))

// On a phone the session page's own status bar sticks to the top instead of the header
const onSession = computed(() => route.path.startsWith('/session'))
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="top-0 z-40 border-b border-gold/10 bg-obsidian-950/85 backdrop-blur-md" :class="onSession ? 'md:sticky' : 'sticky'">
      <div class="wrap flex h-[var(--header-h)] items-center gap-4">
        <NuxtLink to="/" class="group flex min-w-0 items-center gap-3">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-gold/30 bg-obsidian-850 transition group-hover:shadow-glow">
            <GemIcon :size="20" />
          </span>
          <span class="min-w-0 leading-tight">
            <strong class="block truncate font-display text-[15px] font-semibold tracking-wider text-parchment">Lucan Beryll</strong>
            <small class="block truncate text-[10.5px] uppercase tracking-[0.18em] text-faint">Dao Genie · Warlock 10</small>
          </span>
        </NuxtLink>

        <nav class="ml-auto hidden h-full items-stretch gap-1 lg:flex" aria-label="Primary">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="relative flex items-center whitespace-nowrap px-3 text-[13px] font-medium transition"
            :class="isActive(item) ? 'text-gold-light' : 'text-dim hover:text-parchment'"
          >
            <span class="rounded-lg px-1 py-1.5" :class="item.to === '/session' && !isActive(item) ? 'text-gold/90' : ''">{{ item.label }}</span>
            <span v-if="isActive(item)" class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
          </NuxtLink>
        </nav>

        <div class="ml-auto flex items-center gap-2 lg:hidden">
          <NuxtLink v-if="!onSession" to="/session" class="btn btn-gold px-3 py-2 text-[13px]">Session</NuxtLink>
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
            v-for="item in nav"
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
        <span>D&amp;D 5e (2014) + Tasha’s · campaign homebrew is marked <span class="chip ml-1 border-topaz/40 text-topaz">Homebrew</span></span>
        <span class="font-serif text-sm italic text-dim">“A deal made is a deal kept.”</span>
      </div>
    </footer>

    <DiceToasts />
  </div>
</template>
