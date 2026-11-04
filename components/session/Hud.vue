<script setup lang="ts">
import { character, lesserDao } from '~/data/characters/lucan/character'
import { spells } from '~/data/characters/lucan/spells'

const { state, pactMax, savantMax, inForm, stats, damage, heal, setTemp, use, endForm, endTurn } = useTracker()
const { roll, note, mode } = useDice()

const amount = ref<number | null>(null)
const hpPct = computed(() => Math.round((state.value.hp / character.maxHp) * 100))
const hpTone = computed(() => (hpPct.value > 50 ? 'from-jade/80 to-jade' : hpPct.value > 25 ? 'from-topaz/80 to-topaz' : 'from-ruby/80 to-ruby'))
const formPct = computed(() => Math.round((state.value.form / lesserDao.hp) * 100))
const pactLeft = computed(() => pactMax - (state.value.used.pact ?? 0))
const savantLeft = computed(() => savantMax - (state.value.used.savant ?? 0))
const concentrating = computed(() => spells.find(s => s.slug === state.value.concentration))

function apply(kind: 'damage' | 'heal' | 'temp') {
  const n = Number(amount.value)
  if (!n || n < 0) return
  if (kind === 'damage') {
    const spell = concentrating.value
    // Saved before the hit: if the form breaks, the save is still the form's
    const conSave = stats.value.abilities.con.save
    const { formBroke, carried } = damage(n)
    if (formBroke) note('The Lesser Dao form breaks', carried ? `${carried} damage carries over to Lucan` : 'No damage left over for Lucan')
    if (spell) {
      const dc = Math.max(10, Math.floor(n / 2))
      const save = roll(`1d20+${conSave}`, `Concentration save (DC ${dc})`)
      if (save.total < dc) {
        state.value.concentration = ''
        note(`Lost concentration on ${spell.name}`, `Rolled ${save.total} against DC ${dc}`)
      }
    }
  } else if (kind === 'heal') heal(n)
  else setTemp(n)
  amount.value = null
}

function nextTurn() {
  if (endTurn()) note('The Lesser Dao form ends', `${lesserDao.turns} turns are up`)
}

const toggleMode = (m: 'adv' | 'dis') => (mode.value = mode.value === m ? 'normal' : m)
</script>

