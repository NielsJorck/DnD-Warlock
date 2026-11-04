<script setup lang="ts">
import { abilityNames } from '~/data/characters/lucan/character'

const abilities = abilityOrder.map(key => ({ key, name: abilityNames[key], ...lucanStats.abilities[key] }))
</script>

<template>
  <div class="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
    <div
      v-for="a in abilities"
      :key="a.key"
      class="rounded-lg border px-1.5 py-1.5 text-center"
      :class="a.key === 'cha' ? 'border-gold/40 bg-gold/5' : 'border-obsidian-600 bg-obsidian-950/50'"
      :title="`${a.name} ${a.score}: check ${signed(a.check)}, save ${signed(a.save)}`"
    >
      <div class="text-[10px] font-semibold uppercase tracking-wider" :class="a.key === 'cha' ? 'text-gold' : 'text-faint'">{{ a.key }} {{ a.score }}</div>
      <div class="stat-num text-xl leading-tight">{{ signed(a.check) }}</div>
      <div
        class="mt-0.5 rounded-md border py-0.5 text-[11px] font-medium tabular-nums"
        :class="a.proficient ? 'border-gold/30 bg-gold/5 text-parchment' : 'border-obsidian-600 text-faint'"
      >Save {{ signed(a.save) }}</div>
    </div>
  </div>
</template>
