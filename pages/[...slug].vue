<script setup lang="ts">
// Legacy URLs are redirected by middleware/legacy-redirects.global.ts;
// anything that reaches this page doesn't exist.
throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
</script>

<template>
  <div />
</template>
