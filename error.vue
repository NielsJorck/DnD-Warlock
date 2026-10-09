<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useHead({ title: notFound.value ? 'Not found — Lucan Beryll' : 'Error — Lucan Beryll' })
</script>

<template>
  <NuxtLayout>
    <div class="mx-auto grid max-w-xl place-items-center py-24 text-center">
      <GemIcon color="#d65a50" :size="44" />
      <p class="eyebrow mt-6">{{ error.statusCode }}</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide"><span class="text-gilded">{{ notFound ? 'Nothing of value here' : 'Something cracked' }}</span></h1>
      <p class="mt-4 font-serif text-lg text-dim">
        {{ notFound ? 'This page isn’t in the codex. Perhaps it was stored in the Vessel and never taken out.' : error.statusMessage || error.message }}
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-2">
        <button type="button" class="btn btn-gold px-4 py-2 text-[13px]" @click="clearError({ redirect: '/' })">Back to the sheet</button>
        <button type="button" class="btn px-4 py-2 text-[13px]" @click="clearError({ redirect: '/spells' })">Spellbook</button>
      </div>
    </div>
  </NuxtLayout>
</template>
