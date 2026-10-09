<script setup lang="ts">
import { character, abilityNames } from '~/data/character'

const withItems = ref(true)
const { roll } = useDice()

const rows = computed(() =>
  abilityOrder.map(key => {
    const mod = abilityMod(key)
    const check = mod + (withItems.value ? character.itemBonuses.checks : 0)
    return {
      key,
      name: abilityNames[key],
      score: character.abilities[key],
      mod,
      check,
      save: saveBonus(key, withItems.value),
      proficient: character.saveProficiencies.includes(key),
      primary: key === 'cha'
    }
  })
)
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-faint">Click a check or save to roll it.</p>
      <label class="flex cursor-pointer select-none items-center gap-2 text-xs text-dim">
        <span>Include Ring &amp; Stone bonuses</span>
        <button
          type="button"
          role="switch"
          :aria-checked="withItems"
          class="relative h-5 w-9 rounded-full border transition"
          :class="withItems ? 'border-gold/60 bg-gold/30' : 'border-obsidian-500 bg-obsidian-800'"
          @click="withItems = !withItems"
        >
          <span class="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-parchment transition-all" :class="withItems ? 'left-[18px]' : 'left-0.5'" />
        </button>
      </label>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      <div
        v-for="a in rows"
        :key="a.key"
        class="relative flex flex-col items-center rounded-xl border px-2 pb-3 pt-3 text-center"
        :class="a.primary ? 'border-gold/50 bg-gradient-to-b from-gold/10 to-obsidian-900' : 'border-obsidian-600 bg-obsidian-950/50'"
      >
        <span class="eyebrow" :class="a.primary ? '' : 'text-dim'">{{ a.name }}</span>
        <button
          type="button"
          class="stat-num mt-1 rounded-lg px-2 text-4xl leading-tight transition hover:text-gold-light"
          :title="`Roll ${a.name} check`"
          @click="roll(`1d20${signed(a.check).replace('−', '-')}`, `${a.name} check`)"
        >{{ signed(a.check) }}</button>
        <span class="-mt-0.5 rounded-full border border-obsidian-500 bg-obsidian-900 px-2.5 text-[11px] font-semibold tabular-nums text-dim">{{ a.score }}</span>
        <button
          type="button"
          class="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium tabular-nums transition hover:border-gold/60"
          :class="a.proficient ? 'border-gold/30 bg-gold/5 text-parchment' : 'border-obsidian-600 text-faint'"
          :title="`Roll ${a.name} saving throw`"
          @click="roll(`1d20${signed(a.save).replace('−', '-')}`, `${a.name} save`)"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="a.proficient ? 'bg-gold' : 'border border-faint'" />
          Save {{ signed(a.save) }}
        </button>
      </div>
    </div>
    <p class="mt-3 text-[11px] text-faint">
      <span class="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle" /> Proficient save.
      Big numbers are ability checks<template v-if="withItems"> (including the Stone of Good Luck’s +1)</template>. Saves<template v-if="withItems"> include +1 from the Ring and +1 from the Stone</template>.
    </p>
  </div>
</template>
