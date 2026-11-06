<script setup lang="ts">
import { character, stats } from '~/data/characters/gloom-stalker/character'
import { silent, spells, spellBySlug, statusLabels, statusTone } from '~/data/characters/gloom-stalker/spells'
import { levelLabel, schoolGlyph } from '~/data/characters/shared'

const route = useRoute()
const spell = spellBySlug[route.params.slug as string]
if (!spell) throw createError({ statusCode: 404, statusMessage: 'Spell not found', fatal: true })

useHead({ title: `${spell.name} — ${character.name}’s Spellbook` })

const tone = schoolTone[spell.school]
// Every slot level the spell can be cast at, with its dice
const byLevel = Object.entries(spell.dice ?? {})
  .map(([level, dice]) => ({ level: Number(level), dice: dice! }))
  .sort((a, b) => a.level - b.level)

const sameList = spells.filter(s => s.status === spell.status).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
const idx = sameList.findIndex(s => s.slug === spell.slug)
const prev = sameList[idx - 1]
const next = sameList[idx + 1]
const related = spells.filter(s => s.slug !== spell.slug && s.status === spell.status).slice(0, 6)
</script>

<template>
  <div class="mx-auto max-w-4xl xl:max-w-6xl">
    <NuxtLink to="/gloom-stalker/spells" class="text-xs text-dim hover:text-gold-light">← Spellbook</NuxtLink>

    <div class="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
      <div class="min-w-0 space-y-6">
        <article class="panel relative overflow-hidden">
          <div class="pointer-events-none absolute -right-6 -top-10 font-display text-[200px] leading-none opacity-[0.08]" :class="tone.text" aria-hidden="true">{{ schoolGlyph[spell.school] }}</div>
          <div class="h-1 w-full" :style="{ background: `linear-gradient(90deg, ${tone.hex}, transparent)` }" />

          <div class="relative p-6 sm:p-9">
            <div class="flex flex-wrap items-center gap-2">
              <span class="chip" :class="[tone.border, tone.bg, tone.text]">{{ schoolGlyph[spell.school] }} {{ levelLabel(spell.level, true) }} {{ spell.school.toLowerCase() }}</span>
              <span class="chip" :class="statusTone[spell.status]">{{ statusLabels[spell.status] }}<template v-if="spell.opensAt"> · from level {{ spell.opensAt }}</template></span>
              <span v-if="spell.concentration" class="chip border-rose/40 text-rose">Concentration</span>
              <span v-if="spell.ritual" class="chip border-amethyst/40 text-amethyst">Ritual</span>
              <span v-if="silent(spell)" class="chip border-sapphire/40 text-sapphire">Silent: no verbal component</span>
            </div>
            <h1 class="mt-4 font-display text-4xl font-bold tracking-wide text-parchment sm:text-5xl">{{ spell.name }}</h1>
            <p class="mt-2 font-serif text-xl italic text-dim">{{ spell.role }}</p>

            <div class="mt-6"><GloomStalkerSpellStats :spell="spell" /></div>

            <p class="lore mt-6">{{ spell.summary }}</p>

            <div v-if="spell.higher" class="mt-6 rounded-xl border border-sapphire/30 bg-sapphire/5 p-4">
              <p class="eyebrow mb-1 text-sapphire">From a higher slot</p>
              <p class="text-parchment">{{ spell.higher }}</p>
            </div>

            <div v-if="spell.notes" class="mt-4 rounded-xl border border-topaz/25 bg-topaz/5 p-4">
              <p class="eyebrow mb-1 text-topaz">In the build</p>
              <p class="text-[14.5px] leading-relaxed text-parchment/85">{{ spell.notes }}</p>
            </div>

            <div v-if="spell.attack || spell.save || byLevel.length" class="mt-6 border-t border-obsidian-600 pt-5">
              <div class="flex flex-wrap items-center gap-2">
                <RollButton v-if="spell.attack" :notation="`1d20+${stats.spellAttack}`" :label="`${spell.name} — spell attack`">Spell attack {{ signed(stats.spellAttack) }}</RollButton>
                <span v-if="spell.save" class="chip px-3 py-1 text-xs">{{ spell.save }} save vs DC {{ stats.spellDc }}</span>
                <span v-if="spell.damage" class="text-xs text-faint">{{ spell.damage }}</span>
                <span v-if="spell.heal" class="text-xs text-jade">Healing</span>
              </div>
              <div v-if="byLevel.length" class="mt-3 flex flex-wrap items-center gap-1.5">
                <span class="mr-1 text-[11px] text-faint">{{ spell.level ? 'By slot' : 'Roll' }}</span>
                <RollButton v-for="b in byLevel" :key="b.level" :notation="b.dice" :label="`${spell.name}${spell.level ? ` (${levelLabel(b.level)} level)` : ''}${spell.heal ? ' · healing' : ''}`">
                  <template v-if="spell.level">{{ levelLabel(b.level) }} · </template>{{ b.dice }}
                </RollButton>
              </div>
            </div>
          </div>
        </article>

        <GloomStalkerTactics v-if="spell.slug === 'hunters-mark'" />
      </div>

      <aside class="space-y-8 xl:sticky xl:top-24 xl:self-start">
        <nav class="grid grid-cols-2 gap-3" aria-label="Adjacent spells">
          <NuxtLink v-if="prev" :to="`/gloom-stalker/spells/${prev.slug}`" class="panel px-4 py-3 transition hover:border-gold/40">
            <span class="text-[11px] text-faint">← Previous</span>
            <span class="block truncate font-display text-parchment">{{ prev.name }}</span>
          </NuxtLink>
          <span v-else />
          <NuxtLink v-if="next" :to="`/gloom-stalker/spells/${next.slug}`" class="panel px-4 py-3 text-right transition hover:border-gold/40">
            <span class="text-[11px] text-faint">Next →</span>
            <span class="block truncate font-display text-parchment">{{ next.name }}</span>
          </NuxtLink>
        </nav>

        <section v-if="related.length">
          <h2 class="eyebrow mb-3 text-dim">Also {{ statusLabels[spell.status].toLowerCase() }}</h2>
          <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <NuxtLink
              v-for="r in related"
              :key="r.slug"
              :to="`/gloom-stalker/spells/${r.slug}`"
              class="flex items-center gap-3 rounded-xl border border-obsidian-600 bg-obsidian-900/70 px-3 py-2.5 transition hover:border-gold/40"
            >
              <span class="grid h-8 w-8 place-items-center rounded-lg border text-sm" :class="[schoolTone[r.school].border, schoolTone[r.school].bg, schoolTone[r.school].text]">{{ schoolGlyph[r.school] }}</span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold text-parchment">{{ r.name }}</span>
                <span class="block truncate text-[11px] text-faint">{{ levelLabel(r.level) }} · {{ r.role }}</span>
              </span>
            </NuxtLink>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>
