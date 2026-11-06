<script setup lang="ts">
import { character } from '~/data/characters/elemental-monk/character'
import { items, itemBySlug } from '~/data/characters/elemental-monk/items'
import { slots, sourceNames, variantOf } from '~/data/characters/item-types'

const route = useRoute()
const item = itemBySlug[route.params.slug as string]
if (!item) throw createError({ statusCode: 404, statusMessage: 'Item not found', fatal: true })

useHead({ title: `${item.name} — ${character.name}’s Items` })

const groupLabel = { owned: 'Starting kit', wishlist: 'Other uncommon pick', vessel: '' }
const rarity = item.rarity ? rarityTone[item.rarity] : null
const requestedVariant = variantOf(item)
const siblings = items.filter(i => i.slug !== item.slug)

const facts = [
  { label: 'Type', value: item.type },
  { label: 'Slot', value: item.slot ? `${slots[item.slot].label} · ${slots[item.slot].rule}` : undefined },
  { label: 'Rarity', value: item.rarity, tone: rarity?.text },
  { label: 'Attunement', value: item.attunement ?? 'Not required' },
  { label: 'Source', value: item.source ? item.source.split(' · ').map(s => sourceNames[s] ?? s).join(' · ') : 'Not recorded' },
  { label: 'Carried', value: item.quantity ? `${item.quantity}` : undefined },
  { label: 'Charges', value: item.charges },
  { label: 'Version', value: requestedVariant ? `${requestedVariant.label} requested` : undefined }
].filter(f => f.value)
</script>

<template>
  <div class="mx-auto max-w-4xl xl:max-w-6xl">
    <NuxtLink to="/elemental-monk/items" class="text-xs text-dim hover:text-gold-light">← Items</NuxtLink>

    <div class="mt-4 grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
      <article class="panel relative overflow-hidden">
        <div class="h-1 w-full" :style="{ background: `linear-gradient(90deg, ${rarity?.hex ?? '#d6a84f'}, transparent)` }" />
        <div class="pointer-events-none absolute -right-4 -top-6 font-display text-[160px] leading-none opacity-[0.07]" :style="{ color: rarity?.hex }" aria-hidden="true">{{ item.glyph }}</div>
        <div class="relative p-6 sm:p-9">
          <div class="flex flex-wrap gap-2">
            <span class="chip" :class="item.group === 'owned' ? 'border-gold/50 bg-gold/10 text-gold-light' : 'border-obsidian-500 bg-obsidian-800 text-dim'">{{ groupLabel[item.group] }}</span>
            <span v-if="item.caveat && item.group === 'owned' && item.rarity === 'Uncommon'" class="chip border-topaz/40 text-topaz">Pending the DM</span>
          </div>
          <h1 class="mt-3 font-display text-3xl font-bold tracking-wide text-parchment sm:text-4xl">{{ item.name }}</h1>
          <p v-if="item.role" class="mt-1 font-serif text-xl italic text-dim">{{ item.role }}</p>

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
            <p class="eyebrow mb-2">In their hands</p>
            <p class="lore">{{ item.forCharacter }}</p>
          </div>
        </div>
      </article>

      <section class="xl:sticky xl:top-24 xl:self-start">
        <h2 class="eyebrow mb-3 text-dim">Their other items</h2>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
          <NuxtLink
            v-for="s in siblings"
            :key="s.slug"
            :to="`/elemental-monk/items/${s.slug}`"
            class="flex items-center gap-3 rounded-xl border border-obsidian-600 bg-obsidian-900/70 px-3 py-2.5 transition hover:border-gold/40"
          >
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-obsidian-500 bg-obsidian-800 text-lg" :style="s.rarity ? { color: rarityTone[s.rarity].hex } : undefined" aria-hidden="true">{{ s.glyph }}</span>
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
