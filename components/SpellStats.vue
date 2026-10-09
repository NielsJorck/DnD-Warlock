<script setup lang="ts">
import type { Spell } from '~/data/spells'

const props = defineProps<{ spell: Spell }>()
const cells = computed(() => [
  { label: 'Casting time', value: props.spell.castingTime + (props.spell.ritual ? ' (ritual)' : '') },
  { label: 'Range', value: props.spell.range },
  { label: 'Components', value: props.spell.components },
  { label: 'Duration', value: (props.spell.concentration ? 'Concentration, ' : '') + props.spell.duration },
  { label: 'Access', value: props.spell.access, tone: accessTone[props.spell.access] },
  { label: 'Source', value: props.spell.source }
])
</script>

<template>
  <div>
    <dl class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-obsidian-600/70 bg-obsidian-600/70 sm:grid-cols-3">
      <div v-for="c in cells" :key="c.label" class="bg-obsidian-950/80 px-3 py-2">
        <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">{{ c.label }}</dt>
        <dd class="text-[13px] text-parchment" :class="c.tone">{{ c.value }}</dd>
      </div>
    </dl>
    <p v-if="spell.material" class="mt-1.5 text-[11.5px] italic text-faint">Material: {{ spell.material }}</p>
  </div>
</template>
