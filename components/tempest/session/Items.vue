<script setup lang="ts">
const { state, left, maxOf, use, rollDamage, toggleBoots, speed } = useTempestTracker()
const { roll, note } = useDice()

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

function staffStorm(id: 'staffStrike' | 'staffClap' | 'staffBoth') {
  if (left(id) <= 0) return
  use(id)
  if (id !== 'staffClap') rollDamage('9d6', 'Lightning Strike (lightning) · 120-ft line, DC 17 DEX, half on a save', { storm: true })
  if (id !== 'staffStrike') rollDamage('2d6', 'Thunderclap (thunder) · 60 ft, DC 17 CON or deafened, half on a save', { storm: true })
}

function intervention() {
  if (left('intervention') <= 0) return
  use('intervention')
  const r = roll('1d100', 'Divine Intervention · 10 or lower')
  if (r.total <= 10) {
    state.value.kordAnswered = true
    note('Kord answers', 'No Divine Intervention for 7 days. Untick it under Items & Features when they have passed')
  }
}

const triggers = computed<Trigger[]>(() => [
  {
    id: 'staffStrike',
    name: 'Lightning Strike',
    to: '/tempest/items/staff-of-thunder-and-lightning',
    when: 'Action',
    note: 'Staff · 120-ft line, 9d6 lightning, DC 17 DEX',
    label: '9d6',
    disabled: left('staffStrike') <= 0,
    run: () => staffStorm('staffStrike')
  },
  {
    id: 'staffClap',
    name: 'Thunderclap',
    to: '/tempest/items/staff-of-thunder-and-lightning',
    when: 'Action',
    note: 'Staff · 60 ft around him, 2d6 thunder and deafened, DC 17 CON',
    label: '2d6',
    disabled: left('staffClap') <= 0,
    run: () => staffStorm('staffClap')
  },
  {
    id: 'staffBoth',
    name: 'Thunder and Lightning',
    to: '/tempest/items/staff-of-thunder-and-lightning',
    when: 'Action',
    note: 'Staff · both at once, without spending their own uses',
    label: 'Both',
    disabled: left('staffBoth') <= 0,
    run: () => staffStorm('staffBoth')
  },
  {
    id: 'boots',
    name: 'Boots of Speed',
    to: '/tempest/items/boots-of-speed',
    when: 'Bonus',
    note: state.value.boots ? `Speed ${speed.value} · opportunity attacks have disadvantage` : `Double speed · ${left('boots')} of 10 minutes left`,
    label: state.value.boots ? 'Off' : 'On',
    active: state.value.boots,
    disabled: !state.value.boots && left('boots') <= 0,
    run: toggleBoots
  },
  {
    id: 'emblem',
    name: 'Guardian Emblem',
    to: '/tempest/items/sentinel-shield',
    when: 'Reaction',
    note: 'A critical hit on him or a friend within 30 ft becomes a normal hit',
    label: 'Use',
    disabled: left('emblem') <= 0,
    run: () => {
      use('emblem')
      note('Guardian Emblem', `The critical hit is a normal hit · ${left('emblem')} charges left`)
    }
  },
  {
    id: 'intervention',
    name: 'Divine Intervention',
    to: '/tempest#features',
    when: 'Action',
    note: state.value.kordAnswered ? 'Kord answered: not again until 7 days have passed' : 'Kord answers on a d100 of 10 or lower',
    label: 'Pray',
    disabled: left('intervention') <= 0,
    run: intervention
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
        <div class="flex max-w-[7.5rem] flex-wrap justify-end gap-1.5" :aria-label="`${left(t.id)} of ${maxOf(t.id)} left`">
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
        <button
          type="button"
          class="btn min-w-[4.5rem] px-2 py-1 text-[11.5px]"
          :class="t.active ? 'border-sapphire/60 bg-sapphire/10 text-sapphire' : ''"
          :disabled="t.disabled"
          @click="t.run()"
        >{{ t.label }}</button>
      </li>
    </ul>
    <label v-if="state.kordAnswered" class="mt-2 flex cursor-pointer items-center gap-2 border-t border-obsidian-600/60 pt-2 text-[12px] text-dim">
      <input v-model="state.kordAnswered" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" />
      Kord answered within the last 7 days (untick when they have passed)
    </label>
    <p class="mt-2 text-[11px] text-faint">The staff’s storms each come back at dawn. Its Lightning and Thunder properties are on the staff’s card under Attacks.</p>
  </section>
</template>
