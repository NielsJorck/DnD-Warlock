<script setup lang="ts">
import { character, lesserDao } from '~/data/character'
import { items } from '~/data/items'
import { appearance } from '~/data/lore'

useHead({ title: 'Lucan Beryll — Character Sheet' })

// Every number appears once on the sheet: here, in the attacks table, or under Defenses and Skills
const vitals = [
  { label: 'Armor Class', short: 'AC', value: String(character.ac.total), sub: 'Golden Pact + Bracers' },
  { label: 'Hit Points', short: 'HP', value: String(character.maxHp), sub: character.hitDice },
  { label: 'Spell Save DC', short: 'DC', value: String(derived.spellDc), sub: `${derived.spellDcBase} + ${character.itemBonuses.spell} ${character.itemBonuses.spellSource}` },
  { label: 'Spell Attack', short: 'Atk', value: signed(derived.spellAttack), sub: `${signed(derived.spellAttackBase)} + ${character.itemBonuses.spell} ${character.itemBonuses.spellSource}` },
  { label: 'Initiative', short: 'Init', value: signed(derived.initiative), sub: 'DEX + Stone' },
  { label: 'Speed', short: 'Speed', value: `${character.speed}`, sub: 'ft · fly 30 (Gift)' },
  { label: 'Proficiency', short: 'Prof', value: signed(character.proficiencyBonus), sub: `Level ${character.level}` },
  { label: 'Pact Slots', short: 'Slots', value: `${character.pactSlots.count}×5th`, sub: `Short rest · +${character.savantSlot.count} Savant` }
]

// +1 magic dagger, finesse: DEX (higher than STR) + proficiency (simple weapons)
const daggerHit = abilityMod('dex') + character.proficiencyBonus + 1
const daggerMod = abilityMod('dex') + 1
const attacks = [
  {
    name: 'Eldritch Blast',
    to: '/spells/eldritch-blast',
    meta: `120 ft · ${derived.eldritchBeams} beams`,
    hit: derived.spellAttack,
    damage: `1d10 + ${derived.agonizing} force each`
  },
  {
    name: 'Crystal Dagger',
    to: '/items/pact-keepers-crystal-dagger',
    meta: 'Finesse · thrown 30 ft, returns',
    hit: daggerHit,
    damage: `1d4 + ${daggerMod} piercing, 2d4 force, 2d4 bludgeoning`
  },
  {
    name: 'Lesser Dao form',
    to: '/lesser-dao',
    meta: `Two a turn · ${lesserDao.uses} / long rest`,
    hit: lesserDao.attacks[0].toHit,
    damage: lesserDao.attacks.slice(0, 2).map(a => `${a.name} ${a.damage.replace('+', ' + ')}`).join(' · ')
  }
]

// "Cold (Sash of Summer)" → name and where it comes from
const resistances = character.resistances.map(r => {
  const [name, source] = r.replace(')', '').split(' (')
  return { name, source }
})

const attuned = items.filter(i => i.group === 'owned' && i.attunement)
const freeSlots = Math.max(0, character.attunement.max - attuned.length)

const sections = [
  { id: 'combat', label: 'Attacks' },
  { id: 'defenses', label: 'Defenses' },
  { id: 'skills', label: 'Skills' },
  { id: 'attunement', label: 'Attunement' },
  { id: 'features', label: 'Features' }
]
</script>

