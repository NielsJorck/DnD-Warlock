<script setup lang="ts">
import { stats } from '~/data/characters/soulknife/character'

const { state, advantageFrom, attack, bladeHit, sneakAttack, rollDamage, steadyAim } = useSoulknifeTracker()

// One damage roll doubles its dice, then the toggle switches off
const crit = ref(false)
function hit(second: boolean) {
  bladeHit(second, crit.value)
  crit.value = false
}
function sneak(type = 'psychic') {
  sneakAttack(crit.value, type)
  crit.value = false
}
// A steel hit; the shortsword's Vex gives advantage on the next attack, like a blade's
function weaponDamage(w: (typeof weapons)[number]) {
  if (w.vex) state.value.vex = 2
  rollDamage(w.dice, `${w.name} (${w.type})`, crit.value)
  crit.value = false
}

// Steel, for whatever shrugs off psychic damage (constructs, mostly)
const mod = stats.bladeDamage
const weapons = [
  { name: 'Dagger', meta: 'Melee or thrown 20/60 ft · Light · Nick', dice: `1d4+${mod}`, type: 'piercing', vex: false },
  { name: 'Second dagger', meta: 'Nick: in the same Attack action, after a Light weapon · no DEX to damage', dice: '1d4', type: 'piercing', vex: false },
  { name: 'Shortsword', meta: 'Melee · Light · Vex: a hit gives advantage on the next attack', dice: `1d6+${mod}`, type: 'piercing', vex: true }
]
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden" :class="state.hidden ? 'border-amethyst/40' : ''">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <div>
        <p v-if="advantageFrom.length" class="eyebrow text-jade">Advantage: {{ advantageFrom.join(', ') }}</p>
        <h2 class="heading text-lg">Attacks</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-lg border px-2.5 py-1.5 text-[12px] transition"
          :class="state.steadyAim ? 'border-jade/60 bg-jade/10 text-jade' : state.bonusUsed ? 'cursor-not-allowed border-obsidian-600 text-faint opacity-60' : 'border-obsidian-600 text-dim hover:text-parchment'"
          :disabled="state.steadyAim || state.bonusUsed"
          title="Bonus action, only if he hasn’t moved this turn: advantage on the next attack, speed 0"
          @click="steadyAim"
        >Steady Aim</button>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition" :class="state.hidden ? 'border-amethyst/60 bg-amethyst/10 text-amethyst' : 'border-obsidian-600 text-dim'" title="Hidden with the Hide action: Invisible, so the next attack has advantage. Attacking ends it">
          <input v-model="state.hidden" type="checkbox" class="h-3.5 w-3.5 accent-[#a682dc]" />
          Hidden
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition" :class="crit ? 'border-gold/60 bg-gold/15 text-gold-light' : 'border-obsidian-600 text-dim'">
          <input v-model="crit" type="checkbox" class="h-3.5 w-3.5 accent-[#d6a84f]" />
          Critical hit
        </label>
      </div>
    </div>

    <!-- The blades -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/soulknife/powers/psychic-blades" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Psychic Blade</NuxtLink>
        <span class="text-[11.5px] text-faint">Attack action · melee or thrown 60 ft · Finesse · Vex</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn" @click="attack(stats.bladeAttack, 'Psychic Blade — attack')">
          Attack <span class="tabular-nums text-faint">{{ signed(stats.bladeAttack) }}<template v-if="advantageFrom.length"> · adv</template></span>
        </button>
        <button type="button" class="btn" @click="hit(false)">Hit <span class="tabular-nums text-faint">{{ stats.blade }} psychic</span></button>
        <button type="button" class="btn border-gold/40 text-gold-light hover:border-gold" :disabled="state.sneakUsed" :title="state.sneakUsed ? 'Already dealt this turn' : 'Once per turn: advantage, or an ally next to the target'" @click="sneak()">
          Sneak Attack <span class="tabular-nums text-faint">{{ stats.sneak }}</span>
        </button>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-1.5 border-t border-obsidian-600/60 pt-3">
        <span class="mr-1 text-[11.5px] text-faint">Second blade · bonus action</span>
        <button type="button" class="btn" :disabled="state.bonusUsed" :title="state.bonusUsed ? 'The bonus action is used' : 'After a blade attack this turn, with the other hand free'" @click="attack(stats.bladeAttack, 'Second blade — attack', { bonusAction: true })">
          Attack <span class="tabular-nums text-faint">{{ signed(stats.bladeAttack) }}<template v-if="advantageFrom.length"> · adv</template></span>
        </button>
        <button type="button" class="btn" @click="hit(true)">Hit <span class="tabular-nums text-faint">{{ stats.secondBlade }} psychic</span></button>
      </div>
      <p class="mt-2 text-[12px] text-dim">
        A hit sets Vex: advantage on the next attack against that creature, so a second blade after a hit without Sneak Attack gets it. An attack uses up Steady Aim, Vex and hiding.
      </p>
    </div>

    <!-- Other weapons -->
    <div class="p-5">
      <p class="eyebrow mb-2 text-dim">Steel</p>
      <ul class="divide-y divide-obsidian-600/60">
        <li v-for="w in weapons" :key="w.name" class="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2">
          <span class="min-w-0 flex-1">
            <span class="text-[13px] font-medium text-parchment">{{ w.name }}</span>
            <span class="block text-[11px] text-faint">{{ w.meta }}</span>
          </span>
          <button type="button" class="btn px-2 py-1 text-[11.5px]" @click="attack(stats.weaponAttack, `${w.name} — attack`)">Attack {{ signed(stats.weaponAttack) }}</button>
          <button type="button" class="btn px-2 py-1 text-[11.5px]" @click="weaponDamage(w)">{{ w.dice }}</button>
          <button type="button" class="btn px-2 py-1 text-[11.5px]" :disabled="state.sneakUsed" @click="sneak(w.type)">+ Sneak</button>
        </li>
      </ul>
      <p class="mt-2 text-[12px] text-dim">
        The blades are almost always better. Steel is for what’s immune to psychic damage, constructs above all: animated armor, flying swords, golems. Two thrown daggers fit in one Attack action and leave the bonus action free; the shortsword’s Vex sets up Sneak Attack up close.
      </p>
    </div>
  </section>
</template>
