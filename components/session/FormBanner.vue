<script setup lang="ts">
import { lesserDao as dao } from '~/data/characters/lucan/character'
import { spells } from '~/data/characters/lucan/spells'

const { state, endForm, endTurn } = useTracker()
const { note } = useDice()

const concentrating = computed(() => spells.find(s => s.slug === state.value.concentration))

function nextTurn() {
  if (endTurn()) note('The Lesser Dao form ends', `${dao.turns} turns are up`)
}
</script>

<template>
  <section class="panel relative overflow-hidden border-topaz/40">
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-topaz/15 via-topaz/[0.04] to-transparent" aria-hidden="true" />
    <div class="relative flex flex-wrap items-center gap-x-6 gap-y-4 p-4 sm:p-5">
      <span class="hidden h-14 w-14 shrink-0 place-items-center rounded-xl border border-topaz/50 bg-obsidian-950/70 text-3xl text-topaz sm:grid" aria-hidden="true">⟁</span>

      <div class="min-w-0 flex-1 basis-72">
        <p class="eyebrow text-topaz">Transformed · {{ state.formTurns }} of {{ dao.turns }} turns left</p>
        <h2 class="heading text-xl">{{ dao.name }}</h2>
        <p class="mt-1 text-[12.5px] leading-relaxed text-dim">
          {{ dao.size }} · walk, burrow and fly 30 ft · {{ dao.senses.toLowerCase() }} · resists {{ dao.resistances.join(' and ').toLowerCase() }} · can’t be petrified.
          Attacks, checks and saves below use the form’s stats.
        </p>
        <p class="mt-1 text-[12.5px] text-parchment/85">
          No spellcasting.<template v-if="concentrating"> Concentration on <NuxtLink :to="`/lucan/spells/${concentrating.slug}`" class="text-rose hover:text-parchment">{{ concentrating.name }}</NuxtLink> carries on.</template>
        </p>
      </div>

      <div class="flex w-full flex-col gap-2.5 sm:w-auto sm:items-end">
        <div class="flex gap-1" :aria-label="`${state.formTurns} of ${dao.turns} turns left`">
          <span
            v-for="i in dao.turns"
            :key="i"
            class="h-3 w-3 rotate-45 rounded-[2px] border"
            :class="i <= state.formTurns ? 'border-topaz/80 bg-topaz/50' : 'border-obsidian-500 bg-obsidian-900'"
          />
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button type="button" class="btn border-topaz/50 py-2 text-topaz hover:border-topaz" @click="nextTurn">End turn</button>
          <button type="button" class="btn py-2" @click="endForm">End form</button>
          <NuxtLink to="/lucan/lesser-dao" class="btn py-2">Stat block →</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
