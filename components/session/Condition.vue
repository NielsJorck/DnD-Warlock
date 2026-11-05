<script setup lang="ts">
import { conditions, exhaustionLevels } from '~/data/conditions'
import { lesserDao } from '~/data/characters/lucan/character'

const { state, inForm, left, use, heal } = useTracker()
const { roll, note } = useDice()

// The Lesser Dao form can't be petrified
const immune = (name: string) => inForm.value && lesserDao.conditionImmunities.includes(name)

const dying = computed(() => state.value.hp === 0)
const stable = computed(() => state.value.deathSaves.success >= 3)
const dead = computed(() => state.value.deathSaves.fail >= 3)

function toggle(name: string) {
  const s = state.value
  s.conditions = s.conditions.includes(name) ? s.conditions.filter(c => c !== name) : [...s.conditions, name]
}

function deathSave() {
  const d = state.value.deathSaves
  const r = roll('1d20', 'Death save', { plain: true })
  const n = r.rolls[0]
  if (n === 20) heal(1)
  else if (n === 1) d.fail = Math.min(3, d.fail + 2)
  else if (n >= 10) d.success = Math.min(3, d.success + 1)
  else d.fail = Math.min(3, d.fail + 1)
}

// Gift of the Protectors: a named creature drops to 1 HP instead of 0, once per long rest
function protectors() {
  if (left('protectors') <= 0) return
  use('protectors')
  heal(1)
  note('Gift of the Protectors', 'Lucan drops to 1 HP instead')
}
</script>

<template>
  <section class="panel p-5">
    <h2 class="heading mb-3 text-lg">Conditions</h2>

    <div v-if="dying" class="mb-4 rounded-xl border border-ruby/40 bg-ruby/5 p-3.5">
      <div class="flex items-center justify-between gap-3">
        <span class="eyebrow text-ruby">{{ dead ? 'Dead' : stable ? 'Stable' : 'Death saves' }}</span>
        <button type="button" class="btn border-ruby/50 py-2 text-ruby" :disabled="stable || dead" @click="deathSave">Roll death save</button>
      </div>
      <div class="mt-2.5 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <div class="mb-1 text-faint">Successes</div>
          <div class="flex gap-1.5">
            <button
              v-for="i in 3"
              :key="i"
              type="button"
              class="h-6 w-6 rounded-full border transition"
              :class="i <= state.deathSaves.success ? 'border-jade bg-jade/60' : 'border-obsidian-500 bg-obsidian-900'"
              :aria-label="`Success ${i}`"
              @click="state.deathSaves.success = i <= state.deathSaves.success ? i - 1 : i"
            />
          </div>
        </div>
        <div>
          <div class="mb-1 text-faint">Failures</div>
          <div class="flex gap-1.5">
            <button
              v-for="i in 3"
              :key="i"
              type="button"
              class="h-6 w-6 rounded-full border transition"
              :class="i <= state.deathSaves.fail ? 'border-ruby bg-ruby/60' : 'border-obsidian-500 bg-obsidian-900'"
              :aria-label="`Failure ${i}`"
              @click="state.deathSaves.fail = i <= state.deathSaves.fail ? i - 1 : i"
            />
          </div>
        </div>
      </div>
      <button v-if="left('protectors') > 0 && !dead" type="button" class="btn mt-3 w-full py-2" @click="protectors">
        Gift of the Protectors: drop to 1 HP instead
      </button>
      <p class="mt-2 text-[11px] leading-relaxed text-faint">A natural 20 brings him back with 1 HP, a natural 1 counts as two failures. Damage while down is a failure; healing clears the saves.</p>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="c in conditions"
        :key="c.name"
        type="button"
        class="chip px-2.5 py-1 text-[12px] transition"
        :class="immune(c.name) ? 'border-topaz/40 text-topaz line-through' : state.conditions.includes(c.name) ? 'border-ruby/60 bg-ruby/15 text-ruby' : 'hover:border-obsidian-500 hover:text-parchment'"
        :aria-pressed="state.conditions.includes(c.name)"
        :disabled="immune(c.name)"
        :title="immune(c.name) ? 'The Lesser Dao form is immune' : c.effect"
        @click="toggle(c.name)"
      >{{ c.name }}</button>
    </div>
    <p v-if="inForm" class="mt-2 text-[11px] text-topaz/90">In the Lesser Dao form: immune to being petrified.</p>
    <ul v-if="state.conditions.length" class="mt-3 space-y-1.5 text-[12px] leading-relaxed text-dim">
      <li v-for="c in conditions.filter(c => state.conditions.includes(c.name))" :key="c.name">
        <span class="font-semibold text-ruby">{{ c.name }}.</span> {{ c.effect }}
      </li>
    </ul>

    <div class="mt-4 border-t border-obsidian-600 pt-3">
      <div class="flex items-center justify-between gap-3">
        <span class="text-[13px] font-medium text-parchment">Exhaustion</span>
        <div class="flex gap-1" role="group" aria-label="Exhaustion level">
          <button
            v-for="i in 6"
            :key="i"
            type="button"
            class="grid h-7 w-7 place-items-center rounded-md border text-[11px] font-semibold tabular-nums transition"
            :class="i <= state.exhaustion ? 'border-ruby/60 bg-ruby/20 text-ruby' : 'border-obsidian-600 text-faint hover:border-obsidian-500'"
            :aria-pressed="i <= state.exhaustion"
            @click="state.exhaustion = i === state.exhaustion ? i - 1 : i"
          >{{ i }}</button>
        </div>
      </div>
      <p class="mt-1 text-[11px] text-faint">{{ state.exhaustion ? `Level ${state.exhaustion}: ${exhaustionLevels.slice(1, state.exhaustion + 1).join(' · ')}` : 'None. Effects add up level by level.' }}</p>
    </div>
  </section>
</template>
