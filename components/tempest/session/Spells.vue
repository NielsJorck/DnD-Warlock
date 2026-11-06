<script setup lang="ts">
import { character, stats } from '~/data/characters/tempest/character'
import { spells, ready, type Spell } from '~/data/characters/tempest/spells'
import { levelLabel } from '~/data/characters/shared'

const { state, left, slotsLeft, lowestSlot, cast, rollDamage } = useTempestTracker()

const today = computed(() => spells.filter(ready))
// Booming Blade and Shocking Grasp have their own cards under Attacks
const cantrips = computed(() => today.value.filter(s => s.level === 0 && s.access !== 'Magic Initiate'))

const timing = (s: Spell) =>
  /reaction/i.test(s.castingTime) ? 'reaction' : /bonus/i.test(s.castingTime) ? 'bonus' : /action/i.test(s.castingTime) ? 'action' : 'long'
const groups = computed(() =>
  [
    { id: 'reaction', title: 'Reaction' },
    { id: 'bonus', title: 'Bonus action' },
    { id: 'action', title: 'Action' },
    { id: 'long', title: 'Longer casting time' }
  ]
    .map(g => ({ ...g, spells: today.value.filter(s => s.level > 0 && timing(s) === g.id).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)) }))
    .filter(g => g.spells.length)
)

// Each spell is cast at the slot level picked on its row, or the lowest one left
const picked = reactive<Record<string, number>>({})
const fromShield = (s: Spell) => s.access === 'Magic Initiate'
const levelOf = (s: Spell) => {
  const p = picked[s.slug]
  return p && slotsLeft(p) > 0 ? p : lowestSlot(s.level) ?? s.level
}
const levelsFor = (s: Spell) => Array.from({ length: character.slots.length - s.level + 1 }, (_, i) => s.level + i)
const diceAt = (s: Spell, level: number) => s.dice?.[level] ?? s.dice?.[s.level]
const canCast = (s: Spell) => (fromShield(s) ? left('shield') > 0 : slotsLeft(levelOf(s)) > 0)
const saveOf = (s: Spell) => s.save?.split(' ')[0]

