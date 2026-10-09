<script setup lang="ts">
const nav = [
  { to: '/', label: 'Sheet', exact: true },
  { to: '/spells', label: 'Spells' },
  { to: '/items', label: 'Items' },
  { to: '/vessel', label: 'Vessel' },
  { to: '/lore', label: 'Lore' },
  { to: '/rules', label: 'Rules' },
  { to: '/dm', label: 'DM' }
]
const route = useRoute()
const isActive = (item: (typeof nav)[number]) => (item.exact ? route.path === item.to : route.path.startsWith(item.to))
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 border-b border-gold/10 bg-obsidian-950/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-[1240px] items-center gap-6 px-4 py-3 sm:px-8">
        <NuxtLink to="/" class="group flex shrink-0 items-center gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-xl border border-gold/30 bg-obsidian-850 transition group-hover:shadow-glow">
            <GemIcon :size="20" />
          </span>
          <span class="leading-tight">
            <strong class="block font-display text-[15px] font-semibold tracking-wider text-parchment">Lucan Beryll</strong>
            <small class="block text-[10.5px] uppercase tracking-[0.18em] text-faint">Dao Genie · Warlock 10</small>
          </span>
        </NuxtLink>
        <nav class="scrollbar-none -mr-4 ml-auto flex gap-1 overflow-x-auto pr-4 sm:mr-0 sm:pr-0" aria-label="Primary">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="relative whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition"
            :class="isActive(item) ? 'text-gold-light' : 'text-dim hover:bg-obsidian-800 hover:text-parchment'"
          >
            {{ item.label }}
            <span v-if="isActive(item)" class="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-[1240px] flex-1 px-4 pb-20 pt-8 sm:px-8 sm:pt-12">
      <slot />
    </main>

    <footer class="border-t border-gold/10">
      <div class="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-[11.5px] text-faint sm:px-8">
        <span>D&amp;D 5e (2014) + Tasha’s · campaign homebrew is marked <span class="chip ml-1 border-topaz/40 text-topaz">Homebrew</span></span>
        <span class="font-serif text-sm italic text-dim">“A deal made is a deal kept.”</span>
      </div>
    </footer>

    <DiceToasts />
  </div>
</template>
