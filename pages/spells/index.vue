<script setup lang="ts">
import { type School, type Spell, type SpellStatus, spells, levelLabel, schoolGlyph, statusLabels } from '~/data/spells'

useHead({ title: 'Spellbook — Lucan Beryll' })

type Tab = 'known' | 'book' | 'wishlist' | 'later' | 'all'
const tabs: { id: Tab; label: string; statuses: SpellStatus[]; blurb: string }[] = [
  { id: 'known', label: 'Known', statuses: ['known'], blurb: 'Everything Lucan can cast right now: Warlock spells, Tome cantrips, Telekinetic’s Mage Hand and both patron lists.' },
  { id: 'book', label: 'Book of Shadows', statuses: ['book'], blurb: 'Rituals inscribed by Book of Ancient Secrets. Cast from the book as rituals only — no pact slot.' },
  { id: 'wishlist', label: 'Ritual wishlist', statuses: ['wishlist'], blurb: 'Rituals worth copying into the Book of Shadows when a scroll or spellbook turns up (50 gp and 2 hours per level).' },
  { id: 'later', label: 'Candidates & future', statuses: ['candidate', 'future'], blurb: 'Spells under consideration for future levels, plus the Mystic Arcanum endgame.' },
  { id: 'all', label: 'All', statuses: ['known', 'book', 'wishlist', 'candidate', 'future'], blurb: 'Every spell in Lucan’s glossary.' }
]

const route = useRoute()
const router = useRouter()
const tab = ref<Tab>(tabs.some(t => t.id === route.query.tab) ? (route.query.tab as Tab) : 'known')
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const levels = ref<number[]>([])
const schools = ref<School[]>([])
type ConcFilter = 'any' | 'yes' | 'no'
const concOptions: { id: ConcFilter; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'yes', label: 'Concentration' },
  { id: 'no', label: 'No concentration' }
]
const conc = ref<ConcFilter>('any')

type CastTime = 'action' | 'bonus' | 'reaction' | 'longer'
const castOptions: { id: CastTime; label: string }[] = [
  { id: 'action', label: 'Action' },
  { id: 'bonus', label: 'Bonus action' },
  { id: 'reaction', label: 'Reaction' },
  { id: 'longer', label: 'Longer' }
]
const castTimeOf = (s: Spell): CastTime => {
  const t = s.castingTime.toLowerCase()
  if (t.startsWith('1 bonus action')) return 'bonus'
  if (t.startsWith('1 reaction')) return 'reaction'
  if (t.startsWith('1 action')) return 'action'
  return 'longer'
}
const castTimes = ref<CastTime[]>([])
const onlyRitual = ref(false)
const expandAll = ref(false)

watch([tab, query], ([t, q]) => {
  router.replace({ query: { ...(t !== 'known' ? { tab: t } : {}), ...(q ? { q } : {}) } })
})

const current = computed(() => tabs.find(t => t.id === tab.value)!)
const countFor = (t: (typeof tabs)[number]) => spells.filter(s => t.statuses.includes(s.status)).length

const allLevels = [...new Set(spells.map(s => s.level))].sort((a, b) => a - b)
const allSchools = Object.keys(schoolGlyph) as School[]

const toggle = <T,>(list: T[], v: T) => {
  const i = list.indexOf(v)
  i === -1 ? list.push(v) : list.splice(i, 1)
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return spells
    .filter(s => current.value.statuses.includes(s.status))
    .filter(s => !levels.value.length || levels.value.includes(s.level))
    .filter(s => !schools.value.length || schools.value.includes(s.school))
    .filter(s => conc.value === 'any' || s.concentration === (conc.value === 'yes'))
    .filter(s => !castTimes.value.length || castTimes.value.includes(castTimeOf(s)))
    .filter(s => !onlyRitual.value || s.ritual)
    .filter(s => !q || [s.name, s.role, s.summary, s.notes, s.atPact, s.school, s.access].join(' ').toLowerCase().includes(q))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
})

const groups = computed(() => {
  const out: { key: string; title: string; sub?: string; spells: Spell[] }[] = []
  const push = (key: string, title: string, list: Spell[], sub?: string) => list.length && out.push({ key, title, sub, spells: list })
  if (tab.value === 'wishlist') {
    for (const p of ['High', 'Useful', 'Additional'] as const) {
      push(p, `${p} priority`, filtered.value.filter(s => s.priority === p))
    }
  } else if (tab.value === 'later' || tab.value === 'all') {
    for (const st of current.value.statuses) push(st, statusLabels[st], filtered.value.filter(s => s.status === st))
  } else {
    for (const lv of allLevels) {
      const list = filtered.value.filter(s => s.level === lv)
      push(String(lv), lv === 0 ? 'Cantrips' : `${levelLabel(lv)} level`, list, lv === 0 ? 'At will' : 'Cast with a 5th-level pact slot')
    }
  }
  return out
})

