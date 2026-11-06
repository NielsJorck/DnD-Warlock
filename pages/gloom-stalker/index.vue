<script setup lang="ts">
import { character, stats } from '~/data/characters/gloom-stalker/character'
import { items } from '~/data/characters/gloom-stalker/items'
import { rulesPath, rulesets } from '~/data/campaign'

useHead({ title: `${character.name} — Character Sheet` })

const vitals = [
  { label: 'Armor Class', short: 'AC', value: String(character.ac.total), sub: 'Studded leather + DEX' },
  { label: 'Hit Points', short: 'HP', value: String(character.maxHp), sub: character.hitDice },
  { label: 'Initiative', short: 'Init', value: signed(stats.initiative), sub: 'DEX + WIS + Alert' },
  { label: 'Speed', short: 'Speed', value: String(character.speed), sub: `ft · ${character.speed + 10} on the first turn` },
  { label: 'Longbow', short: 'Bow', value: signed(stats.bowAttack), sub: `1d8 + ${stats.bowDamage} · Archery` },
  { label: 'Spell Save DC', short: 'DC', value: String(stats.spellDc), sub: `Spell attack ${signed(stats.spellAttack)}` },
  { label: 'Proficiency', short: 'Prof', value: signed(character.proficiencyBonus), sub: `Level ${character.level}` },
  { label: 'Spell Slots', short: 'Slots', value: character.slots.join('·'), sub: '1st level', small: true }
]

