<script setup lang="ts">
import { type Power, kindTone } from '~/data/characters/soulknife/powers'
import { levelLabel } from '~/data/characters/shared'

const props = defineProps<{ power: Power }>()
const cells = computed(() =>
  [
    { label: 'When', value: props.power.timing },
    { label: 'Range', value: props.power.range },
    { label: 'Cost', value: props.power.cost },
    { label: 'Duration', value: props.power.duration },
    { label: 'From', value: props.power.source, tone: kindTone[props.power.kind].text },
    { label: 'Arrives', value: `Level ${props.power.level}` }
  ].filter(c => c.value)
)
</script>

<template>
  <div>
    <dl class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-obsidian-600/70 bg-obsidian-600/70 sm:grid-cols-3">
      <div v-for="c in cells" :key="c.label" class="bg-obsidian-950/80 px-3 py-2">
        <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">{{ c.label }}</dt>
        <dd class="text-[13px] text-parchment" :class="c.tone">{{ c.value }}</dd>
      </div>
    </dl>
    <p v-if="power.spell" class="mt-1.5 text-[11.5px] italic text-faint">
      {{ power.spell.level ? `${levelLabel(power.spell.level, true)} ${power.spell.school.toLowerCase()} spell` : `${power.spell.school} cantrip` }} · {{ power.spell.components }}{{ power.concentration ? ' · concentration' : '' }}
    </p>
  </div>
</template>
