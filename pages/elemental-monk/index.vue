<script setup lang="ts">
import { character, stats } from '~/data/characters/elemental-monk/character'
import { items } from '~/data/characters/elemental-monk/items'
import { rulesPath, rulesets } from '~/data/campaign'

useHead({ title: `${character.name} — Character Sheet` })

const vitals = [
  { label: 'Armor Class', short: 'AC', value: String(character.ac.total), sub: 'DEX + WIS + cloak' },
  { label: 'Hit Points', short: 'HP', value: String(character.maxHp), sub: character.hitDice },
  { label: 'Initiative', short: 'Init', value: signed(stats.initiative), sub: 'DEX' },
  { label: 'Speed', short: 'Speed', value: String(character.speed), sub: 'ft · 80 with a Dash' },
  { label: 'Proficiency', short: 'Prof', value: signed(character.proficiencyBonus), sub: `Level ${character.level}` },
  { label: 'Focus Points', short: 'Focus', value: String(stats.focus), sub: `DC ${stats.focusDc} · short rest` },
  { label: 'Martial Arts', short: 'Die', value: stats.martialDie, sub: 'Rerolls 1s' },
  { label: 'Reach', short: 'Reach', value: `${stats.reach.attuned}`, sub: 'ft attuned, own turn' }
]

const strike = `${stats.strike.replace('+', ' + ')}`
const attacks = [
  {
    name: 'Unarmed Strike',
    to: '/elemental-monk/techniques/martial-arts',
    meta: `Attack action · reach ${stats.reach.ownTurn} ft on their turn, ${stats.reach.attuned} ft attuned`,
    hit: signed(stats.strikeAttack),
    damage: `${strike} bludgeoning, or an element`
  },
  {
    name: 'Bonus strike',
    to: '/elemental-monk/techniques/martial-arts',
    meta: 'Bonus action · free',
    hit: signed(stats.strikeAttack),
    damage: strike
  },
  {
    name: 'Flurry of Blows',
    to: '/elemental-monk/techniques/flurry-of-blows',
    meta: 'Bonus action · 1 Focus Point: two strikes',
    hit: signed(stats.strikeAttack),
    damage: `${strike} each`
  },
  { name: 'Surprise Attack', to: '/elemental-monk/techniques/surprise-attack', meta: 'On a hit, against a creature that hasn’t acted yet in the fight', hit: '—', damage: `+${stats.surprise}` },
  { name: 'Elemental Strikes', to: '/elemental-monk/techniques/elemental-attunement', meta: 'While attuned, on a hit dealing an element', hit: '—', damage: `STR DC ${stats.focusDc} or moved 10 ft` },
  { name: 'Dagger', meta: 'Monk weapon · melee, or thrown 20/60 ft', hit: signed(stats.weaponAttack), damage: `${strike} piercing` }
]

