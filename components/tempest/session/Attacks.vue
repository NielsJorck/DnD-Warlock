<script setup lang="ts">
import { stats } from '~/data/characters/tempest/character'
import { spellBySlug } from '~/data/characters/tempest/spells'

const { state, left, use, channelLeft, rollDamage, startAvatar } = useTempestTracker()
const { note } = useDice()

// One damage roll doubles its dice, then the toggle switches off
const crit = ref(false)
function dmg(notation: string, label: string, storm = false) {
  rollDamage(notation, label, { storm, crit: crit.value })
  crit.value = false
}

const staffHit = stats.staffAttack
const staffDmg = `1d6+${stats.staffDamage}`
// As a storm avatar the staff's bludgeoning turns to thunder, which Destructive Wrath can max
const staffType = computed(() => (state.value.avatar ? 'thunder' : 'bludgeoning'))

const guardians = computed(() => (state.value.concentration === 'spirit-guardians' ? state.value.concentrationLevel || 3 : 0))
const guardiansDice = computed(() => spellBySlug['spirit-guardians']?.dice?.[guardians.value] ?? `${guardians.value}d8`)
const weaponDice = computed(() => spellBySlug['spiritual-weapon']?.dice?.[state.value.weapon] ?? `${state.value.weapon >= 4 ? 2 : 1}d8+${stats.abilities.wis.check}`)

function primeWrath(on: boolean) {
  if (on && channelLeft.value <= 0) return
  state.value.wrathReady = on
}

function staffProperty(id: 'staffLightning' | 'staffThunder') {
  if (left(id) <= 0) return
  use(id)
  if (id === 'staffLightning') dmg('2d6', 'Staff: Lightning (lightning)', true)
  else note('Staff: Thunder', 'Heard 300 ft away · DC 17 CON or stunned until the end of his next turn')
}

function wrathOfTheStorm(type: 'lightning' | 'thunder') {
  if (left('wrath') <= 0) return
  use('wrath')
  dmg('2d8', `Wrath of the Storm (${type}) · DC ${stats.spellDc} DEX, half on a save`, true)
}

// Where a primed Destructive Wrath is worth the most: the maximum against the average
const wrathTargets = [
  { what: 'Staff: Lightning Strike', dice: '9d6', max: 54, gain: 22.5 },
  { what: 'Destructive Wave', dice: '5d10 thunder', max: 50, gain: 22.5 },
  { what: 'Call Lightning, 5th', dice: '5d10', max: 50, gain: 22.5 },
  { what: 'Shatter, 5th', dice: '6d8', max: 48, gain: 21 },
  { what: 'Shatter, 3rd', dice: '4d8', max: 32, gain: 14 },
  { what: 'Stormgirdle bolt', dice: '3d6', max: 18, gain: 7.5 },
  { what: 'Wrath of the Storm', dice: '2d8', max: 16, gain: 7 }
]
</script>

