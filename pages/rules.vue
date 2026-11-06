<script setup lang="ts">
import { type RulesetId, isRulesetId, rulesetList, rulesets } from '~/data/campaign'
import { characters } from '~/data/characters'

useHead({ title: 'Campaign Rules' })

const route = useRoute()
const router = useRouter()

// Opens on ?ruleset=, else on the ruleset of the character last visited. Like the
// spellbook's tabs, the choice is applied once the page is live, since the
// prerendered page shows the 2014 rules.
const lastSlug = useState<string>('character')
const tab = ref<RulesetId>('2014')
const fromQuery = () => (isRulesetId(route.query.ruleset) ? route.query.ruleset : undefined)
onMounted(() => {
  const last = characters.find(c => c.slug === lastSlug.value)
  tab.value = fromQuery() ?? last?.ruleset ?? '2014'
  watch(tab, id => router.replace({ query: { ruleset: id }, hash: route.hash }))
  watch(() => route.query.ruleset, () => {
    const id = fromQuery()
    if (id) tab.value = id
  })
})

const current = computed(() => rulesets[tab.value])
const playing = computed(() => characters.filter(c => c.ruleset === tab.value))
const withRules = computed(() => playing.value.filter(c => c.rules))
const pdf = computed(() => current.value.rulebook && publicPath(current.value.rulebook.src))
const settled = computed(() => current.value.homebrew.length || current.value.rulings.length || current.value.sourcePolicy)
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-6 -top-12 font-display text-[200px] leading-none text-topaz/[0.07]" aria-hidden="true">⚖</div>
      <h1 class="font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Campaign Rules</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">The group keeps two rulesets, one for the 2014 books and one for 2024. Each character plays by one of them.</p>
    </header>

    <div class="scrollbar-none mt-6 flex gap-1 overflow-x-auto border-b border-obsidian-600" role="tablist">
      <button
        v-for="r in rulesetList"
        :key="r.id"
        type="button"
        role="tab"
        :aria-selected="tab === r.id"
        class="relative shrink-0 px-4 py-2.5 text-sm transition"
        :class="tab === r.id ? 'text-gold-light' : 'text-dim hover:text-parchment'"
        @click="tab = r.id"
      >
        {{ r.name }}
        <span class="ml-1 text-[11px]" :class="r.status === 'In use' ? 'text-jade' : 'text-faint'">{{ r.status }}</span>
        <span v-if="tab === r.id" class="absolute inset-x-3 -bottom-px h-0.5 rounded bg-gold" />
      </button>
    </div>

    <div class="mt-4">
      <p class="max-w-3xl text-[13px] text-dim">{{ current.summary }}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <span v-if="current.sourcePolicy" class="chip px-3 py-1 text-xs">{{ current.sourcePolicy.baseline }}</span>
        <a :href="current.reference.url" target="_blank" rel="noopener" class="chip px-3 py-1 text-xs text-gold-light hover:border-gold/50">Reference: {{ current.reference.label }} ↗</a>
        <a v-if="current.rulebook" href="#rulebook" class="chip border-topaz/40 px-3 py-1 text-xs text-topaz hover:border-topaz/70">{{ current.rulebook.title }} (PDF) ↓</a>
        <a v-for="c in withRules" :key="c.slug" :href="`#${c.slug}`" class="chip px-3 py-1 text-xs hover:border-gold/50 hover:text-gold-light">{{ c.name }}’s rulings ↓</a>
      </div>
    </div>

    <div class="mt-10 space-y-12">
      <div v-if="!settled" class="panel-inset max-w-3xl px-5 py-4 text-[13px] leading-relaxed text-dim">
        Nothing is settled for this ruleset yet. Its house rules, rulings and source policy will be listed here as the group agrees on them.
        <template v-if="!playing.length"> No character plays by it yet.</template>
      </div>

      <section v-if="current.homebrew.length">
        <SectionHeading title="Homebrew in Effect" />
        <HouseRules :rules="current.homebrew" />
      </section>

      <section v-if="current.rulings.length">
        <SectionHeading title="Rulings" />
        <RulingList :rulings="current.rulings" />
      </section>

      <section v-if="current.sourcePolicy">
        <SectionHeading title="Source Policy" />
        <div class="grid gap-4 md:grid-cols-2">
          <div class="panel p-5">
            <p class="eyebrow mb-3 text-jade">Allowed</p>
            <ul class="space-y-2">
              <li v-for="a in current.sourcePolicy.allowed" :key="a" class="flex gap-2 text-[13px] leading-relaxed text-parchment/85"><span class="text-jade">✓</span>{{ a }}</li>
            </ul>
          </div>
          <div class="panel p-5">
            <p class="eyebrow mb-3 text-ruby">Excluded</p>
            <ul class="space-y-2">
              <li v-for="e in current.sourcePolicy.excluded" :key="e" class="flex gap-2 text-[13px] leading-relaxed text-parchment/85"><span class="text-ruby">✕</span>{{ e }}</li>
            </ul>
          </div>
        </div>
      </section>

      <CharacterRules v-for="c in withRules" :key="c.slug" :character="c" />
    </div>

    <!-- The browser's own PDF viewer; phones mostly can't show a PDF inside a page, so they get the buttons -->
    <section v-if="current.rulebook && pdf" id="rulebook" class="mt-12 scroll-mt-24">
      <SectionHeading :title="`${current.rulebook.title} ${current.rulebook.version}`">
        <a :href="pdf" target="_blank" rel="noopener" class="btn btn-gold">Open in a new tab ↗</a>
        <a :href="pdf" download class="btn">Download</a>
      </SectionHeading>
      <p class="-mt-2 mb-4 max-w-3xl text-[13px] text-dim">{{ current.rulebook.note }}</p>
      <iframe :src="`${pdf}#view=FitH`" :title="current.rulebook.title" loading="lazy" class="hidden h-[85vh] min-h-[600px] w-full rounded-2xl border border-gold/15 bg-obsidian-900 md:block" />
      <p class="panel-inset px-4 py-3 text-[12.5px] text-dim md:hidden">The PDF opens in your phone’s own viewer with the buttons above.</p>
    </section>
  </div>
</template>