const attuned = items.filter(i => i.group === 'owned' && i.attunement)
const freeSlots = Math.max(0, character.attunementMax - attuned.length)

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
    <!-- Who they are, and every number that matters at a glance -->
    <section class="panel relative overflow-hidden">
      <svg class="pointer-events-none absolute -right-20 -top-20 h-[480px] w-[480px] text-jade opacity-[0.08]" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="0.7" aria-hidden="true">
        <path d="M30 150c16-6 28-22 34-44 10-36 40-56 70-50 25 5 37 28 28 48-7 16-25 23-38 15-12-7-12-22-2-27 7-3 13 0 13 7" />
        <circle cx="100" cy="100" r="96" stroke-dasharray="2 4" />
        <circle cx="100" cy="100" r="88" />
      </svg>
      <div class="relative grid grid-cols-1 gap-6 p-5 sm:p-8 2xl:grid-cols-[minmax(0,1fr)_minmax(0,46rem)] 2xl:items-center">
        <div class="flex items-center gap-5 sm:gap-8">
          <NuxtLink to="/elemental-monk/lore" class="group block w-24 shrink-0 overflow-hidden rounded-2xl border border-jade/40 shadow-panel sm:w-40 lg:w-48" aria-label="Story and appearance">
            <ElementalMonkEmblem class="transition duration-500 group-hover:scale-[1.03]" />
          </NuxtLink>
          <div class="min-w-0">
            <p class="eyebrow">Level {{ character.level }} {{ character.species }} {{ character.className }} · {{ character.subclass }}</p>
            <h1 class="mt-2 font-display text-[2.1rem] font-bold leading-[0.95] tracking-wide sm:text-6xl">
              <span class="text-gilded">{{ character.name }}</span>
            </h1>
            <p class="mt-2 font-serif text-lg italic text-dim sm:text-xl">{{ character.epithet }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5 [&>.chip]:whitespace-normal">
              <span class="chip border-jade/50 text-jade">Concept · name to come</span>
              <span class="chip">{{ character.background }} · {{ character.backgroundDetail }}</span>
              <span class="chip border-jade/40 text-jade">Sword Mountains expedition</span>
              <NuxtLink :to="rulesPath(character.ruleset)" class="chip transition hover:border-gold/50 hover:text-gold-light">{{ rulesets[character.ruleset].name }} rules</NuxtLink>
              <NuxtLink to="/rules?ruleset=2024#elemental-monk" class="chip border-topaz/40 text-topaz transition hover:border-topaz">Bugbear: pending the DM</NuxtLink>
            </div>
            <p class="lore mt-4 hidden max-w-2xl sm:block">{{ character.concept }}</p>
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
          <AbilityGrid :stats="stats.abilities" highlight="dex" />
          <p class="text-[10.5px] text-faint">Big numbers are ability checks; gold saves are proficient. Saves and AC include the Cloak of Protection’s +1, if the DM says yes.</p>
        </div>
      </div>
    </section>

    <nav class="scrollbar-none -mx-[var(--gutter)] mt-6 flex gap-2 overflow-x-auto px-[var(--gutter)]" aria-label="Sheet sections">
      <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="chip shrink-0 px-3 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light">{{ s.label }}</a>
    </nav>

    <div class="mt-6 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div class="space-y-5">
        <section id="combat" class="panel scroll-mt-24 p-5">
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
                  <NuxtLink v-if="a.to" :to="a.to" class="font-semibold text-parchment hover:text-gold-light">{{ a.name }}</NuxtLink>
                  <span v-else class="font-semibold text-parchment">{{ a.name }}</span>
                  <div class="text-[11px] text-faint">{{ a.meta }}</div>
                </td>
                <td class="stat-num whitespace-nowrap px-2 py-2 text-center text-lg">{{ a.hit }}</td>
                <td class="py-2 pl-2 text-gold-light">{{ a.damage }}</td>
              </tr>
            </tbody>
          </table>
          <p class="mt-2 text-[11.5px] leading-relaxed text-faint">
            Elemental Attunement costs a Focus Point at the start of their turn and lasts 10 minutes: strikes reach {{ stats.reach.attuned }} ft on their own turn ({{ stats.reach.attunedOff }} ft for opportunity attacks) and deal acid, cold, fire, lightning or thunder. Tavern Brawler rerolls 1s on the Martial Arts die and pushes 5 ft once a turn on an Attack-action hit. Grapple and Shove: DC {{ stats.grappleDc }}.
          </p>
        </section>

        <section id="defenses" class="panel scroll-mt-24 p-5">
          <h2 class="heading mb-3 text-lg">Armor &amp; Defenses</h2>
          <p class="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[12.5px]">
            <template v-for="(b, n) in character.ac.breakdown" :key="b.label">
              <span v-if="n" class="text-faint">+</span>
              <span><span class="tabular-nums text-parchment">{{ b.value }}</span> <span class="text-dim">{{ b.label }}</span></span>
            </template>
            <span class="text-faint">=</span>
            <span class="font-semibold text-gold-light">AC {{ character.ac.total }}</span>
            <span class="text-faint">· 19 with DEX 20 at level 4</span>
          </p>
          <dl class="mt-3 space-y-1.5 border-t border-obsidian-600 pt-3 text-[13px]">
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Deflect</dt>
              <dd class="text-parchment">Reaction to a weapon hit: <span class="tabular-nums">{{ stats.deflect.replace('+', ' + ') }}</span> less damage; at 0, a Focus Point sends <span class="tabular-nums">{{ stats.redirect.replace('+', ' + ') }}</span> back <span class="text-faint">(DEX DC {{ stats.focusDc }})</span></dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Saves</dt>
              <dd class="text-parchment">Advantage against being charmed <span class="text-faint">(Fey Ancestry)</span>. +1 to every save <span class="text-faint">(the cloak)</span>.</dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Dodge</dt>
              <dd class="text-parchment">Patient Defense: Disengage free, Dodge too for a Focus Point <span class="text-faint">(bonus action)</span></dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Later</dt>
              <dd class="text-parchment">Slow Fall at 4, Evasion at 7, Self-Restoration at 10.</dd>
            </div>
          </dl>
        </section>
      </div>

      <section id="skills" class="panel scroll-mt-24 p-5">
        <h2 class="heading text-lg">Skills &amp; Senses</h2>
        <p class="mb-3 mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-faint">
          <span class="flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-gold" /> proficient</span>
        </p>
        <ul class="grid grid-cols-2 gap-x-4 text-[13px] sm:grid-cols-3 md:grid-cols-2">
          <li
            v-for="s in stats.skills"
            :key="s.name"
            class="flex items-center gap-2 py-0.5"
            :title="s.source ? `Proficient — ${s.source}` : `${s.name} (${s.ability.toUpperCase()})`"
          >
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
            <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
            <span class="ml-auto tabular-nums" :class="s.proficient ? 'text-gold-light' : 'text-dim'">{{ signed(s.bonus) }}</span>
          </li>
        </ul>
        <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-obsidian-600 pt-3 text-[12.5px]">
          <div class="flex justify-between gap-2"><dt class="text-faint">Darkvision</dt><dd class="tabular-nums text-parchment">{{ character.darkvision }} ft</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Perception</dt><dd class="tabular-nums text-parchment">{{ stats.passive.perception }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Insight</dt><dd class="tabular-nums text-parchment">{{ stats.passive.insight }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Investigation</dt><dd class="tabular-nums text-parchment">{{ stats.passive.investigation }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Squeeze</dt><dd class="text-parchment">Small spaces</dd></div>
        </dl>
      </section>

      <div class="grid items-start gap-5 md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
        <section class="panel p-5">
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
            <div class="flex gap-3">
              <dt class="w-28 shrink-0 text-faint">Masteries</dt>
              <dd class="text-dim">None: the 2024 Monk has no Weapon Mastery</dd>
            </div>
          </dl>
        </section>

        <section id="attunement" class="panel scroll-mt-24 p-5">
          <div class="mb-2 flex items-baseline justify-between gap-3">
            <h2 class="heading text-lg">Attuned Items</h2>
            <NuxtLink to="/elemental-monk/items" class="text-xs text-dim hover:text-gold-light">All items →</NuxtLink>
          </div>
          <ul class="grid gap-x-4 text-[13px] sm:grid-cols-2 md:grid-cols-1">
            <li v-for="i in attuned" :key="i.slug">
              <NuxtLink :to="`/elemental-monk/items/${i.slug}`" class="flex items-center gap-2.5 py-0.5 text-parchment transition hover:text-gold-light">
                <span class="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />
                <span class="truncate">{{ i.name }}</span>
                <span class="text-[11px] text-topaz">pending the DM</span>
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
      <SectionHeading id="features" title="Feats &amp; Features">
        <NuxtLink to="/elemental-monk/levels" class="text-xs text-dim hover:text-gold-light">Level history →</NuxtLink>
      </SectionHeading>
      <div class="grid items-start gap-6 lg:grid-cols-2">
        <div>
          <h3 class="eyebrow mb-2 text-dim">Feat</h3>
          <FeatureList :features="character.feats" levels="/elemental-monk/levels" />
        </div>
        <div>
          <h3 class="eyebrow mb-2 text-dim">Class, Subclass &amp; Species</h3>
          <FeatureList :features="character.features" levels="/elemental-monk/levels" />
        </div>
      </div>
    </section>
  </div>
</template>
