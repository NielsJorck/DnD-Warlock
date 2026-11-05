<script setup lang="ts">
import { type Item, slots, sourceNames, variantOf } from '~/data/characters/lucan/items'

// One line of the Items page: a table row that opens into the full rules
const props = defineProps<{ item: Item }>()
const rarity = computed(() => (props.item.rarity ? rarityTone[props.item.rarity] : null))
const variant = computed(() => variantOf(props.item))
const attune = computed(() => (!props.item.attunement ? '' : props.item.attunement.startsWith('Optional') ? 'Optional' : 'Required'))
const source = computed(() => {
  const s = props.item.source ? sourceNames[props.item.source] ?? props.item.source : ''
  return props.item.homebrew ? `Campaign homebrew${s ? `, based on ${s}` : ''}` : s
})
const facts = computed(() =>
  [
    { label: 'Slot', value: props.item.slot ? slots[props.item.slot].label : undefined },
    { label: 'Attunement', value: props.item.attunement },
    { label: 'Charges', value: props.item.charges },
    { label: 'Source', value: source.value }
  ].filter(f => f.value)
)
</script>

<template>
  <details class="group/row border-b border-obsidian-600/60 last:border-b-0 open:bg-obsidian-950/50">
    <summary
      class="grid cursor-pointer list-none grid-cols-[2.25rem_minmax(0,1fr)_1rem] items-center gap-x-3 gap-y-1 px-3 py-2.5 transition hover:bg-obsidian-800/40 sm:px-4 md:grid-cols-[2.25rem_minmax(0,15rem)_minmax(0,1fr)_6.5rem_5.5rem_1rem] [&::-webkit-details-marker]:hidden"
    >
      <span class="row-span-2 grid h-9 w-9 place-items-center self-start overflow-hidden rounded-lg border border-obsidian-500 bg-obsidian-800 text-lg md:row-span-1 md:self-center" :style="rarity ? { color: rarity.hex, borderColor: `${rarity.hex}55` } : undefined" aria-hidden="true">
        <img v-if="item.art" :src="publicPath(item.art.src)" alt="" class="h-full w-full object-cover" :style="{ objectPosition: item.art.focus }" loading="lazy" />
        <template v-else>{{ item.glyph }}</template>
      </span>

      <span class="min-w-0">
        <span class="flex flex-wrap items-baseline gap-x-2">
          <span class="font-display text-[14.5px] font-semibold tracking-wide text-parchment transition group-hover/row:text-gold-light">{{ item.name }}</span>
          <span v-if="item.quantity" class="text-[12px] text-dim">×{{ item.quantity }}</span>
          <span v-if="item.homebrew" class="chip border-topaz/40 py-0 text-[10px] text-topaz md:hidden">Homebrew</span>
        </span>
        <span class="block truncate text-[11.5px] text-faint">{{ item.type }}<template v-if="variant"> · {{ variant.label }} requested</template></span>
      </span>

      <span class="col-start-3 row-start-1 text-faint transition group-open/row:rotate-90 md:col-start-6" aria-hidden="true">▸</span>

      <span class="col-span-2 col-start-2 text-[13px] leading-snug text-parchment/90 md:col-span-1 md:col-start-3 md:row-start-1">{{ item.effect }}</span>

      <span class="hidden text-[12px] md:col-start-4 md:row-start-1 md:block">
        <span class="block" :class="rarity?.text ?? 'text-dim'">{{ item.rarity ?? (item.classFeature ? 'Class feature' : '') }}</span>
        <span v-if="item.homebrew" class="block text-[10.5px] text-topaz/80">Homebrew</span>
      </span>
      <span class="hidden text-[12px] md:col-start-5 md:row-start-1 md:block" :class="attune ? 'text-parchment/85' : 'text-faint'">{{ attune || '—' }}</span>
    </summary>

    <div class="px-3 pb-5 pt-1 sm:px-4 md:pl-[3.75rem]">
      <!-- Items with a painting show it large beside the rules -->
      <div :class="item.art ? 'flex flex-col gap-5 sm:flex-row sm:items-start' : ''">
        <figure v-if="item.art" class="w-full max-w-xs shrink-0 sm:w-52 lg:w-64">
          <a :href="publicPath(item.art.src)" target="_blank" rel="noopener" class="block overflow-hidden rounded-xl border shadow-glow transition hover:brightness-110" :style="{ borderColor: `${rarity?.hex ?? '#d6a84f'}66` }">
            <img :src="publicPath(item.art.src)" :alt="item.art.alt" class="aspect-[3/4] w-full object-cover" :style="{ objectPosition: item.art.focus }" loading="lazy" />
          </a>
          <figcaption class="mt-2 text-[11.5px] italic leading-relaxed text-faint">{{ item.art.caption }}</figcaption>
        </figure>
        <div class="min-w-0 flex-1">
          <dl class="flex flex-wrap gap-x-5 gap-y-1 text-[12px]">
            <div v-for="f in facts" :key="f.label" class="flex gap-1.5">
              <dt class="text-faint">{{ f.label }}</dt>
              <dd class="text-parchment/85">{{ f.value }}</dd>
            </div>
            <div v-if="item.rarity" class="flex gap-1.5 md:hidden">
              <dt class="text-faint">Rarity</dt>
              <dd :class="rarity?.text">{{ item.rarity }}</dd>
            </div>
          </dl>

          <p v-if="item.role" class="mt-3 font-serif text-[15px] italic text-dim">{{ item.role }}</p>

          <div class="mt-3 grid gap-x-8 gap-y-4 xl:grid-cols-2">
            <div class="min-w-0">
              <ul class="space-y-1.5 text-[13px] leading-relaxed text-parchment/85">
                <li v-for="r in item.rules" :key="r" class="flex gap-2.5"><span class="mt-[0.5rem] h-1 w-1 shrink-0 rotate-45 bg-gold/60" />{{ r }}</li>
              </ul>

              <ul v-if="item.variants" class="mt-3 divide-y divide-obsidian-600/60 overflow-hidden rounded-lg border border-obsidian-600/70 text-[12.5px]">
                <li v-for="v in item.variants" :key="v.id" class="flex flex-wrap items-baseline gap-x-3 px-3 py-1.5" :class="v.id === variant?.id ? 'bg-gold/5' : ''">
                  <span class="w-20 shrink-0 font-semibold text-parchment">{{ v.label }}</span>
                  <span class="w-16 shrink-0 text-[11.5px]" :class="rarityTone[v.rarity].text">{{ v.rarity }}</span>
                  <span class="min-w-0 flex-1 text-parchment/80">{{ v.effect }}</span>
                  <span v-if="v.id === variant?.id" class="chip border-gold/40 py-0 text-[10px] text-gold-light">Requested</span>
                </li>
              </ul>
            </div>

            <div v-if="item.caveat || item.forCharacter" class="min-w-0 space-y-3">
              <p v-if="item.caveat" class="border-l-2 border-topaz/50 pl-3 text-[13px] leading-relaxed text-topaz/90">{{ item.caveat }}</p>
              <p v-if="item.forCharacter" class="rounded-lg bg-obsidian-900/80 px-3 py-2 text-[13px] italic leading-relaxed text-dim">{{ item.forCharacter }}</p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink :to="`/lucan/items/${item.slug}`" class="chip px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">Item page →</NuxtLink>
            <NuxtLink v-if="item.see" :to="item.see.to" class="chip border-topaz/40 px-3 py-1 text-xs text-topaz transition hover:border-topaz/70 hover:text-parchment">{{ item.see.label }} →</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>
