<script setup lang="ts">
import { character } from '~/data/character'

// +1 magic dagger, finesse: DEX (higher than STR) + proficiency (simple weapons)
const toHit = abilityMod('dex') + character.proficiencyBonus + 1
const dmgMod = abilityMod('dex') + 1
const wrath = derived.genieWrath
const average = 2.5 + dmgMod + 5 + 5
</script>

<template>
  <div class="panel overflow-hidden">
    <div class="border-b border-gold/10 bg-gradient-to-r from-rose/10 via-transparent to-transparent p-5">
      <p class="eyebrow">Weapon</p>
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="heading text-xl">Pact Keeper’s Crystal Dagger</h3>
        <NuxtLink to="/items/pact-keepers-crystal-dagger" class="text-xs text-dim hover:text-gold-light">Item details →</NuxtLink>
      </div>
      <p class="mt-1 text-sm text-dim">+1 dagger · finesse, light · thrown 30 ft and returns to his hand · spellcasting focus</p>
    </div>
    <div class="grid gap-5 p-5 md:grid-cols-[1fr_1.1fr]">
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="panel-inset py-2.5">
          <div class="eyebrow text-dim">To hit</div>
          <div class="stat-num text-2xl">{{ signed(toHit) }}</div>
        </div>
        <div class="panel-inset py-2.5">
          <div class="eyebrow text-dim">Damage</div>
          <div class="stat-num text-2xl">5d4+{{ dmgMod }}</div>
        </div>
        <div class="panel-inset py-2.5">
          <div class="eyebrow text-dim">Average</div>
          <div class="stat-num text-2xl">≈{{ Math.round(average) }}</div>
        </div>
      </div>
      <div>
        <ul class="space-y-1.5 text-[13px] text-dim">
          <li class="flex justify-between gap-3"><span class="text-parchment">Piercing</span><span class="tabular-nums text-gold-light">1d4 + {{ dmgMod }}</span></li>
          <li class="flex justify-between gap-3"><span class="text-parchment">Arcane burst</span><span class="tabular-nums text-gold-light">2d4 force + 2d4 bludgeoning</span></li>
          <li class="flex justify-between gap-3"><span><span class="text-parchment">Genie’s Wrath</span> · once per turn</span><span class="tabular-nums text-gold-light">+{{ wrath }} bludgeoning</span></li>
          <li class="flex justify-between gap-3"><span><span class="text-parchment">Crusher</span> · bludgeoning on every hit</span><span class="text-gold-light">move 5 ft</span></li>
        </ul>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <RollButton :notation="`1d20+${toHit}`" label="Crystal Dagger — attack">Attack</RollButton>
          <RollButton :notation="`5d4+${dmgMod + wrath}`" label="Crystal Dagger damage (+Genie’s Wrath)">Damage + Wrath</RollButton>
          <RollButton :notation="`5d4+${dmgMod}`" label="Crystal Dagger damage">Damage</RollButton>
        </div>
      </div>
    </div>
  </div>
</template>
