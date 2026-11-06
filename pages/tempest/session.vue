<script setup lang="ts">
import { character } from '~/data/characters/tempest/character'

useHead({ title: `Session — ${character.name}` })

const { reset } = useTempestTracker()

const sections = [
  { id: 'resources', label: 'Resources' },
  { id: 'rolls', label: 'Rolls' },
  { id: 'items', label: 'Items & features' },
  { id: 'attacks', label: 'Attacks' },
  { id: 'spells', label: 'Spells' }
]

function resetAll() {
  if (confirm('Reset the whole tracker? HP, slots, daily uses and everything running go back to the start.')) reset()
}
</script>

<template>
  <div>
    <header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <h1 class="font-display text-3xl font-bold tracking-wide sm:text-4xl"><span class="text-gilded">Session</span></h1>
      <nav class="scrollbar-none -mx-[var(--gutter)] flex gap-1.5 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Session sections">
        <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="chip shrink-0 px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">{{ s.label }}</a>
        <button type="button" class="chip shrink-0 px-3 py-1 text-xs text-faint transition hover:border-ruby/50 hover:text-ruby" @click="resetAll">Reset</button>
      </nav>
    </header>

    <TempestSessionHud class="mt-4" />

    <!--
      Phone: one column. lg: resources | rolls, items, attacks, then spells.
      2xl: resources | rolls, items, attacks | spells.
    -->
    <div class="mt-6 grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)_minmax(0,1fr)] 3xl:grid-cols-[380px_minmax(0,1fr)_minmax(0,1fr)]">
      <div class="grid items-start gap-5 md:grid-cols-2 lg:row-span-2 lg:grid-cols-1 2xl:row-span-1">
        <TempestSessionResources id="resources" />
        <TempestSessionCondition />
      </div>

      <div class="space-y-5">
        <TempestSessionRolls id="rolls" />
        <TempestSessionItems id="items" />
        <TempestSessionAttacks id="attacks" />
      </div>

      <TempestSessionSpells id="spells" class="lg:col-start-2 2xl:col-start-auto" />
    </div>
  </div>
</template>
