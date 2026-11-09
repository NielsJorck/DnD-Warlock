<script setup lang="ts">
import { stats } from '~/data/characters/gloom-stalker/character'

const { state, left, maxOf, use, drinkPotion } = useGloomStalkerTracker()
const { note } = useDice()

interface Trigger {
  id: string // resource id
  name: string
  to: string
  when: string
  note: string
  label: string
  disabled?: boolean
  pips?: boolean // show one pip per use (false for long counts like arrows)
  run: () => void
}

const triggers = computed<Trigger[]>(() => [
  {
    id: 'potions',
    name: 'Potion of Healing',
    to: '/gloom-stalker/items/potion-of-healing',
    when: 'Bonus',
    note: `${stats.potion} HP · drink, or give it to someone within 5 ft`,
    label: 'Drink',
    pips: true,
    disabled: left('potions') <= 0,
    run: drinkPotion
  },
  {
    id: 'healersKit',
    name: 'Healer’s Kit',
    to: '/gloom-stalker/items#gear',
    when: 'Action',
    note: `Stabilize a dying creature, no roll · ${left('healersKit')} of 10 uses`,
    label: 'Use',
    disabled: left('healersKit') <= 0,
    run: () => {
      use('healersKit')
      note('Healer’s Kit', `The creature is stable at 0 HP · ${left('healersKit')} uses left`)
    }
  },
  {
    id: 'arrows',
    name: 'Arrows',
    to: '/gloom-stalker/items#gear',
    when: 'Count',
    note: `${left('arrows')} of ${maxOf('arrows')} · shooting from Attacks spends them`,
    label: '+1',
    disabled: left('arrows') >= maxOf('arrows'),
    run: () => use('arrows', -1)
  }
])
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <h2 class="heading mb-2 text-lg">Items &amp; Features</h2>

    <ul class="grid gap-x-6 xl:grid-cols-2 2xl:grid-cols-1 3xl:grid-cols-2 [&>li]:border-t [&>li]:border-obsidian-600/60">
      <li v-for="t in triggers" :key="t.id" class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2.5 py-1.5" :title="t.note">
        <div class="min-w-0 leading-snug">
          <div class="truncate text-[13px]">
            <NuxtLink :to="t.to" class="font-medium text-parchment hover:text-gold-light">{{ t.name }}</NuxtLink>
            <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">{{ t.when }}</span>
          </div>
          <div class="truncate text-[11px] text-faint">{{ t.note }}</div>
        </div>
        <div v-if="t.pips" class="flex max-w-[7.5rem] flex-wrap justify-end gap-1.5" :aria-label="`${left(t.id)} of ${maxOf(t.id)} left`">
          <button
            v-for="i in maxOf(t.id)"
            :key="i"
            type="button"
            class="h-3 w-3 rotate-45 rounded-[2px] border transition"
            :class="i <= left(t.id) ? 'border-gold/70 bg-gold/40 hover:bg-gold/60' : 'border-obsidian-500 bg-obsidian-900 hover:border-gold/40'"
            :title="i <= left(t.id) ? 'Mark as used' : 'Mark as unused'"
            @click="use(t.id, i <= left(t.id) ? 1 : -1)"
          />
        </div>
        <span v-else class="text-[12px] tabular-nums text-dim">{{ left(t.id) }}</span>
        <button type="button" class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]" :disabled="t.disabled" @click="t.run()">{{ t.label }}</button>
      </li>
      <li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 py-1.5">
        <div class="min-w-0 leading-snug">
          <div class="truncate text-[13px]">
            <span class="font-medium text-parchment">Heroic Inspiration</span>
            <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">Free</span>
          </div>
          <div class="truncate text-[11px] text-faint">Reroll any one die right after rolling it · when the DM gives it</div>
        </div>
        <button type="button" class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]" :class="state.inspiration ? 'border-gold/60 bg-gold/10 text-gold-light' : ''" @click="state.inspiration = !state.inspiration">{{ state.inspiration ? 'Spend' : 'Gain' }}</button>
      </li>
      <li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 py-1.5">
        <div class="min-w-0 leading-snug">
          <div class="truncate text-[13px]">
            <NuxtLink to="/gloom-stalker/items/bracers-of-archery" class="font-medium text-parchment hover:text-gold-light">Bracers of Archery</NuxtLink>
            <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">Always</span>
          </div>
          <div class="truncate text-[11px] text-faint">+2 damage on every bow hit, already in the longbow’s numbers · pending the DM</div>
        </div>
        <span class="chip py-0 text-[10px] text-jade">Attuned</span>
      </li>
    </ul>
    <p class="mt-2 text-[11px] text-faint">Potions, kit uses and arrows don’t come back on a rest. Thieves’ Tools {{ signed(stats.tools) }} are under Rolls; the crowbar, caltrops and climber’s kit are on the Items page.</p>
  </section>
</template>
