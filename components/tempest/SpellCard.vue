<script setup lang="ts">
import { stats } from '~/data/characters/tempest/character'
import { type Spell, statusLabels, statusTone } from '~/data/characters/tempest/spells'
import { levelLabel, schoolGlyph } from '~/data/characters/shared'

const props = defineProps<{ spell: Spell; open?: boolean }>()
const tone = computed(() => schoolTone[props.spell.school])
// Magic Initiate (Wizard) casts with Intelligence
const initiate = computed(() => props.spell.access === 'Magic Initiate')
const attack = computed(() => (initiate.value ? stats.initiateAttack : stats.spellAttack))
const dc = computed(() => (initiate.value ? stats.initiateDc : stats.spellDc))
const dice = computed(() => props.spell.dice?.[props.spell.level])
</script>

<template>
  <details
    class="group overflow-hidden rounded-xl border bg-obsidian-900/70 transition open:bg-obsidian-850/80 open:shadow-panel"
    :class="['known', 'domain', 'prepared'].includes(spell.status) ? 'border-obsidian-600 hover:border-gold/30' : 'border-obsidian-600/60 hover:border-obsidian-500'"
    :open="open"
  >
    <summary class="flex items-center gap-3 px-3.5 py-3 sm:gap-4">
      <span class="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border text-lg" :class="[tone.border, tone.bg, tone.text]" :title="spell.school">
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
          <span v-if="spell.storm" class="chip border-sapphire/40 py-0 text-[10px] text-sapphire" :title="`${spell.storm} damage: Destructive Wrath can max it`">ϟ {{ spell.storm }}</span>
          <span class="chip py-0 text-[10px]" :class="statusTone[spell.status]">{{ initiate ? 'Magic Initiate' : statusLabels[spell.status] }}</span>
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
      <TempestSpellStats :spell="spell" />

      <p class="mt-3 text-[13.5px] leading-relaxed text-parchment/85">{{ spell.summary }}</p>

      <div v-if="spell.higher" class="mt-3 rounded-lg border border-sapphire/25 bg-sapphire/5 px-3 py-2 text-[13px]">
        <span class="eyebrow mr-2 text-sapphire">Higher slots</span><span class="text-parchment">{{ spell.higher }}</span>
      </div>
      <p v-if="spell.notes" class="mt-3 border-l-2 border-topaz/40 pl-3 text-[13px] leading-relaxed text-dim">{{ spell.notes }}</p>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <RollButton v-if="spell.attack" :notation="`1d20+${attack}`" :label="`${spell.name} — spell attack`">Attack {{ signed(attack) }}</RollButton>
        <RollButton v-if="dice" :notation="dice" :label="`${spell.name}${spell.damage ? ` · ${spell.damage}` : ''}`">{{ dice }}</RollButton>
        <span v-if="spell.save" class="chip text-[11px]">{{ spell.save }} save · DC {{ dc }}</span>
        <NuxtLink :to="`/tempest/spells/${spell.slug}`" class="ml-auto text-xs text-dim hover:text-gold-light">Open page →</NuxtLink>
      </div>
    </div>
  </details>
</template>
