<script setup lang="ts">
import { character } from '~/data/character'
import { items } from '~/data/items'

useHead({ title: 'Treasury — Lucan Beryll' })

const query = ref('')
const matches = (i: (typeof items)[number]) => {
  const q = query.value.trim().toLowerCase()
  return !q || [i.name, i.type, i.role, i.effect, i.rarity, i.forCharacter, ...i.rules].join(' ').toLowerCase().includes(q)
}

const attuned = computed(() => items.filter(i => i.group === 'attuned' && matches(i)))
const gear = computed(() => items.filter(i => i.group === 'gear' && matches(i)))
const suggestions = computed(() => items.filter(i => i.group === 'suggestion' && matches(i)))
const priorityPicks = computed(() => suggestions.value.filter(i => i.priority))
const otherPicks = computed(() => suggestions.value.filter(i => !i.priority))
const vesselCount = items.filter(i => i.group === 'vessel').length
const empty = computed(() => !attuned.value.length && !gear.value.length && !suggestions.value.length)

const jump = [
  { id: 'attuned', label: 'Attuned', count: items.filter(i => i.group === 'attuned').length },
  { id: 'gear', label: 'Carried', count: items.filter(i => i.group === 'gear').length },
  { id: 'suggestions', label: 'Wishlist', count: items.filter(i => i.group === 'suggestion').length }
]
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-8 -top-14 font-display text-[220px] leading-none text-gold/[0.06]" aria-hidden="true">◈</div>
      <p class="eyebrow">Equipment · attunement {{ character.attunement.used }} / {{ character.attunement.max }}</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Treasury</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">An appraiser’s inventory: what Lucan wears, what he carries, and what is worth acquiring next. The Vessel’s household magic is kept on the Vessel page.</p>
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

    <section v-if="attuned.length" class="mt-10">
      <SectionHeading id="attuned" eyebrow="Worn and bonded" title="Attuned Items" />
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div class="grid gap-4 sm:grid-cols-2">
          <ItemCard v-for="i in attuned" :key="i.slug" :item="i" featured />
        </div>
        <div class="panel h-fit p-5">
          <p class="eyebrow mb-3 text-dim">Attunement slots</p>
          <AttunementSlots />
          <div class="mt-4 space-y-1.5 border-t border-obsidian-600 pt-3 text-[12.5px]">
            <div class="flex justify-between"><span class="text-dim">Armor Class</span><span class="text-parchment">{{ character.ac.total }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Saving throws</span><span class="text-parchment">+{{ character.itemBonuses.saves }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Ability checks</span><span class="text-parchment">+{{ character.itemBonuses.checks }}</span></div>
            <div class="flex justify-between"><span class="text-dim">Spell attack &amp; DC</span><span class="text-parchment">+{{ character.itemBonuses.spell }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="gear.length" class="mt-12">
      <SectionHeading id="gear" eyebrow="On his person" title="Carried Gear" />
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ItemCard v-for="i in gear" :key="i.slug" :item="i" />
      </div>
    </section>


    <section v-if="suggestions.length" class="mt-12">
      <SectionHeading id="suggestions" eyebrow="Not owned yet" title="Acquisition Wishlist" />
      <p class="-mt-2 mb-5 max-w-3xl text-[13px] text-dim">Upgrades that fit Lucan’s build, with the catches an appraiser would flag. All of them need the DM’s blessing.</p>
      <template v-if="priorityPicks.length">
        <p class="eyebrow mb-3 text-gold-light">Priority picks</p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ItemCard v-for="i in priorityPicks" :key="i.slug" :item="i" featured />
        </div>
      </template>
      <template v-if="otherPicks.length">
        <p class="eyebrow mb-3 text-dim" :class="{ 'mt-8': priorityPicks.length }">More options</p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ItemCard v-for="i in otherPicks" :key="i.slug" :item="i" />
        </div>
      </template>
    </section>
  </div>
</template>
