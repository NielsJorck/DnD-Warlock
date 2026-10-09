<script setup lang="ts">
import { type Spell, levelLabel, schoolGlyph, statusLabels } from '~/data/spells'

const props = defineProps<{ spell: Spell; open?: boolean }>()
const tone = computed(() => schoolTone[props.spell.school])
const rollNotation = computed(() => (props.spell.atPact ?? props.spell.damage ?? '').match(/\d+d\d+/)?.[0])
</script>

<template>
  <details
    class="group overflow-hidden rounded-xl border bg-obsidian-900/70 transition open:bg-obsidian-850/80 open:shadow-panel"
    :class="spell.status === 'known' ? 'border-obsidian-600 hover:border-gold/30' : 'border-obsidian-600/60 hover:border-obsidian-500'"
    :open="open"
  >
    <summary class="flex items-center gap-3 px-3.5 py-3 sm:gap-4">
      <span
        class="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border text-lg"
        :class="[tone.border, tone.bg, tone.text]"
        :title="spell.school"
      >
        {{ schoolGlyph[spell.school] }}
        <span class="absolute -bottom-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full border border-obsidian-600 bg-obsidian-950 px-1 text-[10px] font-semibold text-parchment">
          {{ spell.level === 0 ? 'C' : spell.level }}
        </span>
      </span>

      <span class="min-w-0 flex-1">
        <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="font-display text-[15px] font-semibold tracking-wide text-parchment">{{ spell.name }}</span>
          <span v-if="spell.concentration" class="chip border-rose/40 py-0 text-[10px] text-rose" title="Concentration">Conc.</span>
          <span v-if="spell.ritual" class="chip border-amethyst/40 py-0 text-[10px] text-amethyst" title="Ritual">Ritual</span>
          <span v-if="spell.status !== 'known'" class="chip py-0 text-[10px]" :class="statusTone[spell.status]">
            {{ spell.priority ? `${spell.priority} priority` : statusLabels[spell.status] }}
          </span>
        </span>
        <span class="mt-0.5 block truncate text-[12.5px] text-dim">
          <span :class="tone.text">{{ levelLabel(spell.level, true) }} {{ spell.school.toLowerCase() }}</span>
          · {{ spell.role }}
        </span>
      </span>

      <span class="hidden shrink-0 text-right text-[11px] leading-tight text-faint md:block">
        <span class="block text-parchment/80">{{ spell.castingTime }}</span>
        <span class="block">{{ spell.range }}</span>
      </span>
      <svg class="h-4 w-4 shrink-0 text-faint transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
      </svg>
    </summary>

    <div class="border-t border-obsidian-600/70 px-4 pb-4 pt-3">
      <SpellStats :spell="spell" />

      <p class="mt-3 text-[13.5px] leading-relaxed text-parchment/85">{{ spell.summary }}</p>

      <div v-if="spell.atPact" class="mt-3 rounded-lg border border-gold/25 bg-gold/5 px-3 py-2 text-[13px]">
        <span class="eyebrow mr-2">At 5th level</span><span class="text-parchment">{{ spell.atPact }}</span>
      </div>
      <p v-if="spell.notes" class="mt-3 border-l-2 border-topaz/40 pl-3 text-[13px] leading-relaxed text-dim">{{ spell.notes }}</p>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <RollButton v-if="spell.attack" :notation="`1d20+${derived.spellAttack}`" :label="`${spell.name} — spell attack`">Attack {{ signed(derived.spellAttack) }}</RollButton>
        <RollButton v-if="rollNotation" :notation="rollNotation" :label="`${spell.name} damage`">{{ rollNotation }}</RollButton>
        <span v-if="spell.save" class="chip text-[11px]">{{ spell.save }} save · DC {{ derived.spellDc }}</span>
        <NuxtLink :to="`/spells/${spell.slug}`" class="ml-auto text-xs text-dim hover:text-gold-light">Open page →</NuxtLink>
      </div>
    </div>
  </details>
</template>
