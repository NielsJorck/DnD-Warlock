<script setup lang="ts">
import { abilityNames } from '~/data/characters/lucan/character'

const { inForm, stats } = useTracker()
const { roll } = useDice()

// Lucan's numbers, or the Lesser Dao form's while he is in it
const abilities = computed(() => abilityOrder.map(key => ({ key, name: abilityNames[key], ...stats.value.abilities[key] })))
const who = computed(() => (inForm.value ? 'Lesser Dao ' : ''))

const r20 = (bonus: number, label: string) => roll(`1d20${signed(bonus).replace('−', '-')}`, `${who.value}${label}`)
</script>

<template>
  <section class="panel scroll-mt-48 p-5" :class="inForm ? 'border-topaz/40' : ''">
    <div class="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
      <div>
        <p class="eyebrow" :class="inForm ? 'text-topaz' : ''">{{ inForm ? 'Lesser Dao form · its own scores · Stone included' : 'Stone of Good Luck included' }}</p>
        <h2 class="heading text-lg">Rolls</h2>
      </div>
      <span class="text-[11px] text-faint">Adv / Dis in the top bar</span>
    </div>

    <!-- Abilities beside skills where there is room, stacked in narrow columns -->
    <div class="grid gap-x-6 gap-y-4 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] 2xl:grid-cols-1 3xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
      <div>
        <div class="mb-0.5 grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-end">
          <span class="eyebrow text-dim">Abilities</span>
          <span class="text-center text-[10px] uppercase tracking-[0.14em] text-faint">Check</span>
          <span class="text-center text-[10px] uppercase tracking-[0.14em] text-faint">Save</span>
        </div>
        <ul class="text-[13px]">
          <li v-for="a in abilities" :key="a.key" class="grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center">
            <span class="flex min-w-0 items-baseline gap-2 px-2 py-1">
              <span class="truncate" :class="a.key === 'cha' ? 'font-semibold text-gold-light' : 'text-parchment'">{{ a.name }}</span>
              <span class="text-[10.5px] tabular-nums text-faint">{{ a.score }}</span>
            </span>
            <button
              type="button"
              class="rounded-md py-1 text-center tabular-nums text-parchment transition hover:bg-obsidian-800 hover:text-gold-light"
              :title="`Roll ${a.name} check`"
              @click="r20(a.check, `${a.name} check`)"
            >{{ signed(a.check) }}</button>
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-md py-1 tabular-nums transition hover:bg-obsidian-800 hover:text-gold-light"
              :class="a.proficient ? 'font-semibold text-gold-light' : 'text-dim'"
              :title="`Roll ${a.name} save${a.proficient ? ' (proficient)' : ''}`"
              @click="r20(a.save, `${a.name} save`)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="a.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
              {{ signed(a.save) }}
            </button>
          </li>
          <!-- Initiative is a Dexterity check and concentration a Constitution save, so they sit in those columns -->
          <li class="mt-1 grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center border-t border-obsidian-600 pt-1">
            <span class="px-2 py-1 font-semibold text-parchment">Initiative</span>
            <button type="button" class="rounded-md py-1 text-center font-semibold tabular-nums text-gold-light transition hover:bg-obsidian-800" title="Roll initiative" @click="r20(stats.initiative, 'Initiative')">{{ signed(stats.initiative) }}</button>
            <span />
          </li>
          <li class="grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center">
            <span class="truncate px-2 py-1 font-semibold text-rose" title="DC 10 or half the damage taken, whichever is higher">Concentration</span>
            <span />
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-md py-1 font-semibold tabular-nums text-rose transition hover:bg-obsidian-800"
              title="Roll a concentration save: DC 10 or half the damage"
              @click="r20(stats.abilities.con.save, 'Concentration save')"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
              {{ signed(stats.abilities.con.save) }}
            </button>
          </li>
        </ul>
        <p v-if="inForm" class="mt-2 text-[11px] text-topaz/90">Sure-Footed: advantage on Strength and Dexterity saves against being knocked prone.</p>
      </div>

      <div>
        <p class="eyebrow mb-0.5 text-dim">Skills</p>
        <ul class="grid grid-cols-2 gap-x-3 xl:grid-cols-3 2xl:grid-cols-2">
          <li v-for="s in stats.skills" :key="s.name">
            <button
              type="button"
              class="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-left text-[12.5px] transition hover:bg-obsidian-800 sm:gap-2 sm:px-2 sm:text-[13px]"
              @click="r20(s.bonus, `${s.name} check`)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.expertise ? 'bg-gold ring-2 ring-gold/40' : s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
              <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
              <span class="ml-auto tabular-nums" :class="s.proficient ? 'text-gold-light' : 'text-dim'">{{ signed(s.bonus) }}</span>
            </button>
          </li>
        </ul>
        <p class="mt-2 border-t border-obsidian-600 px-2 pt-2 text-[12px] text-faint">
          Passive Perception <span class="font-semibold tabular-nums text-parchment">{{ stats.passive.perception }}</span>
          · Insight <span class="font-semibold tabular-nums text-parchment">{{ stats.passive.insight }}</span>
          · Investigation <span class="font-semibold tabular-nums text-parchment">{{ stats.passive.investigation }}</span>
        </p>
      </div>
    </div>
  </section>
</template>
