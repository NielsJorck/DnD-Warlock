<script setup lang="ts">
import { character, stats } from '~/data/characters/tempest/character'
import { items } from '~/data/characters/tempest/items'
import { appearance } from '~/data/characters/tempest/lore'
import { rulesPath, rulesets } from '~/data/campaign'

useHead({ title: `${character.name} — Character Sheet` })

const dc = `DC ${stats.spellDc}`
const vitals = [
  { label: 'Armor Class', short: 'AC', value: String(character.ac.total), sub: `Plate + shield · ${character.ac.withPlus2} if +2` },
  { label: 'Hit Points', short: 'HP', value: String(character.maxHp), sub: character.hitDice },
  { label: 'Spell Save DC', short: 'DC', value: String(stats.spellDc), sub: `${stats.spellDcBase} + ${character.itemBonuses.spell} ${character.itemBonuses.spellSource}` },
  { label: 'Spell Attack', short: 'Atk', value: signed(stats.spellAttack), sub: `${signed(stats.spellAttackBase)} + ${character.itemBonuses.spell} ${character.itemBonuses.spellSource}` },
  { label: 'Initiative', short: 'Init', value: signed(stats.initiative), sub: 'Advantage (Sentinel Shield)' },
  { label: 'Speed', short: 'Speed', value: String(character.speed), sub: `ft · ${character.speed * 2} with the boots` },
  { label: 'Proficiency', short: 'Prof', value: signed(character.proficiencyBonus), sub: `Level ${character.level}` },
  { label: 'Spell Slots', short: 'Slots', value: character.slots.join('·'), sub: '1st to 5th', small: true }
]

const attacks = [
  {
    name: 'Staff of Thunder and Lightning',
    to: '/tempest/items/staff-of-thunder-and-lightning',
    meta: 'One-handed beside the shield · +2 magic',
    hit: signed(stats.staffAttack),
    damage: `1d6 + ${stats.staffDamage} bludgeoning`
  },
  {
    name: 'Booming Blade',
    to: '/tempest/spells/booming-blade',
    meta: 'The staff, as an action · Magic Initiate',
    hit: signed(stats.staffAttack),
    damage: `1d6 + ${stats.staffDamage}, +1d8 thunder · 2d8 thunder if it moves`
  },
  { name: 'Spirit Guardians', to: '/tempest/spells/spirit-guardians', meta: '3rd level · 15-ft aura · halves their speed', hit: `${dc} WIS`, damage: '3d8 radiant, half on a save · +1d8 per slot above 3rd' },
  { name: 'Spiritual Weapon', to: '/tempest/spells/spiritual-weapon', meta: '2nd level · bonus action, 60 ft · 1 minute', hit: signed(stats.spellAttack), damage: `1d8 + ${stats.abilities.wis.check} force` },
  { name: 'Toll the Dead', to: '/tempest/spells/toll-the-dead', meta: '60 ft', hit: `${dc} WIS`, damage: '2d8 necrotic, 2d12 if hurt' },
  { name: 'Word of Radiance', to: '/tempest/spells/word-of-radiance', meta: 'Creatures he picks within 5 ft', hit: `${dc} CON`, damage: '2d6 radiant' },
  { name: 'Wrath of the Storm', meta: `Reaction when hit in melee · ${stats.wrathUses} / long rest`, hit: `${dc} DEX`, damage: '2d8 lightning or thunder, half on a save' },
  { name: 'Shocking Grasp', to: '/tempest/spells/shocking-grasp', meta: 'Magic Initiate (INT) · no reactions after', hit: signed(stats.initiateAttack), damage: '2d8 lightning' }
]

