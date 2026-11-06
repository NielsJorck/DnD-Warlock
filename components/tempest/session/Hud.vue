<script setup lang="ts">
import { character, stats } from '~/data/characters/tempest/character'
import { levelLabel } from '~/data/characters/shared'

const { state, ac, speed, concentrating, slotsLeft, useSlot, hit, heal, setTemp, nextTurn, dropConcentration, toggleBoots } = useTempestTracker()
const { roll, mode } = useDice()

const amount = ref<number | null>(null)
const hpPct = computed(() => Math.round((state.value.hp / character.maxHp) * 100))
const hpTone = computed(() => (hpPct.value > 50 ? 'from-jade/80 to-jade' : hpPct.value > 25 ? 'from-topaz/80 to-topaz' : 'from-ruby/80 to-ruby'))
const slotLevels = character.slots.map((count, i) => ({ level: i + 1, count }))

function apply(kind: 'damage' | 'heal' | 'temp') {
  const n = Number(amount.value)
  if (!n || n < 0) return
  if (kind === 'damage') hit(n)
  else if (kind === 'heal') heal(n)
  else setTemp(n)
  amount.value = null
}

const toggleMode = (m: 'adv' | 'dis') => (mode.value = mode.value === m ? 'normal' : m)
</script>

<template>
  <div
    class="sticky top-0 z-30 -mx-[var(--gutter)] border-y bg-obsidian-950/90 px-[var(--gutter)] py-2.5 shadow-[0_14px_24px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors md:top-[var(--header-h)]"
    :class="state.avatar ? 'border-sapphire/50' : 'border-gold/15'"
  >
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2.5">
      <!-- Hit points -->
      <div class="min-w-0 flex-1 sm:w-64 sm:flex-none">
        <div class="flex flex-wrap items-baseline gap-x-2">
          <span class="eyebrow text-dim">HP</span>
          <span class="stat-num text-2xl leading-none" :class="state.hp === 0 ? 'text-ruby' : ''">{{ state.hp }}</span>
          <span class="text-sm text-faint">/ {{ character.maxHp }}</span>
          <span v-if="state.temp" class="text-sm font-semibold tabular-nums text-sapphire">+{{ state.temp }} temp</span>
        </div>
        <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-obsidian-700">
          <div class="h-full rounded-full bg-gradient-to-r transition-all duration-500" :class="hpTone" :style="{ width: `${hpPct}%` }" />
        </div>
      </div>

      <dl class="flex items-center gap-4 text-center">
        <div>
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">AC</dt>
          <dd class="stat-num text-xl leading-tight" :class="state.shieldUp ? 'text-sapphire' : ''">{{ ac }}</dd>
        </div>
        <div class="hidden sm:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Init</dt>
          <dd>
            <button type="button" class="stat-num rounded px-1 text-xl leading-tight transition hover:text-gold-light" title="Roll initiative, with the Sentinel Shield’s advantage" @click="roll(`1d20+${stats.initiative}`, 'Initiative · Sentinel Shield', { advantage: true })">{{ signed(stats.initiative) }}</button>
          </dd>
        </div>
        <div class="hidden md:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">DC</dt>
          <dd class="stat-num text-xl leading-tight">{{ stats.spellDc }}</dd>
        </div>
        <div class="hidden md:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Spell</dt>
          <dd class="stat-num text-xl leading-tight">{{ signed(stats.spellAttack) }}</dd>
        </div>
        <div class="hidden xl:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Speed</dt>
          <dd class="stat-num text-xl leading-tight" :class="state.boots ? 'text-sapphire' : ''">{{ speed }}</dd>
        </div>
      </dl>

      <!-- Spell slots by level: click a full one to spend it, an empty one to restore it -->
      <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <div v-for="g in slotLevels" :key="g.level" class="flex items-center gap-1" :title="`${levelLabel(g.level, true)} slots: ${slotsLeft(g.level)} of ${g.count} left`">
          <span class="text-[10px] font-semibold tabular-nums text-faint">{{ g.level }}</span>
          <button
            v-for="i in g.count"
            :key="i"
            type="button"
            class="h-3.5 w-3.5 rounded-full border transition"
            :class="i <= slotsLeft(g.level) ? 'border-sapphire/80 bg-sapphire/50 hover:bg-sapphire/70' : 'border-obsidian-500 bg-obsidian-900 hover:border-sapphire/50'"
            :aria-label="i <= slotsLeft(g.level) ? `Spend a ${levelLabel(g.level)}-level slot` : `Restore a ${levelLabel(g.level)}-level slot`"
            @click="useSlot(g.level, i <= slotsLeft(g.level) ? 1 : -1)"
          />
        </div>
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
      <button type="button" class="chip shrink-0 border-gold/40 text-gold-light transition hover:bg-gold/10" title="The start of his turn: Shield wears off and the Storm Avatar counts down" @click="nextTurn">Next turn ↻</button>
      <span v-if="concentrating" class="chip shrink-0 border-rose/40 text-rose">
        Concentrating: <NuxtLink :to="`/tempest/spells/${concentrating.slug}`" class="font-semibold hover:text-parchment">{{ concentrating.name }}</NuxtLink>
        <template v-if="state.concentrationLevel > concentrating.level"> · {{ levelLabel(state.concentrationLevel) }} level</template>
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Drop concentration" @click="dropConcentration">✕</button>
      </span>
      <span v-else class="chip shrink-0 text-faint">Not concentrating</span>
      <span v-if="state.weapon" class="chip shrink-0 border-gold/40 text-gold-light">
        Spiritual Weapon
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Dismiss the Spiritual Weapon" @click="state.weapon = 0">✕</button>
      </span>
      <span v-if="state.avatar" class="chip shrink-0 border-sapphire/60 bg-sapphire/10 text-sapphire">
        Storm Avatar · {{ state.avatar }} turn{{ state.avatar === 1 ? '' : 's' }} left
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="End the Storm Avatar" @click="state.avatar = 0">✕</button>
      </span>
      <span v-if="state.shieldUp" class="chip shrink-0 border-sapphire/50 text-sapphire">Shield +5 AC</span>
      <span v-if="state.wrathReady" class="chip shrink-0 border-topaz/60 bg-topaz/10 text-topaz">
        Destructive Wrath ready
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Stand down Destructive Wrath" @click="state.wrathReady = false">✕</button>
      </span>
      <span v-if="state.boots" class="chip shrink-0 border-sapphire/40 text-sapphire">
        Boots: speed {{ speed }}
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Click the boots off" @click="toggleBoots">✕</button>
      </span>
      <span v-if="mode !== 'normal'" class="chip shrink-0" :class="mode === 'adv' ? 'border-jade/40 text-jade' : 'border-ruby/40 text-ruby'">d20s with {{ mode === 'adv' ? 'advantage' : 'disadvantage' }}</span>
      <span v-if="state.hp === 0" class="chip shrink-0 border-ruby/50 text-ruby">Dying · ✓ {{ state.deathSaves.success }} · ✗ {{ state.deathSaves.fail }}</span>
      <span v-if="state.inspiration" class="chip shrink-0 border-gold/50 text-gold-light">★ Inspiration</span>
      <span v-for="c in state.conditions" :key="c" class="chip shrink-0 border-ruby/40 text-ruby">
        {{ c }}
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" :aria-label="`Remove ${c}`" @click="state.conditions = state.conditions.filter(x => x !== c)">✕</button>
      </span>
      <span v-if="state.exhaustion" class="chip shrink-0 border-ruby/40 text-ruby">Exhaustion {{ state.exhaustion }}</span>
    </div>
  </div>
</template>
