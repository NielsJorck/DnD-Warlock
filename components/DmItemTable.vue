<script setup lang="ts">
import { type Item, variantOf, bySlot } from '~/data/items'
import { roomBySlug } from '~/data/vessel'
import { verdictLabels, type Verdict } from '~/composables/useDmReview'

const props = defineProps<{ items: Item[]; grouped?: boolean }>()

// One table body per slot when grouped, otherwise a single unlabeled body
const groups = computed(() => (props.grouped ? bySlot(props.items) : [{ slot: 'all', label: '', rule: '', max: undefined, items: props.items }]))
const allowedIn = (list: Item[]) => list.filter(i => state.value.verdicts[i.slug] !== 'deny').length

const { state, setVerdict } = useDmReview()

const rarityOf = (i: Item) => variantOf(i, state.value.variants[i.slug])?.rarity ?? i.rarity

// Picking the requested version again clears the override
function setVariant(i: Item, id: string) {
  if (id === i.defaultVariant) delete state.value.variants[i.slug]
  else state.value.variants[i.slug] = id
}

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
      <tbody v-for="g in groups" :key="g.slot" class="divide-y divide-obsidian-600/60 border-t border-obsidian-600">
        <tr v-if="g.label" class="bg-obsidian-950/40">
          <td colspan="6" class="px-4 py-2">
            <span class="font-display text-[13px] font-semibold tracking-wide text-parchment">{{ g.label }}</span>
            <span class="ml-2 text-[11.5px] text-faint">{{ g.rule }}</span>
            <span v-if="g.max && allowedIn(g.items) > g.max" class="chip ml-2 border-topaz/40 py-0 text-[10px] text-topaz">
              {{ allowedIn(g.items) }} not denied, {{ g.max }} can be worn
            </span>
          </td>
        </tr>
        <tr v-for="i in g.items" :key="i.slug" class="align-top transition hover:bg-obsidian-800/40">
          <td class="px-4 py-3">
            <NuxtLink :to="`/items/${i.slug}`" class="font-semibold text-parchment transition hover:text-gold-light">{{ i.name }}</NuxtLink>
            <p class="text-[11.5px] text-faint">{{ i.room ? roomBySlug[i.room]?.name : i.type }}</p>
            <span v-if="i.onSheet" class="chip mt-1 border-gold/40 py-0 text-[10px] text-gold-light" title="Its numbers are already on the character sheet">On the sheet</span>
            <span v-if="i.group === 'vessel'" class="chip mt-1 border-jade/40 py-0 text-[10px] text-jade" title="Part of the Genie Vessel, assumed accepted">Accepted</span>
            <select
              v-if="i.variants"
              :value="variantOf(i, state.variants[i.slug])?.id"
              class="field mt-1.5 block w-auto px-2 py-1 text-[12px]"
              :aria-label="`Version of ${i.name}`"
              @change="setVariant(i, ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="v in i.variants" :key="v.id" :value="v.id">{{ v.label }} · {{ v.rarity }}{{ v.id === i.defaultVariant ? ' (requested)' : '' }}</option>
            </select>
          </td>
          <td class="px-3 py-3 text-dim">{{ i.source ?? '—' }}</td>
          <td class="whitespace-nowrap px-3 py-3" :class="rarityOf(i) ? rarityTone[rarityOf(i)!].text : 'text-faint'">{{ rarityOf(i) ?? '—' }}</td>
          <td class="px-3 py-3 text-dim">{{ i.attunement ? 'Yes' : '—' }}</td>
          <td class="max-w-[380px] px-3 py-3">
            <p class="text-parchment/90">{{ variantOf(i, state.variants[i.slug])?.effect ?? i.effect }}</p>
            <p v-if="i.caveat" class="mt-1 border-l-2 border-topaz/50 pl-2 text-[11.5px] leading-relaxed text-topaz/90">{{ i.caveat }}</p>
          </td>
          <td class="px-4 py-3">
            <p v-if="i.group === 'gear'" class="text-[12px] text-jade" title="A class feature, not a request">✓ Already accepted</p>
            <div v-else class="flex gap-1" role="group" :aria-label="`Verdict for ${i.name}`">
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
            <input v-if="i.group !== 'gear'" v-model="state.notes[i.slug]" type="text" placeholder="Note…" class="field mt-1.5 px-2 py-1 text-[12px]" :aria-label="`DM note for ${i.name}`" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
