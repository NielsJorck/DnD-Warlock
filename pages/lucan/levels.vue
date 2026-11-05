<script setup lang="ts">
import { character, type AbilityKey } from '~/data/characters/lucan/character'
import { allowedArrays } from '~/data/campaign'
import { levels, skillPicks, type ChoiceKind, type LevelEntry } from '~/data/characters/lucan/levels'
import { levelLabel } from '~/data/characters/lucan/spells'

useHead({ title: 'Level History — Lucan Beryll' })

// Picks so far against what the Warlock table allows; a swap doesn't add one
const counted: { kind: ChoiceKind; label: string; max: (l: LevelEntry) => number }[] = [
  { kind: 'Cantrip', label: 'Cantrips', max: l => l.table.cantrips },
  { kind: 'Spell', label: 'Spells known', max: l => l.table.spellsKnown },
  { kind: 'Invocation', label: 'Invocations', max: l => l.table.invocations }
]
const runningCounts = (entry: LevelEntry) =>
  counted.map(c => {
    const have = levels
      .filter(l => l.level <= entry.level)
      .flatMap(l => l.choices)
      .filter(ch => ch.kind === c.kind && !ch.replaces).length
    return { label: c.label, have, max: c.max(entry) }
  })

const statusLabel = (l: LevelEntry) => (l.status === 'creation' ? 'Built at creation' : l.status === 'upcoming' ? 'Upcoming' : `Gained ${l.date ?? ''}`.trim())
const statusTone: Record<LevelEntry['status'], string> = {
  creation: 'border-obsidian-500 text-dim',
  played: 'border-jade/40 bg-jade/10 text-jade',
  upcoming: 'border-dashed border-topaz/50 text-topaz'
}
const slotLabel = (l: LevelEntry) => `${l.table.slots} × ${levelLabel(l.table.slotLevel)}`

// Level 1: the array, each increase, and the result; the array is checked against the allowed list
const abilityKeys: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const start = levels.find(l => l.startingScores)?.startingScores
const startArray = start ? Object.values(start.base).sort((a, b) => b - a) : []
const arrayNo = allowedArrays.findIndex(a => a.join() === startArray.join()) + 1 // 0: not an allowed array
const startTotal = (k: AbilityKey) => (start ? start.base[k] + start.increases.reduce((sum, i) => sum + (i.scores[k] ?? 0), 0) : 0)

