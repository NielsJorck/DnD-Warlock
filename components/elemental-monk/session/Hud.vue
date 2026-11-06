<script setup lang="ts">
import { character, stats } from '~/data/characters/elemental-monk/character'

const { state, speed, reach, strikeType, surpriseReady, focusLeft, maxOf, damage, heal, setTemp, nextTurn, rollInitiative, endAttunement } = useElementalMonkTracker()
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
    :class="state.attuned ? 'border-jade/50' : 'border-gold/15'"
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
            <button type="button" class="stat-num rounded px-1 text-xl leading-tight transition hover:text-gold-light" title="Roll initiative: Surprise Attack is on until their second turn" @click="rollInitiative">{{ signed(stats.initiative) }}</button>
          </dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Reach</dt>
          <dd class="stat-num text-xl leading-tight" :class="state.attuned ? 'text-jade' : ''" :title="`On their own turn; ${reach.other} ft on anyone else’s`">{{ reach.own }}</dd>
        </div>
        <div class="hidden md:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Strike</dt>
          <dd class="stat-num text-xl leading-tight">{{ signed(stats.strikeAttack) }}</dd>
        </div>
        <div class="hidden xl:block">
          <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">Speed</dt>
          <dd class="stat-num text-xl leading-tight">{{ speed }}</dd>
        </div>
      </dl>

      <!-- Focus Points -->
      <div class="flex items-center gap-1.5" :title="`Focus Points: ${focusLeft} of ${maxOf('focus')} left`">
        <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">Focus</span>
        <span
          v-for="i in maxOf('focus')"
          :key="i"
          class="h-3.5 w-3.5 rounded-full border transition"
          :class="i <= focusLeft ? 'border-jade/80 bg-jade/50' : 'border-obsidian-500 bg-obsidian-900'"
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
      <button type="button" class="chip shrink-0 border-gold/40 text-gold-light transition hover:bg-gold/10" title="The start of their turn: the bonus action, reaction and Tavern Brawler’s push are back, and the Dodge ends" @click="nextTurn">Next turn ↻</button>
      <button type="button" class="chip shrink-0 transition" :class="state.bonusUsed ? 'text-faint line-through' : 'border-sapphire/40 text-sapphire'" title="Bonus action: click to mark it used or free" @click="state.bonusUsed = !state.bonusUsed">Bonus action</button>
      <button type="button" class="chip shrink-0 transition" :class="state.reactionUsed ? 'text-faint line-through' : 'border-sapphire/40 text-sapphire'" title="Reaction: click to mark it used or free" @click="state.reactionUsed = !state.reactionUsed">Reaction</button>
      <button type="button" class="chip shrink-0 transition" :class="state.pushUsed ? 'text-faint line-through' : 'border-topaz/40 text-topaz'" title="Tavern Brawler’s 5-ft push: once per turn, on an Attack-action hit. Click to mark it used or ready" @click="state.pushUsed = !state.pushUsed">Brawler push</button>
      <span v-if="state.attuned" class="chip shrink-0 border-jade/60 bg-jade/10 text-jade" :title="`Reach ${reach.own} ft on their turn, ${reach.other} ft otherwise. 10 minutes, or until Incapacitated`">
        Attuned · {{ strikeType }} · {{ reach.own }} ft
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="End the attunement" @click="endAttunement('Ten minutes are up')">✕</button>
      </span>
      <span v-if="surpriseReady" class="chip shrink-0 border-verdigris/50 text-verdigris" title="Surprise Attack: +2d6 on a hit against a creature that hasn’t taken a turn yet">
        Surprise Attack +{{ stats.surprise }}
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Surprise Attack is over" @click="state.surprise = false">✕</button>
      </span>
      <span v-if="state.dodging" class="chip shrink-0 border-sapphire/50 bg-sapphire/10 text-sapphire">
        Dodging
        <button type="button" class="ml-0.5 text-faint hover:text-parchment" aria-label="Stop dodging" @click="state.dodging = false">✕</button>
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
