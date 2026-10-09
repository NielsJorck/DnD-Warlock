<script setup lang="ts">
import { spells, spellBySlug, levelLabel, schoolGlyph, statusLabels } from '~/data/spells'

const route = useRoute()
const spell = spellBySlug[route.params.slug as string]
if (!spell) throw createError({ statusCode: 404, statusMessage: 'Spell not found', fatal: true })

useHead({ title: `${spell.name} — Lucan’s Spellbook` })

const tone = schoolTone[spell.school]
const rollNotation = (spell.atPact ?? spell.damage ?? '').match(/\d+d\d+/)?.[0]

const sameList = spells.filter(s => s.status === spell.status).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
const idx = sameList.findIndex(s => s.slug === spell.slug)
const prev = sameList[idx - 1]
const next = sameList[idx + 1]
const related = spells.filter(s => s.slug !== spell.slug && s.access === spell.access && s.status === spell.status).slice(0, 6)
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <NuxtLink to="/spells" class="text-xs text-dim hover:text-gold-light">← Spellbook</NuxtLink>

    <article class="panel relative mt-4 overflow-hidden">
      <div class="pointer-events-none absolute -right-6 -top-10 font-display text-[200px] leading-none opacity-[0.08]" :class="tone.text" aria-hidden="true">{{ schoolGlyph[spell.school] }}</div>
      <div class="h-1 w-full" :style="{ background: `linear-gradient(90deg, ${tone.hex}, transparent)` }" />

      <div class="relative p-6 sm:p-9">
        <div class="flex flex-wrap items-center gap-2">
          <span class="chip" :class="[tone.border, tone.bg, tone.text]">{{ schoolGlyph[spell.school] }} {{ levelLabel(spell.level, true) }} {{ spell.school.toLowerCase() }}</span>
          <span class="chip" :class="statusTone[spell.status]">{{ statusLabels[spell.status] }}<template v-if="spell.priority"> · {{ spell.priority }}</template></span>
          <span v-if="spell.concentration" class="chip border-rose/40 text-rose">Concentration</span>
          <span v-if="spell.ritual" class="chip border-amethyst/40 text-amethyst">Ritual</span>
        </div>
        <h1 class="mt-4 font-display text-4xl font-bold tracking-wide text-parchment sm:text-5xl">{{ spell.name }}</h1>
        <p class="mt-2 font-serif text-xl italic text-dim">{{ spell.role }}</p>

        <div class="mt-6"><SpellStats :spell="spell" /></div>

        <p class="lore mt-6">{{ spell.summary }}</p>

        <div v-if="spell.atPact" class="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4">
          <p class="eyebrow mb-1">Cast from a 5th-level pact slot</p>
          <p class="text-parchment">{{ spell.atPact }}</p>
        </div>

        <div v-if="spell.notes" class="mt-4 rounded-xl border border-topaz/25 bg-topaz/5 p-4">
          <p class="eyebrow mb-1 text-topaz">Lucan’s notes</p>
          <p class="text-[14.5px] leading-relaxed text-parchment/85">{{ spell.notes }}</p>
        </div>

        <div v-if="spell.attack || spell.save || rollNotation" class="mt-6 flex flex-wrap items-center gap-2 border-t border-obsidian-600 pt-5">
          <RollButton v-if="spell.attack" :notation="`1d20+${derived.spellAttack}`" :label="`${spell.name} — spell attack`">Spell attack {{ signed(derived.spellAttack) }}</RollButton>
          <RollButton v-if="rollNotation" :notation="rollNotation" :label="`${spell.name} damage`">Damage {{ rollNotation }}</RollButton>
          <span v-if="spell.save" class="chip px-3 py-1 text-xs">{{ spell.save }} save vs DC {{ derived.spellDc }}</span>
          <span v-if="spell.damage" class="text-xs text-faint">{{ spell.damage }}</span>
        </div>
      </div>
    </article>

    <nav class="mt-6 grid grid-cols-2 gap-3" aria-label="Adjacent spells">
      <NuxtLink v-if="prev" :to="`/spells/${prev.slug}`" class="panel px-4 py-3 transition hover:border-gold/40">
        <span class="text-[11px] text-faint">← Previous</span>
        <span class="block truncate font-display text-parchment">{{ prev.name }}</span>
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="next" :to="`/spells/${next.slug}`" class="panel px-4 py-3 text-right transition hover:border-gold/40">
        <span class="text-[11px] text-faint">Next →</span>
        <span class="block truncate font-display text-parchment">{{ next.name }}</span>
      </NuxtLink>
    </nav>

    <section v-if="related.length" class="mt-10">
      <h2 class="eyebrow mb-3 text-dim">Also from {{ spell.access }}</h2>
      <div class="grid gap-2 sm:grid-cols-2">
        <NuxtLink
          v-for="r in related"
          :key="r.slug"
          :to="`/spells/${r.slug}`"
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
  </div>
</template>
