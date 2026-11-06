<script setup lang="ts">
import { character, stats } from '~/data/characters/tempest/character'
import { spells } from '~/data/characters/tempest/spells'
import { levelLabel } from '~/data/characters/shared'

const { state, left, maxOf, use, slotsLeft, useSlot, heal, shortRest, longRest, dropConcentration } = useTempestTracker()
const { roll, note } = useDice()

const concentrationSpells = computed(() => spells.filter(s => s.concentration && ['known', 'domain', 'prepared'].includes(s.status)))
const slotLevels = character.slots.map((count, i) => ({ level: i + 1, count }))
const conMod = stats.abilities.con.check

// The class and feature uses that come back on a rest; the items' are under Items & Features
const pools = [
  { id: 'channel', label: 'Channel Divinity', rest: 'Short rest' },
  { id: 'devout', label: 'Amulet: free Channel Divinity', rest: 'Dawn' },
  { id: 'wrath', label: 'Wrath of the Storm', rest: 'Long rest' },
  { id: 'shield', label: 'Shield (Magic Initiate)', rest: 'Long rest' }
]

function spendHitDie() {
  if (state.value.hitDiceUsed >= character.level) return
  state.value.hitDiceUsed++
  heal(Math.max(0, roll(`1d8+${conMod}`, 'Hit Die').total))
}

function onConcentration(slug: string) {
  if (!slug) return dropConcentration()
  state.value.concentration = slug
  state.value.concentrationLevel = spells.find(s => s.slug === slug)?.level ?? 0
}

function rest(kind: 'short' | 'long') {
  if (kind === 'short') shortRest()
  else longRest()
  note(kind === 'short' ? 'Short rest' : 'Long rest', kind === 'short' ? 'Channel Divinity restored' : 'HP, slots and daily uses restored')
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
    <p class="mt-2 text-[11px] text-faint">Casting from the Spells list spends the slot level picked there.</p>

    <!-- Class uses -->
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

    <!-- Hit Dice -->
    <div class="mt-4 flex items-center justify-between gap-3 border-t border-obsidian-600 pt-4">
      <div>
        <div class="text-[13px] font-medium text-parchment">Hit Dice (d8)</div>
        <div class="text-[11px] text-faint">{{ character.level - state.hitDiceUsed }} / {{ character.level }} left · {{ signed(conMod) }} CON each</div>
      </div>
      <button type="button" class="btn shrink-0 py-2" :disabled="state.hitDiceUsed >= character.level" @click="spendHitDie">Spend 1</button>
    </div>

    <!-- Concentration -->
    <div class="mt-4 border-t border-obsidian-600 pt-4">
      <label class="eyebrow mb-1.5 block text-dim" for="tempest-conc">Concentrating on</label>
      <select id="tempest-conc" :value="state.concentration" class="field py-2" @change="onConcentration(($event.target as HTMLSelectElement).value)">
        <option value="">— nothing —</option>
        <option v-for="s in concentrationSpells" :key="s.slug" :value="s.slug">{{ s.name }}</option>
      </select>
      <p class="mt-1.5 text-[11px] text-faint">Taking damage rolls the concentration save for you (CON {{ signed(stats.abilities.con.save) }}, with War Caster’s advantage) and drops the spell if it fails.</p>
    </div>

    <label class="mt-3 flex cursor-pointer items-center gap-2 text-[13px] text-dim">
      <input v-model="state.inspiration" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" />
      Inspiration
    </label>

    <div class="mt-5 grid grid-cols-2 gap-2">
      <button type="button" class="btn py-2.5" @click="rest('short')">☾ Short rest</button>
      <button type="button" class="btn btn-gold py-2.5" @click="rest('long')">✦ Long rest</button>
    </div>
    <p class="mt-2 text-[10.5px] leading-relaxed text-faint">
      A short rest restores Channel Divinity. A long rest restores HP, slots and every daily use (the amulet’s, the staff’s, the girdle’s and the emblem’s come back at dawn), half his Hit Dice and one level of exhaustion, and clears conditions.
    </p>
  </section>
</template>
