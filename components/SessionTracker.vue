<script setup lang="ts">
import { character, resources } from '~/data/character'
import { spells } from '~/data/spells'

const { state, hitDiceMax, damage, heal, setTemp, use, shortRest, longRest } = useTracker()
const { roll } = useDice()

const amount = ref<number | null>(null)
const hpPct = computed(() => Math.round((state.value.hp / character.maxHp) * 100))
const hpTone = computed(() => (hpPct.value > 50 ? 'from-jade/80 to-jade' : hpPct.value > 25 ? 'from-topaz/80 to-topaz' : 'from-ruby/80 to-ruby'))

const concentrationSpells = spells.filter(s => s.concentration && (s.status === 'known' || s.status === 'book'))

function apply(kind: 'damage' | 'heal' | 'temp') {
  const n = Number(amount.value)
  if (!n || n < 0) return
  if (kind === 'damage') {
    const concentrating = state.value.concentration
    damage(n)
    if (concentrating) {
      const dc = Math.max(10, Math.floor(n / 2))
      roll(`1d20+${saveBonus('con')}`, `Concentration save (DC ${dc})`)
    }
  } else if (kind === 'heal') heal(n)
  else setTemp(n)
  amount.value = null
}

function spendHitDie() {
  if (state.value.hitDiceUsed >= hitDiceMax) return
  state.value.hitDiceUsed++
  const r = roll(`1d8+${abilityMod('con')}`, 'Hit Die')
  heal(Math.max(0, r.total))
}

function rodRecover() {
  if (state.value.used.rod >= 1 || state.value.used.pact <= 0) return
  use('rod')
  use('pact', -1)
}

function castAgathys() {
  if (state.value.used.pact >= 2) return
  use('pact')
  setTemp(25)
}
</script>

<template>
  <div class="panel p-5">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <p class="eyebrow">At the table</p>
        <h2 class="heading text-lg">Session Tracker</h2>
      </div>
      <span class="text-[10.5px] text-faint">Saved in this browser</span>
    </div>

    <!-- HP -->
    <div class="panel-inset p-4">
      <div class="flex items-end justify-between">
        <div>
          <span class="eyebrow text-dim">Hit points</span>
          <div class="stat-num text-4xl leading-none">
            {{ state.hp }}<span class="text-lg text-faint"> / {{ character.maxHp }}</span>
          </div>
        </div>
        <div v-if="state.temp" class="text-right">
          <span class="eyebrow text-sapphire">Temp</span>
          <div class="stat-num text-2xl leading-none text-sapphire">+{{ state.temp }}</div>
        </div>
      </div>
      <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-obsidian-700">
        <div class="h-full rounded-full bg-gradient-to-r transition-all duration-500" :class="hpTone" :style="{ width: `${hpPct}%` }" />
      </div>
      <form class="mt-3 flex gap-1.5" @submit.prevent="apply('damage')">
        <input v-model.number="amount" type="number" min="0" inputmode="numeric" placeholder="Amount" class="field min-w-0 flex-1 py-1.5" aria-label="HP amount" />
        <button type="submit" class="btn border-ruby/40 text-ruby hover:border-ruby">Damage</button>
        <button type="button" class="btn border-jade/40 text-jade hover:border-jade" @click="apply('heal')">Heal</button>
        <button type="button" class="btn border-sapphire/40 text-sapphire hover:border-sapphire" @click="apply('temp')">Temp</button>
      </form>
      <p v-if="state.concentration" class="mt-2 text-[11px] text-faint">Taking damage rolls a concentration save automatically.</p>
    </div>

    <!-- Pact slots -->
    <div class="mt-4">
      <div class="mb-2 flex items-center justify-between">
        <span class="eyebrow text-dim">Pact slots · 5th level</span>
        <span class="text-[10.5px] text-faint">Short rest</span>
      </div>
      <div class="flex gap-2">
        <button
          v-for="i in 2"
          :key="i"
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 transition"
          :class="i <= 2 - state.used.pact ? 'border-gold/50 bg-gold/10 hover:bg-gold/15' : 'border-obsidian-600 bg-obsidian-950/60 hover:border-obsidian-500'"
          :aria-label="i <= 2 - state.used.pact ? 'Spend pact slot' : 'Restore pact slot'"
          @click="use('pact', i <= 2 - state.used.pact ? 1 : -1)"
        >
          <GemIcon :size="22" :dim="i > 2 - state.used.pact" />
          <span class="text-xs font-semibold" :class="i <= 2 - state.used.pact ? 'text-gold-light' : 'text-faint'">{{ i <= 2 - state.used.pact ? 'Ready' : 'Spent' }}</span>
        </button>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <button type="button" class="btn" :disabled="state.used.rod >= 1 || state.used.pact === 0" @click="rodRecover">Rod: regain slot</button>
        <button type="button" class="btn" :disabled="state.used.pact >= 2" @click="castAgathys">Cast Agathys (+25 temp)</button>
      </div>
    </div>

    <!-- Other resources -->
    <ul class="mt-4 space-y-2">
      <li v-for="r in resources.filter(r => r.id !== 'pact')" :key="r.id" class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-[13px] font-medium text-parchment">{{ r.name }}</div>
          <div class="truncate text-[11px] text-faint">{{ r.note }}</div>
        </div>
        <div class="flex shrink-0 gap-1">
          <button
            v-for="i in r.max"
            :key="i"
            type="button"
            class="h-5 w-5 rotate-45 rounded-[4px] border transition"
            :class="i <= r.max - (state.used[r.id] ?? 0) ? 'border-gold/70 bg-gold/40 hover:bg-gold/60' : 'border-obsidian-500 bg-obsidian-900'"
            :aria-label="`${r.name} use ${i}`"
            @click="use(r.id, i <= r.max - (state.used[r.id] ?? 0) ? 1 : -1)"
          />
        </div>
      </li>
      <li class="flex items-center justify-between gap-3">
        <div>
          <div class="text-[13px] font-medium text-parchment">Hit Dice (d8)</div>
          <div class="text-[11px] text-faint">{{ hitDiceMax - state.hitDiceUsed }} / {{ hitDiceMax }} left · +{{ abilityMod('con') }} CON each</div>
        </div>
        <button type="button" class="btn" :disabled="state.hitDiceUsed >= hitDiceMax" @click="spendHitDie">Spend 1</button>
      </li>
    </ul>

    <!-- Concentration -->
    <div class="mt-4">
      <label class="eyebrow mb-1.5 block text-dim" for="conc">Concentrating on</label>
      <select id="conc" v-model="state.concentration" class="field py-1.5">
        <option value="">— nothing —</option>
        <option v-for="s in concentrationSpells" :key="s.slug" :value="s.slug">{{ s.name }}</option>
      </select>
    </div>

    <label class="mt-3 flex cursor-pointer items-center gap-2 text-[13px] text-dim">
      <input v-model="state.inspiration" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" />
      Inspiration
    </label>

    <div class="mt-5 grid grid-cols-2 gap-2">
      <button type="button" class="btn py-2" @click="shortRest">☾ Short rest</button>
      <button type="button" class="btn btn-gold py-2" @click="longRest">✦ Long rest</button>
    </div>
    <p class="mt-2 text-[10.5px] leading-relaxed text-faint">
      A short rest restores pact slots. A long rest restores everything, including half your Hit Dice.
    </p>
  </div>
</template>
