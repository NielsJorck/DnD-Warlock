<script setup lang="ts">
import type { Item } from '~/data/items'

const props = defineProps<{ item: Item; featured?: boolean }>()
const rarity = computed(() => (props.item.rarity ? rarityTone[props.item.rarity] : null))
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border bg-obsidian-900/80 transition hover:shadow-panel"
    :class="featured ? 'border-gold/25 hover:border-gold/50' : 'border-obsidian-600 hover:border-obsidian-500'"
  >
    <NuxtLink v-if="item.art" :to="`/items/${item.slug}`" class="relative block h-44 overflow-hidden border-b border-obsidian-600" tabindex="-1" aria-hidden="true">
      <img :src="publicPath(item.art.src)" alt="" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" :style="{ objectPosition: item.art.focus }" loading="lazy" />
      <div class="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-transparent to-transparent" />
    </NuxtLink>
    <div class="flex items-start gap-3.5 p-4">
      <span
        class="grid h-12 w-12 shrink-0 place-items-center rounded-xl border text-2xl"
        :class="featured ? 'border-gold/40 bg-gradient-to-b from-gold/20 to-obsidian-900 text-gold-light' : 'border-obsidian-500 bg-obsidian-800 text-parchment/80'"
        :style="rarity && !featured ? { color: rarity.hex, borderColor: `${rarity.hex}55` } : undefined"
        aria-hidden="true"
      >{{ item.glyph }}</span>
      <div class="min-w-0 flex-1">
        <NuxtLink :to="`/items/${item.slug}`" class="font-display text-[15px] font-semibold tracking-wide text-parchment transition hover:text-gold-light">
          {{ item.name }}
        </NuxtLink>
        <p class="text-[11.5px] text-faint">
          {{ item.type }}<template v-if="item.rarity"> · <span :class="rarity?.text">{{ item.rarity }}</span></template><template v-if="item.source"> · {{ item.source }}</template>
        </p>
        <div class="mt-1.5 flex flex-wrap gap-1">
          <span v-if="item.attunement" class="chip py-0 text-[10px]" :class="item.group === 'attuned' ? 'border-gold/40 text-gold-light' : ''">Attunement</span>
          <span v-if="item.charges" class="chip py-0 text-[10px]">{{ item.charges }}</span>
          <span v-if="item.status && item.status !== 'Current'" class="chip py-0 text-[10px]" :class="item.status === 'Needs DM approval' ? 'border-topaz/40 text-topaz' : 'border-sapphire/40 text-sapphire'">{{ item.status }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col px-4 pb-4">
      <p class="text-[13.5px] font-medium text-parchment">{{ item.effect }}</p>
      <p class="mt-1 text-[12.5px] text-dim">{{ item.role }}</p>
      <p v-if="item.caveat" class="mt-2 border-l-2 border-topaz/50 pl-2.5 text-[12px] leading-relaxed text-topaz/90">{{ item.caveat }}</p>

      <details v-if="item.rules.length || item.forCharacter" class="group/d mt-3">
        <summary class="inline-flex items-center gap-1 text-[11.5px] text-dim transition hover:text-gold-light">
          <span class="transition group-open/d:rotate-90">▸</span> Rules &amp; notes
        </summary>
        <ul class="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-parchment/80">
          <li v-for="r in item.rules" :key="r" class="flex gap-2"><span class="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-gold/60" />{{ r }}</li>
        </ul>
        <p v-if="item.forCharacter" class="mt-2 rounded-lg bg-obsidian-950/70 px-3 py-2 text-[12.5px] italic leading-relaxed text-dim">{{ item.forCharacter }}</p>
      </details>
    </div>
  </article>
</template>
