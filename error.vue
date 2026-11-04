<script setup lang="ts">
import type { NuxtError } from '#app'
import { campaign } from '~/data/campaign'
import { characters } from '~/data/characters'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useHead({ title: `${notFound.value ? 'Not found' : 'Error'} — ${campaign.name}` })
</script>

<template>
  <NuxtLayout>
    <div class="mx-auto grid max-w-xl place-items-center py-24 text-center">
      <GemIcon color="#d65a50" :size="44" />
      <p class="eyebrow mt-6">{{ error.statusCode }}</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide"><span class="text-gilded">{{ notFound ? 'Nothing of value here' : 'Something cracked' }}</span></h1>
      <p class="mt-4 font-serif text-lg text-dim">
        {{ notFound ? 'This page isn’t in the codex.' : error.statusMessage || error.message }}
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-2">
        <button
          v-for="c in characters"
          :key="c.slug"
          type="button"
          class="btn btn-gold px-4 py-2 text-[13px]"
          @click="clearError({ redirect: c.nav[0].to })"
        >{{ c.name }}’s sheet</button>
        <button type="button" class="btn px-4 py-2 text-[13px]" @click="clearError({ redirect: '/' })">All characters</button>
      </div>
    </div>
  </NuxtLayout>
</template>
