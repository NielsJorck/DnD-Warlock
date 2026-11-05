<script setup lang="ts">
import type { CharacterEntry } from '~/data/characters'
const props = defineProps<{ character: CharacterEntry }>()
const rules = computed(() => props.character.rules!)
</script>

<template>
  <section :id="character.slug" class="scroll-mt-24">
    <SectionHeading :eyebrow="character.tagline" :title="`${character.name}’s Rulings`">
      <NuxtLink :to="character.nav[0].to" class="text-xs text-dim hover:text-gold-light">Sheet →</NuxtLink>
    </SectionHeading>

    <div class="space-y-6">
      <div v-if="rules.houseRules.length">
        <h3 class="eyebrow mb-2 text-dim">House rules</h3>
        <HouseRules :rules="rules.houseRules" />
      </div>
      <div v-if="rules.rulings.length">
        <h3 class="eyebrow mb-2 text-dim">Rulings</h3>
        <RulingList :rulings="rules.rulings" />
      </div>
      <div v-if="rules.dmQuestions.length" class="rounded-xl border border-dashed border-topaz/40 p-4">
        <div class="mb-2 flex items-center justify-between gap-3">
          <p class="eyebrow text-topaz">Waiting on the DM</p>
          <NuxtLink :to="`${rules.dmPage}#questions`" class="text-[12px] text-topaz transition hover:text-parchment">Answer on the DM page →</NuxtLink>
        </div>
        <ul class="space-y-1.5">
          <li v-for="q in rules.dmQuestions" :key="q.id" class="flex gap-2 text-[13px] text-parchment/85"><span class="text-topaz">?</span>{{ q.question }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
