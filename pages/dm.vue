<script setup lang="ts">
import { character } from '~/data/character'
import { items, type Item } from '~/data/items'
import { dmQuestions } from '~/data/lore'
import { verdictLabels } from '~/composables/useDmReview'

useHead({ title: 'DM Review — Lucan Beryll' })

const { state, reset } = useDmReview()

const equipped = items.filter(i => i.group === 'attuned' || i.group === 'gear')
const vesselStores = items.filter(i => i.group === 'vessel')
const wishlist = items.filter(i => i.group === 'suggestion').sort((a, b) => Number(!!b.priority) - Number(!!a.priority))
const reviewable = [...equipped, ...wishlist, ...vesselStores]

const topics = [...new Set(dmQuestions.map(q => q.topic))]
const itemName = Object.fromEntries(items.map(i => [i.slug, i.name]))

const tally = computed(() => {
  const counts = { allow: 0, discuss: 0, deny: 0, open: 0 }
  for (const i of reviewable) counts[state.value.verdicts[i.slug] ?? 'open']++
  return counts
})
const answered = computed(() => dmQuestions.filter(q => state.value.answers[q.id]?.trim()).length)

const verdictMark = { allow: '✓', discuss: '?', deny: '✕' } as const

function itemLines(list: Item[]) {
  return list.map(i => {
    const v = state.value.verdicts[i.slug]
    const note = state.value.notes[i.slug]?.trim()
    return `${v ? verdictMark[v] : '·'} ${i.name}: ${v ? verdictLabels[v] : 'no verdict'}${note ? `. ${note}` : ''}`
  })
}

function summary() {
  return [
    'DM review for Lucan Beryll',
    '✓ allowed   ? let’s talk   ✕ not allowed   · no verdict',
    '',
    'EQUIPPED',
    ...itemLines(equipped),
    '',
    'WISHLIST',
    ...itemLines(wishlist),
    '',
    'VESSEL STORES',
    ...itemLines(vesselStores),
    '',
    'QUESTIONS',
    ...dmQuestions.flatMap((q, n) => [`${n + 1}. ${q.question}`, `   → ${state.value.answers[q.id]?.trim() || 'no answer yet'}`])
  ].join('\n')
}

const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(summary())
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function confirmReset() {
  if (confirm('Clear every verdict, note and answer on this page?')) reset()
}
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-6 -top-12 font-display text-[200px] leading-none text-topaz/[0.07]" aria-hidden="true">⚖</div>
      <p class="eyebrow">For the Dungeon Master · attunement {{ character.attunement.used }} / {{ character.attunement.max }}</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">DM Review</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">
        Everything Lucan has and everything he would like to have, in one place. Mark each item
        <span class="text-jade">✓ allowed</span>, <span class="text-topaz">? let’s talk</span> or <span class="text-ruby">✕ not allowed</span>, answer the open questions, then copy the result and send it back.
      </p>
      <div class="mt-5 flex flex-wrap items-center gap-2">
        <span class="chip border-jade/40 px-3 py-1 text-xs text-jade">✓ {{ tally.allow }}</span>
        <span class="chip border-topaz/40 px-3 py-1 text-xs text-topaz">? {{ tally.discuss }}</span>
        <span class="chip border-ruby/40 px-3 py-1 text-xs text-ruby">✕ {{ tally.deny }}</span>
        <span class="chip px-3 py-1 text-xs">{{ tally.open }} not reviewed</span>
        <span class="chip px-3 py-1 text-xs">{{ answered }} / {{ dmQuestions.length }} questions answered</span>
        <span class="flex-1" />
        <button type="button" class="btn" @click="confirmReset">Clear</button>
        <button type="button" class="btn btn-gold" @click="copy">{{ copied ? 'Copied ✓' : 'Copy for the player' }}</button>
      </div>
      <p class="mt-3 text-[11px] text-faint">Verdicts, notes and answers are saved in this browser only.</p>
    </header>

    <section class="mt-10">
      <SectionHeading id="equipped" eyebrow="What Lucan has now" title="Equipped Items">
        <a href="#wishlist" class="chip px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">Wishlist ↓</a>
        <a href="#questions" class="chip px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">Questions ↓</a>
      </SectionHeading>
      <DmItemTable :items="equipped" />

      <details class="group mt-4">
        <summary class="inline-flex items-center gap-1.5 text-[12.5px] text-dim transition hover:text-gold-light">
          <span class="transition group-open:rotate-90">▸</span> Vessel stores: {{ vesselStores.length }} household items kept inside the Genie Vessel
        </summary>
        <div class="mt-3">
          <DmItemTable :items="vesselStores" />
        </div>
      </details>
    </section>

    <section class="mt-12">
      <SectionHeading id="wishlist" eyebrow="Not owned yet" title="Wishlist" />
      <p class="-mt-2 mb-4 max-w-3xl text-[13px] text-dim">Items that would fit the build. <span class="text-gold">★</span> marks the ones Lucan wants most. Notes in amber are the catches already spotted.</p>
      <DmItemTable :items="wishlist" />
    </section>

    <section class="mt-12">
      <SectionHeading id="questions" eyebrow="Waiting on the DM" title="Open Questions" />
      <div class="space-y-8">
        <div v-for="t in topics" :key="t">
          <p class="eyebrow mb-3 text-topaz">{{ t }}</p>
          <div class="grid gap-3 md:grid-cols-2">
            <div v-for="q in dmQuestions.filter(q => q.topic === t)" :key="q.id" class="rounded-xl border border-topaz/25 bg-gradient-to-br from-topaz/[0.06] to-transparent p-4">
              <h3 class="text-sm font-semibold text-parchment">{{ q.question }}</h3>
              <p class="mt-1 text-[12.5px] leading-relaxed text-dim">{{ q.context }}</p>
              <div v-if="q.items?.length" class="mt-2 flex flex-wrap gap-1">
                <NuxtLink v-for="s in q.items" :key="s" :to="`/items/${s}`" class="chip py-0 text-[10px] transition hover:border-gold/50 hover:text-gold-light">{{ itemName[s] }}</NuxtLink>
              </div>
              <textarea v-model="state.answers[q.id]" rows="2" placeholder="DM’s answer…" class="field mt-3 resize-y text-[13px]" :aria-label="`Answer: ${q.question}`" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