const activeFilters = computed(
  () => levels.value.length + schools.value.length + castTimes.value.length + Number(conc.value !== 'any') + Number(onlyRitual.value) + Number(!!query.value)
)
function clearFilters() {
  levels.value = []
  schools.value = []
  castTimes.value = []
  conc.value = 'any'
  onlyRitual.value = false
  query.value = ''
}
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-10 -top-16 font-display text-[220px] leading-none text-amethyst/[0.06]" aria-hidden="true">✶</div>
      <p class="eyebrow">Pact Magic · Charisma</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Spellbook</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">Every spell Lucan knows, keeps in the Book of Shadows, or has his eye on. Each leveled spell is cast at 5th level from a pact slot.</p>
      <div class="mt-5 flex flex-wrap gap-2">
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Save DC</span> <span class="stat-num ml-1 text-xl">{{ derived.spellDc }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Attack</span> <span class="stat-num ml-1 text-xl">{{ signed(derived.spellAttack) }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Pact slots</span> <span class="stat-num ml-1 text-xl">2 × 5th</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Known</span> <span class="stat-num ml-1 text-xl">{{ countFor(tabs[0]) }}</span></div>
      </div>
    </header>

    <!-- Tabs -->
    <div class="scrollbar-none mt-6 flex gap-1 overflow-x-auto border-b border-obsidian-600" role="tablist">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        class="relative shrink-0 px-4 py-2.5 text-sm transition"
        :class="tab === t.id ? 'text-gold-light' : 'text-dim hover:text-parchment'"
        @click="tab = t.id"
      >
        {{ t.label }}
        <span class="ml-1 text-[11px] text-faint">{{ countFor(t) }}</span>
        <span v-if="tab === t.id" class="absolute inset-x-3 -bottom-px h-0.5 rounded bg-gold" />
      </button>
    </div>
    <p class="mt-3 text-[13px] text-dim">{{ current.blurb }}</p>

    <div class="mt-5 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
      <!-- Filters -->
      <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div class="relative">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" /></svg>
          <input v-model="query" type="search" placeholder="Search spells…" class="field w-full pl-9" aria-label="Search spells" />
        </div>

        <div>
          <p class="eyebrow mb-2 text-dim">Level</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="lv in allLevels"
              :key="lv"
              type="button"
              class="chip px-2.5 py-1 text-xs transition"
              :class="levels.includes(lv) ? 'border-gold/60 bg-gold/15 text-gold-light' : 'hover:border-obsidian-500 hover:text-parchment'"
              @click="toggle(levels, lv)"
            >{{ lv === 0 ? 'Cantrip' : levelLabel(lv) }}</button>
          </div>
        </div>

        <div>
          <p class="eyebrow mb-2 text-dim">School</p>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="sc in allSchools"
              :key="sc"
              type="button"
              class="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition"
              :class="schools.includes(sc) ? [schoolTone[sc].border, schoolTone[sc].bg, schoolTone[sc].text] : 'border-obsidian-600 text-dim hover:border-obsidian-500 hover:text-parchment'"
              @click="toggle(schools, sc)"
            >
              <span :class="schoolTone[sc].text">{{ schoolGlyph[sc] }}</span>{{ sc }}
            </button>
          </div>
        </div>

        <div>
          <p class="eyebrow mb-2 text-dim">Casting time</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="c in castOptions"
              :key="c.id"
              type="button"
              class="chip px-2.5 py-1 text-xs transition"
              :class="castTimes.includes(c.id) ? 'border-gold/60 bg-gold/15 text-gold-light' : 'hover:border-obsidian-500 hover:text-parchment'"
              :title="c.id === 'longer' ? '1 minute or more' : undefined"
              @click="toggle(castTimes, c.id)"
            >{{ c.label }}</button>
          </div>
        </div>

        <div>
          <p class="eyebrow mb-2 text-dim">Concentration</p>
          <div class="grid grid-cols-3 overflow-hidden rounded-lg border border-obsidian-600 text-[11.5px]" role="radiogroup" aria-label="Concentration">
            <button
              v-for="o in concOptions"
              :key="o.id"
              type="button"
              role="radio"
              :aria-checked="conc === o.id"
              class="px-1.5 py-1.5 leading-tight transition"
              :class="conc === o.id ? 'bg-rose/15 text-rose' : 'text-dim hover:bg-obsidian-800 hover:text-parchment'"
              @click="conc = o.id"
            >{{ o.label }}</button>
          </div>
        </div>

        <div class="space-y-2 text-[13px]">
          <label class="flex cursor-pointer items-center gap-2 text-dim"><input v-model="onlyRitual" type="checkbox" class="h-4 w-4 accent-[#a682dc]" /> Rituals only</label>
          <label class="flex cursor-pointer items-center gap-2 text-dim"><input v-model="expandAll" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" /> Expand all cards</label>
        </div>

        <button v-if="activeFilters" type="button" class="btn w-full justify-center" @click="clearFilters">Clear filters ({{ activeFilters }})</button>
      </aside>

      <!-- Results -->
      <div class="min-w-0">
        <p class="mb-4 text-xs text-faint">{{ filtered.length }} spell{{ filtered.length === 1 ? '' : 's' }}</p>
        <div v-if="!groups.length" class="panel grid place-items-center px-6 py-16 text-center">
          <p class="font-display text-lg text-parchment">No spells match</p>
          <p class="mt-1 text-sm text-dim">Try another search or clear the filters.</p>
          <button type="button" class="btn mt-4" @click="clearFilters">Clear filters</button>
        </div>
        <section v-for="g in groups" :key="`${tab}-${g.key}`" class="mb-8">
          <div class="mb-3 flex items-baseline gap-3">
            <h2 class="heading text-lg">{{ g.title }}</h2>
            <span v-if="g.sub" class="text-[11px] text-faint">{{ g.sub }}</span>
            <span class="divider flex-1" />
            <span class="text-[11px] text-faint">{{ g.spells.length }}</span>
          </div>
          <div class="space-y-2">
            <SpellCard v-for="s in g.spells" :key="`${s.slug}-${expandAll}`" :spell="s" :open="expandAll" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
