<script setup lang="ts">
import { character, lesserDao as dao } from '~/data/character'

const { state, inForm } = useTracker()
const { roll } = useDice()

const atk = derived.spellAttack
const beams = derived.eldritchBeams
const ago = derived.agonizing
const wrath = derived.genieWrath

// +1 magic dagger, finesse: DEX (higher than STR) + proficiency (simple weapons)
const daggerHit = abilityMod('dex') + character.proficiencyBonus + 1
const daggerMod = abilityMod('dex') + 1

// Hex follows concentration unless switched by hand
const hexOverride = ref<boolean | null>(null)
const hex = computed({
  get: () => hexOverride.value ?? state.value.concentration === 'hex',
  set: v => (hexOverride.value = v)
})
watch(() => state.value.concentration, () => (hexOverride.value = null))

// One damage roll doubles its dice, then the toggle switches off
const crit = ref(false)
function damage(notation: string, label: string) {
  roll(crit.value ? critDice(notation) : notation, crit.value ? `${label} · critical` : label)
  crit.value = false
}

const hexDie = computed(() => (hex.value ? '+1d6' : ''))
const hexTag = computed(() => (hex.value ? ' +Hex' : ''))
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden" :class="inForm ? 'border-topaz/40' : ''">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <div>
        <p class="eyebrow" :class="inForm ? 'text-topaz' : ''">{{ inForm ? 'Form of the Lesser Dao' : 'Attack rolls · damage' }}</p>
        <h2 class="heading text-lg">Attacks</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition" :class="hex ? 'border-verdigris/50 bg-verdigris/10 text-verdigris' : 'border-obsidian-600 text-dim'">
          <input v-model="hex" type="checkbox" class="h-3.5 w-3.5 accent-[#7fb07a]" />
          Hex +1d6
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition" :class="crit ? 'border-gold/60 bg-gold/15 text-gold-light' : 'border-obsidian-600 text-dim'">
          <input v-model="crit" type="checkbox" class="h-3.5 w-3.5 accent-[#d6a84f]" />
          Critical hit
        </label>
      </div>
    </div>

    <!-- The form's own attacks -->
    <div v-if="inForm" class="p-5">
      <p class="text-[12.5px] text-dim"><span class="font-semibold text-parchment">Action:</span> {{ dao.multiattack }}</p>
      <ul class="mt-3 space-y-2.5">
        <li v-for="a in dao.attacks" :key="a.name" class="rounded-xl border border-obsidian-600 bg-obsidian-950/50 p-3">
          <div class="flex flex-wrap items-baseline justify-between gap-x-3">
            <span class="font-display text-[15px] font-semibold tracking-wide text-parchment">{{ a.name }}</span>
            <span class="text-[11.5px] text-faint">{{ a.kind }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <RollButton :notation="`1d20+${a.toHit}`" :label="`${a.name} — attack`">Attack {{ signed(a.toHit) }}</RollButton>
            <button type="button" class="btn" @click="damage(`${a.damage}${hexDie}`, `${a.name} damage (${a.type}${hexTag})`)">
              Damage <span class="tabular-nums text-faint">{{ a.damage }}{{ hexDie }}</span>
            </button>
          </div>
          <p v-if="a.effect" class="mt-2 text-[12px] leading-relaxed text-dim">{{ a.effect }}</p>
        </li>
      </ul>
      <p v-if="hex" class="mt-2 text-[11px] text-verdigris/90">Hex only adds to hits on the cursed creature.</p>
      <p class="mt-3 text-[11.5px] text-faint">Eldritch Blast and the Crystal Dagger come back when the form ends.</p>
    </div>

    <template v-else>
      <!-- Eldritch Blast -->
      <div class="border-b border-obsidian-600/70 p-5">
        <div class="flex flex-wrap items-baseline justify-between gap-x-3">
          <NuxtLink to="/spells/eldritch-blast" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Eldritch Blast</NuxtLink>
          <span class="text-[11.5px] text-faint">Action · 120 ft · {{ beams }} beams, separate attacks</span>
        </div>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <div class="mb-1.5 text-[10.5px] uppercase tracking-[0.14em] text-faint">To hit {{ signed(atk) }}</div>
            <div class="flex flex-wrap gap-1.5">
              <RollButton v-for="b in beams" :key="b" :notation="`1d20+${atk}`" :label="`Eldritch Blast — beam ${b}`">Beam {{ b }}</RollButton>
            </div>
          </div>
          <div>
            <div class="mb-1.5 text-[10.5px] uppercase tracking-[0.14em] text-faint">Damage per hit</div>
            <div class="flex flex-wrap gap-1.5">
              <button type="button" class="btn" :title="`1d10${hexDie}+${ago + wrath}: Agonizing +${ago}, Genie’s Wrath +${wrath}`" @click="damage(`1d10${hexDie}+${ago + wrath}`, `Eldritch Blast — first hit (+Agonizing +Wrath${hexTag})`)">
                1st hit <span class="tabular-nums text-faint">1d10{{ hexDie }}+{{ ago + wrath }}</span>
              </button>
              <button type="button" class="btn" :title="`1d10${hexDie}+${ago}: Agonizing +${ago}`" @click="damage(`1d10${hexDie}+${ago}`, `Eldritch Blast — another hit (+Agonizing${hexTag})`)">
                Other hits <span class="tabular-nums text-faint">1d10{{ hexDie }}+{{ ago }}</span>
              </button>
            </div>
          </div>
        </div>
        <ul class="mt-3 grid gap-x-4 gap-y-1 text-[12px] text-dim sm:grid-cols-2">
          <li><span class="text-parchment">Genie’s Wrath</span> +{{ wrath }} bludgeoning, first hit each turn</li>
          <li><span class="text-parchment">Repelling Blast</span> push 10 ft, once per target</li>
          <li><span class="text-parchment">Grasp of Hadar</span> pull 10 ft, once per turn</li>
          <li><span class="text-parchment">Crusher</span> move 5 ft on the bludgeoning hit</li>
        </ul>
        <p v-if="hex" class="mt-2 text-[11px] text-verdigris/90">Hex only adds to hits on the cursed creature.</p>
      </div>

      <!-- Crystal Dagger -->
      <div class="p-5">
        <div class="flex flex-wrap items-baseline justify-between gap-x-3">
          <NuxtLink to="/items/pact-keepers-crystal-dagger" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Pact Keeper’s Crystal Dagger</NuxtLink>
          <span class="text-[11.5px] text-faint">Action · finesse · thrown 30 ft, returns</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <RollButton :notation="`1d20+${daggerHit}`" label="Crystal Dagger — attack">Attack {{ signed(daggerHit) }}</RollButton>
          <button type="button" class="btn" @click="damage(`5d4${hexDie}+${daggerMod + wrath}`, `Crystal Dagger damage (+Wrath${hexTag})`)">
            Damage + Wrath <span class="tabular-nums text-faint">5d4{{ hexDie }}+{{ daggerMod + wrath }}</span>
          </button>
          <button type="button" class="btn" @click="damage(`5d4${hexDie}+${daggerMod}`, `Crystal Dagger damage${hexTag ? ` (${hexTag.trim()})` : ''}`)">
            Damage <span class="tabular-nums text-faint">5d4{{ hexDie }}+{{ daggerMod }}</span>
          </button>
        </div>
        <p class="mt-2 text-[12px] text-dim">1d4+{{ daggerMod }} piercing, 2d4 force and 2d4 bludgeoning, so every hit can trigger Crusher.</p>
      </div>
    </template>
  </section>
</template>
