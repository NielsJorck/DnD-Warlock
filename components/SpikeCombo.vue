<script setup lang="ts">
interface Step {
  id: string
  name: string
  feet: number
  how: string
  on: boolean
}

const steps = ref<Step[]>([
  { id: 'repel', name: 'Repelling Blast', feet: 10, how: 'Eldritch Blast hit — push away', on: true },
  { id: 'grasp', name: 'Grasp of Hadar', feet: 10, how: 'Same hit — pull back toward Lucan', on: true },
  { id: 'crusher', name: 'Crusher', feet: 5, how: 'Bludgeoning hit (Genie’s Wrath)', on: true },
  { id: 'tk', name: 'Telekinetic shove', feet: 5, how: `Bonus action · STR save DC ${derived.spellDcBase}`, on: true },
  { id: 'walk', name: 'Target walks out', feet: 20, how: 'Its own movement through the spikes', on: false }
])

const feet = computed(() => steps.value.filter(s => s.on).reduce((t, s) => t + s.feet, 0))
const dice = computed(() => (feet.value / 5) * 2)
</script>

<template>
  <div class="panel overflow-hidden">
    <div class="border-b border-gold/10 bg-gradient-to-r from-jade/10 via-transparent to-transparent p-5">
      <p class="eyebrow">Battlefield control</p>
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="heading text-xl">The Spike Growth Grinder</h3>
        <NuxtLink to="/spells/spike-growth" class="text-xs text-dim hover:text-gold-light">Spike Growth →</NuxtLink>
      </div>
      <p class="mt-1 text-sm text-dim">20-ft radius · 2d4 piercing for every 5 ft a creature moves inside it · concentration, 10 minutes</p>
    </div>

    <div class="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr]">
      <ul class="space-y-1.5">
        <li v-for="s in steps" :key="s.id">
          <label
            class="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition"
            :class="s.on ? 'border-jade/40 bg-jade/5' : 'border-obsidian-600 hover:border-obsidian-500'"
          >
            <input v-model="s.on" type="checkbox" class="h-4 w-4 accent-[#4fb39a]" />
            <span class="min-w-0 flex-1">
              <span class="block text-[13px] font-medium text-parchment">{{ s.name }}</span>
              <span class="block text-[11px] text-faint">{{ s.how }}</span>
            </span>
            <span class="text-right tabular-nums">
              <span class="block text-sm font-semibold text-jade">{{ s.feet }} ft</span>
              <span class="block text-[10.5px] text-faint">{{ (s.feet / 5) * 2 }}d4</span>
            </span>
          </label>
        </li>
      </ul>

      <div class="panel-inset flex flex-col p-4">
        <p class="eyebrow mb-2 text-dim">One turn of forced movement</p>
        <div class="flex min-h-5 flex-wrap gap-[3px]" aria-hidden="true">
          <span
            v-for="i in feet / 5"
            :key="i"
            class="h-5 w-5 border border-jade/50 bg-jade/25"
            style="clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
          />
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <div>
            <div class="text-[11px] text-faint">Distance</div>
            <div class="stat-num text-2xl">{{ feet }} ft</div>
          </div>
          <div class="text-right">
            <div class="text-[11px] text-faint">Spike damage</div>
            <div class="stat-num text-gilded text-3xl">≈{{ Math.round(dice * 2.5) }}</div>
          </div>
        </div>
        <div class="mt-3">
          <RollButton v-if="dice" :notation="`${dice}d4`" label="Spike Growth damage">Roll {{ dice }}d4</RollButton>
        </div>
        <p class="mt-auto pt-3 text-[11px] leading-relaxed text-faint">
          Added to the ≈20 from the blast itself. Whether forced movement triggers Spike Growth is up to the DM. The common reading of “moves into or within” says it does.
        </p>
      </div>
    </div>
  </div>
</template>
