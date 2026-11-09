<script setup lang="ts">
import { character, stats } from '~/data/characters/gloom-stalker/character'
import { type Spell, type SpellStatus, silent, spells, statusLabels } from '~/data/characters/gloom-stalker/spells'
import { type School, levelLabel, schoolGlyph } from '~/data/characters/shared'

useHead({ title: `Spellbook — ${character.name}` })

type Tab = 'ready' | 'later' | 'all'
const tabs: { id: Tab; label: string; statuses: SpellStatus[]; blurb?: string }[] = [
  {
    id: 'ready',
    label: 'Ready',
    statuses: ['known', 'always', 'prepared'],
    blurb: `What he can cast today: the Wood Elf’s Druidcraft and Longstrider, Hunter’s Mark and Disguise Self (always prepared), and ${stats.prepared} prepared from the ranger list. One prepared spell can be swapped after each long rest.`
  },
  { id: 'later', label: 'Candidates & future', statuses: ['candidate', 'future'], blurb: 'Other 1st-level ranger spells worth swapping in, and what opens at levels 5 and 9: 2nd- and 3rd-level slots, the Wood Elf’s Pass without Trace, and the Gloom Stalker’s Rope Trick and Fear.' },
  { id: 'all', label: 'All', statuses: ['known', 'always', 'prepared', 'candidate', 'future'] }
]

// Ready spells group by where they come from
const sources: { id: string; title: string; sub: string; match: (s: Spell) => boolean }[] = [
  { id: 'elf', title: 'Wood Elf', sub: `Elven Lineage · WIS: DC ${stats.spellDc} · Longstrider once a day without a slot`, match: s => s.status === 'known' },
  { id: 'always', title: 'Always prepared', sub: 'Favored Enemy and the Gloom Stalker, on top of the rest', match: s => s.status === 'always' },
  { id: 'prepared', title: 'Prepared', sub: `${stats.prepared} from the ranger list`, match: s => s.status === 'prepared' }
]

const route = useRoute()
const router = useRouter()
// The static site has one prerendered page for every ?tab= and ?q=, so the query
// is applied once the page is live; reading it earlier clashes with that HTML.
const tab = ref<Tab>('ready')
const query = ref('')
onMounted(() => {
  if (tabs.some(t => t.id === route.query.tab)) tab.value = route.query.tab as Tab
  if (typeof route.query.q === 'string') query.value = route.query.q
  watch([tab, query], ([t, q]) => {
    router.replace({ query: { ...(t !== 'ready' ? { tab: t } : {}), ...(q ? { q } : {}) } })
  })
})
const levels = ref<number[]>([])
const schools = ref<School[]>([])
type ConcFilter = 'any' | 'yes' | 'no'
const concOptions: { id: ConcFilter; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'yes', label: 'Concentration' },
  { id: 'no', label: 'Beside the mark' }
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
const onlySilent = ref(false)
const onlyRitual = ref(false)
const expandAll = ref(false)
const groupBy = ref<'source' | 'level'>('source')

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
    .filter(s => !onlySilent.value || silent(s))
    .filter(s => !onlyRitual.value || s.ritual)
    .filter(s => !q || [s.name, s.role, s.summary, s.notes, s.higher, s.school, s.access].join(' ').toLowerCase().includes(q))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
})

const groups = computed(() => {
  const out: { key: string; title: string; sub?: string; spells: Spell[] }[] = []
  const push = (key: string, title: string, list: Spell[], sub?: string) => list.length && out.push({ key, title, sub, spells: list })
  if (tab.value !== 'ready') {
    for (const st of current.value.statuses) push(st, statusLabels[st], filtered.value.filter(s => s.status === st))
  } else if (groupBy.value === 'source') {
    for (const g of sources) push(g.id, g.title, filtered.value.filter(g.match), g.sub)
  } else {
    for (const lv of allLevels) {
      push(String(lv), lv === 0 ? 'Cantrips' : `${levelLabel(lv)} level`, filtered.value.filter(s => s.level === lv), lv ? `${character.slots[lv - 1] ?? 0} slots` : 'At will')
    }
  }
  return out
})