const attacks = [
  { name: 'Longbow', to: '/gloom-stalker/items/bracers-of-archery', meta: '150/600 ft · two-handed · Slow mastery', hit: signed(stats.bowAttack), damage: `1d8 + ${stats.bowDamage} piercing` },
  { name: 'Hunter’s Mark', to: '/gloom-stalker/spells/hunters-mark', meta: 'Bonus action · on the marked quarry', hit: '—', damage: '+1d6 force on every hit' },
  { name: 'Dreadful Strike', to: '/gloom-stalker/session#attacks', meta: `Once a turn on a weapon hit · ${stats.dreadfulUses} / long rest`, hit: '—', damage: '+2d6 psychic' },
  { name: 'Shortsword', meta: 'Finesse, light · the first blade', hit: signed(stats.bladeAttack), damage: `1d6 + ${stats.bladeDamage} piercing` },
  { name: 'Scimitar', meta: 'Nick: its extra attack is part of the Attack action', hit: signed(stats.bladeAttack), damage: '1d6 slashing, no modifier' },
  { name: 'Shortbow', meta: 'The spare · 80/320 ft', hit: signed(stats.bowAttack), damage: `1d6 + ${stats.bowDamage} piercing` }
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
      <svg class="pointer-events-none absolute -right-20 -top-20 h-[480px] w-[480px] text-sapphire opacity-[0.08]" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="0.7" aria-hidden="true">
        <path d="M118 30a70 70 0 1 0 0 140a88 88 0 0 1 0-140z" />
        <circle cx="100" cy="100" r="96" stroke-dasharray="2 4" />
        <circle cx="100" cy="100" r="88" />
        <path d="M40 160 160 40M160 40l-16 3M160 40l-3 16" />
      </svg>
      <div class="relative grid grid-cols-1 gap-6 p-5 sm:p-8 2xl:grid-cols-[minmax(0,1fr)_minmax(0,46rem)] 2xl:items-center">
        <div class="flex items-center gap-5 sm:gap-8">
          <NuxtLink to="/gloom-stalker/lore" class="group block w-24 shrink-0 overflow-hidden rounded-2xl border border-sapphire/40 shadow-panel sm:w-40 lg:w-48" aria-label="Story and appearance">
            <div class="aspect-[3/4] w-full transition duration-500 group-hover:scale-[1.03]"><GloomStalkerEmblem /></div>
          </NuxtLink>
          <div class="min-w-0">
            <p class="eyebrow">Level {{ character.level }} {{ character.species }} {{ character.className }} · {{ character.subclass }}</p>
            <h1 class="mt-2 font-display text-[2.1rem] font-bold leading-[0.95] tracking-wide sm:text-6xl">
              <span class="text-gilded">{{ character.name }}</span>
            </h1>
            <p class="mt-2 font-serif text-lg italic text-dim sm:text-xl">{{ character.epithet }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5 [&>.chip]:whitespace-normal">
              <span class="chip border-sapphire/50 text-sapphire">Concept · name to come</span>
              <span class="chip">{{ character.background }} · {{ character.backgroundDetail }}</span>
              <NuxtLink :to="rulesPath(character.ruleset)" class="chip transition hover:border-gold/50 hover:text-gold-light">{{ rulesets[character.ruleset].name }} rules</NuxtLink>
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
              <dd class="stat-num leading-tight" :class="v.small ? 'whitespace-nowrap py-[3px] text-[13px] tracking-tight sm:py-0.5 sm:text-xl' : 'text-xl sm:text-2xl'">{{ v.value }}</dd>
              <dd class="hidden truncate text-[10.5px] text-faint sm:block">{{ v.sub }}</dd>
            </div>
          </dl>
          <AbilityGrid :stats="stats.abilities" highlight="dex" />
          <p class="text-[10.5px] text-faint">Big numbers are ability checks; gold saves are proficient. Wisdom casts their spells. Bow damage includes the Bracers of Archery’s +2, pending the DM.</p>
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
            The opening shot with the mark and Dreadful Strike averages about 21. In darkness, against anything relying on darkvision, every arrow has advantage. Two arrows a turn from level 5.
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
            <span class="text-faint">· no Stealth penalty</span>
          </p>
          <dl class="mt-3 space-y-1.5 border-t border-obsidian-600 pt-3 text-[13px]">
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">In the dark</dt>
              <dd class="text-parchment">Invisible to creatures relying on darkvision while entirely in darkness: their attacks have disadvantage <span class="text-faint">(Umbral Sight)</span></dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Saves</dt>
              <dd class="text-parchment">Proficient in Strength and Dexterity. Wisdom saves come at level 7 <span class="text-faint">(Iron Mind)</span>.</dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Resistances</dt>
              <dd class="text-dim">None</dd>
            </div>
          </dl>
        </section>
      </div>

      <section id="skills" class="panel scroll-mt-24 p-5">
        <h2 class="heading text-lg">Skills &amp; Senses</h2>
        <p class="mb-3 mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-faint">
          <span class="flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-gold" /> proficient</span>
          <span class="flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-gold/30" /> <span class="text-gold">exp</span> expertise</span>
        </p>
        <ul class="grid grid-cols-2 gap-x-4 text-[13px] sm:grid-cols-3 md:grid-cols-2">
          <li
            v-for="s in stats.skills"
            :key="s.name"
            class="flex items-center gap-2 py-0.5"
            :title="s.source ? `Proficient — ${s.source}${s.expertiseFrom ? ` · expertise from ${s.expertiseFrom}` : ''}` : `${s.name} (${s.ability.toUpperCase()})`"
          >
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.expertise ? 'bg-gold ring-2 ring-gold/30' : s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
            <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
            <span v-if="s.expertise" class="text-[10px] text-gold">exp</span>
            <span class="ml-auto tabular-nums" :class="s.proficient ? 'text-gold-light' : 'text-dim'">{{ signed(s.bonus) }}</span>
          </li>
        </ul>
        <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-obsidian-600 pt-3 text-[12.5px]">
          <div class="flex justify-between gap-2"><dt class="text-faint" title="From Umbral Sight">Darkvision</dt><dd class="tabular-nums text-parchment">{{ character.darkvision }} ft</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Perception</dt><dd class="tabular-nums text-parchment">{{ stats.passive.perception }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Insight</dt><dd class="tabular-nums text-parchment">{{ stats.passive.insight }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint">Passive Investigation</dt><dd class="tabular-nums text-parchment">{{ stats.passive.investigation }}</dd></div>
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
              <dt class="w-28 shrink-0 text-faint">Mastery</dt>
              <dd class="text-parchment">
                <template v-for="(m, n) in character.weaponMastery" :key="m.weapon">{{ n ? ', ' : '' }}<span :title="m.effect">{{ m.weapon }} ({{ m.mastery }})</span></template>
              </dd>
            </div>
          </dl>
        </section>

        <section id="attunement" class="panel scroll-mt-24 p-5">
          <div class="mb-2 flex items-baseline justify-between gap-3">
            <h2 class="heading text-lg">Attuned Items</h2>
            <NuxtLink to="/gloom-stalker/items" class="text-xs text-dim hover:text-gold-light">All items →</NuxtLink>
          </div>
          <ul class="grid gap-x-4 text-[13px] sm:grid-cols-2 md:grid-cols-1">
            <li v-for="i in attuned" :key="i.slug">
              <NuxtLink :to="`/gloom-stalker/items/${i.slug}`" class="flex items-center gap-2.5 py-0.5 text-parchment transition hover:text-gold-light">
                <span class="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />
                <span class="truncate">{{ i.name }}</span>
                <span class="text-[10.5px] text-topaz">pending the DM</span>
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
        <NuxtLink to="/gloom-stalker/levels" class="text-xs text-dim hover:text-gold-light">Level history →</NuxtLink>
      </SectionHeading>
      <div class="grid items-start gap-6 lg:grid-cols-2">
        <div>
          <h3 class="eyebrow mb-2 text-dim">Feats</h3>
          <FeatureList :features="character.feats" levels="/gloom-stalker/levels" />
        </div>
        <div>
          <h3 class="eyebrow mb-2 text-dim">Class, Subclass &amp; Species</h3>
          <FeatureList :features="character.features" levels="/gloom-stalker/levels" />
        </div>
      </div>
    </section>
  </div>
</template>
