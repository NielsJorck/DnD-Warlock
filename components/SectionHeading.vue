<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; id?: string }>()
</script>

<template>
  <div :id="id" class="mb-5 flex scroll-mt-24 flex-wrap items-end justify-between gap-3">
    <div>
      <p v-if="eyebrow" class="eyebrow mb-1.5">{{ eyebrow }}</p>
      <h2 class="heading text-xl sm:text-2xl">{{ title }}</h2>
    </div>
    <div class="flex items-center gap-2"><slot /></div>
  </div>
</template>
