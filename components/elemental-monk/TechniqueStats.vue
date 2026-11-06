<script setup lang="ts">
import { type Technique, kindTone } from '~/data/characters/elemental-monk/techniques'
import { levelLabel } from '~/data/characters/shared'

const props = defineProps<{ technique: Technique }>()
const cells = computed(() =>
  [
    { label: 'When', value: props.technique.timing },
    { label: 'Range', value: props.technique.range },
    { label: 'Cost', value: props.technique.cost },
    { label: 'Duration', value: props.technique.duration },
    { label: 'From', value: props.technique.source, tone: kindTone[props.technique.kind].text },
    { label: 'Arrives', value: `Level ${props.technique.level}` }
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
    <p v-if="technique.spell" class="mt-1.5 text-[11.5px] italic text-faint">
      {{ technique.spell.level ? `${levelLabel(technique.spell.level, true)} ${technique.spell.school.toLowerCase()} spell` : `${technique.spell.school} cantrip` }} · {{ technique.spell.components }} · Wisdom
    </p>
  </div>
</template>