<template>
  <section class="panel scroll-mt-48 overflow-hidden" :class="state.avatar ? 'border-sapphire/40' : ''">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gold/10 p-5 pb-4">
      <div>
        <p v-if="state.avatar" class="eyebrow text-sapphire">Storm Avatar</p>
        <h2 class="heading text-lg">Attacks</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <label
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition"
          :class="state.wrathReady ? 'border-topaz/60 bg-topaz/10 text-topaz' : channelLeft ? 'border-obsidian-600 text-dim' : 'cursor-not-allowed border-obsidian-600 text-faint opacity-60'"
          :title="channelLeft ? 'Spends a Channel Divinity on the next lightning or thunder roll and makes it the maximum. The amulet’s free one goes last' : 'No Channel Divinity left'"
        >
          <input :checked="state.wrathReady" type="checkbox" class="h-3.5 w-3.5 accent-[#e3a640]" :disabled="!channelLeft && !state.wrathReady" @change="primeWrath(($event.target as HTMLInputElement).checked)" />
          Destructive Wrath <span class="text-faint">{{ channelLeft }}</span>
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition" :class="crit ? 'border-gold/60 bg-gold/15 text-gold-light' : 'border-obsidian-600 text-dim'">
          <input v-model="crit" type="checkbox" class="h-3.5 w-3.5 accent-[#d6a84f]" />
          Critical hit
        </label>
      </div>
    </div>

    <!-- The staff -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/tempest/items/staff-of-thunder-and-lightning" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Staff of Thunder and Lightning</NuxtLink>
        <span class="text-[11.5px] text-faint">Action · one-handed · +2 magic</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <RollButton :notation="`1d20+${staffHit}`" label="Staff — attack">Attack {{ signed(staffHit) }}</RollButton>
        <button type="button" class="btn" @click="dmg(staffDmg, `Staff damage (${staffType})`, !!state.avatar)">
          Hit <span class="tabular-nums text-faint">{{ staffDmg }} {{ staffType }}</span>
        </button>
        <button type="button" class="btn" @click="dmg('1d8', 'Divine Strike (thunder)', true)">
          Divine Strike <span class="tabular-nums text-faint">1d8 thunder</span>
        </button>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <button type="button" class="btn border-sapphire/40 text-sapphire hover:border-sapphire" :disabled="left('staffLightning') <= 0" title="On a hit, once a day" @click="staffProperty('staffLightning')">
          ⚡ Lightning <span class="tabular-nums text-faint">2d6</span>
        </button>
        <button type="button" class="btn border-sapphire/40 text-sapphire hover:border-sapphire" :disabled="left('staffThunder') <= 0" title="On a hit, once a day" @click="staffProperty('staffThunder')">
          Thunder <span class="text-faint">DC 17 CON · stun</span>
        </button>
      </div>
      <p class="mt-2 text-[12px] text-dim">Divine Strike adds to one weapon hit a turn. The Lightning property’s 2d6 lets Thunderbolt Strike push 10 ft.</p>
    </div>

    <!-- Booming Blade -->
    <div class="border-b border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/tempest/spells/booming-blade" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Booming Blade</NuxtLink>
        <span class="text-[11.5px] text-faint">Action, or a War Caster opportunity attack · the staff</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <RollButton :notation="`1d20+${staffHit}`" label="Booming Blade — attack">Attack {{ signed(staffHit) }}</RollButton>
        <button type="button" class="btn" @click="dmg(staffDmg, `Booming Blade: staff (${staffType})`, !!state.avatar)">
          Hit <span class="tabular-nums text-faint">{{ staffDmg }}</span>
        </button>
        <button type="button" class="btn" @click="dmg('1d8', 'Booming Blade (thunder)', true)">
          Blade <span class="tabular-nums text-faint">1d8 thunder</span>
        </button>
        <button type="button" class="btn border-rose/40 text-rose hover:border-rose" @click="dmg('2d8', 'Booming Blade: it moved (thunder)', true)">
          It moved <span class="tabular-nums text-faint">2d8 thunder</span>
        </button>
      </div>
      <p class="mt-2 text-[12px] text-dim">Divine Strike counts on the hit. The 2d8 goes off if the target moves of its own will before his next turn; a push or a shove doesn’t set it off.</p>
    </div>

    <!-- What his spells keep doing -->
    <div class="grid gap-px border-b border-obsidian-600/70 bg-obsidian-600/60 sm:grid-cols-2">
      <div class="bg-obsidian-900 p-5">
        <div class="flex items-baseline justify-between gap-2">
          <NuxtLink to="/tempest/spells/spirit-guardians" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Spirit Guardians</NuxtLink>
          <span class="text-[11.5px] text-faint">DC {{ stats.spellDc }} WIS</span>
        </div>
        <template v-if="guardians">
          <div class="mt-2 flex flex-wrap gap-1.5">
            <button type="button" class="btn" @click="dmg(guardiansDice, 'Spirit Guardians (radiant) · half on a save')">
              Damage <span class="tabular-nums text-faint">{{ guardiansDice }} radiant</span>
            </button>
          </div>
          <p class="mt-2 text-[12px] text-dim">When a creature starts its turn within 15 ft or first enters on a turn. Its speed is halved there.</p>
        </template>
        <p v-else class="mt-2 text-[12px] text-faint">Not up. Cast it from the Spells list and its damage shows here.</p>
      </div>
      <div class="bg-obsidian-900 p-5">
        <div class="flex items-baseline justify-between gap-2">
          <NuxtLink to="/tempest/spells/spiritual-weapon" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Spiritual Weapon</NuxtLink>
          <span class="text-[11.5px] text-faint">Bonus action · 60 ft</span>
        </div>
        <template v-if="state.weapon">
          <div class="mt-2 flex flex-wrap gap-1.5">
            <RollButton :notation="`1d20+${stats.spellAttack}`" label="Spiritual Weapon — attack">Attack {{ signed(stats.spellAttack) }}</RollButton>
            <button type="button" class="btn" @click="dmg(weaponDice, 'Spiritual Weapon (force)')">
              Damage <span class="tabular-nums text-faint">{{ weaponDice }}</span>
            </button>
          </div>
          <p class="mt-2 text-[12px] text-dim">Move it 20 ft and attack each turn for 1 minute. No concentration.</p>
        </template>
        <p v-else class="mt-2 text-[12px] text-faint">Not out. Cast it from the Spells list.</p>
      </div>
    </div>

    <!-- Reaction and the girdle -->
    <div class="grid gap-px bg-obsidian-600/60 sm:grid-cols-2">
      <div class="bg-obsidian-900 p-5">
        <div class="flex items-baseline justify-between gap-2">
          <span class="font-display text-[15px] font-semibold tracking-wide text-parchment">Wrath of the Storm</span>
          <span class="text-[11.5px] text-faint">Reaction · {{ left('wrath') }} left</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <button type="button" class="btn" :disabled="left('wrath') <= 0" @click="wrathOfTheStorm('lightning')">Lightning <span class="tabular-nums text-faint">2d8</span></button>
          <button type="button" class="btn" :disabled="left('wrath') <= 0" @click="wrathOfTheStorm('thunder')">Thunder <span class="tabular-nums text-faint">2d8</span></button>
        </div>
        <p class="mt-2 text-[12px] text-dim">When a creature within 5 ft hits him. DC {{ stats.spellDc }} DEX for half. Lightning pushes it 10 ft; thunder keeps it in the aura.</p>
      </div>
      <div class="bg-obsidian-900 p-5">
        <div class="flex items-baseline justify-between gap-2">
          <NuxtLink to="/tempest/items/stormgirdle" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Storm Avatar</NuxtLink>
          <span class="text-[11.5px] text-faint">{{ state.avatar ? 'Bonus action · 30 ft' : 'Action · 1 minute' }}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <button v-if="state.avatar" type="button" class="btn border-sapphire/40 text-sapphire hover:border-sapphire" @click="dmg('3d6', 'Stormgirdle bolt (lightning) · DC 15 DEX, half on a save', true)">
            ⚡ Bolt <span class="tabular-nums text-faint">3d6 lightning</span>
          </button>
          <button v-else type="button" class="btn" :disabled="left('avatar') <= 0" @click="startAvatar">Become the storm</button>
        </div>
        <p class="mt-2 text-[12px] text-dim">{{ state.avatar ? 'Immune to lightning and thunder. The staff deals thunder.' : left('avatar') ? 'Once a day.' : 'Used today.' }}</p>
      </div>
    </div>

    <div class="border-t border-obsidian-600/70 p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <NuxtLink to="/tempest/spells/shocking-grasp" class="font-display text-[15px] font-semibold tracking-wide text-parchment hover:text-gold-light">Shocking Grasp</NuxtLink>
        <span class="text-[11.5px] text-faint">Action · Magic Initiate (INT) · advantage against metal armor</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <RollButton :notation="`1d20+${stats.initiateAttack}`" label="Shocking Grasp — spell attack">Attack {{ signed(stats.initiateAttack) }}</RollButton>
        <button type="button" class="btn" @click="dmg('2d8', 'Shocking Grasp (lightning)', true)">Damage <span class="tabular-nums text-faint">2d8 lightning</span></button>
      </div>
      <p class="mt-2 text-[12px] text-dim">The target can’t take reactions until its next turn, and the lightning lets Thunderbolt Strike push.</p>
    </div>

    <details class="group border-t border-obsidian-600/70">
      <summary class="flex items-center justify-between gap-3 px-5 py-3 text-[12.5px] text-dim transition hover:text-parchment">
        Where Destructive Wrath does the most
        <span class="text-faint transition group-open:rotate-90" aria-hidden="true">▸</span>
      </summary>
      <table class="mx-5 mb-4 w-[calc(100%-2.5rem)] text-[12.5px]">
        <tbody class="divide-y divide-obsidian-600/60">
          <tr v-for="w in wrathTargets" :key="w.what">
            <td class="py-1 pr-2 text-parchment">{{ w.what }}</td>
            <td class="px-2 py-1 text-faint">{{ w.dice }}</td>
            <td class="px-2 py-1 text-right font-semibold tabular-nums text-gold-light">{{ w.max }}</td>
            <td class="py-1 pl-2 text-right tabular-nums text-sapphire">+{{ w.gain }}</td>
          </tr>
        </tbody>
      </table>
      <p class="-mt-2 px-5 pb-4 text-[11.5px] text-faint">The maximum, and what it adds over the average. A save still halves it: the staff’s Thunder stun before a Lightning Strike makes the 54 stick.</p>
    </details>
  </section>
</template>
