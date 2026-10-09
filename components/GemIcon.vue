<script setup lang="ts">
withDefaults(defineProps<{ color?: string; size?: number; dim?: boolean }>(), { color: '#d6a84f', size: 20, dim: false })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true" :style="{ opacity: dim ? 0.3 : 1 }">
    <path d="M12 2 21 9 12 22 3 9Z" :fill="color" />
    <path d="M3 9h18l-9 13Z" fill="#000" opacity=".28" />
    <path d="M8 9l4-7 4 7-4 13Z" fill="#fff" opacity=".22" />
    <path d="M12 2 21 9 12 22 3 9Z" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".6" />
  </svg>
</template>
