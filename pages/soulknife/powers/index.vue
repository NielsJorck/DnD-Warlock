<script setup lang="ts">
import { character, stats } from '~/data/characters/soulknife/character'
import { type Power, type PowerCost, type PowerKind, type PowerStatus, type PowerWhen, costLabels, kindTone, powers, whenLabels } from '~/data/characters/soulknife/powers'

useHead({ title: `Powers — ${character.name}` })

type Tab = 'ready' | 'later' | 'all'
const tabs: { id: Tab; label: string; statuses: PowerStatus[]; blurb?: string }[] = [
  {
    id: 'ready',
    label: 'Ready',
    statuses: ['ready'],
    blurb: 'What he can do at level 3. A rogue has no spellbook: these are the psionic powers, the rogue options he chooses each turn, Alert’s swap and the Wood Elf spells, which need no slots.'
  },
  { id: 'later', label: 'Later', statuses: ['future'], blurb: 'What arrives on the way to level 12, with the level it comes at. Cunning Strike, Uncanny Dodge and Pass without Trace at 5 are the big step.' },
  { id: 'all', label: 'All', statuses: ['ready', 'future'] }
]

const kinds = Object.keys(kindTone) as PowerKind[]
const kindSub: Record<PowerKind, string> = {
  Psionic: `Soulknife · ${stats.psiDice} Psionic Energy Dice (${stats.psiDie}s)`,
  Rogue: `Sneak Attack ${stats.sneak}`,
  Feat: 'Alert, from the Criminal',
  'Wood Elf': `Elven Lineage · WIS: DC ${stats.elfDc}, attack ${signed(stats.elfAttack)}`
}

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

const kindFilter = ref<PowerKind[]>([])
const whens = ref<PowerWhen[]>([])
const costs = ref<PowerCost[]>([])
const arrives = ref<number[]>([])
const expandAll = ref(false)
const groupBy = ref<'kind' | 'level'>('kind')

const current = computed(() => tabs.find(t => t.id === tab.value)!)
const countFor = (t: (typeof tabs)[number]) => powers.filter(p => t.statuses.includes(p.status)).length
const allLevels = [...new Set(powers.map(p => p.level))].sort((a, b) => a - b)

const toggle = <T,>(list: T[], v: T) => {
  const i = list.indexOf(v)
  i === -1 ? list.push(v) : list.splice(i, 1)
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return powers
    .filter(p => current.value.statuses.includes(p.status))
    .filter(p => !kindFilter.value.length || kindFilter.value.includes(p.kind))
    .filter(p => !whens.value.length || whens.value.includes(p.when))
    .filter(p => !costs.value.length || costs.value.includes(p.costKind))
    .filter(p => !arrives.value.length || arrives.value.includes(p.level))
    .filter(p => !q || [p.name, p.kind, p.source, p.role, p.summary, p.notes, p.grows, p.timing, ...(p.options ?? []).map(o => `${o.name} ${o.effect}`)].join(' ').toLowerCase().includes(q))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
})

const groups = computed(() => {
  const out: { key: string; title: string; sub?: string; powers: Power[] }[] = []
  const push = (key: string, title: string, list: Power[], sub?: string) => list.length && out.push({ key, title, sub, powers: list })
  if (tab.value === 'ready' && groupBy.value === 'kind') {
    for (const k of kinds) push(k, k, filtered.value.filter(p => p.kind === k), kindSub[k])
  } else {
    for (const lv of allLevels) push(String(lv), `Level ${lv}`, filtered.value.filter(p => p.level === lv), lv <= character.level ? 'Ready' : 'To come')
  }
  return out
})

