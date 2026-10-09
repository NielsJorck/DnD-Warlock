<script setup lang="ts">
const ac = ref(15)
const advantage = ref(false)
const split = ref(false)

const beams = derived.eldritchBeams
const atk = derived.spellAttack
const ago = derived.agonizing
const wrath = derived.genieWrath

const stats = computed(() => {
  const p = hitChance(atk, ac.value, advantage.value)
  const crit = advantage.value ? 1 - 0.95 ** 2 : 0.05
  const anyHit = 1 - (1 - p) ** beams
  const perBeamDice = p * 5.5 + crit * 5.5
  const expected = split.value
    ? beams * (perBeamDice + p * ago) + anyHit * wrath
    : beams * perBeamDice + anyHit * (ago + wrath)
  const allHit = split.value ? beams * (5.5 + ago) + wrath : beams * 5.5 + ago + wrath
  return { p, expected, allHit }
})
const pct = (n: number) => `${Math.round(n * 100)}%`
</script>

<template>
  <div class="panel overflow-hidden">
    <div class="relative border-b border-gold/10 bg-gradient-to-r from-amethyst/10 via-transparent to-transparent p-5">
      <p class="eyebrow">Signature attack</p>
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="heading text-xl">Eldritch Blast</h3>
        <NuxtLink to="/spells/eldritch-blast" class="text-xs text-dim hover:text-gold-light">Spell details →</NuxtLink>
      </div>
      <p class="mt-1 text-sm text-dim">120 ft · {{ beams }} beams · each beam is a separate attack</p>
    </div>

    <div class="grid gap-5 p-5 md:grid-cols-[1fr_1.1fr]">
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="panel-inset py-2.5">
            <div class="eyebrow text-dim">To hit</div>
            <div class="stat-num text-2xl">{{ signed(atk) }}</div>
          </div>
          <div class="panel-inset py-2.5">
            <div class="eyebrow text-dim">Per beam</div>
            <div class="stat-num text-2xl">1d10</div>
          </div>
          <div class="panel-inset py-2.5">
            <div class="eyebrow text-dim">All hit</div>
            <div class="stat-num text-2xl">≈{{ Math.round(stats.allHit) }}</div>
          </div>
        </div>
        <ul class="space-y-1.5 text-[13px] text-dim">
          <li class="flex justify-between gap-3"><span><span class="text-parchment">Agonizing Blast</span> · once per target</span><span class="tabular-nums text-gold-light">+{{ ago }} force</span></li>
          <li class="flex justify-between gap-3"><span><span class="text-parchment">Genie’s Wrath</span> · once per turn</span><span class="tabular-nums text-gold-light">+{{ wrath }} bludgeoning</span></li>
          <li class="flex justify-between gap-3"><span><span class="text-parchment">Repelling Blast</span> · once per target</span><span class="text-gold-light">push 10 ft</span></li>
          <li class="flex justify-between gap-3"><span><span class="text-parchment">Grasp of Hadar</span> · once per turn</span><span class="text-gold-light">pull 10 ft</span></li>
          <li class="flex justify-between gap-3"><span><span class="text-parchment">Crusher</span> · once per turn</span><span class="text-gold-light">move 5 ft</span></li>
        </ul>
        <div class="flex flex-wrap gap-1.5 pt-1">
          <RollButton :notation="`1d20+${atk}`" label="Eldritch Blast — beam 1">Beam 1</RollButton>
          <RollButton :notation="`1d20+${atk}`" label="Eldritch Blast — beam 2">Beam 2</RollButton>
          <RollButton :notation="`1d10+${ago + wrath}`" label="First hit damage (+Agonizing +Wrath)">1st hit dmg</RollButton>
          <RollButton
            :notation="split ? `1d10+${ago}` : '1d10'"
            :label="split ? 'Hit on second target (+Agonizing)' : 'Extra beam damage'"
          >{{ split ? '2nd target' : 'Extra beam' }}</RollButton>
        </div>
      </div>

      <div class="panel-inset p-4">
        <p class="eyebrow mb-3 text-dim">Expected damage</p>
        <label class="flex items-center justify-between gap-3 text-[13px]">
          <span class="text-dim">Target AC</span>
          <span class="flex items-center gap-2">
            <input v-model.number="ac" type="range" min="10" max="24" class="w-28 accent-[#d6a84f]" aria-label="Target AC" />
            <span class="stat-num w-6 text-right">{{ ac }}</span>
          </span>
        </label>
        <div class="mt-3 grid grid-cols-2 gap-1 rounded-lg border border-obsidian-600 p-1 text-xs">
          <button type="button" class="rounded-md py-1.5 transition" :class="!split ? 'bg-gold/15 text-gold-light' : 'text-dim hover:text-parchment'" @click="split = false">One target</button>
          <button type="button" class="rounded-md py-1.5 transition" :class="split ? 'bg-gold/15 text-gold-light' : 'text-dim hover:text-parchment'" @click="split = true">Split beams</button>
        </div>
        <label class="mt-3 flex cursor-pointer items-center gap-2 text-[13px] text-dim">
          <input v-model="advantage" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" />
          Advantage <span class="text-faint">(e.g. Shadow of Moil)</span>
        </label>
        <div class="mt-4 flex items-end justify-between border-t border-obsidian-600 pt-3">
          <div>
            <div class="text-[11px] text-faint">Hit chance per beam</div>
            <div class="stat-num text-xl">{{ pct(stats.p) }}</div>
          </div>
          <div class="text-right">
            <div class="text-[11px] text-faint">Average per turn</div>
            <div class="stat-num text-gilded text-4xl">{{ stats.expected.toFixed(1) }}</div>
          </div>
        </div>
        <p class="mt-3 text-[11px] leading-relaxed text-faint">
          Under the campaign’s once-per-target rule, splitting the beams adds Agonizing to each target and pushes both of them.
        </p>
      </div>
    </div>
  </div>
</template>
