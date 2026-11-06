<script setup lang="ts">
import { stats } from '~/data/characters/soulknife/character'
import { type Power, costLabels, kindTone, statusLabels, statusTone } from '~/data/characters/soulknife/powers'

const props = defineProps<{ power: Power; open?: boolean }>()
const tone = computed(() => kindTone[props.power.kind])
</script>

<template>
  <details
    class="group overflow-hidden rounded-xl border bg-obsidian-900/70 transition open:bg-obsidian-850/80 open:shadow-panel"
    :class="power.status === 'ready' ? 'border-obsidian-600 hover:border-gold/30' : 'border-obsidian-600/60 hover:border-obsidian-500'"
    :open="open"
  >
    <summary class="flex items-center gap-3 px-3.5 py-3 sm:gap-4">
      <span class="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border text-lg" :class="[tone.border, tone.bg, tone.text]" :title="power.kind">
        {{ tone.glyph }}
        <span class="absolute -bottom-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full border border-obsidian-600 bg-obsidian-950 px-1 text-[10px] font-semibold text-parchment" :title="`Arrives at level ${power.level}`">
          {{ power.level }}
        </span>
      </span>

      <span class="min-w-0 flex-1">
        <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="font-display text-[15px] font-semibold tracking-wide text-parchment">{{ power.name }}</span>
          <span v-if="power.costKind === 'psi'" class="chip border-amethyst/40 py-0 text-[10px] text-amethyst" :title="power.cost">Psi die</span>
          <span v-if="power.concentration" class="chip border-rose/40 py-0 text-[10px] text-rose" title="Concentration">Conc.</span>
          <span class="chip py-0 text-[10px]" :class="statusTone[power.status]">{{ power.status === 'future' ? `Level ${power.level}` : statusLabels[power.status] }}</span>
        </span>
        <span class="mt-0.5 block truncate text-[12.5px] text-dim">
          <span :class="tone.text">{{ power.kind }}</span>
          · {{ power.role }}
        </span>
      </span>

      <span class="hidden shrink-0 text-right text-[11px] leading-tight text-faint md:block">
        <span class="block text-parchment/80">{{ power.timing.split(',')[0] }}</span>
        <span class="block">{{ costLabels[power.costKind] }}</span>
      </span>
      <svg class="h-4 w-4 shrink-0 text-faint transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
      </svg>
    </summary>

    <div class="border-t border-obsidian-600/70 px-4 pb-4 pt-3">
      <SoulknifePowerStats :power="power" />

      <p class="mt-3 text-[13.5px] leading-relaxed text-parchment/85">{{ power.summary }}</p>

      <ul v-if="power.options" class="mt-3 divide-y divide-obsidian-600/60 overflow-hidden rounded-lg border border-obsidian-600/70 text-[12.5px]">
        <li v-for="o in power.options" :key="o.name" class="flex flex-wrap items-baseline gap-x-3 px-3 py-1.5">
          <span class="w-24 shrink-0 font-semibold text-parchment">{{ o.name }}</span>
          <span v-if="o.cost" class="w-24 shrink-0 text-[11.5px] text-faint">{{ o.cost }}</span>
          <span class="min-w-0 flex-1 text-parchment/80">{{ o.effect }}</span>
        </li>
      </ul>

      <div v-if="power.grows" class="mt-3 rounded-lg border border-sapphire/25 bg-sapphire/5 px-3 py-2 text-[13px]">
        <span class="eyebrow mr-2 text-sapphire">Grows</span><span class="text-parchment">{{ power.grows }}</span>
      </div>
      <p v-if="power.notes" class="mt-3 border-l-2 border-topaz/40 pl-3 text-[13px] leading-relaxed text-dim">{{ power.notes }}</p>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <RollButton v-if="power.attack" :notation="`1d20+${stats.bladeAttack}`" :label="`${power.name} — attack`">Attack {{ signed(stats.bladeAttack) }}</RollButton>
        <RollButton v-if="power.dice" :notation="power.dice" :label="`${power.name}${power.damage ? ` · ${power.damage}` : ''}`">{{ power.dice }}</RollButton>
        <span v-if="power.save" class="chip text-[11px]">{{ power.save }}</span>
        <NuxtLink :to="`/soulknife/powers/${power.slug}`" class="ml-auto text-xs text-dim hover:text-gold-light">Open page →</NuxtLink>
      </div>
    </div>
  </details>
</template>
