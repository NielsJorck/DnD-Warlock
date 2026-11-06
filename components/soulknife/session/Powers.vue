<script setup lang="ts">
import { stats } from '~/data/characters/soulknife/character'
import { powers, kindTone, whenLabels, type Power, type PowerWhen } from '~/data/characters/soulknife/powers'

const { state, psiLeft, left, knack, resolveKnack, whispers, cunning, steadyAim } = useSoulknifeTracker()

// The powers with buttons of their own on this panel are left out of the list below
const has = (p: Power) => ['psi-bolstered-knack', 'psychic-whispers', 'cunning-action', 'steady-aim'].includes(p.slug)
const ready = powers.filter(p => p.status === 'ready' && !has(p))
// The rest are listed by when they happen
const groups = (['bonus', 'action', 'reaction', 'free'] as PowerWhen[])
  .map(when => ({ when, title: whenLabels[when], powers: ready.filter(p => p.when === when) }))
  .filter(g => g.powers.length)
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden">
    <div class="flex flex-wrap items-end justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <h2 class="heading text-lg">Powers</h2>
      <div class="flex flex-wrap gap-1.5 text-[11.5px]">
        <span class="chip border-amethyst/40 text-amethyst">Psi {{ psiLeft }} × {{ stats.psiDie }}</span>
        <span class="chip">Sneak Attack {{ stats.sneak }}</span>
        <span class="chip">Elf spells DC {{ stats.elfDc }}</span>
      </div>
    </div>

    <!-- The psi dice at work -->
    <div class="grid gap-px border-b border-obsidian-600/70 bg-obsidian-600/60 sm:grid-cols-2">
      <div class="bg-obsidian-900 p-5">
        <div class="flex items-baseline justify-between gap-2">
          <NuxtLink to="/soulknife/powers/psi-bolstered-knack" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Psi-Bolstered Knack</NuxtLink>
          <span class="text-[11.5px] text-faint">After a failed check</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <button v-if="!state.knackPending" type="button" class="btn border-amethyst/40 text-amethyst hover:border-amethyst" :disabled="psiLeft <= 0" @click="knack">
            Add a die <span class="tabular-nums text-faint">1{{ stats.psiDie }}</span>
          </button>
          <template v-else>
            <button type="button" class="btn border-jade/50 text-jade hover:border-jade" @click="resolveKnack(true)">It succeeds: spend</button>
            <button type="button" class="btn" @click="resolveKnack(false)">Still fails: keep</button>
          </template>
        </div>
        <p class="mt-2 text-[12px] text-dim">A skill or tool he is proficient in. The die is spent only if the check now succeeds.</p>
      </div>
      <div class="bg-obsidian-900 p-5">
        <div class="flex items-baseline justify-between gap-2">
          <NuxtLink to="/soulknife/powers/psychic-whispers" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Psychic Whispers</NuxtLink>
          <span class="text-[11.5px] text-faint">Magic action · {{ stats.psiTelepathy }} creatures</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <button type="button" class="btn border-amethyst/40 text-amethyst hover:border-amethyst" :disabled="!left('whispers') && psiLeft <= 0" @click="whispers">
            {{ left('whispers') ? 'Link · free' : 'Link · spend a die' }}
          </button>
        </div>
        <p class="mt-2 text-[12px] text-dim">
          {{ state.telepathy ? `Linked for ${state.telepathy} hour${state.telepathy === 1 ? '' : 's'}.` : 'No link.' }} Telepathy with him within a mile; he relays between the others.
        </p>
      </div>
    </div>

    <!-- Cunning Action and Steady Aim -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/soulknife/powers/cunning-action" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Cunning Action</NuxtLink>
        <span class="text-[11.5px] text-faint">{{ state.bonusUsed ? 'Bonus action used' : 'Bonus action' }}</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <button type="button" class="btn" :disabled="state.bonusUsed" @click="cunning('Dash')">Dash</button>
        <button type="button" class="btn" :disabled="state.bonusUsed" @click="cunning('Disengage')">Disengage</button>
        <button type="button" class="btn border-amethyst/40 text-amethyst hover:border-amethyst" :disabled="state.bonusUsed" title="Rolls Stealth against DC 15; with the hood up, with advantage" @click="cunning('Hide')">Hide <span class="text-faint">DC 15</span></button>
        <button type="button" class="btn border-jade/40 text-jade hover:border-jade" :disabled="state.bonusUsed || state.steadyAim" title="Only if he hasn’t moved this turn" @click="steadyAim">Steady Aim</button>
      </div>
      <p class="mt-2 text-[12px] text-dim">Hide needs heavy obscurement or three-quarters cover, out of every enemy’s sight. Hidden, he is Invisible: the next attack has advantage.</p>
    </div>

    <!-- Everything else that is ready -->
    <div v-for="g in groups" :key="g.when" class="border-b border-obsidian-600/70 last:border-0">
      <p class="eyebrow bg-obsidian-950/40 px-5 py-2 text-dim">{{ g.title }}</p>
      <ul class="divide-y divide-obsidian-600/50">
        <li v-for="p in g.powers" :key="p.slug" class="flex items-center gap-3 px-5 py-2.5">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm" :class="[kindTone[p.kind].border, kindTone[p.kind].text, kindTone[p.kind].bg]" :title="p.kind">{{ kindTone[p.kind].glyph }}</span>
          <div class="min-w-0 flex-1">
            <NuxtLink :to="`/soulknife/powers/${p.slug}`" class="text-[13.5px] font-semibold text-parchment hover:text-gold-light">{{ p.name }}</NuxtLink>
            <p class="line-clamp-2 text-[11.5px] leading-snug text-faint">{{ p.timing }} · {{ p.role }}</p>
          </div>
          <RollButton v-if="p.dice && !p.attack" :notation="p.dice" :label="p.name" compact />
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-obsidian-600/70 px-5 py-3 text-[11.5px] text-faint">
      <span>The blades are under Attacks. Cunning Strike, Uncanny Dodge and Pass without Trace arrive at level 5.</span>
      <NuxtLink to="/soulknife/powers" class="text-dim hover:text-gold-light">All powers →</NuxtLink>
    </div>
  </section>
</template>