// Skill picks: a pick without a skill went unused
const totalPicks = skillPicks.reduce((sum, p) => sum + p.picks, 0)
const unusedPicks = skillPicks.reduce((sum, p) => sum + Math.max(0, p.picks - p.skills.length), 0)
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-4 -top-14 font-display text-[200px] leading-none text-gold/[0.06]" aria-hidden="true">{{ character.level }}</div>
      <p class="eyebrow">Build record</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Level History</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">
        Which choice belongs to which level, for when the DM asks. Lucan was built straight at level {{ character.level }} for the campaign start, so
        levels 1–{{ character.level }} show where each choice fits the rules. New levels are recorded here as they’re gained.
      </p>
      <div class="mt-5 flex flex-wrap gap-2">
        <a v-for="l in levels" :key="l.level" :href="`#level-${l.level}`" class="chip px-2.5 py-1 text-xs tabular-nums transition hover:border-gold/50 hover:text-gold-light" :class="l.status === 'upcoming' ? 'border-dashed' : ''">
          {{ l.level }}
        </a>
      </div>
    </header>

    <section class="mt-10 max-w-5xl">
      <SectionHeading eyebrow="Warlock 1 → 12" title="Level by Level" />
      <ol class="relative space-y-4 before:absolute before:bottom-6 before:left-[1.2rem] before:top-6 before:w-px before:bg-gold/20 sm:before:left-[1.45rem]">
        <li v-for="l in levels" :id="`level-${l.level}`" :key="l.level" class="relative flex scroll-mt-24 gap-3 sm:gap-4">
          <span
            class="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border font-display text-lg font-semibold tabular-nums sm:h-12 sm:w-12 sm:text-xl"
            :class="l.status === 'upcoming' ? 'border-dashed border-topaz/50 bg-obsidian-950 text-topaz' : 'border-gold/40 bg-obsidian-850 text-gold-light'"
          >{{ l.level }}</span>

          <article class="panel min-w-0 flex-1 p-4 sm:p-5" :class="l.status === 'upcoming' ? 'border-dashed !bg-obsidian-900/40' : ''">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h3 class="heading text-lg">Level {{ l.level }}</h3>
              <span class="chip py-0 text-[10.5px]" :class="statusTone[l.status]">{{ statusLabel(l) }}</span>
              <span class="ml-auto flex flex-wrap gap-x-3 text-[11.5px] text-faint">
                <span>HP <span class="tabular-nums text-parchment">{{ l.maxHp }}</span></span>
                <span>Prof <span class="tabular-nums text-parchment">+{{ l.proficiencyBonus }}</span></span>
                <span>Slots <span class="text-parchment">{{ slotLabel(l) }}</span></span>
              </span>
            </div>

            <dl class="mt-2 flex flex-wrap gap-1.5 text-[11.5px]">
              <div
                v-for="c in runningCounts(l)"
                :key="c.label"
                class="flex gap-1.5 rounded-md border px-2 py-0.5"
                :class="c.have > c.max ? 'border-ruby/50 bg-ruby/10' : 'border-obsidian-600'"
                :title="c.have > c.max ? `${c.have - c.max} more than the Warlock table allows at level ${l.level}` : undefined"
              >
                <dt class="text-faint">{{ c.label }}</dt>
                <dd class="tabular-nums" :class="c.have > c.max ? 'text-ruby' : 'text-parchment'">{{ c.have }} / {{ c.max }}</dd>
              </div>
            </dl>

            <div v-if="l.startingScores" class="mt-3">
              <p class="eyebrow mb-1 text-dim">Starting scores</p>
              <table class="w-full max-w-md text-[12.5px] tabular-nums">
                <thead class="border-b border-obsidian-600 text-[10px] uppercase tracking-[0.1em] text-faint">
                  <tr>
                    <th class="py-1 pr-2 text-left font-semibold"><span class="sr-only">Source</span></th>
                    <th v-for="k in abilityKeys" :key="k" class="px-1 py-1 text-center font-semibold">{{ k }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-1 pr-2 text-faint">Array</td>
                    <td v-for="k in abilityKeys" :key="k" class="px-1 py-1 text-center text-parchment">{{ l.startingScores.base[k] }}</td>
                  </tr>
                  <tr v-for="i in l.startingScores.increases" :key="i.source">
                    <td class="py-1 pr-2 text-faint">{{ i.source }}</td>
                    <td v-for="k in abilityKeys" :key="k" class="px-1 py-1 text-center text-gold-light">{{ i.scores[k] ? `+${i.scores[k]}` : '' }}</td>
                  </tr>
                  <tr class="border-t border-obsidian-600">
                    <td class="py-1 pr-2 text-dim">Level 1</td>
                    <td v-for="k in abilityKeys" :key="k" class="px-1 py-1 text-center font-semibold text-parchment">{{ startTotal(k) }}</td>
                  </tr>
                </tbody>
              </table>
              <p class="mt-2 text-[12.5px] leading-relaxed text-dim">
                <span v-if="arrayNo" class="text-parchment">Array {{ arrayNo }} of the {{ allowedArrays.length }} allowed: {{ startArray.join(', ') }}.</span>
                <span v-else class="text-ruby">{{ startArray.join(', ') }} is not one of the allowed arrays.</span>
              </p>
            </div>

            <div v-if="l.level === 1" id="skill-picks" class="mt-3 scroll-mt-24">
              <p class="eyebrow mb-1 text-dim">Skill picks · {{ totalPicks }}<template v-if="unusedPicks">, {{ unusedPicks }} unused</template></p>
              <table class="w-full max-w-xl text-left text-[12.5px]">
                <thead class="border-b border-obsidian-600 text-[10px] uppercase tracking-[0.1em] text-faint">
                  <tr>
                    <th class="py-1 pr-2 font-semibold">Source</th>
                    <th class="px-2 py-1 text-center font-semibold">Picks</th>
                    <th class="py-1 pl-2 font-semibold">Skill</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-obsidian-600/60">
                  <tr v-for="p in skillPicks" :key="p.source" class="align-top">
                    <td class="py-1 pr-2">
                      <span class="text-parchment">{{ p.source }}</span>
                      <span class="block text-[11px] leading-snug text-faint">{{ p.rule }}</span>
                    </td>
                    <td class="px-2 py-1 text-center tabular-nums text-parchment">{{ p.picks }}</td>
                    <td class="py-1 pl-2" :class="p.skills.length ? 'text-gold-light' : 'italic text-faint'">{{ p.skills.length ? p.skills.join(', ') : 'Not used' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-if="l.abilities" class="mt-2 text-[12.5px] text-dim">
              <span class="text-faint">Abilities</span> <span class="tabular-nums text-parchment">{{ l.abilities }}</span>
            </p>

            <div v-if="l.gains.length" class="mt-3">
              <p class="eyebrow mb-1 text-dim">Gains</p>
              <ul class="space-y-0.5">
                <li v-for="g in l.gains" :key="g.name" class="flex gap-2 text-[13px] leading-relaxed">
                  <span class="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 border border-gold/60" />
                  <span>
                    <NuxtLink v-if="g.to" :to="g.to" class="text-parchment hover:text-gold-light">{{ g.name }}</NuxtLink>
                    <span v-else class="text-parchment">{{ g.name }}</span>
                    <span v-if="g.note" class="text-dim"> · {{ g.note }}</span>
                  </span>
                </li>
              </ul>
            </div>

            <div v-if="l.choices.length" class="mt-3">
              <p class="eyebrow mb-1 text-dim">Choices</p>
              <ul class="divide-y divide-obsidian-600/50">
                <li v-for="(c, n) in l.choices" :key="n" class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 py-1.5 text-[13px] sm:grid-cols-[8rem_minmax(0,1fr)_auto]">
                  <span class="text-[11.5px] uppercase tracking-[0.1em] text-faint">{{ c.kind }}</span>
                  <span class="min-w-0">
                    <NuxtLink v-if="c.to" :to="c.to" class="font-semibold text-parchment hover:text-gold-light">{{ c.pick }}</NuxtLink>
                    <span v-else class="font-semibold text-parchment">{{ c.pick }}</span>
                    <span v-if="c.replaces" class="text-dim"> replaces {{ c.replaces }}</span>
                    <span v-if="c.note" class="block text-[12px] leading-relaxed text-dim">{{ c.note }}</span>
                  </span>
                  <span v-if="c.gift" class="col-start-2 sm:col-start-auto"><span class="chip border-topaz/50 bg-topaz/10 py-0 text-[10px] text-topaz">DM gift</span></span>
                </li>
              </ul>
            </div>

            <div v-if="l.pending?.length" class="mt-3">
              <p class="eyebrow mb-1 text-topaz">To decide</p>
              <ul class="space-y-0.5">
                <li v-for="p in l.pending" :key="p" class="flex gap-2 text-[13px] leading-relaxed text-parchment/85"><span class="text-topaz">?</span>{{ p }}</li>
              </ul>
            </div>
          </article>
        </li>
      </ol>
    </section>
  </div>
</template>
