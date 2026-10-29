<script setup lang="ts">
import { spells } from '~/data/spells'

const { state, inForm, left, nextSlot, spendSlot, use } = useTracker()
const { cast } = useCasting()
const { note } = useDice()

// Imbued by casting a spell of 1 action, or 1 minute or longer: no bonus actions or reactions
const eligible = spells.filter(s => s.level > 0 && s.status === 'known' && !/bonus|reaction/i.test(s.castingTime))
const name = ref('')
const open = ref(false) // the imbue form stays folded until it is needed
const match = computed(() => eligible.find(s => s.name.toLowerCase() === name.value.trim().toLowerCase()))
const stored = computed(() => state.value.gem)
const problem = computed(() =>
  inForm.value ? 'Lucan can’t cast in the Lesser Dao form.' : stored.value ? 'The gem already holds a spell.' : left('gem') <= 0 ? 'Already imbued since the last long rest.' : !nextSlot.value ? 'No slot left to cast it with.' : !match.value ? 'Pick one of Lucan’s spells that takes an action or a minute or more.' : ''
)

function imbue() {
  if (problem.value || !match.value) return
  const slot = spendSlot()
  use('gem')
  state.value.gem = { name: match.value.name, slug: match.value.slug, level: 5, by: 'Lucan' }
  note('Spell Gem imbued', `${match.value.name} · ${slot === 'pact' ? 'pact slot' : 'Spell Savant slot'}`)
  name.value = ''
  open.value = false
}

function release() {
  const g = state.value.gem
  if (!g || inForm.value) return
  state.value.gem = null
  const spell = spells.find(s => s.slug === g.slug)
  if (spell) cast(spell, 'gem', g.level)
}
</script>

<template>
  <div class="py-1.5">
    <div class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2.5" title="Cast from the gem as an action: DC 17, attack +9, no components">
      <div class="min-w-0 leading-snug">
        <div class="truncate text-[13px]">
          <NuxtLink to="/items/spell-gem-blue-topaz" class="font-medium text-parchment hover:text-gold-light">Spell Gem</NuxtLink>
          <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">Action</span>
        </div>
        <div class="truncate text-[11px] text-faint">
          <template v-if="stored">Holds <NuxtLink v-if="stored.slug" :to="`/spells/${stored.slug}`" class="text-parchment hover:text-gold-light">{{ stored.name }}</NuxtLink><span v-else class="text-parchment">{{ stored.name }}</span> · DC 17 · +9</template>
          <template v-else>Empty · DC 17 · +9 · imbue once a day</template>
        </div>
      </div>
      <div class="flex gap-1.5" :aria-label="`${left('gem')} of 1 imbue left`">
        <button
          type="button"
          class="h-3 w-3 rotate-45 rounded-[2px] border transition"
          :class="left('gem') > 0 ? 'border-gold/70 bg-gold/40 hover:bg-gold/60' : 'border-obsidian-500 bg-obsidian-900 hover:border-gold/40'"
          :title="left('gem') > 0 ? 'Mark the imbue as used' : 'Mark the imbue as unused'"
          @click="use('gem', left('gem') > 0 ? 1 : -1)"
        />
      </div>
      <span v-if="stored" class="flex gap-1">
        <button type="button" class="btn min-w-[3.5rem] px-2 py-1 text-[11.5px]" :disabled="inForm" :title="inForm ? 'No spellcasting in the Lesser Dao form' : undefined" @click="release">Cast</button>
        <button type="button" class="btn px-1.5 py-1 text-[11.5px] text-faint" :aria-label="`Empty the gem without casting ${stored.name}`" @click="state.gem = null">✕</button>
      </span>
      <button v-else type="button" class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]" :aria-expanded="open" @click="open = !open">{{ open ? 'Close' : 'Imbue' }}</button>
    </div>

    <template v-if="open && !stored">
      <form class="mt-1.5 flex gap-1.5" @submit.prevent="imbue">
        <input v-model="name" list="gem-spells" placeholder="Spell to imbue" class="field min-w-0 flex-1 py-1 text-[12.5px]" aria-label="Spell to imbue" />
        <datalist id="gem-spells">
          <option v-for="s in eligible" :key="s.slug" :value="s.name" />
        </datalist>
        <button type="submit" class="btn py-1 text-[12.5px]" :disabled="!!problem">Imbue</button>
      </form>
      <p v-if="name.trim() && problem" class="mt-1 text-[11px] text-topaz/90">{{ problem }}</p>
    </template>
  </div>
</template>
