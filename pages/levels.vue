<script setup lang="ts">
import { character, type AbilityKey } from '~/data/character'
import { allowedArrays, levels, revisions, unplaced, type ChoiceKind, type LevelEntry } from '~/data/levels'
import { levelLabel } from '~/data/spells'

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

// Level 1: the scores, the increases, and the arrays that fit, each checked against the allowed list
const abilityKeys: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const arrayNo = (arr: number[]) => allowedArrays.findIndex(a => a.join() === arr.join()) + 1 // 0: not an allowed array
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

    <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
      <div class="min-w-0 space-y-12">
        <section>
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
                  <p class="eyebrow mb-1 text-dim">Scores at level 1</p>
                  <dl class="grid max-w-md grid-cols-6 gap-1 text-center">
                    <div v-for="k in abilityKeys" :key="k" class="rounded-md border border-obsidian-600 py-1">
                      <dt class="text-[10px] uppercase tracking-[0.1em] text-faint">{{ k }}</dt>
                      <dd class="stat-num text-base">{{ l.startingScores.level1[k] }}</dd>
                    </div>
                  </dl>
                  <ul class="mt-2 space-y-0.5 text-[12.5px]">
                    <li v-for="i in l.startingScores.increases" :key="i.source" class="flex gap-2">
                      <span class="w-24 shrink-0 text-faint">{{ i.source }}</span><span class="text-parchment">{{ i.text }}</span>
                    </li>
                  </ul>
                  <p class="eyebrow mb-1 mt-3 text-dim">{{ l.startingScores.arrays.length === 1 ? 'Array' : 'Arrays that fit' }} · of the {{ allowedArrays.length }} allowed</p>
                  <ul class="flex flex-wrap gap-1.5">
                    <li
                      v-for="a in l.startingScores.arrays"
                      :key="a.join()"
                      class="rounded-md border px-2 py-0.5 text-[12px] tabular-nums"
                      :class="arrayNo(a) ? 'border-gold/30 text-parchment' : 'border-ruby/50 bg-ruby/10 text-ruby'"
                    >
                      <span :class="arrayNo(a) ? 'text-faint' : ''">{{ arrayNo(a) ? `#${arrayNo(a)}` : 'Not allowed:' }}</span> {{ a.join(', ') }}
                    </li>
                  </ul>
                  <p class="mt-2 text-[12.5px] leading-relaxed text-dim">{{ l.startingScores.note }}</p>
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
                      <span class="col-start-2 flex flex-wrap gap-1 sm:col-start-auto">
                        <span v-if="c.gift" class="chip border-topaz/50 bg-topaz/10 py-0 text-[10px] text-topaz">DM gift</span>
                        <span
                          class="chip py-0 text-[10px]"
                          :class="c.basis === 'fitted' ? 'border-dashed border-obsidian-500 text-faint' : 'border-gold/40 text-gold-light'"
                        >{{ c.basis === 'fitted' ? 'Fitted' : 'Fixed' }}</span>
                      </span>
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

        <section>
          <SectionHeading eyebrow="At level 10" title="Changes to the Build" />
          <p class="-mt-2 mb-4 max-w-3xl text-[13px] text-dim">Changes made after the level-{{ character.level }} build was first written down. Dates are when the change was recorded.</p>
          <div class="grid gap-4 xl:grid-cols-3">
            <div v-for="r in revisions" :key="r.date" class="panel p-5">
              <p class="eyebrow tabular-nums">{{ r.date }}</p>
              <h3 class="heading mb-2 text-base">{{ r.title }}</h3>
              <ul class="space-y-1.5">
                <li v-for="c in r.changes" :key="c" class="flex gap-2 text-[12.5px] leading-relaxed text-parchment/85"><span class="text-gold/60">◇</span>{{ c }}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div class="panel p-5">
          <p class="eyebrow">How to read it</p>
          <h2 class="heading mb-3 text-lg">Fixed and Fitted</h2>
          <dl class="space-y-2.5 text-[12.5px] leading-relaxed">
            <div class="flex gap-3">
              <dt><span class="chip border-gold/40 py-0 text-[10px] text-gold-light">Fixed</span></dt>
              <dd class="text-dim">The rules or the notes set the level: race, patron, pact boon, and the feats at 1, 4 and 8.</dd>
            </div>
            <div class="flex gap-3">
              <dt><span class="chip border-dashed border-obsidian-500 py-0 text-[10px] text-faint">Fitted</span></dt>
              <dd class="text-dim">Chosen at creation and shown at the first level the rules allow it, so the counts work out.</dd>
            </div>
            <div class="flex gap-3">
              <dt><span class="chip border-topaz/50 bg-topaz/10 py-0 text-[10px] text-topaz">DM gift</span></dt>
              <dd class="text-dim">Given by the DM on top of the normal picks.</dd>
            </div>
            <div class="flex gap-3">
              <dt><span class="whitespace-nowrap rounded-md border border-ruby/50 bg-ruby/10 px-1.5 py-0.5 tabular-nums text-ruby">n / n</span></dt>
              <dd class="text-dim">More picks than the Warlock table allows at that level.</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-xl border border-dashed border-topaz/40 p-5">
          <p class="eyebrow text-topaz">In case the DM asks</p>
          <h2 class="heading mb-3 text-lg">Not Settled by the Record</h2>
          <ul class="space-y-3">
            <li v-for="u in unplaced" :key="u.title">
              <h3 class="text-[13px] font-semibold text-parchment">{{ u.title }}</h3>
              <p class="mt-0.5 text-[12.5px] leading-relaxed text-dim">{{ u.text }}</p>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>
