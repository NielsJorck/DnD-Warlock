<script setup lang="ts">
import { stats } from '~/data/characters/tempest/character'
import { abilityNames } from '~/data/characters/shared'

const { roll } = useDice()

const abilities = abilityOrder.map(key => ({ key, name: abilityNames[key], ...stats.abilities[key] }))

// advantage: from the Sentinel Shield (initiative, Perception) or War Caster (concentration)
const r20 = (bonus: number, label: string, advantage = false) => roll(`1d20${signed(bonus).replace('−', '-')}`, label, { advantage })
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
      <div>
        <p class="eyebrow">Advantage from the shield and War Caster included</p>
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
              <span class="truncate" :class="a.key === 'wis' ? 'font-semibold text-gold-light' : 'text-parchment'">{{ a.name }}</span>
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
          <li class="mt-1 grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center border-t border-obsidian-600 pt-1">
            <span class="px-2 py-1 font-semibold text-parchment">Initiative <span class="text-[10px] font-normal text-sapphire">adv</span></span>
            <button type="button" class="rounded-md py-1 text-center font-semibold tabular-nums text-gold-light transition hover:bg-obsidian-800" title="Roll initiative with the Sentinel Shield’s advantage" @click="r20(stats.initiative, 'Initiative · Sentinel Shield', true)">{{ signed(stats.initiative) }}</button>
            <span />
          </li>
          <li class="grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center">
            <span class="truncate px-2 py-1 font-semibold text-rose" title="DC 10 or half the damage taken, whichever is higher">Concentration <span class="text-[10px] font-normal text-sapphire">adv</span></span>
            <span />
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-md py-1 font-semibold tabular-nums text-rose transition hover:bg-obsidian-800"
              title="Roll a concentration save with War Caster’s advantage: DC 10 or half the damage"
              @click="r20(stats.abilities.con.save, 'Concentration save · War Caster', true)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full border border-rose" />
              {{ signed(stats.abilities.con.save) }}
            </button>
          </li>
        </ul>
        <p class="mt-2 text-[11px] text-faint">Advantage on saves against poison (dwarf). +2 on Dexterity saves against effects that target only him (Shield Master).</p>
      </div>

      <div>
        <p class="eyebrow mb-0.5 text-dim">Skills</p>
        <ul class="grid grid-cols-2 gap-x-3 xl:grid-cols-3 2xl:grid-cols-2">
          <li v-for="s in stats.skills" :key="s.name">
            <button
              type="button"
              class="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-left text-[12.5px] transition hover:bg-obsidian-800 sm:gap-2 sm:px-2 sm:text-[13px]"
              :title="s.advantage ? `With advantage from the ${s.advantage}` : undefined"
              @click="r20(s.bonus, s.advantage ? `${s.name} check · ${s.advantage}` : `${s.name} check`, !!s.advantage)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
              <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
              <span v-if="s.advantage" class="text-[10px] text-sapphire">adv</span>
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
