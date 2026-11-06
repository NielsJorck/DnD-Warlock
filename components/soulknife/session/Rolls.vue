<script setup lang="ts">
import { stats } from '~/data/characters/soulknife/character'
import { abilityNames } from '~/data/characters/shared'

const { state, d20, rollInitiative, exhaustionPenalty } = useSoulknifeTracker()

const abilities = abilityOrder.map(key => ({ key, name: abilityNames[key], ...stats.abilities[key] }))

// Stealth has advantage only with the cloak's hood up
const skillAdvantage = (s: (typeof stats.skills)[number]) => !!s.advantage && state.value.hood
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
      <div>
        <p class="eyebrow">Expertise and the cloak’s advantage included</p>
        <h2 class="heading text-lg">Rolls</h2>
      </div>
      <span class="text-[11px]" :class="exhaustionPenalty ? 'text-ruby' : 'text-faint'">{{ exhaustionPenalty ? `Exhaustion −${exhaustionPenalty} on every roll` : 'Adv / Dis in the top bar' }}</span>
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
            >{{ signed(a.check) }}</button>
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-md py-1 tabular-nums transition hover:bg-obsidian-800 hover:text-gold-light"
              :class="a.proficient ? 'font-semibold text-gold-light' : 'text-dim'"
              :title="`Roll ${a.name} save${a.proficient ? ' (proficient)' : ''}`"
              @click="d20(a.save, `${a.name} save`)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="a.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
              {{ signed(a.save) }}
            </button>
          </li>
          <li class="mt-1 grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center border-t border-obsidian-600 pt-1">
            <span class="px-2 py-1 font-semibold text-parchment">Initiative <span v-if="state.hidden" class="text-[10px] font-normal text-sapphire">adv</span></span>
            <button type="button" class="rounded-md py-1 text-center font-semibold tabular-nums text-gold-light transition hover:bg-obsidian-800" title="Roll initiative: DEX + Alert’s proficiency bonus, with advantage while hidden" @click="rollInitiative">{{ signed(stats.initiative) }}</button>
            <span />
          </li>
          <li class="grid grid-cols-[minmax(0,1fr)_3.5rem_4rem] items-center">
            <span class="truncate px-2 py-1 font-semibold text-parchment" title="DEX + proficiency: pick a lock or disarm a trap, DC 15 as the 2024 tools list them">Thieves’ Tools</span>
            <button type="button" class="rounded-md py-1 text-center font-semibold tabular-nums text-gold-light transition hover:bg-obsidian-800" title="Roll a Thieves’ Tools check" @click="d20(stats.tools, 'Thieves’ Tools check')">{{ signed(stats.tools) }}</button>
            <span />
          </li>
        </ul>
        <p class="mt-2 text-[11px] text-faint">Advantage on saves to avoid or end Charmed (Fey Ancestry). A failed check with a skill or the tools can take a psi die: Knack, under Powers.</p>
      </div>

      <div>
        <p class="eyebrow mb-0.5 text-dim">Skills</p>
        <ul class="grid grid-cols-2 gap-x-3 xl:grid-cols-3 2xl:grid-cols-2">
          <li v-for="s in stats.skills" :key="s.name">
            <button
              type="button"
              class="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-left text-[12.5px] transition hover:bg-obsidian-800 sm:gap-2 sm:px-2 sm:text-[13px]"
              :title="s.expertise ? 'Expertise: double proficiency' : s.advantage ? `Advantage with the ${s.advantage}` : undefined"
              @click="d20(s.bonus, skillAdvantage(s) ? `${s.name} check · cloak` : `${s.name} check`, { advantage: skillAdvantage(s) })"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.expertise ? 'bg-gold ring-2 ring-gold/40' : s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
              <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
              <span v-if="skillAdvantage(s)" class="text-[10px] text-sapphire">adv</span>
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
