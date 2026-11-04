<script setup lang="ts">
import type { HouseRule } from '~/data/campaign'
defineProps<{ rules: HouseRule[] }>()
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
    <div v-for="(h, n) in rules" :key="h.rule" class="rounded-xl border border-topaz/25 bg-gradient-to-br from-topaz/[0.07] to-transparent p-4">
      <div class="flex items-start gap-3">
        <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-topaz/40 font-display text-xs text-topaz">{{ n + 1 }}</span>
        <div>
          <h3 class="text-sm font-semibold text-parchment">{{ h.rule }}</h3>
          <p class="mt-1 text-[12.5px] leading-relaxed text-dim">{{ h.detail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
