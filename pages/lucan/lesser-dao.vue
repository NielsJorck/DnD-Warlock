<script setup lang="ts">
import { character, lesserDao as dao, abilityNames } from '~/data/characters/lucan/character'

useHead({ title: 'Form of the Lesser Dao — Lucan Beryll' })

const plain = (s: string) => s.split(' (')[0] // "Cold (Sash of Summer)" → "Cold"

const quick = [
  { label: 'Armor Class', value: String(dao.ac), sub: 'Same as Lucan' },
  { label: 'Form HP', value: String(dao.hp), sub: 'In front of his own' },
  { label: 'Attacks', value: '2 × +9', sub: 'Maul, burst or fist' },
  { label: 'Save DC', value: String(dao.saveDc), sub: 'Strength, or prone' },
  { label: 'Speed', value: '30', sub: 'Walk, burrow, fly' },
  { label: 'Darkvision', value: '120', sub: 'ft' }
]

// Lucan next to the form; `better` marks where the form comes out ahead
const compare = [
  { label: 'Size', lucan: character.size, form: dao.size },
  { label: 'Armor Class', lucan: String(character.ac.total), form: String(dao.ac) },
  { label: 'Hit points', lucan: String(character.maxHp), form: `${dao.hp} more, taken first`, better: true },
  { label: 'Speed', lucan: `${character.speed} ft, fly 30 with Elemental Gift`, form: 'Walk, burrow and fly 30 ft, hovers', better: true },
  { label: 'Senses', lucan: plain(character.senses[0]), form: dao.senses, better: true },
  ...abilityOrder.map(k => {
    const l = lucanStats.abilities[k]
    const f = formStats.abilities[k]
    return {
      label: abilityNames[k],
      lucan: `${l.score} · save ${signed(l.save)}`,
      form: `${f.score} · save ${signed(f.save)}`,
      better: f.save > l.save
    }
  }),
  { label: 'Attacks', lucan: `Eldritch Blast, ${derived.eldritchBeams} beams at ${signed(derived.spellAttack)}`, form: 'Two a turn at +9, 4d6 + 5 or 2d8 + 5' },
  { label: 'Spellcasting', lucan: `DC ${derived.spellDc}, attack ${signed(derived.spellAttack)}`, form: 'None; concentration carries on' },
  { label: 'Resistances', lucan: character.resistances.map(plain).join(', '), form: dao.resistances.join(', ') },
  { label: 'Condition immunity', lucan: '—', form: dao.conditionImmunities.join(', '), better: true },
  { label: 'Passive Perception', lucan: String(lucanStats.passive.perception), form: String(formStats.passive.perception) }
]
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(227,166,64,0.14),transparent_60%)]" aria-hidden="true" />
      <div class="pointer-events-none absolute -right-6 -top-16 font-display text-[240px] leading-none text-topaz/[0.07]" aria-hidden="true">⟁</div>
      <div class="relative grid gap-8 p-6 sm:p-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] xl:items-center">
        <div>
          <p class="eyebrow text-topaz">Bracers of the Dao Pact · {{ dao.uses }} / long rest</p>
          <h1 class="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-wide sm:text-6xl"><span class="text-gilded">Form of the Lesser Dao</span></h1>
          <p class="mt-3 font-serif text-xl italic text-dim">{{ dao.type }}</p>
          <div class="mt-5 flex flex-wrap gap-2">
            <span class="chip border-topaz/40 text-topaz">Homebrew</span>
            <span class="chip">{{ dao.activation }} to assume</span>
            <span class="chip">Lasts {{ dao.turns }} turns</span>
            <span class="chip">No spellcasting</span>
          </div>
          <p class="lore mt-6 max-w-2xl">
            Twice per long rest the Bracers turn Lucan into a Large earth genie for ten turns: a second body with its own hit points, two heavy attacks a turn and a way through solid stone.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <NuxtLink to="/lucan/session#items" class="btn btn-gold px-4 py-2 text-[13px]">Assume it in Session →</NuxtLink>
            <NuxtLink to="/lucan/items/bracers-of-the-dao-pact" class="btn px-4 py-2 text-[13px]">Bracers of the Dao Pact</NuxtLink>
          </div>
        </div>
        <dl class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <div v-for="q in quick" :key="q.label" class="rounded-xl border border-obsidian-600 bg-obsidian-950/70 px-4 py-3">
            <dt class="eyebrow truncate text-dim">{{ q.label }}</dt>
            <dd class="stat-num text-3xl">{{ q.value }}</dd>
            <dd class="truncate text-[11px] text-faint">{{ q.sub }}</dd>
          </div>
        </dl>
      </div>
    </header>

    <!-- Stat block | rules and tactics | side by side -->
    <div class="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px] 3xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_440px]">
      <LesserDaoPanel />

      <div class="space-y-6">
        <section class="panel p-5 sm:p-6">
          <p class="eyebrow">At this table</p>
          <h2 class="heading mb-4 text-xl">How the Form Works</h2>
          <ul class="space-y-2.5">
            <li v-for="r in dao.rules" :key="r" class="flex gap-3 text-[14px] leading-relaxed text-parchment/85">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-topaz/80" />{{ r }}
            </li>
          </ul>
        </section>

        <section class="panel p-5 sm:p-6">
          <p class="eyebrow">In a fight</p>
          <h2 class="heading mb-4 text-xl">Tactics</h2>
          <ol class="space-y-3">
            <li v-for="(t, n) in dao.tactics" :key="t" class="flex gap-3 text-[14px] leading-relaxed text-parchment/85">
              <span class="font-display text-lg font-bold leading-6 text-gold/50">{{ ['I', 'II', 'III', 'IV', 'V', 'VI'][n] }}</span>{{ t }}
            </li>
          </ol>
        </section>
      </div>

      <aside class="panel overflow-hidden xl:col-start-2 xl:row-span-2 xl:row-start-1 3xl:col-start-3 3xl:row-span-1">
        <div class="p-5 pb-3">
          <p class="eyebrow">Side by side</p>
          <h2 class="heading text-xl">Lucan and the Form</h2>
          <p class="mt-1 text-[11.5px] text-faint">Saves include the Stone of Good Luck’s +1. Gold marks where the form comes out ahead.</p>
        </div>
        <table class="w-full text-left text-[12.5px]">
          <thead class="border-y border-obsidian-600 bg-obsidian-950/60 text-[10px] uppercase tracking-[0.14em] text-faint">
            <tr>
              <th class="px-5 py-2 font-semibold"><span class="sr-only">Stat</span></th>
              <th class="px-2 py-2 font-semibold">Lucan</th>
              <th class="py-2 pl-2 pr-5 font-semibold text-topaz">Form</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-obsidian-600/60">
            <tr v-for="c in compare" :key="c.label" class="align-top">
              <th scope="row" class="px-5 py-2 font-medium text-dim">{{ c.label }}</th>
              <td class="px-2 py-2 text-parchment/85">{{ c.lucan }}</td>
              <td class="py-2 pl-2 pr-5" :class="c.better ? 'text-gold-light' : 'text-parchment/85'">{{ c.form }}</td>
            </tr>
          </tbody>
        </table>
      </aside>
    </div>
  </div>
</template>
