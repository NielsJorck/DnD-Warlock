<script setup lang="ts">
import { character, type AbilityKey } from '~/data/character'
import { spells, levelLabel } from '~/data/spells'
import { appearance } from '~/data/lore'

useHead({ title: 'Lucan Beryll — Character Sheet' })

const vitals = [
  { label: 'Armor Class', value: String(character.ac.total), sub: 'Barrier Tattoo', id: 'ac' },
  { label: 'Hit Points', value: String(character.maxHp), sub: character.hitDice },
  { label: 'Spell Save DC', value: String(derived.spellDc), sub: `${derived.spellDcBase} + 2 Rod` },
  { label: 'Spell Attack', value: signed(derived.spellAttack), sub: `${signed(derived.spellAttackBase)} + 2 Rod` },
  { label: 'Initiative', value: signed(derived.initiative), sub: 'DEX + Stone', roll: `1d20+${derived.initiative}` },
  { label: 'Speed', value: `${character.speed}`, sub: 'ft · fly 30 (Gift)' },
  { label: 'Proficiency', value: signed(character.proficiencyBonus), sub: 'Level 10' },
  { label: 'Pact Slots', value: `${character.pactSlots.count}×5th`, sub: 'Short rest' }
]

const allSkills: { name: string; ability: AbilityKey }[] = [
  { name: 'Acrobatics', ability: 'dex' },
  { name: 'Animal Handling', ability: 'wis' },
  { name: 'Arcana', ability: 'int' },
  { name: 'Athletics', ability: 'str' },
  { name: 'Deception', ability: 'cha' },
  { name: 'History', ability: 'int' },
  { name: 'Insight', ability: 'wis' },
  { name: 'Intimidation', ability: 'cha' },
  { name: 'Investigation', ability: 'int' },
  { name: 'Medicine', ability: 'wis' },
  { name: 'Nature', ability: 'int' },
  { name: 'Perception', ability: 'wis' },
  { name: 'Performance', ability: 'cha' },
  { name: 'Persuasion', ability: 'cha' },
  { name: 'Religion', ability: 'int' },
  { name: 'Sleight of Hand', ability: 'dex' },
  { name: 'Stealth', ability: 'dex' },
  { name: 'Survival', ability: 'wis' }
]
const skills = allSkills.map(s => {
  const prof = character.skills.find(p => p.name === s.name)
  return { ...s, proficient: !!prof, source: prof?.source, bonus: skillBonus(s.ability, !!prof) }
})

const leveled = spells.filter(s => s.status === 'known' && s.level > 0).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
const cantrips = spells.filter(s => s.status === 'known' && s.level === 0)

