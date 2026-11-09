<script setup lang="ts">
import { character, stats } from '~/data/characters/gloom-stalker/character'
import { spells } from '~/data/characters/gloom-stalker/spells'
import { levelLabel } from '~/data/characters/shared'

const { state, left, maxOf, use, slotsLeft, useSlot, spendHitDie, shortRest, longRest, dropConcentration } = useGloomStalkerTracker()
const { note } = useDice()

const concentrationSpells = computed(() => spells.filter(s => s.concentration && ['known', 'always', 'prepared'].includes(s.status)))
const slotLevels = character.slots.map((count, i) => ({ level: i + 1, count }))
const conMod = stats.abilities.con.check

// The uses that come back on a long rest; potions and arrows are under Items & Features
const pools = [
  { id: 'mark', label: 'Hunter’s Mark, free casts', rest: 'Long rest' },
  { id: 'dreadful', label: 'Dreadful Strike', rest: 'Long rest' },
  { id: 'longstrider', label: 'Longstrider, free cast', rest: 'Long rest' }
]

function onConcentration(slug: string) {
  if (!slug) return dropConcentration()
  state.value.concentration = slug
  state.value.concentrationLevel = spells.find(s => s.slug === slug)?.level ?? 0
}

function rest(kind: 'short' | 'long') {
  if (kind === 'short') shortRest()
  else longRest()
  note(kind === 'short' ? 'Short rest' : 'Long rest', kind === 'short' ? 'Spend Hit Point Dice to heal' : 'HP, Hit Point Dice, slots and daily uses restored')
}
</script>

<template>
  <section class="panel scroll-mt-48 p-5">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="heading text-lg">Resources</h2>
      <span class="text-[10.5px] text-faint">Saved in this browser</span>
    </div>

    <!-- Spell slots -->
    <div class="flex items-center justify-between">
      <span class="eyebrow text-dim">Spell slots</span>
      <span class="text-[10.5px] text-faint">Long rest</span>
    </div>
    <ul class="mt-2 space-y-1.5">
      <li v-for="g in slotLevels" :key="g.level" class="flex items-center gap-3">
        <span class="w-9 text-[12px] font-semibold tabular-nums text-dim">{{ levelLabel(g.level) }}</span>
        <div class="flex flex-1 gap-1.5">
          <button
            v-for="i in g.count"
            :key="i"
            type="button"
            class="h-8 flex-1 rounded-lg border text-[11px] font-semibold transition"
            :class="i <= slotsLeft(g.level) ? 'border-sapphire/50 bg-sapphire/15 text-sapphire hover:bg-sapphire/25' : 'border-obsidian-600 bg-obsidian-950/60 text-faint hover:border-obsidian-500'"
            :aria-label="i <= slotsLeft(g.level) ? `Spend a ${levelLabel(g.level)}-level slot` : `Restore a ${levelLabel(g.level)}-level slot`"
            @click="useSlot(g.level, i <= slotsLeft(g.level) ? 1 : -1)"
          >{{ i <= slotsLeft(g.level) ? 'Ready' : 'Spent' }}</button>
        </div>
      </li>
    </ul>
    <p class="mt-2 text-[11px] text-faint">Casting from the Spells list spends a free use first, then a slot. 2nd-level slots open at level 5.</p>

    <!-- Daily uses -->
    <ul class="mt-4 space-y-2 border-t border-obsidian-600 pt-4">
      <li v-for="p in pools" :key="p.id" class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-[13px] font-medium text-parchment">{{ p.label }}</div>
          <div class="text-[11px] text-faint">{{ left(p.id) }} / {{ maxOf(p.id) }} left · {{ p.rest }}</div>
        </div>
        <div class="flex gap-1.5">
          <button
            v-for="i in maxOf(p.id)"
            :key="i"
            type="button"
            class="h-3.5 w-3.5 rotate-45 rounded-[2px] border transition"
            :class="i <= left(p.id) ? 'border-gold/70 bg-gold/40 hover:bg-gold/60' : 'border-obsidian-500 bg-obsidian-900 hover:border-gold/40'"
            :title="i <= left(p.id) ? 'Mark as used' : 'Mark as unused'"
            @click="use(p.id, i <= left(p.id) ? 1 : -1)"
          />
        </div>
      </li>
    </ul>

    <!-- Hit Point Dice -->
    <div class="mt-4 flex items-center justify-between gap-3 border-t border-obsidian-600 pt-4">
      <div>
        <div class="text-[13px] font-medium text-parchment">Hit Point Dice (d{{ character.hitDie }})</div>
        <div class="text-[11px] text-faint">{{ character.level - state.hitDiceUsed }} / {{ character.level }} left · {{ signed(conMod) }} CON each</div>
      </div>
      <button type="button" class="btn shrink-0 py-2" :disabled="state.hitDiceUsed >= character.level" @click="spendHitDie">Spend 1</button>
    </div>

    <!-- Concentration and Hunter's Mark's target -->
    <div class="mt-4 border-t border-obsidian-600 pt-4">
      <label class="eyebrow mb-1.5 block text-dim" for="gloom-stalker-conc">Concentrating on</label>
      <select id="gloom-stalker-conc" :value="state.concentration" class="field py-2" @change="onConcentration(($event.target as HTMLSelectElement).value)">
        <option value="">— nothing —</option>
        <option v-for="s in concentrationSpells" :key="s.slug" :value="s.slug">{{ s.name }}</option>
      </select>
      <template v-if="state.concentration === 'hunters-mark'">
        <label class="eyebrow mb-1.5 mt-3 block text-dim" for="gloom-stalker-quarry">Marked quarry</label>
        <input id="gloom-stalker-quarry" v-model="state.markTarget" type="text" placeholder="Who carries the mark" class="field py-2" />
      </template>
      <p class="mt-1.5 text-[11px] text-faint">Taking damage rolls the concentration save for you (CON {{ signed(stats.abilities.con.save) }}, DC 10 or half the damage) and drops the spell if it fails.</p>
    </div>

    <label class="mt-3 flex cursor-pointer items-center gap-2 text-[13px] text-dim">
      <input v-model="state.inspiration" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" />
      Heroic Inspiration <span class="text-[11px] text-faint">· reroll one die · when the DM gives it</span>
    </label>

    <div class="mt-5 grid grid-cols-2 gap-2">
      <button type="button" class="btn py-2.5" @click="rest('short')">☾ Short rest</button>
      <button type="button" class="btn btn-gold py-2.5" @click="rest('long')">✦ Long rest</button>
    </div>
    <p class="mt-2 text-[10.5px] leading-relaxed text-faint">
      Nothing of theirs comes back on a short rest; spend Hit Point Dice to heal. A long rest restores HP, every Hit Point Die (2024), slots and daily uses, removes one level of exhaustion and clears conditions. Potions and arrows don’t come back.
    </p>
  </section>
</template>
