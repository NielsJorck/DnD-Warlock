<script setup lang="ts">
import { spells } from '~/data/spells'

const CAPACITY = 5
const { state, use } = useTracker()

// Lucan's own spells go in at 5th level from a pact or Spell Savant slot; an ally picks the level
const ownSpells = spells.filter(s => s.level > 0 && (s.status === 'known' || s.status === 'book'))
const from = ref<'pact' | 'savant' | 'ally'>('pact')
const name = ref('')
const allyLevel = ref(1)

const stored = computed(() => state.value.ring)
const levelsUsed = computed(() => stored.value.reduce((n, s) => n + s.level, 0))
const level = computed(() => (from.value === 'ally' ? allyLevel.value : 5))
const slotLeft = computed(() => from.value === 'ally' || state.value.used[from.value] < (from.value === 'pact' ? 2 : 1))
const canStore = computed(() => !!name.value.trim() && levelsUsed.value + level.value <= CAPACITY && slotLeft.value)

function store() {
  if (!canStore.value) return
  const spell = spells.find(s => s.name.toLowerCase() === name.value.trim().toLowerCase())
  if (from.value !== 'ally') use(from.value)
  state.value.ring.push({ name: spell?.name ?? name.value.trim(), slug: spell?.slug, level: level.value, by: from.value === 'ally' ? 'Ally' : 'Lucan' })
  name.value = ''
}

function cast(n: number) {
  const [s] = state.value.ring.splice(n, 1)
  if (s?.slug && spells.find(x => x.slug === s.slug)?.concentration) state.value.concentration = s.slug
}
</script>

<template>
  <div class="panel-inset mt-4 p-3.5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <NuxtLink to="/items/ring-of-spell-storing" class="text-[13px] font-medium text-parchment transition hover:text-gold-light">Ring of Spell Storing</NuxtLink>
        <div class="text-[11px] text-faint">Keeps its spells through rests. Cast with the original caster’s DC and attack</div>
      </div>
      <div class="flex shrink-0 gap-1" :aria-label="`${levelsUsed} of ${CAPACITY} spell levels stored`">
        <span
          v-for="i in CAPACITY"
          :key="i"
          class="h-3.5 w-3.5 rotate-45 rounded-[3px] border"
          :class="i <= levelsUsed ? 'border-sapphire/70 bg-sapphire/40' : 'border-obsidian-500 bg-obsidian-900'"
        />
      </div>
    </div>

    <ul v-if="stored.length" class="mt-2.5 space-y-1.5">
      <li v-for="(s, n) in stored" :key="`${s.name}-${n}`" class="flex items-center justify-between gap-2 text-[12.5px]">
        <span class="min-w-0 truncate">
          <NuxtLink v-if="s.slug" :to="`/spells/${s.slug}`" class="text-parchment hover:text-gold-light">{{ s.name }}</NuxtLink>
          <span v-else class="text-parchment">{{ s.name }}</span>
          <span class="text-faint"> · level {{ s.level }} · {{ s.by }}</span>
        </span>
        <span class="flex shrink-0 gap-1">
          <button type="button" class="btn py-0.5 text-[11.5px]" @click="cast(n)">Cast</button>
          <button type="button" class="btn py-0.5 text-[11.5px] text-faint" :aria-label="`Remove ${s.name} without casting`" @click="state.ring.splice(n, 1)">✕</button>
        </span>
      </li>
    </ul>
    <p v-else class="mt-2 text-[11.5px] text-faint">Empty.</p>

    <form class="mt-2.5 flex flex-wrap gap-1.5" @submit.prevent="store">
      <input v-model="name" list="ring-spells" placeholder="Spell" class="field min-w-0 flex-1 py-1 text-[12.5px]" aria-label="Spell to store" />
      <datalist id="ring-spells">
        <option v-for="s in ownSpells" :key="s.slug" :value="s.name" />
      </datalist>
      <select v-model="from" class="field w-auto py-1 text-[12.5px]" aria-label="Who casts it into the ring">
        <option value="pact">Lucan · pact slot</option>
        <option value="savant">Lucan · Savant slot</option>
        <option value="ally">Ally</option>
      </select>
      <select v-if="from === 'ally'" v-model.number="allyLevel" class="field w-auto py-1 text-[12.5px]" aria-label="Spell level">
        <option v-for="l in CAPACITY" :key="l" :value="l">Level {{ l }}</option>
      </select>
      <button type="submit" class="btn py-1 text-[12.5px]" :disabled="!canStore">Store</button>
    </form>
    <p v-if="name.trim() && !canStore" class="mt-1 text-[11px] text-topaz/90">
      {{ !slotLeft ? 'No slot of that kind left to cast it with.' : `Only ${CAPACITY - levelsUsed} level${CAPACITY - levelsUsed === 1 ? '' : 's'} free in the ring.` }}
    </p>
  </div>
</template>
