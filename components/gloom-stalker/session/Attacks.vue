<script setup lang="ts">
import { character, stats } from '~/data/characters/gloom-stalker/character'
import { spellBySlug } from '~/data/characters/gloom-stalker/spells'

const { state, left, marked, d20, d20Penalty, rollDamage, shoot, recoverArrows, dreadfulStrike, cast, canCast, freeLeft } = useGloomStalkerTracker()
const { note } = useDice()

// One damage roll doubles its dice, then the toggle switches off
const crit = ref(false)
function dmg(notation: string, label: string) {
  rollDamage(notation, label, { crit: crit.value })
  crit.value = false
}
function dreadful() {
  dreadfulStrike(crit.value)
  crit.value = false
}

const bowHit = computed(() => stats.bowAttack - d20Penalty.value)
const bowDmg = `1d8+${stats.bowDamage}`
const bladeHit = computed(() => stats.bladeAttack - d20Penalty.value)
const bladeDmg = `1d6+${stats.bladeDamage}`

const mark = spellBySlug['hunters-mark']
function castMark() {
  if (!canCast(mark)) return
  cast(mark)
}
function moveMark() {
  state.value.markTarget = ''
  note('Hunter’s Mark moves', 'Bonus action: the old quarry dropped, mark a new creature within 90 ft')
}

