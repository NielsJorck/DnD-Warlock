<script setup lang="ts">
const { log, dismiss } = useDice()
const timers = new Map<number, ReturnType<typeof setTimeout>>()

watch(
  () => log.value.map(r => r.id),
  ids => {
    for (const id of ids) {
      if (!timers.has(id)) timers.set(id, setTimeout(() => { dismiss(id); timers.delete(id) }, 6000))
    }
  }
)
</script>

<template>
  <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(340px,calc(100vw-2rem))] flex-col-reverse gap-2" aria-live="polite">
    <TransitionGroup name="toast">
      <button
        v-for="r in log.slice(0, 4)"
        :key="r.id"
        type="button"
        class="panel pointer-events-auto flex items-center gap-3 px-4 py-3 text-left shadow-glow"
        :class="r.crit === 'hit' ? 'border-gold' : r.crit === 'miss' ? 'border-ruby/60' : ''"
        @click="dismiss(r.id)"
      >
        <span v-if="r.note !== undefined" class="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/30 bg-obsidian-950">
          <GemIcon :size="22" />
        </span>
        <span
          v-else
          class="stat-num grid h-12 w-12 shrink-0 place-items-center rounded-xl border text-2xl"
          :class="r.crit === 'hit' ? 'border-gold bg-gold/20 text-gold-light' : r.crit === 'miss' ? 'border-ruby/60 bg-ruby/10 text-ruby' : 'border-gold/30 bg-obsidian-950'"
        >{{ r.total }}</span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-semibold text-parchment">{{ r.label }}</span>
          <span v-if="r.note !== undefined" class="block text-[11.5px] text-dim">{{ r.note }}</span>
          <span v-else class="block text-[11px] tabular-nums text-faint">
            {{ r.notation }}<template v-if="r.rolls.length"> · [{{ r.rolls.join(', ') }}<template v-if="r.dropped !== undefined">, <s class="opacity-60">{{ r.dropped }}</s></template>]<template v-if="r.modifier"> {{ signed(r.modifier) }}</template></template>
          </span>
          <span v-if="r.crit === 'hit'" class="block text-[11px] font-semibold uppercase tracking-wider text-gold">Natural 20</span>
          <span v-else-if="r.crit === 'miss'" class="block text-[11px] font-semibold uppercase tracking-wider text-ruby">Natural 1</span>
        </span>
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active { animation: toast-in 220ms ease-out; }
.toast-leave-active { transition: opacity 200ms, transform 200ms; }
.toast-leave-to { opacity: 0; transform: translateX(16px); }
@keyframes toast-in {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: none; }
}
</style>
