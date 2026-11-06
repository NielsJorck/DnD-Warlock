<script setup lang="ts">
import { character, resources, stats } from '~/data/characters/soulknife/character'

const { state, left, maxOf, use, psiLeft, spendHitDie, shortRest, longRest } = useSoulknifeTracker()
const { note } = useDice()

const conMod = stats.abilities.con.check

// The uses that come back on a rest; the consumables are under Items & Features
const pools = resources.filter(r => r.recharge !== 'none' && r.id !== 'psi')

function rest(kind: 'short' | 'long') {
  if (kind === 'short') shortRest()
  else longRest()
  note(kind === 'short' ? 'Short rest' : 'Long rest', kind === 'short' ? 'One Psionic Energy Die back' : 'HP, every Hit Die, every psi die and daily use restored')
}
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="heading text-lg">Resources</h2>
      <span class="text-[10.5px] text-faint">Saved in this browser</span>
    </div>

    <!-- Psionic Energy Dice -->
    <div class="flex items-center justify-between">
      <span class="eyebrow text-dim">Psionic Energy Dice</span>
      <span class="text-[10.5px] text-faint">1 per short rest · all per long rest</span>
    </div>
    <div class="mt-2 flex gap-1.5">
      <button
        v-for="i in maxOf('psi')"
        :key="i"
        type="button"
        class="h-10 flex-1 rounded-lg border text-[12px] font-semibold transition"
        :class="i <= psiLeft ? 'border-amethyst/50 bg-amethyst/15 text-amethyst hover:bg-amethyst/25' : 'border-obsidian-600 bg-obsidian-950/60 text-faint hover:border-obsidian-500'"
        :aria-label="i <= psiLeft ? 'Spend a psi die' : 'Restore a psi die'"
        @click="use('psi', i <= psiLeft ? 1 : -1)"
      >{{ i <= psiLeft ? stats.psiDie : 'Spent' }}</button>
    </div>
    <p class="mt-2 text-[11px] text-faint">Knack and Psychic Whispers under Powers roll the die and spend it for you.</p>

    <!-- Daily uses -->
    <ul class="mt-4 space-y-2 border-t border-obsidian-600 pt-4">
      <li v-for="p in pools" :key="p.id" class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-[13px] font-medium text-parchment">{{ p.name }}</div>
          <div class="text-[11px] text-faint">{{ left(p.id) }} / {{ maxOf(p.id) }} left · {{ p.note }}</div>
        </div>
        <div class="flex gap-1.5">
          <button
            v-for="i in maxOf(p.id)"
            :key="i"
            type="button"
            class="h-3.5 w-3.5 rotate-45 rounded-[2px] border transition"
            :class="i <= left(p.id) ? 'border-gold/70 bg-gold/40 hover:bg-gold/60' : 'border-obsidian-500 bg-obsidian-900 hover:border-gold/40'"
            :title="i <= left(p.id) ? 'Mark as used' : 'Mark as unused'"
            @click="use(p.id, i <= left(p.id) ? 1 : -1)"
          />
        </div>
      </li>
    </ul>

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
      A short rest brings back one Psionic Energy Die; spend Hit Dice above. A long rest (4 hours of Trance for an elf) restores HP, every Hit Die, every psi die, Longstrider and the free Psychic Whispers, takes off one level of Exhaustion and clears conditions.
    </p>
  </section>
</template>
