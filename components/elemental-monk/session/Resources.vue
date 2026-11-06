<script setup lang="ts">
import { character, stats } from '~/data/characters/elemental-monk/character'

const { state, left, maxOf, use, focusLeft, metabolism, spendHitDie, shortRest, longRest } = useElementalMonkTracker()
const { note } = useDice()

const conMod = stats.abilities.con.check

function rest(kind: 'short' | 'long') {
  if (kind === 'short') shortRest()
  else longRest()
  note(kind === 'short' ? 'Short rest' : 'Long rest', kind === 'short' ? 'Every Focus Point back' : 'HP, every Hit Die, Focus and Uncanny Metabolism restored')
}
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="heading text-lg">Resources</h2>
      <span class="text-[10.5px] text-faint">Saved in this browser</span>
    </div>

    <!-- Focus Points -->
    <div class="flex items-center justify-between">
      <span class="eyebrow text-dim">Focus Points</span>
      <span class="text-[10.5px] text-faint">All back on a short rest · DC {{ stats.focusDc }}</span>
    </div>
    <div class="mt-2 flex gap-1.5">
      <button
        v-for="i in maxOf('focus')"
        :key="i"
        type="button"
        class="h-10 flex-1 rounded-lg border text-[12px] font-semibold transition"
        :class="i <= focusLeft ? 'border-jade/50 bg-jade/15 text-jade hover:bg-jade/25' : 'border-obsidian-600 bg-obsidian-950/60 text-faint hover:border-obsidian-500'"
        :aria-label="i <= focusLeft ? 'Spend a Focus Point' : 'Restore a Focus Point'"
        @click="use('focus', i <= focusLeft ? 1 : -1)"
      >{{ i <= focusLeft ? 'Focus' : 'Spent' }}</button>
    </div>
    <p class="mt-2 text-[11px] text-faint">The attunement, Flurry, Patient Defense, Step of the Wind and the redirect spend them for you.</p>

    <!-- Uncanny Metabolism -->
    <div class="mt-4 flex items-center justify-between gap-3 border-t border-obsidian-600 pt-4">
      <div class="min-w-0">
        <NuxtLink to="/elemental-monk/techniques/uncanny-metabolism" class="text-[13px] font-medium text-parchment hover:text-gold-light">Uncanny Metabolism</NuxtLink>
        <div class="text-[11px] text-faint">{{ left('metabolism') }} / {{ maxOf('metabolism') }} · on initiative: all Focus back, {{ stats.metabolism.replace('+', ' + ') }} HP</div>
      </div>
      <button type="button" class="btn shrink-0 border-jade/40 py-2 text-jade hover:border-jade" :disabled="left('metabolism') <= 0" @click="metabolism">Use</button>
    </div>

    <!-- Hit Dice -->
    <div class="mt-4 flex items-center justify-between gap-3 border-t border-obsidian-600 pt-4">
      <div>
        <div class="text-[13px] font-medium text-parchment">Hit Dice (d{{ character.hitDie }})</div>
        <div class="text-[11px] text-faint">{{ character.level - state.hitDiceUsed }} / {{ character.level }} left · {{ signed(conMod) }} CON each</div>
      </div>
      <button type="button" class="btn shrink-0 py-2" :disabled="state.hitDiceUsed >= character.level" @click="spendHitDie">Spend 1</button>
    </div>

    <label class="mt-4 flex cursor-pointer items-center gap-2 border-t border-obsidian-600 pt-4 text-[13px] text-dim">
      <input v-model="state.inspiration" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" />
      Heroic Inspiration <span class="text-[11px] text-faint">· reroll any one die, once</span>
    </label>

    <div class="mt-5 grid grid-cols-2 gap-2">
      <button type="button" class="btn py-2.5" @click="rest('short')">☾ Short rest</button>
      <button type="button" class="btn btn-gold py-2.5" @click="rest('long')">✦ Long rest</button>
    </div>
    <p class="mt-2 text-[10.5px] leading-relaxed text-faint">
      A short rest brings back every Focus Point; spend Hit Dice above. A long rest restores HP, every Hit Die, Focus and Uncanny Metabolism, takes off one level of Exhaustion and clears conditions. Either one outlasts the attunement’s 10 minutes.
    </p>
  </section>
</template>
