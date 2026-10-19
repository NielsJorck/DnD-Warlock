<script setup lang="ts">
import { character } from '~/data/character'
import { items, bySlot, mundaneGear } from '~/data/items'

useHead({ title: 'Treasury — Lucan Beryll' })

const query = ref('')
const matches = (i: (typeof items)[number]) => {
  const q = query.value.trim().toLowerCase()
  return !q || [i.name, i.type, i.role, i.effect, i.rarity, i.forCharacter, ...i.rules].join(' ').toLowerCase().includes(q)
}

const owned = computed(() => items.filter(i => i.group === 'owned' && matches(i)))
const wishlist = computed(() => bySlot(items.filter(i => i.group === 'wishlist' && matches(i))))
const vesselCount = items.filter(i => i.group === 'vessel').length
const empty = computed(() => !owned.value.length && !wishlist.value.length)

const jump = [
  { id: 'owned', label: 'Owned', count: items.filter(i => i.group === 'owned').length },
  { id: 'gear', label: 'Mundane gear', count: mundaneGear.length },
  { id: 'wishlist', label: 'Wishlist', count: items.filter(i => i.group === 'wishlist').length }
]
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-8 -top-14 font-display text-[220px] leading-none text-gold/[0.06]" aria-hidden="true">◈</div>
      <p class="eyebrow">Equipment · attunement {{ character.attunement.used }} / {{ character.attunement.max }}</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Treasury</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">An appraiser’s inventory: what Lucan carries now, as recorded on his Foundry sheet, and a wishlist for later. The Vessel’s household magic is kept on the Vessel page.</p>
      <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="relative sm:w-72">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" /></svg>
          <input v-model="query" type="search" placeholder="Search items…" class="field pl-9" aria-label="Search items" />
        </div>
        <nav class="flex flex-wrap gap-1.5" aria-label="Item sections">
          <a v-for="j in jump" :key="j.id" :href="`#${j.id}`" class="chip px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">
            {{ j.label }} <span class="text-faint">{{ j.count }}</span>
          </a>
          <NuxtLink to="/vessel#rooms" class="chip border-jade/40 px-3 py-1 text-xs text-jade transition hover:border-jade/70 hover:text-parchment">
            Vessel stores <span class="text-faint">{{ vesselCount }}</span> →
          </NuxtLink>
        </nav>
      </div>
    </header>

    <div v-if="empty" class="panel mt-8 grid place-items-center px-6 py-16 text-center">
      <p class="font-display text-lg text-parchment">Nothing matches “{{ query }}”</p>
      <button type="button" class="btn mt-4" @click="query = ''">Clear search</button>
    </div>

    <section v-if="owned.length" class="mt-10">
      <SectionHeading id="owned" eyebrow="On the character sheet" title="Owned Items" />
      <p class="-mt-2 mb-5 max-w-3xl text-[13px] text-dim">
        Everything here is on the Foundry sheet, and the character sheet’s numbers use it. The Golden Pact, the Bracers of the Dao Pact and the Crystal Dagger are campaign items tied to Zahir. Attunement allows 10.
      </p>
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div class="grid gap-4 sm:grid-cols-2">
          <ItemCard v-for="i in owned" :key="i.slug" :item="i" featured />
        </div>
        <div class="panel h-fit p-5 lg:sticky lg:top-24">
          <p class="eyebrow mb-3 text-dim">Attunement slots</p>
          <AttunementSlots />
          <div class="mt-4 space-y-1.5 border-t border-obsidian-600 pt-3 text-[12.5px]">
            <div class="flex justify-between"><span class="text-dim">Armor Class</span><span class="text-parchment">{{ character.ac.total }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Saving throws</span><span class="text-parchment">+{{ character.itemBonuses.saves }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Ability checks</span><span class="text-parchment">+{{ character.itemBonuses.checks }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Spell attack &amp; DC</span><span class="text-parchment">+{{ character.itemBonuses.spell }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Resistance</span><span class="text-parchment">Cold</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <SectionHeading id="gear" eyebrow="Mundane" title="Tools &amp; Gear" />
      <div class="divide-y divide-obsidian-600/60 overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-900/60">
        <div v-for="g in mundaneGear" :key="g.name" class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-4 py-2.5 text-[13px]">
          <span class="font-semibold text-parchment">{{ g.name }}</span>
          <span class="chip py-0 text-[10px]">{{ g.where }}</span>
          <span class="text-[12px] text-faint sm:ml-auto">{{ g.note }}</span>
        </div>
      </div>
    </section>

    <section v-if="wishlist.length" class="mt-12">
      <SectionHeading id="wishlist" eyebrow="For later" title="Wishlist">
        <NuxtLink to="/dm" class="chip px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">DM review →</NuxtLink>
      </SectionHeading>
      <p class="-mt-2 mb-1 max-w-3xl text-[13px] text-dim">
        Items Lucan would like to find, buy or commission later, grouped by where they would be worn. None of their numbers are on the sheet. The DM can rule on each one on the DM page.
      </p>
      <div v-for="g in wishlist" :key="g.slot" class="mt-5">
        <div class="mb-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-obsidian-600/70 pb-1.5">
          <h3 class="font-display text-base font-semibold tracking-wide text-parchment">{{ g.label }}</h3>
          <span class="text-[12px] text-faint">{{ g.rule }}</span>
          <span v-if="g.worn.length" class="text-[12px] text-dim">
            Owned:
            <template v-for="(w, n) in g.worn" :key="w.slug"><NuxtLink :to="`/items/${w.slug}`" class="text-gold-light hover:text-parchment">{{ w.name }}</NuxtLink>{{ n < g.worn.length - 1 ? ', ' : '' }}</template>
            <template v-if="g.max"> ({{ g.worn.length }} / {{ g.max }})</template>
          </span>
          <span v-if="g.full" class="chip border-topaz/40 py-0 text-[10px] text-topaz">Full: one of these means a swap</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ItemCard v-for="i in g.items" :key="i.slug" :item="i" />
        </div>
      </div>
    </section>
  </div>
</template>
