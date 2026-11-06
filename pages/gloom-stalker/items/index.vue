<script setup lang="ts">
import { character, stats } from '~/data/characters/gloom-stalker/character'
import { items, bySlot, mundaneGear, gold, goldLeft, goldSpent, goldTotal } from '~/data/characters/gloom-stalker/items'

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
  { id: 'wishlist', label: 'Instead of the bracers', count: items.filter(i => i.group === 'wishlist').length }
].filter(j => j.count)
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-8 -top-14 font-display text-[220px] leading-none text-sapphire/[0.07]" aria-hidden="true">➶</div>
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
        The campaign’s start: the normal Ranger and Guide equipment, 200 gp, a Potion of Healing, and one uncommon magic item the DM approves (no +1 weapons or armor). The Bracers of Archery are the pitch, and the sheet counts them.
      </p>
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div class="panel h-fit overflow-hidden">
          <ItemTableHead />
          <ItemRow v-for="i in owned" :key="i.slug" :item="i" base="/gloom-stalker/items" />
        </div>
        <div class="panel h-fit p-5 lg:sticky lg:top-24">
          <p class="eyebrow mb-3 text-dim">Attunement slots</p>
          <AttunementSlots :items="items" :max="character.attunementMax" base="/gloom-stalker/items" />
          <div class="mt-4 space-y-1.5 border-t border-obsidian-600 pt-3 text-[12.5px]">
            <div class="flex justify-between"><span class="text-dim">Armor Class</span><span class="text-parchment">{{ character.ac.total }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Longbow</span><span class="text-parchment">{{ signed(stats.bowAttack) }} · 1d8 + {{ stats.bowDamage }}</span></div>
            <div class="flex justify-between"><span class="text-dim">From the bracers</span><span class="text-parchment">+{{ character.itemBonuses.bowDamage }} damage</span></div>
            <div class="flex justify-between"><span class="text-dim">Potions</span><span class="text-parchment">3 · {{ stats.potion }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="gold" class="mt-12 scroll-mt-24">
      <SectionHeading title="Gold" />
      <div class="grid gap-5 lg:grid-cols-2">
        <div class="panel overflow-hidden">
          <p class="eyebrow border-b border-obsidian-600/70 px-4 py-2.5 text-dim">Where it came from</p>
          <ul class="divide-y divide-obsidian-600/60 text-[13px]">
            <li v-for="s in gold.sources" :key="s.name" class="flex justify-between gap-3 px-4 py-2">
              <span class="text-parchment">{{ s.name }}</span>
              <span class="tabular-nums text-gold-light">{{ s.gp }} gp</span>
            </li>
            <li class="flex justify-between gap-3 bg-obsidian-950/60 px-4 py-2 font-semibold">
              <span class="text-dim">Total</span>
              <span class="tabular-nums text-parchment">{{ goldTotal }} gp</span>
            </li>
          </ul>
        </div>
        <div class="panel overflow-hidden">
          <p class="eyebrow border-b border-obsidian-600/70 px-4 py-2.5 text-dim">What it bought</p>
          <ul class="divide-y divide-obsidian-600/60 text-[13px]">
            <li v-for="p in gold.purchases" :key="p.name" class="flex flex-wrap items-baseline justify-between gap-x-3 px-4 py-2">
              <span class="text-parchment">{{ p.name }} <span class="text-[11.5px] text-faint">· {{ p.note }}</span></span>
              <span class="tabular-nums text-ruby/90">−{{ p.gp }} gp</span>
            </li>
            <li class="flex justify-between gap-3 bg-obsidian-950/60 px-4 py-2 font-semibold">
              <span class="text-dim">Spent {{ goldSpent }} gp · left</span>
              <span class="tabular-nums text-jade">{{ goldLeft }} gp</span>
            </li>
          </ul>
          <p class="px-4 py-2.5 text-[12px] text-faint">{{ gold.reserveNote }}</p>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <SectionHeading id="gear" title="Weapons, Tools &amp; Gear" />
      <div class="grid gap-px overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-600/60 2xl:grid-cols-2">
        <div v-for="g in mundaneGear" :key="g.name" class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 bg-obsidian-900 px-4 py-2.5 text-[13px]">
          <span class="font-semibold text-parchment">{{ g.name }}</span>
          <span class="chip py-0 text-[10px]">{{ g.where }}</span>
          <span class="text-[12px] text-faint sm:ml-auto">{{ g.note }}</span>
        </div>
      </div>
    </section>

    <section v-if="wishlist.length" class="mt-12">
      <SectionHeading id="wishlist" title="Instead of the Bracers" />
      <p class="-mt-2 mb-5 max-w-3xl text-[13px] text-dim">Other uncommon items, if the DM says no to the bracers. Only one starts with them; none of these are on the sheet.</p>
      <div class="panel overflow-hidden">
        <ItemTableHead />
        <div v-for="(g, gn) in wishlist" :key="g.slot" :class="gn ? 'border-t border-obsidian-600/70' : ''">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-obsidian-600/70 bg-obsidian-950/60 px-3 py-2 sm:px-4">
            <h3 class="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-light">{{ g.label }}</h3>
            <span class="text-[12px] text-faint">{{ g.rule }}</span>
            <span v-if="g.worn.length" class="text-[12px] text-dim">
              In the kit:
              <template v-for="(w, n) in g.worn" :key="w.slug"><NuxtLink :to="`/gloom-stalker/items/${w.slug}`" class="text-gold-light hover:text-parchment">{{ w.name }}</NuxtLink>{{ n < g.worn.length - 1 ? ', ' : '' }}</template>
            </span>
          </div>
          <ItemRow v-for="i in g.items" :key="i.slug" :item="i" base="/gloom-stalker/items" />
        </div>
      </div>
    </section>
  </div>
</template>
