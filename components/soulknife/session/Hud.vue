<script setup lang="ts">
import { character, stats } from '~/data/characters/soulknife/character'

const { state, speed, psiLeft, maxOf, damage, heal, setTemp, nextTurn, rollInitiative } = useSoulknifeTracker()
const { mode } = useDice()

const amount = ref<number | null>(null)
const hpPct = computed(() => Math.round((state.value.hp / character.maxHp) * 100))
const hpTone = computed(() => (hpPct.value > 50 ? 'from-jade/80 to-jade' : hpPct.value > 25 ? 'from-topaz/80 to-topaz' : 'from-ruby/80 to-ruby'))

function apply(kind: 'damage' | 'heal' | 'temp') {
  const n = Number(amount.value)
  if (!n || n < 0) return
  if (kind === 'damage') damage(n)
  else if (kind === 'heal') heal(n)
  else setTemp(n)
  amount.value = null
}

const toggleMode = (m: 'adv' | 'dis') => (mode.value = mode.value === m ? 'normal' : m)
</script>

<template>
  <div
    class="sticky top-0 z-30 -mx-[var(--gutter)] border-y bg-obsidian-950/90 px-[var(--gutter)] py-2.5 shadow-[0_14px_24px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors md:top-[var(--header-h)]"
    :class="state.hidden ? 'border-amethyst/50' : 'border-gold/15'"
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
          <dd class="stat-num text-xl leading-tight">{{ character.ac.total }}</dd>
        </div>
        <div class="hidden sm:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Init</dt>
          <dd>
            <button type="button" class="stat-num rounded px-1 text-xl leading-tight transition hover:text-gold-light" :title="state.hidden ? 'Roll initiative with advantage: hidden, so Invisible' : 'Roll initiative (Alert adds the proficiency bonus)'" @click="rollInitiative">{{ signed(stats.initiative) }}</button>
          </dd>
        </div>
        <div class="hidden md:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Blade</dt>
          <dd class="stat-num text-xl leading-tight">{{ signed(stats.bladeAttack) }}</dd>
        </div>
        <div class="hidden xl:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Speed</dt>
          <dd class="stat-num text-xl leading-tight" :class="state.steadyAim ? 'text-ruby' : state.longstrider ? 'text-jade' : ''">{{ speed }}</dd>
        </div>
      </dl>

      <!-- Psionic Energy Dice -->
      <div class="flex items-center gap-1.5" :title="`Psionic Energy Dice: ${psiLeft} of ${maxOf('psi')} ${stats.psiDie}s left`">
        <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">Psi</span>
        <span
          v-for="i in maxOf('psi')"
          :key="i"
          class="h-3.5 w-3.5 rotate-45 rounded-[3px] border transition"
          :class="i <= psiLeft ? 'border-amethyst/80 bg-amethyst/50' : 'border-obsidian-500 bg-obsidian-900'"
        />
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

    <!-- This turn, and what is going on right now -->
    <div class="scrollbar-none -mx-[var(--gutter)] mt-2 flex gap-1.5 overflow-x-auto px-[var(--gutter)] text-[11.5px]">
      <button type="button" class="chip shrink-0 border-gold/40 text-gold-light transition hover:bg-gold/10" title="The start of his turn: Sneak Attack, the bonus action and the reaction are back, Steady Aim is gone and Vex counts down" @click="nextTurn">Next turn ↻</button>
      <button
        type="button"
        class="chip shrink-0 transition"
        :class="state.sneakUsed ? 'text-faint line-through' : 'border-gold/50 text-gold-light'"
        title="Sneak Attack: once per turn. Click to mark it used or ready (a reaction attack on an enemy’s turn can deal it again)"
        @click="state.sneakUsed = !state.sneakUsed"
      >Sneak Attack {{ stats.sneak }}</button>
      <button type="button" class="chip shrink-0 transition" :class="state.bonusUsed ? 'text-faint line-through' : 'border-sapphire/40 text-sapphire'" title="Bonus action: click to mark it used or free" @click="state.bonusUsed = !state.bonusUsed">Bonus action</button>
      <button type="button" class="chip shrink-0 transition" :class="state.reactionUsed ? 'text-faint line-through' : 'border-sapphire/40 text-sapphire'" title="Reaction: click to mark it used or free" @click="state.reactionUsed = !state.reactionUsed">Reaction</button>
      <span v-if="state.steadyAim" class="chip shrink-0 border-jade/50 bg-jade/10 text-jade">
        Steady Aim · speed 0
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Drop Steady Aim" @click="state.steadyAim = false">✕</button>
      </span>
      <span v-if="state.vex" class="chip shrink-0 border-jade/50 text-jade" title="Advantage on the next attack against the creature the blade hit">
        Vex{{ state.vex === 1 ? ' · ends this turn' : '' }}
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Drop Vex" @click="state.vex = 0">✕</button>
      </span>
      <span v-if="state.hidden" class="chip shrink-0 border-amethyst/60 bg-amethyst/10 text-amethyst">
        Hidden · Invisible
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="No longer hidden" @click="state.hidden = false">✕</button>
      </span>
      <span v-if="state.hood" class="chip shrink-0 border-jade/40 text-jade">Hood up · Stealth adv</span>
      <span v-if="state.telepathy" class="chip shrink-0 border-amethyst/50 text-amethyst">
        Telepathy · {{ state.telepathy }} h
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="End the telepathic link" @click="state.telepathy = 0">✕</button>
      </span>
      <span v-if="state.longstrider" class="chip shrink-0 border-jade/40 text-jade">
        Longstrider +10 ft
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Longstrider ends" @click="state.longstrider = false">✕</button>
      </span>
      <span v-if="mode !== 'normal'" class="chip shrink-0" :class="mode === 'adv' ? 'border-jade/40 text-jade' : 'border-ruby/40 text-ruby'">d20s with {{ mode === 'adv' ? 'advantage' : 'disadvantage' }}</span>
      <span v-if="state.hp === 0" class="chip shrink-0 border-ruby/50 text-ruby">Dying · ✓ {{ state.deathSaves.success }} · ✗ {{ state.deathSaves.fail }}</span>
      <span v-if="state.inspiration" class="chip shrink-0 border-gold/50 text-gold-light">★ Heroic Inspiration</span>
      <span v-for="c in state.conditions" :key="c" class="chip shrink-0 border-ruby/40 text-ruby">
        {{ c }}
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" :aria-label="`Remove ${c}`" @click="state.conditions = state.conditions.filter(x => x !== c)">✕</button>
      </span>
      <span v-if="state.exhaustion" class="chip shrink-0 border-ruby/40 text-ruby">Exhaustion {{ state.exhaustion }} · −{{ state.exhaustion * 2 }} d20</span>
    </div>
  </div>
</template>
