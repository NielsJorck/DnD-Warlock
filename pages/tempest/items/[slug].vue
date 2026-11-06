<script setup lang="ts">
import { character } from '~/data/characters/tempest/character'
import { items, itemBySlug } from '~/data/characters/tempest/items'
import { slots, sourceNames, variantOf } from '~/data/characters/item-types'

const route = useRoute()
const item = itemBySlug[route.params.slug as string]
if (!item) throw createError({ statusCode: 404, statusMessage: 'Item not found', fatal: true })

useHead({ title: `${item.name} — ${character.name}’s Items` })

const groupLabel = { owned: 'Starting kit', wishlist: 'Wishlist', vessel: '' }
const rarity = item.rarity ? rarityTone[item.rarity] : null
const requestedVariant = variantOf(item)
const siblings = items.filter(i => i.slug !== item.slug)

const facts = [
  { label: 'Type', value: item.type },
  { label: 'Slot', value: item.slot ? `${slots[item.slot].label} · ${slots[item.slot].rule}` : undefined },
  { label: 'Rarity', value: item.rarity, tone: rarity?.text },
  { label: 'Attunement', value: item.attunement ?? 'Not required' },
  { label: 'Source', value: item.source ? item.source.split(' · ').map(s => sourceNames[s] ?? s).join(' · ') : 'Not recorded' },
  { label: 'Charges', value: item.charges },
  { label: 'Version', value: requestedVariant ? `${requestedVariant.label} requested` : undefined }
].filter(f => f.value)
</script>

<template>
  <div class="mx-auto max-w-4xl xl:max-w-6xl">
    <NuxtLink to="/tempest/items" class="text-xs text-dim hover:text-gold-light">← Items</NuxtLink>

    <div class="mt-4 grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
      <article class="panel relative overflow-hidden">
        <div class="h-1 w-full" :style="{ background: `linear-gradient(90deg, ${rarity?.hex ?? '#d6a84f'}, transparent)` }" />
        <div class="relative p-6 sm:p-9">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
            <figure v-if="item.art" class="w-full shrink-0 sm:w-64">
              <a :href="publicPath(item.art.src)" target="_blank" rel="noopener" class="block overflow-hidden rounded-2xl border shadow-glow transition hover:brightness-110" :style="{ borderColor: `${rarity?.hex ?? '#d6a84f'}66` }">
                <img :src="publicPath(item.art.src)" :alt="item.art.alt" class="aspect-[3/4] w-full object-cover" :style="{ objectPosition: item.art.focus }" />
              </a>
              <figcaption class="mt-2 text-[12px] italic leading-relaxed text-dim">{{ item.art.caption }}</figcaption>
            </figure>
            <div class="min-w-0">
              <div class="flex flex-wrap gap-2">
                <span class="chip" :class="item.group === 'owned' ? 'border-gold/50 bg-gold/10 text-gold-light' : 'border-obsidian-500 bg-obsidian-800 text-dim'">{{ groupLabel[item.group] }}</span>
                <span v-if="item.homebrew" class="chip border-topaz/40 text-topaz">Homebrew ask</span>
              </div>
              <h1 class="mt-3 font-display text-3xl font-bold tracking-wide text-parchment sm:text-4xl">{{ item.name }}</h1>
              <p v-if="item.role" class="mt-1 font-serif text-xl italic text-dim">{{ item.role }}</p>
            </div>
          </div>

          <dl class="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-obsidian-600/70 bg-obsidian-600/70 sm:grid-cols-3">
            <div v-for="f in facts" :key="f.label" class="bg-obsidian-950/80 px-3 py-2">
              <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">{{ f.label }}</dt>
              <dd class="text-[13px] text-parchment" :class="f.tone">{{ f.value }}</dd>
            </div>
          </dl>

          <div class="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4">
            <p class="eyebrow mb-1">Effect</p>
            <p class="text-lg text-parchment">{{ item.effect }}</p>
          </div>

          <div v-if="item.variants" class="mt-4">
            <p class="eyebrow mb-2 text-dim">Versions · the DM picks one</p>
            <ul class="divide-y divide-obsidian-600/60 overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-950/60">
              <li v-for="v in item.variants" :key="v.id" class="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-[13.5px]" :class="v.id === requestedVariant?.id ? 'bg-gold/5' : ''">
                <span class="w-24 shrink-0 font-semibold text-parchment">{{ v.label }}</span>
                <span class="w-20 shrink-0 text-[12px]" :class="rarityTone[v.rarity].text">{{ v.rarity }}</span>
                <span class="min-w-0 flex-1 text-parchment/85">{{ v.effect }}</span>
                <span v-if="v.id === requestedVariant?.id" class="chip border-gold/40 py-0 text-[10px] text-gold-light">Requested</span>
              </li>
            </ul>
          </div>

          <div v-if="item.caveat" class="mt-4 rounded-xl border border-topaz/30 bg-topaz/5 p-4">
            <p class="eyebrow mb-1 text-topaz">For the DM</p>
            <p class="text-[14.5px] leading-relaxed text-parchment/85">{{ item.caveat }}</p>
          </div>

          <h2 class="heading mt-8 text-lg">How it works</h2>
          <ul class="mt-3 space-y-2.5">
            <li v-for="r in item.rules" :key="r" class="flex gap-3 text-[15px] leading-relaxed text-parchment/85">
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />{{ r }}
            </li>
          </ul>

          <div v-if="item.forCharacter" class="mt-8 border-t border-obsidian-600 pt-6">
            <p class="eyebrow mb-2">In his hands</p>
            <p class="lore">{{ item.forCharacter }}</p>
          </div>
        </div>
      </article>

      <section class="xl:sticky xl:top-24 xl:self-start">
        <h2 class="eyebrow mb-3 text-dim">His other items</h2>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
          <NuxtLink
            v-for="s in siblings"
            :key="s.slug"
            :to="`/tempest/items/${s.slug}`"
            class="flex items-center gap-3 rounded-xl border border-obsidian-600 bg-obsidian-900/70 px-3 py-2.5 transition hover:border-gold/40"
          >
            <img v-if="s.art" :src="publicPath(s.art.src)" alt="" class="h-9 w-9 shrink-0 rounded-lg border border-obsidian-500 object-cover" :style="{ objectPosition: s.art.focus }" />
            <span class="min-w-0">
              <span class="block truncate text-sm font-semibold text-parchment">{{ s.name }}</span>
              <span v-if="s.role" class="block truncate text-[11px] text-faint">{{ s.role }}</span>
            </span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