// What one hit adds up to on average at level 3, with the bracers
const perHit = [
  { what: 'Arrow', dice: `1d8 + ${stats.bowDamage}`, avg: 4.5 + stats.bowDamage },
  { what: '+ Hunter’s Mark', dice: '1d6 force', avg: 4.5 + stats.bowDamage + 3.5 },
  { what: '+ Dreadful Strike', dice: '2d6 psychic', avg: 4.5 + stats.bowDamage + 3.5 + 7 },
  { what: 'Critical, all three', dice: 'dice doubled', avg: 9 + stats.bowDamage + 7 + 14 }
]
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden" :class="state.dark ? 'border-sapphire/40' : ''">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <div>
        <p v-if="state.dark" class="eyebrow text-sapphire">Unseen in the dark</p>
        <h2 class="heading text-lg">Attacks</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <label
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition"
          :class="state.dark ? 'border-sapphire/60 bg-sapphire/10 text-sapphire' : 'border-obsidian-600 text-dim'"
          title="Entirely in darkness: the bow rolls with advantage against creatures that rely on darkvision"
        >
          <input v-model="state.dark" type="checkbox" class="h-3.5 w-3.5 accent-[#6595dc]" />
          In darkness
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition" :class="crit ? 'border-gold/60 bg-gold/15 text-gold-light' : 'border-obsidian-600 text-dim'">
          <input v-model="crit" type="checkbox" class="h-3.5 w-3.5 accent-[#d6a84f]" />
          Critical hit
        </label>
      </div>
    </div>

    <!-- The longbow -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/gloom-stalker/items/bracers-of-archery" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Longbow</NuxtLink>
        <span class="text-[11.5px] text-faint">Attack action · 150/600 ft · Slow · {{ left('arrows') }} arrows</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn" :class="state.dark ? 'border-sapphire/50 text-sapphire' : ''" :disabled="left('arrows') <= 0" :title="state.dark ? 'With advantage: unseen in the dark' : 'Spends an arrow'" @click="shoot('Longbow — attack')">
          Attack <span class="tabular-nums text-faint">{{ signed(bowHit) }}</span><span v-if="state.dark" class="text-[10px]">adv</span>
        </button>
        <button type="button" class="btn" @click="dmg(bowDmg, 'Longbow (piercing) · Bracers +2')">
          Hit <span class="tabular-nums text-faint">{{ bowDmg }} piercing</span>
        </button>
        <button type="button" class="btn" :class="marked ? 'border-gold/50 text-gold-light' : ''" :title="marked ? 'The quarry is marked' : 'Only against the marked quarry'" @click="dmg('1d6', 'Hunter’s Mark (force)')">
          Mark <span class="tabular-nums text-faint">1d6 force</span>
        </button>
        <button
          type="button"
          class="btn border-amethyst/40 text-amethyst hover:border-amethyst"
          :disabled="left('dreadful') <= 0 || state.dreadfulThisTurn"
          :title="state.dreadfulThisTurn ? 'Once per turn: used this turn' : `Once per turn, on a weapon hit · ${left('dreadful')} left today`"
          @click="dreadful"
        >
          Dreadful Strike <span class="tabular-nums text-faint">2d6 psychic · {{ left('dreadful') }}</span>
        </button>
      </div>
      <p class="mt-2 text-[12px] text-dim">
        Slow: a hit that deals damage takes 10 ft off the target’s speed until the start of your next turn. Dreadful Strike is chosen after the hit lands.
        <template v-if="state.firstTurn"> <span class="text-topaz">First turn: speed {{ character.speed + 10 }}, the ambush.</span></template>
      </p>
      <div class="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
        <span class="text-faint">{{ state.shot }} shot since the last search</span>
        <button type="button" class="btn px-2 py-1 text-[11.5px]" :disabled="!state.shot" title="After the fight: a minute’s search finds half the arrows shot, rounded down" @click="recoverArrows">Recover half</button>
      </div>
    </div>

    <!-- Hunter's Mark -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/gloom-stalker/spells/hunters-mark" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Hunter’s Mark</NuxtLink>
        <span class="text-[11.5px] text-faint">Bonus action · 90 ft · concentration · {{ freeLeft(mark) }} free left</span>
      </div>
      <template v-if="marked">
        <div class="mt-3 flex flex-wrap items-center gap-1.5">
          <input v-model="state.markTarget" type="text" placeholder="Marked quarry" class="field w-48 py-1.5 text-[13px]" aria-label="Marked quarry" />
          <button type="button" class="btn" title="When the quarry drops to 0 HP: a bonus action moves the mark" @click="moveMark">Move the mark</button>
        </div>
        <p class="mt-2 text-[12px] text-dim">1d6 force on every hit against the quarry, and advantage on Perception and Survival checks to find it.</p>
      </template>
      <template v-else>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <button type="button" class="btn btn-gold" :disabled="!canCast(mark)" @click="castMark">Mark a quarry <span class="text-faint">{{ freeLeft(mark) ? 'free' : '1st slot' }}</span></button>
        </div>
        <p class="mt-2 text-[12px] text-faint">Not up. The first free cast of the day goes here, then slots.</p>
      </template>
    </div>

    <!-- The blades -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <span class="font-display text-[15px] font-semibold tracking-wide text-parchment">Scimitar &amp; Shortsword</span>
        <span class="text-[11.5px] text-faint">Attack action · Nick: both blades in one action</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn" @click="d20(stats.bladeAttack, 'Shortsword — attack')">Shortsword <span class="tabular-nums text-faint">{{ signed(bladeHit) }}</span></button>
        <button type="button" class="btn" @click="dmg(bladeDmg, 'Shortsword (piercing)')">Hit <span class="tabular-nums text-faint">{{ bladeDmg }}</span></button>
        <button type="button" class="btn" @click="d20(stats.bladeAttack, 'Scimitar — extra attack (Nick)')">Scimitar <span class="tabular-nums text-faint">{{ signed(bladeHit) }}</span></button>
        <button type="button" class="btn" @click="dmg('1d6', 'Scimitar (slashing) · no modifier on the extra attack')">Hit <span class="tabular-nums text-faint">1d6</span></button>
      </div>
      <p class="mt-2 text-[12px] text-dim">When something reaches him. The light weapon’s extra attack adds no DEX to damage; Nick makes it part of the Attack action, so the bonus action stays free. Hunter’s Mark and Dreadful Strike work on blades too.</p>
    </div>

    <details class="group">
      <summary class="flex items-center justify-between gap-3 px-5 py-3 text-[12.5px] text-dim transition hover:text-parchment">
        What one arrow deals
        <span class="text-faint transition group-open:rotate-90" aria-hidden="true">▸</span>
      </summary>
      <table class="mx-5 mb-4 w-[calc(100%-2.5rem)] text-[12.5px]">
        <tbody class="divide-y divide-obsidian-600/60">
          <tr v-for="w in perHit" :key="w.what">
            <td class="py-1 pr-2 text-parchment">{{ w.what }}</td>
            <td class="px-2 py-1 text-faint">{{ w.dice }}</td>
            <td class="py-1 pl-2 text-right font-semibold tabular-nums text-gold-light">{{ w.avg }}</td>
          </tr>
        </tbody>
      </table>
      <p class="-mt-2 px-5 pb-4 text-[11.5px] text-faint">Averages at level 3. From level 5 the second arrow adds another 14 with the mark up; Dreadful Strike still only once a turn.</p>
    </details>
  </section>
</template>
