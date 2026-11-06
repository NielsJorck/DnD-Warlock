<script setup lang="ts">
import { stats } from '~/data/characters/elemental-monk/character'
import { techniques, kindTone, whenLabels, type Technique, type TechniqueWhen } from '~/data/characters/elemental-monk/techniques'

const { state, reach, focusLeft, attune, patientDefense, stepOfTheWind, deflect, redirect } = useElementalMonkTracker()

// The techniques with buttons of their own on this panel or under Attacks are left out of the list below
const has = (t: Technique) =>
  ['elemental-attunement', 'patient-defense', 'step-of-the-wind', 'deflect-attacks', 'martial-arts', 'flurry-of-blows', 'surprise-attack', 'uncanny-metabolism', 'tavern-brawler'].includes(t.slug)
const ready = techniques.filter(t => t.status === 'ready' && !has(t))
// The rest are listed by when they happen
const groups = (['bonus', 'action', 'reaction', 'free'] as TechniqueWhen[])
  .map(when => ({ when, title: whenLabels[when], techniques: ready.filter(t => t.when === when) }))
  .filter(g => g.techniques.length)
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden">
    <div class="flex flex-wrap items-end justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <h2 class="heading text-lg">Techniques</h2>
      <div class="flex flex-wrap gap-1.5 text-[11.5px]">
        <span class="chip border-jade/40 text-jade">Focus {{ focusLeft }} / {{ stats.focus }}</span>
        <span class="chip">DC {{ stats.focusDc }}</span>
      </div>
    </div>

    <!-- Elemental Attunement -->
    <div class="border-b border-obsidian-600/70 p-5" :class="state.attuned ? 'bg-jade/5' : ''">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/elemental-monk/techniques/elemental-attunement" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Elemental Attunement</NuxtLink>
        <span class="text-[11.5px] text-faint">Start of their turn · 10 minutes</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn border-jade/40 text-jade hover:border-jade" :class="state.attuned ? 'bg-jade/10' : ''" :disabled="state.attuned || focusLeft <= 0" @click="attune">
          {{ state.attuned ? 'Attuned' : 'Attune · 1 Focus' }}
        </button>
      </div>
      <p class="mt-2 text-[12px] text-dim">
        {{ state.attuned ? `Reach ${reach.own} ft on their turn, ${reach.other} ft for opportunity attacks. Pick the element under Attacks.` : 'Unarmed Strikes reach 10 ft further and deal an element that can push or pull 10 ft (STR save). Ends early if they are Incapacitated.' }}
      </p>
    </div>

    <!-- Patient Defense and Step of the Wind -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <span class="font-display text-[15px] font-semibold tracking-wide text-parchment">Move or defend</span>
        <span class="text-[11.5px] text-faint">{{ state.bonusUsed ? 'Bonus action used' : 'Bonus action' }}</span>
      </div>
      <div class="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <NuxtLink to="/elemental-monk/techniques/patient-defense" class="text-[12px] text-dim hover:text-gold-light">Patient Defense</NuxtLink>
          <div class="mt-1 flex flex-wrap gap-1.5">
            <button type="button" class="btn" :disabled="state.bonusUsed" @click="patientDefense(false)">Disengage</button>
            <button type="button" class="btn border-jade/40 text-jade hover:border-jade" :disabled="state.bonusUsed || focusLeft <= 0" @click="patientDefense(true)">+ Dodge <span class="text-faint">· 1</span></button>
          </div>
        </div>
        <div>
          <NuxtLink to="/elemental-monk/techniques/step-of-the-wind" class="text-[12px] text-dim hover:text-gold-light">Step of the Wind</NuxtLink>
          <div class="mt-1 flex flex-wrap gap-1.5">
            <button type="button" class="btn" :disabled="state.bonusUsed" @click="stepOfTheWind(false)">Dash</button>
            <button type="button" class="btn border-jade/40 text-jade hover:border-jade" :disabled="state.bonusUsed || focusLeft <= 0" @click="stepOfTheWind(true)">+ Disengage <span class="text-faint">· 1</span></button>
          </div>
        </div>
      </div>
      <p class="mt-2 text-[12px] text-dim">Free versions cost only the bonus action. Dodge: attacks against them at disadvantage and DEX saves with advantage until their next turn.</p>
    </div>

    <!-- Deflect Attacks -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/elemental-monk/techniques/deflect-attacks" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Deflect Attacks</NuxtLink>
        <span class="text-[11.5px] text-faint">{{ state.reactionUsed ? 'Reaction used' : 'Reaction · a weapon hit' }}</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn" :disabled="state.reactionUsed" title="Bludgeoning, piercing or slashing: take this much off the hit" @click="deflect">
          Reduce <span class="tabular-nums text-faint">{{ stats.deflect }}</span>
        </button>
        <button type="button" class="btn border-jade/40 text-jade hover:border-jade" :disabled="focusLeft <= 0" title="Only when the damage was reduced to 0: 5 ft for a melee attack, 60 ft for a ranged one" @click="redirect()">
          Redirect <span class="tabular-nums text-faint">{{ stats.redirect }} · 1 Focus</span>
        </button>
      </div>
      <p class="mt-2 text-[12px] text-dim">Take the roll off the damage, then put the rest in the HP box. Brought to 0, the redirect makes a creature save (DEX {{ stats.focusDc }}) against the attack’s own damage type.</p>
    </div>

    <!-- Everything else that is ready -->
    <div v-for="g in groups" :key="g.when" class="border-b border-obsidian-600/70 last:border-0">
      <p class="eyebrow bg-obsidian-950/40 px-5 py-2 text-dim">{{ g.title }}</p>
      <ul class="divide-y divide-obsidian-600/50">
        <li v-for="t in g.techniques" :key="t.slug" class="flex items-center gap-3 px-5 py-2.5">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm" :class="[kindTone[t.kind].border, kindTone[t.kind].text, kindTone[t.kind].bg]" :title="t.kind">{{ kindTone[t.kind].glyph }}</span>
          <div class="min-w-0 flex-1">
            <NuxtLink :to="`/elemental-monk/techniques/${t.slug}`" class="text-[13.5px] font-semibold text-parchment hover:text-gold-light">{{ t.name }}</NuxtLink>
            <p class="line-clamp-2 text-[11.5px] leading-snug text-faint">{{ t.timing }} · {{ t.role }}</p>
          </div>
          <RollButton v-if="t.dice && !t.attack" :notation="t.dice" :label="t.name" compact />
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-obsidian-600/70 px-5 py-3 text-[11.5px] text-faint">
      <span>Strikes, Flurry, Surprise Attack and the pushes are under Attacks; Uncanny Metabolism under Resources. Extra Attack and Stunning Strike arrive at level 5.</span>
      <NuxtLink to="/elemental-monk/techniques" class="text-dim hover:text-gold-light">All techniques →</NuxtLink>
    </div>
  </section>
</template>