<template>
  <div>
    <!-- Who he is, and every number that matters at a glance -->
    <section class="panel relative overflow-hidden">
      <svg class="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] text-gold opacity-[0.07]" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="0.6" aria-hidden="true">
        <path d="M100 10 180 70 100 190 20 70Z" />
        <path d="M20 70h160M60 70l40-60 40 60-40 120Z" />
        <path d="M60 70 100 190M140 70 100 190" />
        <circle cx="100" cy="100" r="96" stroke-dasharray="2 4" />
        <circle cx="100" cy="100" r="88" />
      </svg>
      <div class="relative grid grid-cols-1 gap-6 p-5 sm:p-8 2xl:grid-cols-[minmax(0,1fr)_minmax(0,46rem)] 2xl:items-center">
        <div class="flex items-center gap-5 sm:gap-8">
          <NuxtLink to="/lore" class="group block w-24 shrink-0 overflow-hidden rounded-2xl border border-gold/30 shadow-panel sm:w-40 lg:w-48">
            <img :src="publicPath(appearance.portrait.src)" :alt="appearance.portrait.alt" class="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          </NuxtLink>
          <div class="min-w-0">
            <p class="eyebrow">Level {{ character.level }} {{ character.race }} {{ character.className }} · {{ character.subclass }}</p>
            <h1 class="mt-2 font-display text-[2.1rem] font-bold leading-[0.95] tracking-wide sm:text-6xl">
              <span class="text-gilded">Lucan Beryll</span>
            </h1>
            <p class="mt-2 font-serif text-lg italic text-dim sm:text-xl">{{ character.epithet }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5 [&>.chip]:whitespace-normal">
              <span class="chip border-gold/40 text-gold-light">{{ character.pact }}</span>
              <span class="chip">Patron · {{ character.patron }}</span>
              <span class="chip">{{ character.background }} · {{ character.backgroundDetail }}</span>
            </div>
            <p class="lore mt-4 hidden max-w-2xl sm:block">{{ character.identity.summary }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <dl class="grid grid-cols-4 gap-1.5 lg:grid-cols-8 2xl:grid-cols-4">
            <div v-for="v in vitals" :key="v.label" class="min-w-0 rounded-lg border border-obsidian-600 bg-obsidian-950/70 px-2.5 py-2 sm:px-3" :title="`${v.label}: ${v.sub}`">
              <dt class="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-dim">
                <span class="sm:hidden">{{ v.short }}</span><span class="hidden sm:inline">{{ v.label }}</span>
              </dt>
              <dd class="stat-num text-xl leading-tight sm:text-2xl">{{ v.value }}</dd>
              <dd class="hidden truncate text-[10.5px] text-faint sm:block">{{ v.sub }}</dd>
            </div>
          </dl>
          <AbilityGrid />
          <p class="text-[10.5px] text-faint">Big numbers are ability checks. Checks and saves include the Stone of Good Luck’s +1; gold saves are proficient.</p>
        </div>
      </div>
    </section>

    <nav class="scrollbar-none -mx-[var(--gutter)] mt-6 flex gap-2 overflow-x-auto px-[var(--gutter)]" aria-label="Sheet sections">
      <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="chip shrink-0 px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">{{ s.label }}</a>
    </nav>

    <!-- What gets looked up most sits above the features -->
    <div class="mt-6 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div class="space-y-5">
        <section id="combat" class="panel scroll-mt-24 p-5">
          <p class="eyebrow">How Lucan fights</p>
          <h2 class="heading mb-2 text-lg">Attacks</h2>
          <table class="w-full text-left text-[13px]">
            <thead class="border-b border-obsidian-600 text-[10px] uppercase tracking-[0.14em] text-faint">
              <tr>
                <th class="py-2 pr-3 font-semibold">Attack</th>
                <th class="px-2 py-2 text-center font-semibold">Hit</th>
                <th class="py-2 pl-2 font-semibold">Damage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-obsidian-600/60">
              <tr v-for="a in attacks" :key="a.name" class="align-top">
                <td class="py-2 pr-3">
                  <NuxtLink :to="a.to" class="font-semibold text-parchment hover:text-gold-light">{{ a.name }}</NuxtLink>
                  <div class="text-[11px] text-faint">{{ a.meta }}</div>
                </td>
                <td class="stat-num px-2 py-2 text-center text-lg">{{ signed(a.hit) }}</td>
                <td class="py-2 pl-2 text-gold-light">{{ a.damage }}</td>
              </tr>
            </tbody>
          </table>
          <p class="mt-2 text-[11.5px] leading-relaxed text-faint">
            Eldritch Blast and the dagger: Genie’s Wrath adds +{{ derived.genieWrath }} bludgeoning to the first hit each turn, which also lets Crusher move the target.
          </p>
        </section>

        <section id="defenses" class="panel scroll-mt-24 p-5">
          <p class="eyebrow">Defenses</p>
          <h2 class="heading mb-3 text-lg">Armor &amp; Resistances</h2>
          <p class="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[12.5px]">
            <template v-for="(b, n) in character.ac.breakdown" :key="b.label">
              <span v-if="n" class="text-faint">+</span>
              <span><span class="tabular-nums text-parchment">{{ b.value }}</span> <span class="text-dim">{{ b.label.replace(/^The /, '') }}</span></span>
            </template>
            <span class="text-faint">=</span>
            <span class="font-semibold text-gold-light">AC {{ character.ac.total }}</span>
          </p>
          <dl class="mt-3 space-y-1.5 border-t border-obsidian-600 pt-3 text-[13px]">
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Resistances</dt>
              <dd class="text-parchment">
                <template v-for="(r, n) in resistances" :key="r.name">{{ n ? ', ' : '' }}{{ r.name }} <span class="text-faint">({{ r.source }})</span></template>
              </dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Climate</dt>
              <dd class="text-parchment">Unbothered by extreme heat or cold <span class="text-faint">(<NuxtLink to="/items/sash-of-summer" class="hover:text-gold-light">Sash of Summer</NuxtLink>)</span></dd>
            </div>
          </dl>
        </section>
      </div>

      <section id="skills" class="panel scroll-mt-24 p-5">
        <p class="eyebrow">Skills</p>
        <h2 class="heading text-lg">Skills &amp; Senses</h2>
        <p class="mb-3 mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-faint">
          <span class="flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-gold" /> proficient</span>
          <span class="flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-gold/40" /> expertise</span>
          <span>Stone of Good Luck included</span>
        </p>
        <ul class="grid grid-cols-2 gap-x-4 text-[13px] sm:grid-cols-3 md:grid-cols-2">
          <li
            v-for="s in skillList"
            :key="s.name"
            class="flex items-center gap-2 py-0.5"
            :title="s.source ? `${s.expertise ? 'Expertise' : 'Proficient'} — ${s.source}` : `${s.name} (${s.ability.toUpperCase()})`"
          >
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.expertise ? 'bg-gold ring-2 ring-gold/40' : s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
            <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
            <span class="ml-auto tabular-nums" :class="s.proficient ? 'text-gold-light' : 'text-dim'">{{ signed(s.bonus) }}</span>
          </li>
        </ul>
        <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-obsidian-600 pt-3 text-[12.5px]">
          <div class="flex justify-between gap-2"><dt class="text-faint">Darkvision</dt><dd class="tabular-nums text-parchment">{{ character.darkvision }} ft</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Perception</dt><dd class="tabular-nums text-parchment">{{ derived.passivePerception }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Insight</dt><dd class="tabular-nums text-parchment">{{ derived.passiveInsight }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Investigation</dt><dd class="tabular-nums text-parchment">{{ derived.passiveInvestigation }}</dd></div>
        </dl>
      </section>

      <div class="grid items-start gap-5 md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
        <section class="panel p-5">
          <p class="eyebrow">Tongues &amp; tools</p>
          <h2 class="heading mb-3 text-lg">Languages &amp; Tools</h2>
          <dl class="space-y-1.5 text-[13px]">
            <div class="flex gap-3">
              <dt class="w-28 shrink-0 text-faint">Languages</dt>
              <dd class="text-parchment">
                <template v-for="(l, n) in character.languages" :key="l.name">{{ n ? ', ' : '' }}<span :title="l.note">{{ l.name }}</span></template>
              </dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-28 shrink-0 text-faint">Tools</dt>
              <dd class="text-parchment">
                <template v-for="(t, n) in character.toolProficiencies" :key="t.name">{{ n ? ', ' : '' }}<span :title="t.source">{{ t.name }}</span></template>
              </dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-28 shrink-0 text-faint">Armor, weapons</dt>
              <dd class="text-parchment">{{ character.armorWeapons }}</dd>
            </div>
          </dl>
        </section>

        <section id="attunement" class="panel scroll-mt-24 p-5">
          <div class="mb-2 flex items-baseline justify-between gap-3">
            <div>
              <p class="eyebrow">Attunement · {{ attuned.length }} / {{ character.attunement.max }}</p>
              <h2 class="heading text-lg">Attuned Items</h2>
            </div>
            <NuxtLink to="/items" class="text-xs text-dim hover:text-gold-light">All items →</NuxtLink>
          </div>
          <ul class="grid gap-x-4 text-[13px] sm:grid-cols-2 md:grid-cols-1">
            <li v-for="i in attuned" :key="i.slug">
              <NuxtLink :to="`/items/${i.slug}`" class="flex items-center gap-2.5 py-0.5 text-parchment transition hover:text-gold-light">
                <span class="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />
                <span class="truncate">{{ i.name }}</span>
              </NuxtLink>
            </li>
            <li v-for="n in freeSlots" :key="`free-${n}`" class="flex items-center gap-2.5 py-0.5 text-faint">
              <span class="h-1.5 w-1.5 shrink-0 rotate-45 border border-obsidian-500" />
              Free slot
            </li>
          </ul>
        </section>
      </div>
    </div>

    <section class="mt-10">
      <SectionHeading id="features" eyebrow="Build" title="Feats, Invocations &amp; Features">
        <NuxtLink to="/levels" class="text-xs text-dim hover:text-gold-light">Level by level →</NuxtLink>
      </SectionHeading>
      <div class="grid items-start gap-6 lg:grid-cols-2">
        <div class="space-y-6">
          <div>
            <h3 class="eyebrow mb-2 text-dim">Feats</h3>
            <FeatureList :features="character.feats" />
          </div>
          <div>
            <h3 class="eyebrow mb-2 text-dim">Eldritch Invocations</h3>
            <FeatureList :features="character.invocations" />
          </div>
        </div>
        <div>
          <h3 class="eyebrow mb-2 text-dim">Class, Patron &amp; Race Features</h3>
          <FeatureList :features="character.features" />
        </div>
      </div>
    </section>
  </div>
</template>
