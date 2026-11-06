<script setup lang="ts">
import { character, stats } from '~/data/characters/elemental-monk/character'
import { kindTone, techniques, techniqueBySlug, statusLabels, statusTone } from '~/data/characters/elemental-monk/techniques'

const route = useRoute()
const technique = techniqueBySlug[route.params.slug as string]
if (!technique) throw createError({ statusCode: 404, statusMessage: 'Power not found', fatal: true })

useHead({ title: `${technique.name} — ${character.name}’s Techniques` })

const tone = kindTone[technique.kind]
const ordered = [...techniques].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
const idx = ordered.findIndex(p => p.slug === technique.slug)
const prev = ordered[idx - 1]
const next = ordered[idx + 1]
const alsoFrom = { Monk: 'from the Monk', Elements: 'from the Warrior of the Elements', Bugbear: 'from the Bugbear', Feat: 'from the feat' }
const related = techniques.filter(p => p.slug !== technique.slug && p.kind === technique.kind).slice(0, 6)
</script>

<template>
  <div class="mx-auto max-w-4xl xl:max-w-6xl">
    <NuxtLink to="/elemental-monk/techniques" class="text-xs text-dim hover:text-gold-light">← Techniques</NuxtLink>

    <div class="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
      <div class="min-w-0 space-y-6">
        <article class="panel relative overflow-hidden">
          <div class="pointer-events-none absolute -right-6 -top-10 font-display text-[200px] leading-none opacity-[0.08]" :class="tone.text" aria-hidden="true">{{ tone.glyph }}</div>
          <div class="h-1 w-full" :style="{ background: `linear-gradient(90deg, ${tone.hex}, transparent)` }" />

          <div class="relative p-6 sm:p-9">
            <div class="flex flex-wrap items-center gap-2">
              <span class="chip" :class="[tone.border, tone.bg, tone.text]">{{ tone.glyph }} {{ technique.kind }}</span>
              <span class="chip" :class="statusTone[technique.status]">{{ technique.status === 'future' ? `Arrives at level ${technique.level}` : statusLabels[technique.status] }}</span>
              <span v-if="technique.costKind === 'focus'" class="chip border-jade/40 text-jade">{{ technique.cost }}</span>
            </div>
            <h1 class="mt-4 font-display text-4xl font-bold tracking-wide text-parchment sm:text-5xl">{{ technique.name }}</h1>
            <p class="mt-2 font-serif text-xl italic text-dim">{{ technique.role }}</p>

            <div class="mt-6"><ElementalMonkTechniqueStats :technique="technique" /></div>

            <p class="lore mt-6">{{ technique.summary }}</p>

            <ul v-if="technique.options" class="mt-6 divide-y divide-obsidian-600/60 overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-950/60">
              <li v-for="o in technique.options" :key="o.name" class="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-[13.5px]">
                <span class="w-28 shrink-0 font-semibold text-parchment">{{ o.name }}</span>
                <span v-if="o.cost" class="w-28 shrink-0 text-[12px] text-faint">{{ o.cost }}</span>
                <span class="min-w-0 flex-1 text-parchment/85">{{ o.effect }}</span>
              </li>
            </ul>

            <div v-if="technique.grows" class="mt-6 rounded-xl border border-sapphire/30 bg-sapphire/5 p-4">
              <p class="eyebrow mb-1 text-sapphire">On the way to level 12</p>
              <p class="text-parchment">{{ technique.grows }}</p>
            </div>

            <div v-if="technique.notes" class="mt-4 rounded-xl border border-topaz/25 bg-topaz/5 p-4">
              <p class="eyebrow mb-1 text-topaz">In the build</p>
              <p class="text-[14.5px] leading-relaxed text-parchment/85">{{ technique.notes }}</p>
            </div>

            <div v-if="technique.attack || technique.save || technique.dice" class="mt-6 border-t border-obsidian-600 pt-5">
              <div class="flex flex-wrap items-center gap-2">
                <RollButton v-if="technique.attack" :notation="`1d20+${stats.strikeAttack}`" :label="`${technique.name} — attack`">Attack {{ signed(stats.strikeAttack) }}</RollButton>
                <RollButton v-if="technique.dice" :notation="technique.dice" :label="`${technique.name}${technique.damage ? ` · ${technique.damage}` : ''}`">{{ technique.dice }}</RollButton>
                <RollButton v-if="technique.slug === 'deflect-attacks'" :notation="stats.redirect" label="Redirect · DEX save DC 13">Redirect {{ stats.redirect }}</RollButton>
                <span v-if="technique.save" class="chip px-3 py-1 text-xs">{{ technique.save }}</span>
                <span v-if="technique.damage" class="text-xs text-faint">{{ technique.damage }}</span>
              </div>
            </div>
          </div>
        </article>

        <ElementalMonkTactics v-if="technique.slug === 'elemental-attunement'" />
      </div>

      <aside class="space-y-8 xl:sticky xl:top-24 xl:self-start">
        <nav class="grid grid-cols-2 gap-3" aria-label="Adjacent techniques">
          <NuxtLink v-if="prev" :to="`/elemental-monk/techniques/${prev.slug}`" class="panel px-4 py-3 transition hover:border-gold/40">
            <span class="text-[11px] text-faint">← Previous</span>
            <span class="block truncate font-display text-parchment">{{ prev.name }}</span>
          </NuxtLink>
          <span v-else />
          <NuxtLink v-if="next" :to="`/elemental-monk/techniques/${next.slug}`" class="panel px-4 py-3 text-right transition hover:border-gold/40">
            <span class="text-[11px] text-faint">Next →</span>
            <span class="block truncate font-display text-parchment">{{ next.name }}</span>
          </NuxtLink>
        </nav>

        <section v-if="related.length">
          <h2 class="eyebrow mb-3 text-dim">Also {{ alsoFrom[technique.kind] }}</h2>
          <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <NuxtLink
              v-for="r in related"
              :key="r.slug"
              :to="`/elemental-monk/techniques/${r.slug}`"
              class="flex items-center gap-3 rounded-xl border border-obsidian-600 bg-obsidian-900/70 px-3 py-2.5 transition hover:border-gold/40"
            >
              <span class="grid h-8 w-8 place-items-center rounded-lg border text-sm" :class="[kindTone[r.kind].border, kindTone[r.kind].bg, kindTone[r.kind].text]">{{ kindTone[r.kind].glyph }}</span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold text-parchment">{{ r.name }}</span>
                <span class="block truncate text-[11px] text-faint">Level {{ r.level }} · {{ r.role }}</span>
              </span>
            </NuxtLink>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>
