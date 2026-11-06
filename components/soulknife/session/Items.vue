<script setup lang="ts">
import { stats } from '~/data/characters/soulknife/character'

const { state, left, maxOf, use, drinkPotion, castLongstrider, speed } = useSoulknifeTracker()
const { note } = useDice()

interface Trigger {
  id: string // resource id
  name: string
  to: string
  when: string
  note: string
  label: string
  active?: boolean
  disabled?: boolean
  run: () => void
}

const triggers = computed<Trigger[]>(() => [
  {
    id: 'potions',
    name: 'Potion of Healing',
    to: '/soulknife/items/potion-of-healing',
    when: 'Bonus',
    note: `2d4 + 2 · drink, or give to a friend within 5 ft · ${left('potions')} left`,
    label: 'Drink',
    disabled: left('potions') <= 0,
    run: drinkPotion
  },
  {
    id: 'longstrider',
    name: 'Longstrider',
    to: '/soulknife/powers/longstrider',
    when: 'Action',
    note: state.value.longstrider ? `Speed ${speed.value} for the hour` : 'Wood Elf · +10 ft for 1 hour, on them or a friend',
    label: state.value.longstrider ? 'Active' : 'Cast',
    active: state.value.longstrider,
    disabled: state.value.longstrider || left('longstrider') <= 0,
    run: castLongstrider
  },
  {
    id: 'kit',
    name: 'Healer’s Kit',
    to: '/soulknife/items',
    when: 'Utilize',
    note: `Stabilize a creature at 0 HP, no Medicine check · ${left('kit')} uses left`,
    label: 'Use',
    disabled: left('kit') <= 0,
    run: () => {
      use('kit')
      note('Healer’s Kit', `The creature is stable at 0 HP · ${left('kit')} uses left`)
    }
  }
])

function toggleHood() {
  state.value.hood = !state.value.hood
  note(state.value.hood ? 'Hood up' : 'Hood down', state.value.hood ? 'Advantage on Stealth; Perception to spot them at disadvantage' : 'The cloak’s effect is off')
}
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
        <div class="flex max-w-[7.5rem] flex-wrap justify-end gap-1.5" :aria-label="`${left(t.id)} of ${maxOf(t.id)} left`">
          <button
            v-for="i in maxOf(t.id)"
            :key="i"
            type="button"
            class="h-3 w-3 rotate-45 rounded-[2px] border transition"
            :class="i <= left(t.id) ? 'border-gold/70 bg-gold/40 hover:bg-gold/60' : 'border-obsidian-500 bg-obsidian-900 hover:border-gold/40'"
            :title="i <= left(t.id) ? 'Mark as used' : 'Mark as unused (restocked)'"
            @click="use(t.id, i <= left(t.id) ? 1 : -1)"
          />
        </div>
        <button
          type="button"
          class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]"
          :class="t.active ? 'border-jade/60 bg-jade/10 text-jade' : ''"
          :disabled="t.disabled"
          @click="t.run()"
        >{{ t.label }}</button>
      </li>
      <li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 py-1.5">
        <div class="min-w-0 leading-snug">
          <div class="truncate text-[13px]">
            <NuxtLink to="/soulknife/items/cloak-of-elvenkind" class="font-medium text-parchment hover:text-gold-light">Cloak of Elvenkind</NuxtLink>
            <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">Action</span>
          </div>
          <div class="truncate text-[11px] text-faint">{{ state.hood ? 'Hood up: Stealth with advantage' : 'Hood down' }} · pending the DM’s yes</div>
        </div>
        <button type="button" class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]" :class="state.hood ? 'border-jade/60 bg-jade/10 text-jade' : ''" @click="toggleHood">{{ state.hood ? 'Hood up' : 'Hood down' }}</button>
      </li>
    </ul>
    <p class="mt-2 text-[11px] text-faint">
      Potions and the kit don’t come back on a rest: tick a diamond back when they restock. Thieves’ Tools {{ signed(stats.tools) }} are under Rolls.
    </p>
  </section>
</template>
