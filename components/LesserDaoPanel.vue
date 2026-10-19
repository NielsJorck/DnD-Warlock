<script setup lang="ts">
import { abilityNames } from '~/data/character'
import { lesserDao as dao } from '~/data/character'

const { roll } = useDice()

const abilities = abilityOrder.map(key => {
  const mod = modifier(dao.abilities[key])
  const proficient = dao.saveProficiencies.includes(key)
  return { key, score: dao.abilities[key], mod, save: mod + (proficient ? dao.proficiencyBonus : 0) + dao.itemBonus, proficient }
})
const skills = dao.skills.map(s => ({ ...s, bonus: modifier(dao.abilities[s.ability]) + dao.proficiencyBonus + dao.itemBonus }))
</script>

<template>
  <div class="panel overflow-hidden">
    <div class="border-b border-gold/10 bg-gradient-to-r from-topaz/10 via-transparent to-transparent p-5">
      <p class="eyebrow">Bracers of the Dao Pact · 2 / long rest</p>
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="heading text-xl">{{ dao.name }}</h3>
        <NuxtLink to="/items/bracers-of-the-dao-pact" class="text-xs text-dim hover:text-gold-light">Bracers →</NuxtLink>
      </div>
      <p class="mt-1 text-sm text-dim">{{ dao.type }} · bonus action to assume, lasts 10 turns · {{ dao.speed }}</p>
    </div>

    <div class="space-y-5 p-5">
      <div class="grid grid-cols-3 gap-2 text-center sm:grid-cols-4">
        <div class="panel-inset py-2.5">
          <div class="eyebrow text-dim">AC</div>
          <div class="stat-num text-2xl">{{ dao.ac }}</div>
        </div>
        <div class="panel-inset py-2.5">
          <div class="eyebrow text-dim">Form HP</div>
          <div class="stat-num text-2xl">{{ dao.hp }}</div>
          <div class="text-[10.5px] text-faint">{{ dao.hpFormula }}</div>
        </div>
        <div class="panel-inset py-2.5">
          <div class="eyebrow text-dim">Attacks</div>
          <div class="stat-num text-2xl">2 × +9</div>
        </div>
        <div class="panel-inset col-span-3 py-2.5 sm:col-span-1">
          <div class="eyebrow text-dim">Senses</div>
          <div class="mt-1 text-[13px] text-parchment">{{ dao.senses }}</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        <button
          v-for="a in abilities"
          :key="a.key"
          type="button"
          class="rounded-lg border px-2 py-1.5 text-center transition hover:border-gold/60"
          :class="a.proficient ? 'border-gold/30 bg-gold/5' : 'border-obsidian-600'"
          :title="`Roll ${abilityNames[a.key]} save`"
          @click="roll(`1d20${signed(a.save).replace('−', '-')}`, `Lesser Dao ${abilityNames[a.key]} save`)"
        >
          <div class="text-[10px] uppercase tracking-wider text-faint">{{ a.key }} {{ a.score }}</div>
          <div class="text-sm font-semibold tabular-nums text-parchment">{{ signed(a.mod) }}</div>
          <div class="text-[10.5px] tabular-nums" :class="a.proficient ? 'text-gold-light' : 'text-faint'">Save {{ signed(a.save) }}</div>
        </button>
      </div>

      <div>
        <p class="eyebrow mb-2 text-dim">Actions · {{ dao.multiattack }}</p>
        <ul class="space-y-2">
          <li v-for="atk in dao.attacks" :key="atk.name" class="rounded-lg border border-obsidian-600 bg-obsidian-950/50 px-3 py-2.5">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span class="font-semibold text-parchment">{{ atk.name }}</span>
              <span class="text-[11.5px] text-faint">{{ atk.kind }}</span>
              <span class="ml-auto flex gap-1.5">
                <RollButton :notation="`1d20+${atk.toHit}`" :label="`${atk.name} — attack`">+{{ atk.toHit }}</RollButton>
                <RollButton :notation="atk.damage" :label="`${atk.name} damage (${atk.type})`">{{ atk.damage }}</RollButton>
              </span>
            </div>
            <p v-if="atk.effect" class="mt-1 text-[12.5px] leading-relaxed text-dim">{{ atk.effect }}</p>
          </li>
        </ul>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <ul class="space-y-1.5 text-[13px]">
          <li v-for="t in dao.traits" :key="t.name" class="text-dim"><span class="font-semibold text-parchment">{{ t.name }}.</span> {{ t.text }}</li>
        </ul>
        <ul class="space-y-1 text-[13px] text-dim">
          <li><span class="text-parchment">Resistances:</span> {{ dao.resistances.join(', ') }}</li>
          <li><span class="text-parchment">Condition immunity:</span> {{ dao.conditionImmunities.join(', ') }}</li>
          <li>
            <span class="text-parchment">Skills:</span>
            <template v-for="(s, n) in skills" :key="s.name">
              <button type="button" class="hover:text-gold-light" @click="roll(`1d20+${s.bonus}`, `Lesser Dao ${s.name}`)">{{ s.name }} {{ signed(s.bonus) }}</button>{{ n < skills.length - 1 ? ', ' : '' }}
            </template>
          </li>
          <li><span class="text-parchment">Languages:</span> {{ dao.languages }}</li>
          <li class="text-[11.5px] text-faint">Saves and skills include the Stone of Good Luck’s +1.</li>
        </ul>
      </div>
    </div>
  </div>
</template>