const resistances = [
  { name: 'Lightning', source: 'Stormgirdle' },
  { name: 'Thunder', source: 'Stormgirdle' },
  { name: 'Poison', source: 'Dwarven Resilience' }
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
    <!-- Who he is, and every number that matters at a glance -->
    <section class="panel relative overflow-hidden">
      <svg class="pointer-events-none absolute -right-20 -top-20 h-[480px] w-[480px] text-sapphire opacity-[0.08]" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="0.7" aria-hidden="true">
        <path d="M112 18 70 104h30l-14 78 46-98h-30z" />
        <circle cx="100" cy="100" r="96" stroke-dasharray="2 4" />
        <circle cx="100" cy="100" r="88" />
      </svg>
      <div class="relative grid grid-cols-1 gap-6 p-5 sm:p-8 2xl:grid-cols-[minmax(0,1fr)_minmax(0,46rem)] 2xl:items-center">
        <div class="flex items-center gap-5 sm:gap-8">
          <NuxtLink to="/tempest/lore" class="group block w-24 shrink-0 overflow-hidden rounded-2xl border border-sapphire/40 shadow-panel sm:w-40 lg:w-48">
            <img :src="publicPath(appearance.portrait.src)" :alt="appearance.portrait.alt" class="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          </NuxtLink>
          <div class="min-w-0">
            <p class="eyebrow">Level {{ character.level }} {{ character.race }} {{ character.className }} · {{ character.subclass }}</p>
            <h1 class="mt-2 font-display text-[2.1rem] font-bold leading-[0.95] tracking-wide sm:text-6xl">
              <span class="text-gilded">{{ character.name }}</span>
            </h1>
            <p class="mt-2 font-serif text-lg italic text-dim sm:text-xl">{{ character.epithet }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5 [&>.chip]:whitespace-normal">
              <span class="chip border-sapphire/50 text-sapphire">Concept · name to come</span>
              <span class="chip border-gold/40 text-gold-light">{{ character.deity }}, {{ character.deityTitle }}</span>
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
          <AbilityGrid :stats="stats.abilities" highlight="wis" />
          <p class="text-[10.5px] text-faint">Big numbers are ability checks; gold saves are proficient. STR 21 is the Stormgirdle’s. Spells include the Amulet of the Devout’s +1; AC is plain plate.</p>
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
                <td class="stat-num whitespace-nowrap px-2 py-2 text-center" :class="a.hit.startsWith('DC') ? 'text-[13px]' : 'text-lg'">{{ a.hit }}</td>
                <td class="py-2 pl-2 text-gold-light">{{ a.damage }}</td>
              </tr>
            </tbody>
          </table>
          <p class="mt-2 text-[11.5px] leading-relaxed text-faint">
            Divine Strike adds 1d8 thunder to one weapon hit a turn, Booming Blade included. Lightning damage lets Thunderbolt Strike push 10 ft, and Destructive Wrath can max any lightning or thunder roll.
          </p>
        </section>

        <section id="defenses" class="panel scroll-mt-24 p-5">
          <h2 class="heading mb-3 text-lg">Armor &amp; Resistances</h2>
          <p class="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[12.5px]">
            <template v-for="(b, n) in character.ac.breakdown" :key="b.label">
              <span v-if="n" class="text-faint">+</span>
              <span><span class="tabular-nums text-parchment">{{ b.value }}</span> <span class="text-dim">{{ b.label }}</span></span>
            </template>
            <span class="text-faint">=</span>
            <span class="font-semibold text-gold-light">AC {{ character.ac.total }}</span>
            <span class="text-faint">· {{ character.ac.withPlus2 }} if the plate is +2</span>
          </p>
          <dl class="mt-3 space-y-1.5 border-t border-obsidian-600 pt-3 text-[13px]">
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Resistances</dt>
              <dd class="text-parchment">
                <template v-for="(r, n) in resistances" :key="r.name">{{ n ? ', ' : '' }}{{ r.name }} <span class="text-faint">({{ r.source }})</span></template>
              </dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Saves</dt>
              <dd class="text-parchment">
                Advantage on concentration <span class="text-faint">(War Caster)</span> and against poison <span class="text-faint">(dwarf)</span>. +2 on Dexterity saves against effects that target only him <span class="text-faint">(Shield Master)</span>.
              </dd>
            </div>
            <div class="flex gap-3">
              <dt class="w-24 shrink-0 text-faint">Crits</dt>
              <dd class="text-parchment">Turned into normal hits on him or a friend within 30 ft, 3 a day <span class="text-faint">(Guardian Emblem)</span></dd>
            </div>
          </dl>
        </section>
      </div>

      <section id="skills" class="panel scroll-mt-24 p-5">
        <h2 class="heading text-lg">Skills &amp; Senses</h2>
        <p class="mb-3 mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-faint">
          <span class="flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-gold" /> proficient</span>
          <span class="flex items-center gap-1.5"><span class="text-sapphire">adv</span> advantage</span>
        </p>
        <ul class="grid grid-cols-2 gap-x-4 text-[13px] sm:grid-cols-3 md:grid-cols-2">
          <li
            v-for="s in stats.skills"
            :key="s.name"
            class="flex items-center gap-2 py-0.5"
            :title="s.source ? `Proficient — ${s.source}${s.advantage ? ` · advantage from the ${s.advantage}` : ''}` : `${s.name} (${s.ability.toUpperCase()})`"
          >
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="s.proficient ? 'bg-gold' : 'border border-obsidian-500'" />
            <span class="truncate" :class="s.proficient ? 'font-semibold text-parchment' : 'text-dim'">{{ s.name }}</span>
            <span v-if="s.advantage" class="text-[10px] text-sapphire">adv</span>
            <span class="ml-auto tabular-nums" :class="s.proficient ? 'text-gold-light' : 'text-dim'">{{ signed(s.bonus) }}</span>
          </li>
        </ul>
        <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-obsidian-600 pt-3 text-[12.5px]">
          <div class="flex justify-between gap-2"><dt class="text-faint">Darkvision</dt><dd class="tabular-nums text-parchment">{{ character.darkvision }} ft</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-faint" title="Advantage from the Sentinel Shield adds 5">Passive Perception</dt><dd class="tabular-nums text-parchment">{{ stats.passive.perception }}</dd></div>
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
          </dl>
        </section>

        <section id="attunement" class="panel scroll-mt-24 p-5">
          <div class="mb-2 flex items-baseline justify-between gap-3">
            <h2 class="heading text-lg">Attuned Items</h2>
            <NuxtLink to="/tempest/items" class="text-xs text-dim hover:text-gold-light">All items →</NuxtLink>
          </div>
          <ul class="grid gap-x-4 text-[13px] sm:grid-cols-2 md:grid-cols-1">
            <li v-for="i in attuned" :key="i.slug">
              <NuxtLink :to="`/tempest/items/${i.slug}`" class="flex items-center gap-2.5 py-0.5 text-parchment transition hover:text-gold-light">
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
      <SectionHeading id="features" title="Feats &amp; Features">
        <NuxtLink to="/tempest/levels" class="text-xs text-dim hover:text-gold-light">Level history →</NuxtLink>
      </SectionHeading>
      <div class="grid items-start gap-6 lg:grid-cols-2">
        <div>
          <h3 class="eyebrow mb-2 text-dim">Feats</h3>
          <FeatureList :features="character.feats" levels="/tempest/levels" />
        </div>
        <div>
          <h3 class="eyebrow mb-2 text-dim">Class, Domain, Race &amp; Background</h3>
          <FeatureList :features="character.features" levels="/tempest/levels" />
        </div>
      </div>
    </section>
  </div>
</template>