function rollFor(s: Spell, level: number) {
  const dice = diceAt(s, level)
  // "5d10 thunder + 5d10 radiant" → "thunder + radiant": the dice rolled can be an upcast's
  const kinds = s.damage?.replace(/\d+d\d+(\s*[+-]\s*\d+)?\s*/g, '').trim()
  if (dice) rollDamage(dice, `${s.name}${level > s.level && s.level ? ` (${levelLabel(level)} level)` : ''}${kinds ? ` · ${kinds}` : ''}`, { storm: !!s.storm })
}
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden">
    <div class="flex flex-wrap items-end justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <h2 class="heading text-lg">Spells</h2>
      <div class="flex flex-wrap gap-1.5 text-[11.5px]">
        <span class="chip">DC {{ stats.spellDc }}</span>
        <span class="chip">Attack {{ signed(stats.spellAttack) }}</span>
        <span class="chip border-sapphire/40 text-sapphire">Slots {{ character.slots.map((_, i) => slotsLeft(i + 1)).join('·') }}</span>
      </div>
    </div>

    <p v-if="!today.length" class="p-5 text-[13px] text-faint">The spell list is still being written.</p>

    <!-- Cantrips -->
    <div v-if="cantrips.length" class="border-b border-obsidian-600/70 px-5 py-4">
      <p class="eyebrow mb-2 text-dim">Cantrips · at will</p>
      <ul class="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <li v-for="s in cantrips" :key="s.slug" class="flex min-w-0 items-center gap-2">
          <span class="min-w-0 flex-1">
            <NuxtLink :to="`/tempest/spells/${s.slug}`" class="text-[13px] font-medium text-parchment hover:text-gold-light">{{ s.name }}</NuxtLink>
            <span v-if="s.concentration" class="ml-1.5 text-[10px] font-semibold text-rose" title="Concentration">C</span>
            <span v-if="saveOf(s)" class="ml-1.5 text-[10.5px] text-faint">{{ saveOf(s) }}</span>
          </span>
          <button v-if="diceAt(s, 0)" type="button" class="btn px-1.5 py-0.5 text-[11px] tabular-nums" @click="rollFor(s, 0)">{{ diceAt(s, 0) }}</button>
          <button v-if="s.concentration" type="button" class="btn px-2 py-0.5 text-[11px]" :disabled="state.concentration === s.slug" @click="cast(s)">Cast</button>
        </li>
      </ul>
    </div>

    <!-- Leveled spells by casting time -->
    <div v-for="g in groups" :key="g.id" class="border-b border-obsidian-600/70 last:border-0">
      <p class="eyebrow bg-obsidian-950/40 px-5 py-2 text-dim">{{ g.title }}</p>
      <ul class="divide-y divide-obsidian-600/50">
        <li v-for="s in g.spells" :key="s.slug" class="px-5 py-2.5">
          <div class="flex items-center gap-3">
            <span
              class="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm"
              :class="[schoolTone[s.school].border, schoolTone[s.school].text, schoolTone[s.school].bg]"
              :title="`${s.school}, level ${s.level}`"
            >{{ s.level }}</span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <NuxtLink :to="`/tempest/spells/${s.slug}`" class="text-[13.5px] font-semibold text-parchment hover:text-gold-light">{{ s.name }}</NuxtLink>
                <span v-if="state.concentration === s.slug" class="chip border-rose/60 bg-rose/15 py-0 text-[10px] text-rose">Concentrating</span>
                <span v-else-if="s.concentration" class="chip border-rose/40 py-0 text-[10px] text-rose" title="Concentration">C</span>
                <span v-if="s.status === 'domain'" class="chip border-sapphire/40 py-0 text-[10px] text-sapphire">Domain</span>
                <span v-if="saveOf(s)" class="chip py-0 text-[10px]">{{ saveOf(s) }} save</span>
                <span class="text-[10.5px] text-faint">{{ s.range }}</span>
              </div>
              <p class="line-clamp-2 text-[11.5px] leading-snug text-faint">{{ s.role }}</p>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-1.5">
              <button v-if="diceAt(s, levelOf(s))" type="button" class="btn px-1.5 py-0.5 text-[11px] tabular-nums" :class="s.storm ? 'border-sapphire/40' : ''" @click="rollFor(s, levelOf(s))">{{ diceAt(s, levelOf(s)) }}</button>
              <button
                type="button"
                class="btn min-w-[4.5rem] py-1"
                :disabled="!canCast(s)"
                :title="fromShield(s) ? (left('shield') ? 'Once per long rest, no slot' : 'Used today') : canCast(s) ? `Spends a ${levelLabel(levelOf(s))}-level slot` : 'No slot of that level or higher left'"
                @click="cast(s, fromShield(s) ? s.level : levelOf(s))"
              >Cast<template v-if="!fromShield(s) && s.level"> · {{ levelOf(s) }}</template></button>
            </div>
          </div>
          <!-- Slot level to cast at: higher ones only when the spell gets more from them -->
          <div v-if="!fromShield(s) && s.higher && levelsFor(s).length > 1" class="ml-11 mt-1.5 flex flex-wrap items-center gap-1" role="radiogroup" :aria-label="`Slot level for ${s.name}`">
            <span class="mr-1 text-[10.5px] text-faint">Slot</span>
            <button
              v-for="l in levelsFor(s)"
              :key="l"
              type="button"
              role="radio"
              :aria-checked="levelOf(s) === l"
              class="grid h-6 min-w-6 place-items-center rounded-md border px-1 text-[11px] tabular-nums transition"
              :class="levelOf(s) === l ? 'border-sapphire/70 bg-sapphire/20 text-sapphire' : slotsLeft(l) ? 'border-obsidian-500 text-dim hover:border-sapphire/50' : 'border-obsidian-700 text-faint/50 line-through'"
              :disabled="!slotsLeft(l)"
              :title="`${levelLabel(l, true)}: ${slotsLeft(l)} left`"
              @click="picked[s.slug] = l"
            >{{ l }}</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-obsidian-600/70 px-5 py-3 text-[11.5px] text-faint">
      <span>Rituals take 10 extra minutes and no slot, if prepared. A lightning or thunder roll spends a primed Destructive Wrath.</span>
      <NuxtLink to="/tempest/spells" class="text-dim hover:text-gold-light">Full spellbook →</NuxtLink>
    </div>
  </section>
</template>
