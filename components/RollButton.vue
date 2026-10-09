<script setup lang="ts">
const props = defineProps<{ notation: string; label: string; compact?: boolean }>()
const { roll } = useDice()
</script>

<template>
  <button
    type="button"
    class="group inline-flex items-center gap-1.5 rounded-md border border-obsidian-500/80 bg-obsidian-800/70 font-medium tabular-nums text-parchment transition hover:border-gold/60 hover:text-gold-light active:scale-95"
    :class="compact ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'"
    :title="`Roll ${props.notation} — ${props.label}`"
    @click.stop="roll(props.notation, props.label)"
  >
    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 text-gold/70 transition group-hover:rotate-45 group-hover:text-gold" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path d="M12 2 21 7v10l-9 5-9-5V7z" /><path d="M12 2v20M3 7l18 10M21 7 3 17" opacity=".5" />
    </svg>
    <slot>{{ notation }}</slot>
  </button>
</template>
