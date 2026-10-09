<script setup lang="ts">
import type { Item } from '~/data/items'
import { roomBySlug } from '~/data/vessel'
import { verdictLabels, type Verdict } from '~/composables/useDmReview'

defineProps<{ items: Item[] }>()

const { state, setVerdict } = useDmReview()

const verdicts: { id: Verdict; icon: string; tone: string }[] = [
  { id: 'allow', icon: '✓', tone: 'border-jade/60 bg-jade/15 text-jade' },
  { id: 'discuss', icon: '?', tone: 'border-topaz/60 bg-topaz/15 text-topaz' },
  { id: 'deny', icon: '✕', tone: 'border-ruby/60 bg-ruby/15 text-ruby' }
]
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-obsidian-600/70 bg-obsidian-900/60">
    <table class="w-full min-w-[860px] text-left text-[12.5px]">
      <thead class="border-b border-obsidian-600 bg-obsidian-950/60 text-[10.5px] uppercase tracking-[0.14em] text-faint">
        <tr>
          <th class="px-4 py-2.5 font-semibold">Item</th>
          <th class="px-3 py-2.5 font-semibold">Source</th>
          <th class="px-3 py-2.5 font-semibold">Rarity</th>
          <th class="px-3 py-2.5 font-semibold">Attune</th>
          <th class="px-3 py-2.5 font-semibold">What it does</th>
          <th class="w-[210px] px-4 py-2.5 font-semibold">DM verdict</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-obsidian-600/60">
        <tr v-for="i in items" :key="i.slug" class="align-top transition hover:bg-obsidian-800/40">
          <td class="px-4 py-3">
            <NuxtLink :to="`/items/${i.slug}`" class="font-semibold text-parchment transition hover:text-gold-light">
              <span v-if="i.priority" class="text-gold" title="Priority pick">★ </span>{{ i.name }}
            </NuxtLink>
            <p class="text-[11.5px] text-faint">{{ i.room ? roomBySlug[i.room]?.name : i.type }}</p>
            <span v-if="i.status === 'Needs DM approval'" class="chip mt-1 border-topaz/40 py-0 text-[10px] text-topaz">{{ i.status }}</span>
          </td>
          <td class="px-3 py-3 text-dim">{{ i.source ?? '—' }}</td>
          <td class="whitespace-nowrap px-3 py-3" :class="i.rarity ? rarityTone[i.rarity].text : 'text-faint'">{{ i.rarity ?? '—' }}</td>
          <td class="px-3 py-3 text-dim">{{ i.attunement ? 'Yes' : '—' }}</td>
          <td class="max-w-[380px] px-3 py-3">
            <p class="text-parchment/90">{{ i.effect }}</p>
            <p v-if="i.caveat" class="mt-1 border-l-2 border-topaz/50 pl-2 text-[11.5px] leading-relaxed text-topaz/90">{{ i.caveat }}</p>
          </td>
          <td class="px-4 py-3">
            <div class="flex gap-1" role="group" :aria-label="`Verdict for ${i.name}`">
              <button
                v-for="v in verdicts"
                :key="v.id"
                type="button"
                class="grid h-7 flex-1 place-items-center rounded-md border text-[13px] transition"
                :class="state.verdicts[i.slug] === v.id ? v.tone : 'border-obsidian-500 text-faint hover:border-obsidian-400 hover:text-parchment'"
                :title="verdictLabels[v.id]"
                :aria-label="verdictLabels[v.id]"
                :aria-pressed="state.verdicts[i.slug] === v.id"
                @click="setVerdict(i.slug, v.id)"
              >{{ v.icon }}</button>
            </div>
            <input v-model="state.notes[i.slug]" type="text" placeholder="Note…" class="field mt-1.5 px-2 py-1 text-[12px]" :aria-label="`DM note for ${i.name}`" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
