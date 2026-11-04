<script setup lang="ts">
import { spells } from '~/data/characters/lucan/spells'

const CAPACITY = 5
const { state, use, inForm } = useTracker()
const { cast: castSpell } = useCasting()

// Lucan's own spells go in at 5th level from a pact or Spell Savant slot; an ally picks the level
const ownSpells = spells.filter(s => s.level > 0 && (s.status === 'known' || s.status === 'book'))
const from = ref<'pact' | 'savant' | 'ally'>('pact')
const name = ref('')
const allyLevel = ref(1)
const open = ref(false) // the store form stays folded until it is needed

const stored = computed(() => state.value.ring)
const levelsUsed = computed(() => stored.value.reduce((n, s) => n + s.level, 0))
const level = computed(() => (from.value === 'ally' ? allyLevel.value : 5))
const slotLeft = computed(() => from.value === 'ally' || state.value.used[from.value] < (from.value === 'pact' ? 2 : 1))
// In the Lesser Dao form Lucan can't cast into the ring or from it; an ally still can
const lucanBlocked = computed(() => inForm.value && from.value !== 'ally')
const canStore = computed(() => !!name.value.trim() && levelsUsed.value + level.value <= CAPACITY && slotLeft.value && !lucanBlocked.value)

function store() {
  if (!canStore.value) return
  const spell = spells.find(s => s.name.toLowerCase() === name.value.trim().toLowerCase())
  if (from.value !== 'ally') use(from.value)
  state.value.ring.push({ name: spell?.name ?? name.value.trim(), slug: spell?.slug, level: level.value, by: from.value === 'ally' ? 'Ally' : 'Lucan' })
  name.value = ''
  open.value = false
}

function cast(n: number) {
  if (inForm.value) return
  const [s] = state.value.ring.splice(n, 1)
  const spell = s?.slug ? spells.find(x => x.slug === s.slug) : undefined
  if (spell) castSpell(spell, 'ring', s.level)
}
</script>

<template>
  <div class="py-1.5">
    <div class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2.5" title="Keeps its spells through rests. Cast with the original caster’s DC and attack">
      <div class="min-w-0 leading-snug">
        <div class="truncate text-[13px]">
          <NuxtLink to="/lucan/items/ring-of-spell-storing" class="font-medium text-parchment hover:text-gold-light">Ring of Spell Storing</NuxtLink>
        </div>
        <div class="truncate text-[11px] text-faint">{{ stored.length ? `${levelsUsed} of ${CAPACITY} levels stored` : 'Empty' }} · keeps through rests</div>
      </div>
      <!-- On phones the line above already says how full it is -->
      <div class="hidden gap-1.5 sm:flex" :aria-label="`${levelsUsed} of ${CAPACITY} spell levels stored`">
        <span
          v-for="i in CAPACITY"
          :key="i"
          class="h-3 w-3 rotate-45 rounded-[2px] border"
          :class="i <= levelsUsed ? 'border-sapphire/70 bg-sapphire/40' : 'border-obsidian-500 bg-obsidian-900'"
        />
      </div>
      <button type="button" class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]" :aria-expanded="open" @click="open = !open">{{ open ? 'Close' : 'Store' }}</button>
    </div>

    <ul v-if="stored.length" class="mt-1 space-y-0.5 pl-3">
      <li v-for="(s, n) in stored" :key="`${s.name}-${n}`" class="flex items-center justify-between gap-2 text-[12.5px]">
        <span class="min-w-0 truncate">
          <NuxtLink v-if="s.slug" :to="`/lucan/spells/${s.slug}`" class="text-parchment hover:text-gold-light">{{ s.name }}</NuxtLink>
          <span v-else class="text-parchment">{{ s.name }}</span>
          <span class="text-faint"> · level {{ s.level }} · {{ s.by }}</span>
        </span>
        <span class="flex shrink-0 gap-1">
          <button type="button" class="btn px-2 py-0.5 text-[11px]" :disabled="inForm" :title="inForm ? 'No spellcasting in the Lesser Dao form' : undefined" @click="cast(n)">Cast</button>
          <button type="button" class="btn px-1.5 py-0.5 text-[11px] text-faint" :aria-label="`Remove ${s.name} without casting`" @click="state.ring.splice(n, 1)">✕</button>
        </span>
      </li>
    </ul>

    <form v-if="open" class="mt-1.5 flex flex-wrap gap-1.5" @submit.prevent="store">
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
    <p v-if="open && name.trim() && !canStore" class="mt-1 text-[11px] text-topaz/90">
      {{ lucanBlocked ? 'Lucan can’t cast in the Lesser Dao form. An ally can still store a spell.' : !slotLeft ? 'No slot of that kind left to cast it with.' : `Only ${CAPACITY - levelsUsed} level${CAPACITY - levelsUsed === 1 ? '' : 's'} free in the ring.` }}
    </p>
  </div>
</template>
