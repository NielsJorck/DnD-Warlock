<script setup lang="ts">
import type { Ruling } from '~/data/campaign'
defineProps<{ rulings: Ruling[] }>()
</script>

<template>
  <div class="grid gap-px overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-600/60 2xl:grid-cols-2">
    <div v-for="r in rulings" :key="r.ruling" class="flex gap-3 bg-obsidian-900 px-4 py-3.5">
      <span class="mt-0.5 text-gold">⚖</span>
      <div>
        <h3 class="text-sm font-semibold text-parchment">{{ r.ruling }}</h3>
        <p class="mt-0.5 text-[12.5px] leading-relaxed text-dim">{{ r.detail }}</p>
      </div>
    </div>
  </div>
</template>
