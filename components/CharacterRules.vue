<script setup lang="ts">
import type { CharacterEntry } from '~/data/characters'
const props = defineProps<{ character: CharacterEntry }>()
const rules = computed(() => props.character.rules!)
</script>

<template>
  <section :id="character.slug" class="scroll-mt-24">
    <SectionHeading :title="`${character.name}’s Rulings`">
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
    </div>
  </section>
</template>