const showFilters = ref(false)
const activeFilters = computed(() => kindFilter.value.length + whens.value.length + costs.value.length + arrives.value.length + Number(!!query.value))
function clearFilters() {
  kindFilter.value = []
  whens.value = []
  costs.value = []
  arrives.value = []
  query.value = ''
}
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-10 -top-16 font-display text-[220px] leading-none text-amethyst/[0.07]" aria-hidden="true">◈</div>
      <h1 class="font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Powers</span></h1>
      <div class="mt-5 flex flex-wrap gap-2">
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Psi dice</span> <span class="stat-num ml-1 text-xl">{{ stats.psiDice }}{{ stats.psiDie }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Blade</span> <span class="stat-num ml-1 text-xl">{{ signed(stats.bladeAttack) }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Sneak Attack</span> <span class="stat-num ml-1 text-xl">{{ stats.sneak }}</span></div>
        <div class="panel-inset px-4 py-2"><span class="text-[11px] text-faint">Elf spells DC</span> <span class="stat-num ml-1 text-xl">{{ stats.elfDc }}</span></div>
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
      <div v-if="tab === 'ready'" class="grid grid-cols-2 overflow-hidden rounded-lg border border-obsidian-600 text-[11.5px]" role="radiogroup" aria-label="Group ready powers">
        <button
          v-for="o in [{ id: 'kind', label: 'By kind' }, { id: 'level', label: 'By level' }] as const"
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
            <input v-model="query" type="search" placeholder="Search powers…" class="field w-full pl-9" aria-label="Search powers" />
          </div>
          <button type="button" class="btn shrink-0 px-3 lg:hidden" :aria-expanded="showFilters" aria-controls="power-filters" @click="showFilters = !showFilters">
            Filters<span v-if="activeFilters" class="text-gold-light"> ({{ activeFilters }})</span>
          </button>
        </div>

        <div id="power-filters" class="space-y-5 lg:block" :class="showFilters ? 'block' : 'hidden'">
          <div>
            <p class="eyebrow mb-2 text-dim">Kind</p>
            <div class="grid grid-cols-2 gap-1.5">
              <button
                v-for="k in kinds"
                :key="k"
                type="button"
                class="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition"
                :class="kindFilter.includes(k) ? [kindTone[k].border, kindTone[k].bg, kindTone[k].text] : 'border-obsidian-600 text-dim hover:border-obsidian-500 hover:text-parchment'"
                @click="toggle(kindFilter, k)"
              >
                <span :class="kindTone[k].text">{{ kindTone[k].glyph }}</span>{{ k }}
              </button>
            </div>
          </div>

          <div>
            <p class="eyebrow mb-2 text-dim">When</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(label, w) in whenLabels"
                :key="w"
                type="button"
                class="chip px-2.5 py-1 text-xs transition"
                :class="whens.includes(w) ? 'border-gold/60 bg-gold/15 text-gold-light' : 'hover:border-obsidian-500 hover:text-parchment'"
                :title="w === 'free' ? 'On a hit, after a check, at initiative or always on' : undefined"
                @click="toggle(whens, w)"
              >{{ label }}</button>
            </div>
          </div>

          <div>
            <p class="eyebrow mb-2 text-dim">Cost</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(label, c) in costLabels"
                :key="c"
                type="button"
                class="chip px-2.5 py-1 text-xs transition"
                :class="costs.includes(c) ? (c === 'psi' ? 'border-amethyst/60 bg-amethyst/15 text-amethyst' : 'border-gold/60 bg-gold/15 text-gold-light') : 'hover:border-obsidian-500 hover:text-parchment'"
                @click="toggle(costs, c)"
              >{{ label }}</button>
            </div>
          </div>

          <div>
            <p class="eyebrow mb-2 text-dim">Arrives at level</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="lv in allLevels"
                :key="lv"
                type="button"
                class="chip px-2.5 py-1 text-xs tabular-nums transition"
                :class="arrives.includes(lv) ? 'border-gold/60 bg-gold/15 text-gold-light' : 'hover:border-obsidian-500 hover:text-parchment'"
                @click="toggle(arrives, lv)"
              >{{ lv }}</button>
            </div>
          </div>

          <label class="flex cursor-pointer items-center gap-2 text-[13px] text-dim"><input v-model="expandAll" type="checkbox" class="h-4 w-4 accent-[#d6a84f]" /> Expand all cards</label>

          <button v-if="activeFilters" type="button" class="btn w-full justify-center" @click="clearFilters">Clear filters ({{ activeFilters }})</button>
        </div>
      </aside>

      <div class="min-w-0">
        <p class="mb-4 text-xs text-faint">{{ filtered.length }} power{{ filtered.length === 1 ? '' : 's' }}</p>
        <div v-if="!groups.length" class="panel grid place-items-center px-6 py-16 text-center">
          <p class="font-display text-lg text-parchment">No powers match</p>
          <p class="mt-1 text-sm text-dim">Try another search or clear the filters.</p>
          <button type="button" class="btn mt-4" @click="clearFilters">Clear filters</button>
        </div>
        <section v-for="g in groups" :key="`${tab}-${g.key}`" class="mb-8">
          <div class="mb-3 flex items-baseline gap-3">
            <h2 class="heading text-lg">{{ g.title }}</h2>
            <span v-if="g.sub" class="text-[11px] text-faint">{{ g.sub }}</span>
            <span class="divider flex-1" />
            <span class="text-[11px] text-faint">{{ g.powers.length }}</span>
          </div>
          <div class="grid items-start gap-2 2xl:grid-cols-2">
            <SoulknifePowerCard v-for="p in g.powers" :key="`${p.slug}-${expandAll}`" :power="p" :open="expandAll" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
