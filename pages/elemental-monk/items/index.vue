<script setup lang="ts">
import { character } from '~/data/characters/elemental-monk/character'
import { items, bySlot, mundaneGear, gold, goldIn, goldLeft, goldSpent, coins } from '~/data/characters/elemental-monk/items'

useHead({ title: `Items — ${character.name}` })

const query = ref('')
const matches = (i: (typeof items)[number]) => {
  const q = query.value.trim().toLowerCase()
  return !q || [i.name, i.type, i.role, i.effect, i.rarity, i.forCharacter, ...i.rules].join(' ').toLowerCase().includes(q)
}

const owned = computed(() => items.filter(i => i.group === 'owned' && matches(i)))
const wishlist = computed(() => bySlot(items.filter(i => i.group === 'wishlist' && matches(i))))
const empty = computed(() => !owned.value.length && !wishlist.value.length)

const jump = [
  { id: 'kit', label: 'Starting kit', count: items.filter(i => i.group === 'owned').length },
  { id: 'gold', label: 'Gold', count: gold.purchases.length },
  { id: 'gear', label: 'Mundane gear', count: mundaneGear.length },
  { id: 'wishlist', label: 'Other picks', count: items.filter(i => i.group === 'wishlist').length }
].filter(j => j.count)
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-8 -top-14 font-display text-[220px] leading-none text-jade/[0.07]" aria-hidden="true">≋</div>
      <h1 class="font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Items</span></h1>
      <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="relative sm:w-72">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" /></svg>
          <input v-model="query" type="search" placeholder="Search items…" class="field pl-9" aria-label="Search items" />
        </div>
        <nav class="flex flex-wrap gap-1.5" aria-label="Item sections">
          <a v-for="j in jump" :key="j.id" :href="`#${j.id}`" class="chip px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">
            {{ j.label }} <span class="text-faint">{{ j.count }}</span>
          </a>
        </nav>
      </div>
    </header>

    <div v-if="empty" class="panel mt-8 grid place-items-center px-6 py-16 text-center">
      <p class="font-display text-lg text-parchment">Nothing matches “{{ query }}”</p>
      <button type="button" class="btn mt-4" @click="query = ''">Clear search</button>
    </div>

    <section v-if="owned.length" class="mt-10">
      <SectionHeading id="kit" title="Starting Kit" />
      <p class="-mt-2 mb-5 max-w-3xl text-[13px] text-dim">
        The campaign allows one uncommon magic item, which the DM approves, and no +1 weapons or armor. The Cloak of Protection is the ask; the sheet counts it. Three Potions of Healing: the DM’s and two bought.
      </p>
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div class="panel h-fit overflow-hidden">
          <ItemTableHead />
          <ItemRow v-for="i in owned" :key="i.slug" :item="i" base="/elemental-monk/items" />
        </div>
        <div class="panel h-fit p-5 lg:sticky lg:top-24">
          <p class="eyebrow mb-3 text-dim">Attunement slots</p>
          <AttunementSlots :items="items" :max="character.attunementMax" base="/elemental-monk/items" />
          <div class="mt-4 space-y-1.5 border-t border-obsidian-600 pt-3 text-[12.5px]">
            <div class="flex justify-between"><span class="text-dim">Armor Class</span><span class="text-parchment">{{ character.ac.total }} · unarmored + cloak</span></div>
            <div class="flex justify-between"><span class="text-dim">Saves</span><span class="text-parchment">+1 with the cloak</span></div>
            <div class="flex justify-between"><span class="text-dim">Weapons</span><span class="text-parchment">Fists; daggers as backup</span></div>
            <div class="flex justify-between"><span class="text-dim">Gold left</span><span class="text-parchment">{{ coins(goldLeft) }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="gold" class="mt-12 scroll-mt-24">
      <SectionHeading title="Gold" />
      <div class="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div class="panel h-fit p-5">
          <p class="eyebrow mb-2 text-dim">Coming in</p>
          <ul class="space-y-1.5 text-[13px]">
            <li v-for="s in gold.sources" :key="s.label" class="flex items-baseline justify-between gap-3" :title="s.note">
              <span class="text-parchment">{{ s.label }}</span>
              <span class="tabular-nums text-gold-light">{{ coins(s.cp) }}</span>
            </li>
          </ul>
          <div class="mt-3 space-y-1 border-t border-obsidian-600 pt-3 text-[13px]">
            <div class="flex justify-between"><span class="text-dim">Total</span><span class="tabular-nums text-parchment">{{ coins(goldIn) }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Spent</span><span class="tabular-nums text-parchment">{{ coins(goldSpent) }}</span></div>
            <div class="flex justify-between font-semibold"><span class="text-gold-light">Left</span><span class="tabular-nums text-gold-light">{{ coins(goldLeft) }}</span></div>
          </div>
          <p class="mt-3 text-[12px] leading-relaxed text-faint">{{ gold.plan }}</p>
        </div>
        <div class="grid h-fit gap-px overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-600/60">
          <div v-for="p in gold.purchases" :key="p.name" class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 bg-obsidian-900 px-4 py-2.5 text-[13px]">
            <span class="font-semibold text-parchment">{{ p.name }}</span>
            <span class="chip py-0 text-[10px] tabular-nums">{{ coins(p.cp) }}</span>
            <span class="text-[12px] text-faint sm:ml-auto">{{ p.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <SectionHeading id="gear" title="Tools &amp; Gear" />
      <div class="grid gap-px overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-600/60 2xl:grid-cols-2">
        <div v-for="g in mundaneGear" :key="g.name" class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 bg-obsidian-900 px-4 py-2.5 text-[13px]">
          <span class="font-semibold text-parchment">{{ g.name }}</span>
          <span class="chip py-0 text-[10px]">{{ g.where }}</span>
          <span class="text-[12px] text-faint sm:ml-auto">{{ g.note }}</span>
        </div>
      </div>
    </section>

    <section v-if="wishlist.length" class="mt-12">
      <SectionHeading id="wishlist" title="Other Uncommon Picks" />
      <p class="-mt-2 mb-5 max-w-3xl text-[13px] text-dim">If the DM turns the cloak down, these are next. Only one uncommon item at the start; none of these are on the sheet.</p>
      <div class="panel overflow-hidden">
        <ItemTableHead />
        <div v-for="(g, gn) in wishlist" :key="g.slot" :class="gn ? 'border-t border-obsidian-600/70' : ''">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-obsidian-600/70 bg-obsidian-950/60 px-3 py-2 sm:px-4">
            <h3 class="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-light">{{ g.label }}</h3>
            <span class="text-[12px] text-faint">{{ g.rule }}</span>
            <span v-if="g.worn.length" class="text-[12px] text-dim">
              In the kit:
              <template v-for="(w, n) in g.worn" :key="w.slug"><NuxtLink :to="`/elemental-monk/items/${w.slug}`" class="text-gold-light hover:text-parchment">{{ w.name }}</NuxtLink>{{ n < g.worn.length - 1 ? ', ' : '' }}</template>
            </span>
          </div>
          <ItemRow v-for="i in g.items" :key="i.slug" :item="i" base="/elemental-monk/items" />
        </div>
      </div>
    </section>
  </div>
</template>
