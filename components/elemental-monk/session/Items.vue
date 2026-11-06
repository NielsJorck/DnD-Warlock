<script setup lang="ts">
const { left, maxOf, use, drinkPotion } = useElementalMonkTracker()
const { note } = useDice()

interface Trigger {
  id: string // resource id
  name: string
  to: string
  when: string
  note: string
  label: string
  disabled?: boolean
  run: () => void
}

const triggers = computed<Trigger[]>(() => [
  {
    id: 'potions',
    name: 'Potion of Healing',
    to: '/elemental-monk/items/potion-of-healing',
    when: 'Bonus',
    note: `2d4 + 2 · drink, or give to a friend within 5 ft · ${left('potions')} left`,
    label: 'Drink',
    disabled: left('potions') <= 0,
    run: drinkPotion
  },
  {
    id: 'kit',
    name: 'Healer’s Kit',
    to: '/elemental-monk/items',
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
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <h2 class="heading mb-2 text-lg">Items</h2>

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
        <button type="button" class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]" :disabled="t.disabled" @click="t.run()">{{ t.label }}</button>
      </li>
      <li class="py-1.5">
        <div class="truncate text-[13px]">
          <NuxtLink to="/elemental-monk/items/cloak-of-protection" class="font-medium text-parchment hover:text-gold-light">Cloak of Protection</NuxtLink>
          <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">Worn</span>
        </div>
        <div class="text-[11px] text-faint">+1 AC and saves, already counted · pending the DM’s yes</div>
      </li>
    </ul>
    <p class="mt-2 text-[11px] text-faint">Potions and the kit don’t come back on a rest: tick a diamond back when they restock.</p>
  </section>
</template>
