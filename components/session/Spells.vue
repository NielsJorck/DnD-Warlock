<script setup lang="ts">
import { spells, type Spell } from '~/data/characters/lucan/spells'

const { state, nextSlot, inForm } = useTracker()
const { cast } = useCasting()
const concentrating = computed(() => spells.find(s => s.slug === state.value.concentration))

const known = spells.filter(s => s.status === 'known')
// Eldritch Blast has its own card under Attacks
const cantrips = known.filter(s => s.level === 0 && s.slug !== 'eldritch-blast')

const timing = (s: Spell) =>
  /reaction/i.test(s.castingTime) ? 'reaction' : /bonus/i.test(s.castingTime) ? 'bonus' : /action/i.test(s.castingTime) ? 'action' : 'long'
const groups = [
  { id: 'reaction', title: 'Reaction' },
  { id: 'bonus', title: 'Bonus action' },
  { id: 'action', title: 'Action' },
  { id: 'long', title: 'Longer casting time' }
]
  .map(g => ({
    ...g,
    spells: known.filter(s => s.level > 0 && timing(s) === g.id).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
  }))
  .filter(g => g.spells.length)

const dice = (s: Spell) => (s.atPact ?? s.damage ?? '').match(/\d+d\d+/)?.[0]
const saveOf = (s: Spell) => s.save?.split(' ')[0]
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden">
    <div class="flex flex-wrap items-end justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <div>
        <p class="eyebrow">Pact Magic · every slot is 5th level</p>
        <h2 class="heading text-lg">Spells</h2>
      </div>
      <div class="flex flex-wrap gap-1.5 text-[11.5px]">
        <span class="chip">DC {{ derived.spellDc }}</span>
        <span class="chip">Attack {{ signed(derived.spellAttack) }}</span>
        <span v-if="inForm" class="chip border-topaz/40 text-topaz">Not in the form</span>
        <span v-else class="chip" :class="nextSlot === 'pact' ? 'border-gold/40 text-gold-light' : nextSlot === 'savant' ? 'border-amethyst/40 text-amethyst' : 'border-ruby/40 text-ruby'">
          {{ nextSlot === 'pact' ? 'Next: pact slot' : nextSlot === 'savant' ? 'Next: Savant slot' : 'No slots left' }}
        </span>
      </div>
    </div>

    <p v-if="inForm" class="border-b border-topaz/30 bg-topaz/5 px-5 py-3 text-[12.5px] leading-relaxed text-topaz">
      No spellcasting in the Form of the Lesser Dao.
      <template v-if="concentrating">Concentration on {{ concentrating.name }} carries on, and its damage dice still roll.</template>
      <template v-else>Spells come back when the form ends.</template>
    </p>

    <!-- Cantrips -->
    <div class="border-b border-obsidian-600/70 px-5 py-4">
      <p class="eyebrow mb-2 text-dim">Cantrips · at will</p>
      <ul class="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <li v-for="s in cantrips" :key="s.slug" class="flex min-w-0 items-center gap-2">
          <span class="min-w-0 flex-1">
            <NuxtLink :to="`/lucan/spells/${s.slug}`" class="text-[13px] font-medium text-parchment hover:text-gold-light">{{ s.name }}</NuxtLink>
            <span v-if="s.concentration" class="ml-1.5 text-[10px] font-semibold text-rose" title="Concentration">C</span>
            <span v-if="saveOf(s)" class="ml-1.5 text-[10.5px] text-faint">{{ saveOf(s) }}</span>
          </span>
          <RollButton v-if="dice(s)" :notation="dice(s)!" :label="`${s.name} damage`" compact>{{ dice(s) }}</RollButton>
          <button v-if="s.concentration" type="button" class="btn px-2 py-0.5 text-[11px]" :disabled="inForm || state.concentration === s.slug" @click="cast(s)">Cast</button>
        </li>
      </ul>
    </div>

    <!-- Leveled spells by casting time -->
    <div v-for="g in groups" :key="g.id" class="border-b border-obsidian-600/70 last:border-0">
      <p class="eyebrow bg-obsidian-950/40 px-5 py-2 text-dim">{{ g.title }}</p>
      <ul class="divide-y divide-obsidian-600/50">
        <li v-for="s in g.spells" :key="s.slug" class="flex items-center gap-3 px-5 py-2.5">
          <span
            class="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm"
            :class="[schoolTone[s.school].border, schoolTone[s.school].text, schoolTone[s.school].bg]"
            :title="`${s.school}, level ${s.level}`"
          >{{ s.level }}</span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <NuxtLink :to="`/lucan/spells/${s.slug}`" class="text-[13.5px] font-semibold text-parchment hover:text-gold-light">{{ s.name }}</NuxtLink>
              <span v-if="state.concentration === s.slug" class="chip border-rose/60 bg-rose/15 py-0 text-[10px] text-rose">Concentrating</span>
              <span v-else-if="s.concentration" class="chip border-rose/40 py-0 text-[10px] text-rose" title="Concentration">C</span>
              <span v-if="saveOf(s)" class="chip py-0 text-[10px]">{{ saveOf(s) }} save</span>
              <span class="text-[10.5px] text-faint">{{ s.range }}</span>
            </div>
            <p class="line-clamp-2 text-[11.5px] leading-snug text-faint">{{ s.atPact || s.summary }}</p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-1.5">
            <RollButton v-if="dice(s)" :notation="dice(s)!" :label="`${s.name} damage`" compact>{{ dice(s) }}</RollButton>
            <button
              type="button"
              class="btn min-w-[4.5rem] py-1"
              :class="nextSlot === 'savant' ? 'border-amethyst/50 text-amethyst' : ''"
              :disabled="inForm || !nextSlot"
              :title="inForm ? 'No spellcasting in the Lesser Dao form' : nextSlot ? `Spends a ${nextSlot === 'pact' ? 'pact' : 'Spell Savant'} slot` : 'No slots left'"
              @click="cast(s)"
            >Cast</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-obsidian-600/70 px-5 py-3 text-[11.5px] text-faint">
      <span>Rituals from the Book of Shadows take 10 extra minutes and no slot.</span>
      <NuxtLink to="/lucan/spells" class="text-dim hover:text-gold-light">Full spellbook →</NuxtLink>
    </div>
  </section>
</template>
