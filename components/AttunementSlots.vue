<script setup lang="ts">
import { character } from '~/data/characters/lucan/character'
import { items as lucanItems } from '~/data/characters/lucan/items'
import type { Item } from '~/data/characters/item-types'

// Lucan's attuned items unless another character's are passed (owned items needing attunement)
const props = withDefaults(defineProps<{ items?: Item[]; max?: number; base?: string }>(), { base: '/lucan/items' })

const attuned = computed(() => (props.items ?? lucanItems).filter(i => i.group === 'owned' && i.attunement))
const max = computed(() => props.max ?? character.attunement.max)
const slots = computed(() => Array.from({ length: max.value }, (_, i) => attuned.value[i] ?? null))
</script>

<template>
  <div>
    <div class="grid grid-cols-5 gap-2">
      <template v-for="(item, i) in slots" :key="i">
        <NuxtLink
          v-if="item"
          :to="`${base}/${item.slug}`"
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
    <p class="mt-2 text-[11px] text-faint">{{ attuned.length }} / {{ max }} attuned · the limit at this table</p>
  </div>
</template>
