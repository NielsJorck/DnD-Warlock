<script setup lang="ts">
import { character } from '~/data/character'
import { spells } from '~/data/spells'

const { state, hitDiceMax, pactMax, savantMax, inForm, stats, heal, use, shortRest, longRest } = useTracker()
const { roll, note } = useDice()

const concentrationSpells = spells.filter(s => s.concentration && (s.status === 'known' || s.status === 'book'))
const pactLeft = computed(() => pactMax - (state.value.used.pact ?? 0))
const savantLeft = computed(() => savantMax - (state.value.used.savant ?? 0))

// Sanctuary Vessel: Hit Dice spent inside heal +PB each
const inVessel = ref(false)
function spendHitDie() {
  if (state.value.hitDiceUsed >= hitDiceMax) return
  state.value.hitDiceUsed++
  const bonus = abilityMod('con') + (inVessel.value ? character.proficiencyBonus : 0)
  const r = roll(`1d8+${bonus}`, inVessel.value ? 'Hit Die (Sanctuary Vessel)' : 'Hit Die')
  heal(Math.max(0, r.total))
}

function rest(kind: 'short' | 'long') {
  if (kind === 'short') shortRest()
  else longRest()
  note(kind === 'short' ? 'Short rest' : 'Long rest', kind === 'short' ? 'Pact slots restored' : 'HP, slots and daily uses restored')
}
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <p class="eyebrow">Spell slots &amp; rests</p>
        <h2 class="heading text-lg">Resources</h2>
      </div>
      <span class="text-[10.5px] text-faint">Saved in this browser</span>
    </div>

    <!-- Slots -->
    <div class="flex items-center justify-between">
      <span class="eyebrow text-dim">Pact slots · 5th level</span>
      <span class="text-[10.5px] text-faint">Short rest</span>
    </div>
    <div class="mt-2 flex gap-2">
      <button
        v-for="i in pactMax"
        :key="i"
        type="button"
        class="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 transition"
        :class="i <= pactLeft ? 'border-gold/50 bg-gold/10 hover:bg-gold/15' : 'border-obsidian-600 bg-obsidian-950/60 hover:border-obsidian-500'"
        :aria-label="i <= pactLeft ? 'Spend pact slot' : 'Restore pact slot'"
        @click="use('pact', i <= pactLeft ? 1 : -1)"
      >
        <GemIcon :size="22" :dim="i > pactLeft" />
        <span class="text-xs font-semibold" :class="i <= pactLeft ? 'text-gold-light' : 'text-faint'">{{ i <= pactLeft ? 'Ready' : 'Spent' }}</span>
      </button>
    </div>
    <div class="mt-3 flex items-center justify-between">
      <span class="eyebrow text-dim">Spell Savant · 5th level</span>
      <span class="text-[10.5px] text-faint">Long rest</span>
    </div>
    <button
      v-for="i in savantMax"
      :key="i"
      type="button"
      class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 transition"
      :class="i <= savantLeft ? 'border-amethyst/50 bg-amethyst/10 hover:bg-amethyst/15' : 'border-obsidian-600 bg-obsidian-950/60 hover:border-obsidian-500'"
      :aria-label="i <= savantLeft ? 'Spend Spell Savant slot' : 'Restore Spell Savant slot'"
      @click="use('savant', i <= savantLeft ? 1 : -1)"
    >
      <GemIcon :size="18" color="#a682dc" :dim="i > savantLeft" />
      <span class="text-xs font-semibold" :class="i <= savantLeft ? 'text-amethyst' : 'text-faint'">{{ i <= savantLeft ? 'Ready' : 'Spent' }}</span>
    </button>
    <p class="mt-2 text-[11px] text-faint">Casting from the Spells list spends a pact slot first, then the Savant slot.</p>

    <!-- Hit Dice -->
    <div class="mt-4 flex items-center justify-between gap-3 border-t border-obsidian-600 pt-4">
      <div>
        <div class="text-[13px] font-medium text-parchment">Hit Dice (d8)</div>
        <div class="text-[11px] text-faint">{{ hitDiceMax - state.hitDiceUsed }} / {{ hitDiceMax }} left · +{{ abilityMod('con') }} CON<template v-if="inVessel"> +{{ character.proficiencyBonus }} Vessel</template> each</div>
      </div>
      <button type="button" class="btn shrink-0 py-2" :disabled="state.hitDiceUsed >= hitDiceMax" @click="spendHitDie">Spend 1</button>
    </div>
    <label class="mt-2 flex cursor-pointer items-center gap-2 text-[12px] text-dim">
      <input v-model="inVessel" type="checkbox" class="h-4 w-4 accent-[#4fb39a]" />
      Resting in the Sanctuary Vessel <span class="text-faint">(+{{ character.proficiencyBonus }} HP per die)</span>
    </label>

    <!-- Concentration -->
    <div class="mt-4 border-t border-obsidian-600 pt-4">
      <label class="eyebrow mb-1.5 block text-dim" for="conc">Concentrating on</label>
      <select id="conc" v-model="state.concentration" class="field py-2">
        <option value="">— nothing —</option>
        <option v-for="s in concentrationSpells" :key="s.slug" :value="s.slug">{{ s.name }}</option>
      </select>
      <p class="mt-1.5 text-[11px] text-faint">Taking damage rolls the concentration save for you (CON {{ signed(stats.abilities.con.save) }}<template v-if="inForm">, the form’s</template>) and drops the spell if it fails.</p>
    </div>

    <label class="mt-3 flex cursor-pointer items-center gap-2 text-[13px] text-dim">
      <input v-model="state.inspiration" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" />
      Inspiration
    </label>

    <div class="mt-5 grid grid-cols-2 gap-2">
      <button type="button" class="btn py-2.5" @click="rest('short')">☾ Short rest</button>
      <button type="button" class="btn btn-gold py-2.5" @click="rest('long')">✦ Long rest</button>
    </div>
    <p class="mt-2 text-[10.5px] leading-relaxed text-faint">
      A short rest restores pact slots. A long rest restores HP, slots and daily uses, half your Hit Dice and one level of exhaustion, and clears conditions. Wand charges and potions don’t come back. Spells in the ring and the gem stay until cast.
    </p>
  </section>
</template>
