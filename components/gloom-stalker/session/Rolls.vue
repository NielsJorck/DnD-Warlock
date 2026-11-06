<script setup lang="ts">
import { stats } from '~/data/characters/gloom-stalker/character'
import { abilityNames } from '~/data/characters/shared'

const { d20, d20Penalty, startCombat } = useGloomStalkerTracker()

const abilities = abilityOrder.map(key => ({ key, name: abilityNames[key], ...stats.abilities[key] }))
const shown = (n: number) => signed(n - d20Penalty.value)
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
      <div>
        <p class="eyebrow">Exhaustion’s penalty included when there is one</p>
        <h2 class="heading text-lg">Rolls</h2>
      </div>
      <span class="text-[11px] text-faint">Adv / Dis in the top bar</span>
    </div>

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
              <span class="truncate" :class="a.key === 'dex' ? 'font-semibold text-gold-light' : 'text-parchment'">{{ a.name }}</span>
              <span class="text-[10.5px] tabular-nums text-faint">{{ a.score }}</span>
            </span>
            <button
              type="button"
              class="rounded-md py-1 text-center tabular-nums text-parchment transition hover:bg-obsidian-800 hover:text-gold-light"
              :title="`Roll ${a.name} check`"
              @click="d20(a.check, `${a.name} check`)"
            >{{ shown(a.check) }}</button>
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-md py-1 tabular-nums transition hover:bg-obsidian-800 hover:text-gold-light"
              :class="a.proficient ? 'font-semibold text-gold-light' : 'text-dim'"
              :title="`Roll ${a.name} save${a.proficient ? ' (proficient)' : ''}`"
              @click="d20(a.save, `${a.name} save`)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="a.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
              {{ shown(a.save) }}
            </button>
          </li>
          <li class="mt-1 grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center border-t border-obsidian-600 pt-1">
            <span class="px-2 py-1 font-semibold text-parchment" :title="stats.initiativeParts.map(p => `${p.label} ${signed(p.value)}`).join(' · ')">Initiative</span>
            <button type="button" class="rounded-md py-1 text-center font-semibold tabular-nums text-gold-light transition hover:bg-obsidian-800" title="Roll initiative: DEX, Dread Ambusher’s WIS and Alert. Starts the first turn" @click="startCombat">{{ shown(stats.initiative) }}</button>
            <span />
          </li>
          <li class="grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center">
            <span class="truncate px-2 py-1 font-semibold text-rose" title="DC 10 or half the damage taken, whichever is higher, up to 30">Concentration</span>
            <span />
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-md py-1 font-semibold tabular-nums text-rose transition hover:bg-obsidian-800"
              title="Roll a concentration save: DC 10 or half the damage"
              @click="d20(stats.abilities.con.save, 'Concentration save')"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full border border-rose" />
              {{ shown(stats.abilities.con.save) }}
            </button>
          </li>
        </ul>
        <p class="mt-2 text-[11px] text-faint">Proficient in Strength and Dexterity saves; Wisdom saves join at level 7 (Iron Mind).</p>
      </div>

      <div>
        <p class="eyebrow mb-0.5 text-dim">Skills</p>
        <ul class="grid grid-cols-2 gap-x-3 xl:grid-cols-3 2xl:grid-cols-2">
          <li v-for="s in stats.skills" :key="s.name">
            <button
              type="button"
              class="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-left text-[12.5px] transition hover:bg-obsidian-800 sm:gap-2 sm:px-2 sm:text-[13px]"
              :title="s.expertise ? `Expertise from ${s.expertiseFrom}` : s.source ? `Proficient — ${s.source}` : undefined"
              @click="d20(s.bonus, `${s.name} check`)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.expertise ? 'bg-gold ring-2 ring-gold/30' : s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
              <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
              <span v-if="s.expertise" class="text-[10px] text-gold">exp</span>
              <span class="ml-auto tabular-nums" :class="s.proficient ? 'text-gold-light' : 'text-dim'">{{ shown(s.bonus) }}</span>
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
