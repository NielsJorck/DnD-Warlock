<script setup lang="ts">
import { character } from '~/data/character'
import { items } from '~/data/items'

const attuned = items.filter(i => i.group === 'attuned')
const slots = Array.from({ length: character.attunement.max }, (_, i) => attuned[i] ?? null)
</script>

<template>
  <div>
    <div class="grid grid-cols-5 gap-2">
      <template v-for="(item, i) in slots" :key="i">
        <NuxtLink
          v-if="item"
          :to="`/items/${item.slug}`"
          class="group relative grid aspect-square place-items-center rounded-xl border border-gold/40 bg-gradient-to-b from-gold/15 to-obsidian-900 text-xl text-gold-light transition hover:shadow-glow"
          :aria-label="item.name"
        >
          <img v-if="item.art" :src="publicPath(item.art.src)" :alt="item.name" class="h-full w-full rounded-[11px] object-cover" :style="{ objectPosition: item.art.focus }" />
          <template v-else>{{ item.glyph }}</template>
          <span class="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-gold/30 bg-obsidian-900 px-2 py-1 text-[11px] text-parchment group-hover:block">{{ item.name }}</span>
        </NuxtLink>
        <div v-else class="grid aspect-square place-items-center rounded-xl border border-dashed border-obsidian-500 text-faint/60">◇</div>
      </template>
    </div>
    <p class="mt-2 text-[11px] text-faint">{{ attuned.length }} / {{ character.attunement.max }} attuned · campaign limit is 10</p>
  </div>
</template>
