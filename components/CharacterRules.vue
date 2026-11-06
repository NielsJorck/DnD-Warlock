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
      <div v-if="rules.questions?.length">
        <h3 class="eyebrow mb-2 text-topaz">Asked, not answered yet</h3>
        <div class="grid gap-px overflow-hidden rounded-xl border border-dashed border-topaz/30 bg-obsidian-600/60 2xl:grid-cols-2">
          <div v-for="q in rules.questions" :key="q.question" class="flex gap-3 bg-obsidian-900 px-4 py-3.5">
            <span class="mt-0.5 text-topaz">?</span>
            <div>
              <h3 class="text-sm font-semibold text-parchment">{{ q.question }}</h3>
              <p class="mt-0.5 text-[12.5px] leading-relaxed text-dim">{{ q.detail }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
