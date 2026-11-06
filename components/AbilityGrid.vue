<script setup lang="ts">
import { abilityNames, type AbilityKey } from '~/data/characters/shared'
import type { RollStats } from '~/composables/useCharacter'

// Lucan's scores unless another character's are passed; `highlight` is the casting ability
const props = withDefaults(defineProps<{ stats?: RollStats['abilities']; highlight?: AbilityKey }>(), { highlight: 'cha' })

const abilities = computed(() => abilityOrder.map(key => ({ key, name: abilityNames[key], ...(props.stats ?? lucanStats.abilities)[key] })))
</script>

<template>
  <div class="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
    <div
      v-for="a in abilities"
      :key="a.key"
      class="rounded-lg border px-1.5 py-1.5 text-center"
      :class="a.key === highlight ? 'border-gold/40 bg-gold/5' : 'border-obsidian-600 bg-obsidian-950/50'"
      :title="`${a.name} ${a.score}: check ${signed(a.check)}, save ${signed(a.save)}`"
    >
      <div class="text-[10px] font-semibold uppercase tracking-wider" :class="a.key === highlight ? 'text-gold' : 'text-faint'">{{ a.key }} {{ a.score }}</div>
      <div class="stat-num text-xl leading-tight">{{ signed(a.check) }}</div>
      <div
        class="mt-0.5 rounded-md border py-0.5 text-[11px] font-medium tabular-nums"
        :class="a.proficient ? 'border-gold/30 bg-gold/5 text-parchment' : 'border-obsidian-600 text-faint'"
      >Save {{ signed(a.save) }}</div>
    </div>
  </div>
</template>