const showFilters = ref(false)
const activeFilters = computed(
  () => levels.value.length + schools.value.length + castTimes.value.length + Number(conc.value !== 'any') + Number(onlySilent.value) + Number(onlyRitual.value) + Number(!!query.value)
)
function clearFilters() {
  levels.value = []
  schools.value = []
  castTimes.value = []
  conc.value = 'any'
  onlySilent.value = false
  onlyRitual.value = false
  query.value = ''
}
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-10 -top-16 font-display text-[220px] leading-none text-sapphire/[0.07]" aria-hidden="true">☾</div>
      <h1 class="font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Spellbook</span></h1>
      <div class="mt-5 flex flex-wrap gap-2">
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Save DC</span> <span class="stat-num ml-1 text-xl">{{ stats.spellDc }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Attack</span> <span class="stat-num ml-1 text-xl">{{ signed(stats.spellAttack) }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Slots</span> <span class="stat-num ml-1 text-xl">{{ character.slots.join('·') }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Prepared</span> <span class="stat-num ml-1 text-xl">{{ stats.prepared }} + 2</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Free Hunter’s Mark</span> <span class="stat-num ml-1 text-xl">2</span></div>
      </div>
    </header>

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
    <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
      <p v-if="current.blurb" class="max-w-4xl text-[13px] text-dim">{{ current.blurb }}</p>
      <div v-if="tab === 'ready'" class="grid grid-cols-2 overflow-hidden rounded-lg border border-obsidian-600 text-[11.5px]" role="radiogroup" aria-label="Group ready spells">
        <button
          v-for="o in [{ id: 'source', label: 'By source' }, { id: 'level', label: 'By level' }] as const"
          :key="o.id"
          type="button"
          role="radio"
          :aria-checked="groupBy === o.id"
          class="px-3 py-1.5 transition"
          :class="groupBy === o.id ? 'bg-gold/15 text-gold-light' : 'text-dim hover:bg-obsidian-800 hover:text-parchment'"
          @click="groupBy = o.id"
        >{{ o.label }}</button>
      </div>
    </div>

    <div class="mt-5 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside class="space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
        <div class="flex gap-2">
          <div class="relative min-w-0 flex-1">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" /></svg>
            <input v-model="query" type="search" placeholder="Search spells…" class="field w-full pl-9" aria-label="Search spells" />
          </div>
          <button type="button" class="btn shrink-0 px-3 lg:hidden" :aria-expanded="showFilters" aria-controls="spell-filters" @click="showFilters = !showFilters">
            Filters<span v-if="activeFilters" class="text-gold-light"> ({{ activeFilters }})</span>
          </button>
        </div>

        <div id="spell-filters" class="space-y-5 lg:block" :class="showFilters ? 'block' : 'hidden'">
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
                :title="o.id === 'no' ? 'No concentration: castable without dropping Hunter’s Mark' : undefined"
                @click="conc = o.id"
              >{{ o.label }}</button>
            </div>
          </div>

          <div class="space-y-2 text-[13px]">
            <label class="flex cursor-pointer items-center gap-2 text-dim"><input v-model="onlySilent" type="checkbox" class="h-4 w-4 accent-[#6595dc]" /> Silent <span class="text-faint">(no verbal: keeps a hide)</span></label>
            <label class="flex cursor-pointer items-center gap-2 text-dim"><input v-model="onlyRitual" type="checkbox" class="h-4 w-4 accent-[#a682dc]" /> Rituals only</label>
            <label class="flex cursor-pointer items-center gap-2 text-dim"><input v-model="expandAll" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" /> Expand all cards</label>
          </div>

          <button v-if="activeFilters" type="button" class="btn w-full justify-center" @click="clearFilters">Clear filters ({{ activeFilters }})</button>
        </div>
      </aside>

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
          <div class="grid items-start gap-2 2xl:grid-cols-2">
            <GloomStalkerSpellCard v-for="s in g.spells" :key="`${s.slug}-${expandAll}`" :spell="s" :open="expandAll" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