<template>
  <div
    class="sticky top-0 z-30 -mx-[var(--gutter)] border-y bg-obsidian-950/90 px-[var(--gutter)] py-2.5 shadow-[0_14px_24px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors md:top-[var(--header-h)]"
    :class="inForm ? 'border-topaz/40' : 'border-gold/15'"
  >
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2.5">
      <!-- Hit points: in the form its own HP lead, Lucan's wait underneath -->
      <div class="min-w-0 flex-1 sm:w-64 sm:flex-none">
        <template v-if="inForm">
          <div class="flex flex-wrap items-baseline gap-x-2">
            <span class="eyebrow text-topaz">Form</span>
            <span class="stat-num text-2xl leading-none text-topaz">{{ state.form }}</span>
            <span class="text-sm text-faint">/ {{ lesserDao.hp }}</span>
          </div>
          <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-obsidian-700">
            <div class="h-full rounded-full bg-gradient-to-r from-topaz/80 to-topaz transition-all duration-500" :style="{ width: `${formPct}%` }" />
          </div>
          <div class="mt-1.5 flex items-center gap-2">
            <span class="whitespace-nowrap text-[11px] font-semibold tabular-nums text-dim">
              Lucan {{ state.hp }} / {{ character.maxHp }}<span v-if="state.temp" class="text-sapphire"> +{{ state.temp }}</span>
            </span>
            <div class="h-1 flex-1 overflow-hidden rounded-full bg-obsidian-700">
              <div class="h-full rounded-full bg-gradient-to-r transition-all duration-500" :class="hpTone" :style="{ width: `${hpPct}%` }" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-wrap items-baseline gap-x-2">
            <span class="eyebrow text-dim">HP</span>
            <span class="stat-num text-2xl leading-none" :class="state.hp === 0 ? 'text-ruby' : ''">{{ state.hp }}</span>
            <span class="text-sm text-faint">/ {{ character.maxHp }}</span>
            <span v-if="state.temp" class="text-sm font-semibold tabular-nums text-sapphire">+{{ state.temp }} temp</span>
          </div>
          <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-obsidian-700">
            <div class="h-full rounded-full bg-gradient-to-r transition-all duration-500" :class="hpTone" :style="{ width: `${hpPct}%` }" />
          </div>
        </template>
      </div>

      <!-- Numbers: the form swaps spell DC and attack for its own -->
      <dl class="flex items-center gap-4 text-center">
        <div>
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">AC</dt>
          <dd class="stat-num text-xl leading-tight">{{ inForm ? lesserDao.ac : character.ac.total }}</dd>
        </div>
        <div class="hidden sm:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Init</dt>
          <dd>
            <button type="button" class="stat-num rounded px-1 text-xl leading-tight transition hover:text-gold-light" title="Roll initiative" @click="roll(`1d20+${stats.initiative}`, 'Initiative')">{{ signed(stats.initiative) }}</button>
          </dd>
        </div>
        <div class="hidden md:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">DC</dt>
          <dd class="stat-num text-xl leading-tight">{{ inForm ? lesserDao.saveDc : derived.spellDc }}</dd>
        </div>
        <div class="hidden md:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">{{ inForm ? 'Attack' : 'Spell' }}</dt>
          <dd class="stat-num text-xl leading-tight">{{ signed(inForm ? lesserDao.attacks[0].toHit : derived.spellAttack) }}</dd>
        </div>
        <div class="hidden xl:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Speed</dt>
          <dd class="stat-num text-xl leading-tight">
            {{ character.speed }}<span v-if="inForm" class="text-sm text-topaz"> · burrow · fly</span><span v-else-if="state.flying" class="text-sm text-sapphire"> · fly 30</span>
          </dd>
        </div>
      </dl>

      <!-- Slots -->
      <div class="flex items-center gap-1">
        <button
          v-for="i in pactMax"
          :key="`p${i}`"
          type="button"
          class="grid h-9 w-8 place-items-center rounded-md transition hover:bg-obsidian-800"
          :title="i <= pactLeft ? 'Pact slot ready: click to spend' : 'Pact slot spent: click to restore'"
          :aria-label="i <= pactLeft ? 'Spend pact slot' : 'Restore pact slot'"
          @click="use('pact', i <= pactLeft ? 1 : -1)"
        >
          <GemIcon :size="22" :dim="i > pactLeft" />
        </button>
        <span class="mx-0.5 h-6 w-px bg-obsidian-600" aria-hidden="true" />
        <button
          v-for="i in savantMax"
          :key="`s${i}`"
          type="button"
          class="grid h-9 w-8 place-items-center rounded-md transition hover:bg-obsidian-800"
          :title="i <= savantLeft ? 'Spell Savant slot ready: click to spend' : 'Spell Savant slot spent: click to restore'"
          :aria-label="i <= savantLeft ? 'Spend Spell Savant slot' : 'Restore Spell Savant slot'"
          @click="use('savant', i <= savantLeft ? 1 : -1)"
        >
          <GemIcon :size="18" color="#a682dc" :dim="i > savantLeft" />
        </button>
      </div>

      <!-- Damage / heal and roll mode -->
      <div class="flex w-full items-center gap-2 lg:ml-auto lg:w-auto">
        <form class="flex min-w-0 flex-1 gap-1.5" @submit.prevent="apply('damage')">
          <input v-model.number="amount" type="number" min="0" inputmode="numeric" placeholder="HP ±" class="field min-w-0 flex-1 py-1.5 lg:w-24 lg:flex-none" aria-label="HP amount" />
          <button type="submit" class="btn border-ruby/40 px-2.5 text-ruby hover:border-ruby">Dmg</button>
          <button type="button" class="btn border-jade/40 px-2.5 text-jade hover:border-jade" @click="apply('heal')">Heal</button>
          <button type="button" class="btn border-sapphire/40 px-2.5 text-sapphire hover:border-sapphire" @click="apply('temp')">Temp</button>
        </form>
        <div class="flex shrink-0 overflow-hidden rounded-lg border border-obsidian-500 text-xs font-medium" role="group" aria-label="Roll d20s with">
          <button
            type="button"
            class="px-2.5 py-1.5 transition"
            :class="mode === 'adv' ? 'bg-jade/20 text-jade' : 'text-dim hover:text-parchment'"
            :aria-pressed="mode === 'adv'"
            title="Roll every d20 with advantage until switched off"
            @click="toggleMode('adv')"
          >Adv</button>
          <button
            type="button"
            class="border-l border-obsidian-500 px-2.5 py-1.5 transition"
            :class="mode === 'dis' ? 'bg-ruby/20 text-ruby' : 'text-dim hover:text-parchment'"
            :aria-pressed="mode === 'dis'"
            title="Roll every d20 with disadvantage until switched off"
            @click="toggleMode('dis')"
          >Dis</button>
        </div>
      </div>
    </div>

    <!-- What is going on right now -->
    <div class="scrollbar-none -mx-[var(--gutter)] mt-2 flex gap-1.5 overflow-x-auto px-[var(--gutter)] text-[11.5px]">
      <span v-if="inForm" class="chip shrink-0 border-topaz/50 bg-topaz/10 text-topaz">
        Lesser Dao · {{ state.formTurns }} turn{{ state.formTurns === 1 ? '' : 's' }} left
        <button type="button" class="ml-1 rounded border border-topaz/40 px-1.5 text-[10.5px] font-semibold hover:bg-topaz/20 hover:text-parchment" title="Count down one of the form's turns" @click="nextTurn">End turn</button>
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="End the Lesser Dao form" @click="endForm">✕</button>
      </span>
      <span v-if="inForm" class="chip shrink-0 text-faint">No spellcasting</span>
      <span v-if="concentrating" class="chip shrink-0 border-rose/40 text-rose">
        Concentrating: <NuxtLink :to="`/lucan/spells/${concentrating.slug}`" class="font-semibold hover:text-parchment">{{ concentrating.name }}</NuxtLink>
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Drop concentration" @click="state.concentration = ''">✕</button>
      </span>
      <span v-else class="chip shrink-0 text-faint">Not concentrating</span>
      <span v-if="mode !== 'normal'" class="chip shrink-0" :class="mode === 'adv' ? 'border-jade/40 text-jade' : 'border-ruby/40 text-ruby'">d20s with {{ mode === 'adv' ? 'advantage' : 'disadvantage' }}</span>
      <span v-if="state.hp === 0" class="chip shrink-0 border-ruby/50 text-ruby">Dying · ✓ {{ state.deathSaves.success }} · ✗ {{ state.deathSaves.fail }}</span>
      <span v-if="state.flying" class="chip shrink-0 border-sapphire/40 text-sapphire">
        Flying 30 ft
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Land" @click="state.flying = false">✕</button>
      </span>
      <span v-if="state.agathys && state.temp" class="chip shrink-0 border-sapphire/40 text-sapphire">Agathys: {{ state.agathys }} cold to melee attackers</span>
      <span v-if="state.inspiration" class="chip shrink-0 border-gold/50 text-gold-light">★ Inspiration</span>
      <span v-for="c in state.conditions" :key="c" class="chip shrink-0 border-ruby/40 text-ruby">
        {{ c }}
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" :aria-label="`Remove ${c}`" @click="state.conditions = state.conditions.filter(x => x !== c)">✕</button>
      </span>
      <span v-if="state.exhaustion" class="chip shrink-0 border-ruby/40 text-ruby">Exhaustion {{ state.exhaustion }}</span>
    </div>
  </div>
</template>
