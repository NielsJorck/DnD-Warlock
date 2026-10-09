<script setup lang="ts">
import type { Feature } from '~/data/character'
defineProps<{ features: Feature[] }>()
</script>

<template>
  <div class="divide-y divide-obsidian-600/70 overflow-hidden rounded-xl border border-obsidian-600/70">
    <details v-for="f in features" :key="f.name" class="group bg-obsidian-950/40 open:bg-obsidian-850/60">
      <summary class="flex items-start gap-3 px-4 py-3 transition hover:bg-obsidian-800/50">
        <span class="mt-1.5 h-2 w-2 shrink-0 rotate-45 border border-gold/70 transition group-open:bg-gold" />
        <span class="min-w-0 flex-1">
          <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span class="font-semibold text-parchment">{{ f.name }}</span>
            <span class="text-[11px] text-faint">{{ f.source }}<template v-if="f.level"> · Lv {{ f.level }}</template></span>
            <span v-if="f.homebrew" class="chip border-topaz/40 py-0 text-[10px] text-topaz">Homebrew</span>
            <span v-if="f.uses" class="chip py-0 text-[10px]">{{ f.uses }}</span>
          </span>
          <span class="mt-0.5 block text-[13px] leading-relaxed text-dim">{{ f.summary }}</span>
        </span>
        <svg v-if="f.detail" class="mt-1 h-4 w-4 shrink-0 text-faint transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </summary>
      <p v-if="f.detail" class="px-4 pb-4 pl-9 text-[13px] leading-relaxed text-parchment/80">{{ f.detail }}</p>
    </details>
  </div>
</template>
