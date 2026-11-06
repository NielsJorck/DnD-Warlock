<script setup lang="ts">
import { elements, stats } from '~/data/characters/elemental-monk/character'

const { state, reach, strikeType, surpriseReady, focusLeft, attack, strikeHit, surpriseAttack, elementalMove, brawlerPush, bonusStrike, flurry, rollDamage } = useElementalMonkTracker()

// One damage roll doubles its dice, then the toggle switches off
const crit = ref(false)
function hit() {
  strikeHit(crit.value)
  crit.value = false
}
function surprise(type?: string) {
  surpriseAttack(crit.value, type)
  crit.value = false
}
function daggerHit() {
  rollDamage(`1${stats.martialDie}+${stats.strikeDamage}`, 'Dagger (piercing)', crit.value)
  crit.value = false
}

const elementTone: Record<string, string> = {
  acid: 'border-verdigris/60 bg-verdigris/15 text-verdigris',
  cold: 'border-quartz/60 bg-quartz/15 text-quartz',
  fire: 'border-ruby/60 bg-ruby/15 text-ruby',
  lightning: 'border-sapphire/60 bg-sapphire/15 text-sapphire',
  thunder: 'border-topaz/60 bg-topaz/15 text-topaz'
}
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden" :class="state.attuned ? 'border-jade/40' : ''">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <div>
        <p class="eyebrow" :class="state.attuned ? 'text-jade' : ''">Reach {{ reach.own }} ft on their turn · {{ reach.other }} ft otherwise</p>
        <h2 class="heading text-lg">Attacks</h2>
      </div>
      <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition" :class="crit ? 'border-gold/60 bg-gold/15 text-gold-light' : 'border-obsidian-600 text-dim'">
        <input v-model="crit" type="checkbox" class="h-3.5 w-3.5 accent-[#d6a84f]" />
        Critical hit
      </label>
    </div>

    <!-- Unarmed Strike -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/elemental-monk/techniques/martial-arts" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Unarmed Strike</NuxtLink>
        <span class="text-[11.5px] text-faint">Attack action · DEX · {{ stats.martialDie }}, 1s rerolled</span>
      </div>

      <!-- The element each strike deals while attuned -->
      <div v-if="state.attuned" class="mt-3 flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Element of the strike">
        <span class="mr-1 text-[11.5px] text-faint">Element</span>
        <button
          v-for="e in elements"
          :key="e"
          type="button"
          role="radio"
          :aria-checked="state.element === e"
          class="chip px-2.5 py-1 text-[11.5px] capitalize transition"
          :class="state.element === e ? elementTone[e] : 'hover:border-obsidian-500 hover:text-parchment'"
          @click="state.element = e"
        >{{ e }}</button>
      </div>

      <div class="mt-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn" @click="attack('Unarmed Strike — attack')">
          Attack <span class="tabular-nums text-faint">{{ signed(stats.strikeAttack) }}</span>
        </button>
        <button type="button" class="btn" @click="hit">Hit <span class="tabular-nums text-faint">{{ stats.strike }} {{ strikeType }}</span></button>
        <button type="button" class="btn border-verdigris/40 text-verdigris hover:border-verdigris" :disabled="!surpriseReady" :title="surpriseReady ? 'Only on a creature that hasn’t taken a turn yet' : 'Only in the first round, after rolling initiative'" @click="surprise()">
          Surprise <span class="tabular-nums text-faint">+{{ stats.surprise }}</span>
        </button>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <button type="button" class="btn border-jade/40 text-jade hover:border-jade" :disabled="!state.attuned" :title="state.attuned ? 'An elemental hit: the target makes a STR save or is moved up to 10 ft' : 'Only while attuned, on a hit that deals an element'" @click="elementalMove">
          Push or pull 10 ft <span class="text-faint">STR {{ stats.focusDc }}</span>
        </button>
        <button type="button" class="btn border-topaz/40 text-topaz hover:border-topaz" :disabled="state.pushUsed" :title="state.pushUsed ? 'Already used this turn' : 'Once per turn, on an Attack-action hit (not Flurry): 5 ft away, no save'" @click="brawlerPush">
          Brawler push 5 ft
        </button>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-1.5 border-t border-obsidian-600/60 pt-3">
        <span class="mr-1 text-[11.5px] text-faint">{{ state.bonusUsed ? 'Bonus action used' : 'Bonus action' }}</span>
        <button type="button" class="btn" :disabled="state.bonusUsed" title="One more Unarmed Strike, no Focus Point" @click="bonusStrike">
          Bonus strike <span class="tabular-nums text-faint">{{ signed(stats.strikeAttack) }}</span>
        </button>
        <button type="button" class="btn border-jade/40 text-jade hover:border-jade" :disabled="state.bonusUsed || focusLeft <= 0" title="1 Focus Point: two Unarmed Strikes. Roll Attack and Hit above for each" @click="flurry">
          Flurry of Blows <span class="text-faint">· 1 Focus</span>
        </button>
      </div>
      <p class="mt-2 text-[12px] leading-relaxed text-dim">
        {{ state.attuned ? `Each hit picks its element and can move the target 10 ft on a failed STR save.` : `Unattuned: bludgeoning, reach ${reach.own} ft with Long-Limbed. Attune under Techniques at the start of the turn.` }}
        Tavern Brawler’s push stacks with it, on the Attack action only. A Prone target is at disadvantage to hit from beyond 5 ft.
      </p>
    </div>

    <!-- Daggers -->
    <div class="p-5">
      <p class="eyebrow mb-2 text-dim">Steel</p>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span class="min-w-0 flex-1">
          <span class="text-[13px] font-medium text-parchment">Dagger</span>
          <span class="block text-[11px] text-faint">Monk weapon · thrown 20/60 ft, or melee at 10 ft on their turn · the Martial Arts die</span>
        </span>
        <button type="button" class="btn px-2 py-1 text-[11.5px]" @click="attack('Dagger — attack')">Attack {{ signed(stats.weaponAttack) }}</button>
        <button type="button" class="btn px-2 py-1 text-[11.5px]" @click="daggerHit">1{{ stats.martialDie }}+{{ stats.strikeDamage }}</button>
        <button type="button" class="btn px-2 py-1 text-[11.5px]" :disabled="!surpriseReady" @click="surprise('piercing')">+ Surprise</button>
      </div>
      <p class="mt-2 text-[12px] text-dim">For what is out of reach, mostly flyers. No element, no push: those need an Unarmed Strike.</p>
    </div>
  </section>
</template>