const sections = [
  { id: 'abilities', label: 'Abilities' },
  { id: 'combat', label: 'Combat' },
  { id: 'spellcasting', label: 'Spellcasting' },
  { id: 'features', label: 'Features' },
  { id: 'proficiencies', label: 'Proficiencies' }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="panel relative overflow-hidden">
      <svg class="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] text-gold opacity-[0.07]" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="0.6" aria-hidden="true">
        <path d="M100 10 180 70 100 190 20 70Z" />
        <path d="M20 70h160M60 70l40-60 40 60-40 120Z" />
        <path d="M60 70 100 190M140 70 100 190" />
        <circle cx="100" cy="100" r="96" stroke-dasharray="2 4" />
        <circle cx="100" cy="100" r="88" />
      </svg>
      <div class="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">
        <NuxtLink to="/lore" class="group mx-auto block w-full max-w-[280px] overflow-hidden rounded-2xl border border-gold/30 shadow-panel">
          <img :src="publicPath(appearance.portrait.src)" :alt="appearance.portrait.alt" class="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        </NuxtLink>

        <div class="min-w-0">
          <div>
            <p class="eyebrow">Level {{ character.level }} {{ character.race }} {{ character.className }} · {{ character.subclass }}</p>
            <h1 class="mt-3 font-display text-5xl font-bold leading-[0.95] tracking-wide sm:text-7xl">
              <span class="text-gilded">Lucan Beryll</span>
            </h1>
            <p class="mt-3 font-serif text-2xl italic text-dim">{{ character.epithet }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="chip border-gold/40 text-gold-light">{{ character.pact }}</span>
              <span class="chip">Patron · {{ character.patron }}</span>
              <span class="chip">{{ character.background }} · {{ character.backgroundDetail }}</span>
              <span class="chip">{{ character.ruleset }}</span>
            </div>
            <p class="lore mt-6 max-w-xl">{{ character.identity.summary }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <NuxtLink to="/spells" class="btn btn-gold px-4 py-2 text-[13px]">Spellbook →</NuxtLink>
              <NuxtLink to="/vessel" class="btn px-4 py-2 text-[13px]">Enter the Vessel</NuxtLink>
              <NuxtLink to="/lore" class="btn px-4 py-2 text-[13px]">Story &amp; patron</NuxtLink>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div
              v-for="v in vitals"
              :key="v.label"
              class="group relative rounded-xl border border-obsidian-600 bg-obsidian-950/70 px-4 py-3 transition hover:border-gold/40"
            >
              <div class="eyebrow text-dim">{{ v.label }}</div>
              <div class="flex items-baseline justify-between gap-2">
                <span class="stat-num text-3xl">{{ v.value }}</span>
                <RollButton v-if="v.roll" :notation="v.roll" :label="v.label" compact>d20</RollButton>
              </div>
              <div class="text-[11px] text-faint">{{ v.sub }}</div>
              <div
                v-if="v.id === 'ac'"
                class="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-64 rounded-xl border border-gold/30 bg-obsidian-900 p-3 shadow-panel group-hover:block"
              >
                <div v-for="b in character.ac.breakdown" :key="b.label" class="flex justify-between py-0.5 text-xs">
                  <span class="text-dim">{{ b.label }}</span><span class="tabular-nums text-parchment">{{ b.label.startsWith('Barrier') ? b.value : `+${b.value}` }}</span>
                </div>
                <div class="mt-1 flex justify-between border-t border-obsidian-600 pt-1 text-xs font-semibold"><span>Total</span><span>{{ character.ac.total }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- In-page nav -->
    <nav class="scrollbar-none mt-6 flex gap-2 overflow-x-auto" aria-label="Sheet sections">
      <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="chip px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">{{ s.label }}</a>
    </nav>

    <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <!-- Main column -->
      <div class="min-w-0 space-y-10">
        <section class="panel p-5 sm:p-6">
          <SectionHeading id="abilities" eyebrow="Ability scores" title="Abilities &amp; Saving Throws" />
          <AbilityGrid />
        </section>

        <section>
          <SectionHeading id="combat" eyebrow="How Lucan fights" title="Combat" />
          <div class="space-y-5">
            <BlastPanel />
            <SpikeCombo />
          </div>
        </section>

        <section class="panel p-5 sm:p-6">
          <SectionHeading id="spellcasting" eyebrow="Pact Magic · CHA" title="Spellcasting">
            <NuxtLink to="/spells" class="btn">Full spellbook →</NuxtLink>
          </SectionHeading>
          <div class="mb-5 grid grid-cols-3 gap-2 text-center">
            <div class="panel-inset py-3"><div class="eyebrow text-dim">Save DC</div><div class="stat-num text-3xl">{{ derived.spellDc }}</div></div>
            <div class="panel-inset py-3"><div class="eyebrow text-dim">Attack</div><div class="stat-num text-3xl">{{ signed(derived.spellAttack) }}</div></div>
            <div class="panel-inset py-3"><div class="eyebrow text-dim">Slots</div><div class="stat-num text-3xl">2 × 5th</div></div>
          </div>

          <p class="eyebrow mb-2 text-dim">Cantrips · at will</p>
          <div class="mb-5 flex flex-wrap gap-1.5">
            <NuxtLink v-for="c in cantrips" :key="c.slug" :to="`/spells/${c.slug}`" class="chip px-3 py-1 text-xs text-parchment transition hover:border-gold/50 hover:text-gold-light">
              {{ c.name }}<span v-if="c.damage" class="text-faint">· {{ c.damage.split(' ')[0] }}</span>
            </NuxtLink>
          </div>

          <p class="eyebrow mb-2 text-dim">Leveled spells · always cast at 5th level</p>
          <div class="overflow-hidden rounded-xl border border-obsidian-600/70">
            <NuxtLink
              v-for="s in leveled"
              :key="s.slug"
              :to="`/spells/${s.slug}`"
              class="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 border-b border-obsidian-600/60 px-3 py-2.5 transition last:border-0 hover:bg-obsidian-800/60 sm:grid-cols-[2.25rem_11rem_minmax(0,1fr)_auto]"
            >
              <span class="grid h-8 w-8 place-items-center rounded-lg border text-sm" :class="[schoolTone[s.school].border, schoolTone[s.school].text, schoolTone[s.school].bg]">{{ s.level }}</span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold text-parchment">{{ s.name }}</span>
                <span class="block text-[11px] text-faint sm:hidden">{{ s.atPact || s.role }}</span>
              </span>
              <span class="hidden truncate text-[13px] text-dim sm:block">{{ s.atPact || s.role }}</span>
              <span class="hidden gap-1 sm:flex">
                <span v-if="s.concentration" class="chip py-0 text-[10px]" title="Concentration">C</span>
                <span v-if="s.save" class="chip py-0 text-[10px]">{{ s.save.split(' ')[0] }}</span>
              </span>
            </NuxtLink>
          </div>
          <p class="mt-2 text-[11px] text-faint">{{ levelLabel(1, true) }} through 5th-level spells all use the same pact slots, so lower-level spells are always cast upcast.</p>
        </section>

        <section>
          <SectionHeading id="features" eyebrow="Build" title="Feats, Invocations &amp; Features" />
          <div class="space-y-6">
            <div>
              <h3 class="eyebrow mb-2 text-dim">Feats</h3>
              <FeatureList :features="character.feats" />
            </div>
            <div>
              <h3 class="eyebrow mb-2 text-dim">Eldritch Invocations</h3>
              <FeatureList :features="character.invocations" />
            </div>
            <div>
              <h3 class="eyebrow mb-2 text-dim">Class, Patron &amp; Race Features</h3>
              <FeatureList :features="character.features" />
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="space-y-5">
        <SessionTracker />

        <div class="panel p-5">
          <p class="eyebrow">Defenses</p>
          <h2 class="heading mb-3 text-lg">Armor &amp; Resistances</h2>
          <ul class="space-y-1 text-[13px]">
            <li v-for="b in character.ac.breakdown" :key="b.label" class="flex justify-between gap-3">
              <span class="text-dim">{{ b.label }}</span>
              <span class="tabular-nums text-parchment">{{ b.label.startsWith('Barrier') ? b.value : `+${b.value}` }}</span>
            </li>
            <li class="flex justify-between border-t border-obsidian-600 pt-1 font-semibold"><span>Armor Class</span><span class="tabular-nums text-gold-light">{{ character.ac.total }}</span></li>
          </ul>
          <div class="mt-4 space-y-2 text-[13px]">
            <div v-for="r in character.resistances" :key="r" class="flex gap-2"><span class="text-jade">◆</span><span class="text-dim">Resistance: <span class="text-parchment">{{ r }}</span></span></div>
            <div class="flex gap-2"><span class="text-jade">◆</span><span class="text-dim"><span class="text-parchment">Fey Ancestry</span> — advantage against being charmed; magic can’t put him to sleep</span></div>
            <div v-for="s in character.senses" :key="s" class="flex gap-2"><span class="text-jade">◆</span><span class="text-parchment">{{ s }}</span></div>
          </div>
        </div>

        <div id="proficiencies" class="panel scroll-mt-24 p-5">
          <p class="eyebrow">Skills</p>
          <h2 class="heading mb-1 text-lg">Skills &amp; Senses</h2>
          <p class="mb-3 text-[11px] text-faint">Includes the Stone of Good Luck’s +1. Click to roll.</p>
          <div class="mb-4 grid grid-cols-3 gap-2 text-center">
            <div class="panel-inset py-2"><div class="text-[10px] uppercase tracking-wider text-faint">Passive Perc.</div><div class="stat-num text-xl">{{ derived.passivePerception }}</div></div>
            <div class="panel-inset py-2"><div class="text-[10px] uppercase tracking-wider text-faint">Passive Ins.</div><div class="stat-num text-xl">{{ derived.passiveInsight }}</div></div>
            <div class="panel-inset py-2"><div class="text-[10px] uppercase tracking-wider text-faint">Passive Inv.</div><div class="stat-num text-xl">{{ derived.passiveInvestigation }}</div></div>
          </div>
          <ul class="grid grid-cols-1 gap-0.5">
            <li v-for="s in skills" :key="s.name">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition hover:bg-obsidian-800"
                :title="s.source ? `Proficient — ${s.source}` : undefined"
                @click="useDice().roll(`1d20${signed(s.bonus)}`, `${s.name} check`)"
              >
                <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
                <span :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
                <span class="text-[10px] uppercase text-faint">{{ s.ability }}</span>
                <span class="ml-auto tabular-nums" :class="s.proficient ? 'text-gold-light' : 'text-dim'">{{ signed(s.bonus) }}</span>
              </button>
            </li>
          </ul>
        </div>

        <div class="panel p-5">
          <p class="eyebrow">Tongues &amp; tools</p>
          <h2 class="heading mb-3 text-lg">Languages &amp; Tools</h2>
          <ul class="space-y-1.5 text-[13px]">
            <li v-for="l in character.languages" :key="l.name" class="flex items-baseline justify-between gap-3">
              <span class="text-parchment">{{ l.name }}</span>
              <span class="text-right text-[11px] text-faint">{{ l.note }}</span>
            </li>
          </ul>
          <div class="mt-3 border-t border-obsidian-600 pt-3 text-[13px]">
            <div v-for="t in character.toolProficiencies" :key="t.name" class="flex justify-between gap-3">
              <span class="text-parchment">{{ t.name }}</span><span class="text-[11px] text-faint">{{ t.source }}</span>
            </div>
          </div>
        </div>

        <div class="panel p-5">
          <div class="mb-3 flex items-baseline justify-between">
            <div>
              <p class="eyebrow">Attunement</p>
              <h2 class="heading text-lg">Attuned Items</h2>
            </div>
            <NuxtLink to="/items" class="text-xs text-dim hover:text-gold-light">All items →</NuxtLink>
          </div>
          <AttunementSlots />
        </div>
      </aside>
    </div>
  </div>
</template>
