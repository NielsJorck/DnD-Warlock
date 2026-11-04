<script setup lang="ts">
import type { CharacterEntry } from '~/data/characters'
const props = defineProps<{ character: CharacterEntry }>()
const rules = computed(() => props.character.rules!)

// The open-decision checklist, saved per character in this browser
const storageKey = `${props.character.slug}-todo-v1`
const done = ref<Record<string, boolean>>({})
onMounted(() => {
  try {
    done.value = JSON.parse(readSaved(storageKey) ?? '{}')
  } catch {
    // ignore corrupt storage
  }
  watch(done, v => localStorage.setItem(storageKey, JSON.stringify(v)), { deep: true })
})
</script>

<template>
  <section :id="character.slug" class="scroll-mt-24">
    <SectionHeading :eyebrow="character.tagline" :title="`${character.name}’s Rulings`">
      <NuxtLink :to="character.nav[0].to" class="text-xs text-dim hover:text-gold-light">Sheet →</NuxtLink>
    </SectionHeading>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
      <div class="min-w-0 space-y-6">
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

      <aside class="space-y-5">
        <div class="panel p-5">
          <p class="eyebrow">Next session</p>
          <h3 class="heading mb-1 text-lg">Open Decisions</h3>
          <p class="mb-3 text-[11px] text-faint">Tick them off as they’re settled. Saved in this browser.</p>
          <ul class="space-y-1">
            <li v-for="q in rules.decisions.immediate" :key="q">
              <label class="flex cursor-pointer gap-2.5 rounded-lg px-2 py-1.5 text-[13px] leading-relaxed transition hover:bg-obsidian-800">
                <input v-model="done[q]" type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-[#d6a84f]" />
                <span :class="done[q] ? 'text-faint line-through' : 'text-parchment/90'">{{ q }}</span>
              </label>
            </li>
          </ul>
          <p class="eyebrow mb-2 mt-4 text-dim">Items</p>
          <ul class="space-y-1.5">
            <li v-for="q in rules.decisions.items" :key="q" class="flex gap-2 text-[12.5px] leading-relaxed text-dim"><span class="text-gold/60">◇</span>{{ q }}</li>
          </ul>
        </div>

        <details class="panel group p-5">
          <summary class="flex items-center justify-between">
            <span>
              <span class="eyebrow block">Settled</span>
              <span class="heading text-lg">Closed Decisions</span>
            </span>
            <span class="text-faint transition group-open:rotate-180">▾</span>
          </summary>
          <ul class="mt-3 space-y-1.5">
            <li v-for="c in rules.decisions.closed" :key="c" class="flex gap-2 text-[12.5px] leading-relaxed text-dim"><span class="text-jade">✓</span>{{ c }}</li>
          </ul>
        </details>
      </aside>
    </div>
  </section>
</template>
