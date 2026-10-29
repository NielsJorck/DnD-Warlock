<script setup lang="ts">
import { resources, lesserDao } from '~/data/character'

const { state, inForm, left, use, heal, shortRest, assumeForm, endForm } = useTracker()
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

const triggers = computed<Trigger[]>(() => [
  {
    id: 'lesserDao',
    name: 'Lesser Dao form',
    to: '/lesser-dao',
    when: 'Bonus',
    note: inForm.value
      ? `${state.value.formTurns} of ${lesserDao.turns} turns left · ${state.value.form} form HP`
      : `${lesserDao.turns} turns · ${lesserDao.hp} form HP · no spellcasting`,
    label: inForm.value ? 'End form' : 'Assume',
    active: inForm.value,
    disabled: !inForm.value && left('lesserDao') <= 0,
    run: () => {
      if (inForm.value) return endForm()
      assumeForm()
      note('Form of the Lesser Dao', `${lesserDao.hp} form HP · ${lesserDao.turns} turns · no spellcasting`)
    }
  },
  {
    id: 'flight',
    name: 'Elemental Gift',
    to: '/#features',
    when: 'Bonus',
    note: 'Fly 30 ft for 10 minutes',
    label: state.value.flying ? 'Land' : 'Fly',
    active: state.value.flying,
    disabled: !state.value.flying && left('flight') <= 0,
    run: () => {
      if (state.value.flying) return void (state.value.flying = false)
      use('flight')
      state.value.flying = true
    }
  },
  {
    id: 'dagger',
    name: 'Dagger: regain slot',
    to: '/items/pact-keepers-crystal-dagger',
    when: 'Action',
    note: 'One spent pact slot comes back',
    label: 'Regain',
    disabled: left('dagger') <= 0 || !state.value.used.pact,
    run: () => {
      use('dagger')
      use('pact', -1)
      note('Pact slot regained', 'Pact Keeper’s Crystal Dagger')
    }
  },
  {
    id: 'potion',
    name: 'Superior Healing',
    to: '/items/potion-of-superior-healing',
    when: 'Action',
    note: 'Potion · 8d4 + 8 HP, average 28',
    label: 'Drink',
    disabled: left('potion') <= 0,
    run: () => {
      use('potion')
      heal(roll('8d4+8', 'Potion of Superior Healing').total)
    }
  },
  {
    id: 'protectors',
    name: 'Gift of the Protectors',
    to: '/#features',
    when: 'Free',
    note: 'A named creature drops to 1 HP instead of 0',
    label: 'Use',
    disabled: left('protectors') <= 0,
    run: () => use('protectors')
  },
  {
    id: 'scribing',
    name: 'Hidden writing',
    to: '/items/the-golden-pact',
    when: 'Action',
    note: 'Golden Pact · one reader for 24 hours',
    label: 'Use',
    disabled: left('scribing') <= 0,
    run: () => use('scribing')
  },
  {
    id: 'vesselRest',
    name: 'Sanctuary Vessel',
    to: '/vessel',
    when: '10 min',
    note: 'Counts as a short rest for six',
    label: 'Rest',
    disabled: left('vesselRest') <= 0,
    run: () => {
      shortRest()
      use('vesselRest')
      note('Sanctuary Vessel rest', 'Short rest: pact slots restored. Hit Dice heal +4 each')
    }
  }
])

const max = (id: string) => resources.find(r => r.id === id)?.max ?? 0

// Lesser Wand of Lightning Bolts: 1 charge = 3rd level (8d6), +1d6 per extra charge
const charges = ref(1)
const wandLeft = computed(() => left('wand'))
watch(wandLeft, n => (charges.value = Math.max(1, Math.min(charges.value, n))))
function zap() {
  const n = charges.value
  // The wand casts Lightning Bolt, and the form can't cast
  if (n > wandLeft.value || inForm.value) return
  use('wand', n)
  roll(`${7 + n}d6`, `Lightning Bolt (level ${2 + n}) · DC 15 DEX, half on a save`)
  if (wandLeft.value === 0) note('The wand crumbles to ashes', 'Its last charge is spent')
}
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-2">
      <p class="eyebrow">Things Lucan can trigger</p>
      <h2 class="heading text-lg">Items &amp; Features</h2>
    </div>

    <!-- One tight row each: what and when on the left, uses and the button on the right. Two columns where the card is wide -->
    <ul class="grid gap-x-6 xl:grid-cols-2 2xl:grid-cols-1 3xl:grid-cols-2 [&>li]:border-t [&>li]:border-obsidian-600/60">
      <li v-for="t in triggers" :key="t.id" class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2.5 py-1.5" :title="t.note">
        <div class="min-w-0 leading-snug">
          <div class="truncate text-[13px]">
            <NuxtLink :to="t.to" class="font-medium text-parchment hover:text-gold-light">{{ t.name }}</NuxtLink>
            <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">{{ t.when }}</span>
          </div>
          <div class="truncate text-[11px] text-faint">{{ t.note }}</div>
        </div>
        <div class="flex gap-1.5" :aria-label="`${left(t.id)} of ${max(t.id)} left`">
          <button
            v-for="i in max(t.id)"
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
          :class="t.active ? 'border-topaz/60 bg-topaz/10 text-topaz' : ''"
          :disabled="t.disabled"
          @click="t.run()"
        >{{ t.label }}</button>
      </li>

      <!-- Wand: pick the charges, then zap -->
      <li class="py-1.5">
        <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5">
          <div class="min-w-0 leading-snug">
            <div class="truncate text-[13px]">
              <NuxtLink to="/items/lesser-wand-of-lightning-bolts" class="font-medium text-parchment hover:text-gold-light">Wand of Lightning Bolts</NuxtLink>
              <span class="ml-1.5 text-[10px] uppercase tracking-wider text-faint">Action</span>
            </div>
            <div class="truncate text-[11px] text-faint">{{ wandLeft ? `100-ft line · DC 15 DEX · ${wandLeft} of ${max('wand')} charges, no recharge` : 'Spent. The wand crumbled to ashes' }}</div>
          </div>
          <button
            v-if="wandLeft"
            type="button"
            class="btn min-w-[4.5rem] border-sapphire/50 px-2 py-1 text-[11.5px] text-sapphire hover:border-sapphire"
            :disabled="inForm"
            :title="inForm ? 'No spellcasting in the Lesser Dao form' : `Average ${Math.round((7 + charges) * 3.5)} damage`"
            @click="zap"
          >⚡ {{ 7 + charges }}d6</button>
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <label v-if="wandLeft" class="flex items-center gap-1.5 text-[11.5px] text-dim">
            Charges
            <select v-model.number="charges" class="field w-auto px-2 py-0.5 text-[12px]">
              <option v-for="n in Math.min(wandLeft, 7)" :key="n" :value="n">{{ n }} · level {{ 2 + n }}</option>
            </select>
          </label>
          <div class="ml-auto flex gap-1.5" :aria-label="`${wandLeft} of ${max('wand')} charges left`">
            <button
              v-for="i in max('wand')"
              :key="i"
              type="button"
              class="h-3 w-3 rotate-45 rounded-[2px] border transition"
              :class="i <= wandLeft ? 'border-sapphire/70 bg-sapphire/40' : 'border-obsidian-500 bg-obsidian-900'"
              :title="i <= wandLeft ? 'Mark charge as used' : 'Restore charge'"
              @click="use('wand', i <= wandLeft ? 1 : -1)"
            />
          </div>
        </div>
      </li>

      <li><SpellStoringRing /></li>
      <li><SessionSpellGem /></li>
    </ul>
  </section>
</template>
