<script setup lang="ts">
import { homebrew, rulings, dmQuestions, sourcePolicy, openQuestions, tweaksPdf } from '~/data/lore'

useHead({ title: 'Campaign Rules — Lucan Beryll' })

const pdf = publicPath(tweaksPdf.src)

const labelTone: Record<string, string> = {
  Owned: itemGroupTone.owned,
  Wishlist: itemGroupTone.wishlist
}

const done = ref<Record<string, boolean>>({})
onMounted(() => {
  try {
    done.value = JSON.parse(localStorage.getItem('codex-todo-v1') ?? '{}')
  } catch {
    // ignore corrupt storage
  }
  watch(done, v => localStorage.setItem('codex-todo-v1', JSON.stringify(v)), { deep: true })
})
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-6 -top-12 font-display text-[200px] leading-none text-topaz/[0.07]" aria-hidden="true">⚖</div>
      <p class="eyebrow">Table agreements</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Campaign Rules</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">House rules, DM rulings, the source policy and the decisions still on the table. Every number on this site follows these rules.</p>
      <div class="mt-5 flex flex-wrap gap-2">
        <span class="chip px-3 py-1 text-xs">{{ sourcePolicy.baseline }}</span>
        <a :href="sourcePolicy.index.url" target="_blank" rel="noopener" class="chip px-3 py-1 text-xs text-gold-light hover:border-gold/50">Reference: {{ sourcePolicy.index.label }} ↗</a>
        <a href="#tweaks" class="chip border-topaz/40 px-3 py-1 text-xs text-topaz hover:border-topaz/70">{{ tweaksPdf.title }} (PDF) ↓</a>
      </div>
    </header>

    <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
      <div class="min-w-0 space-y-12">
        <section>
          <SectionHeading eyebrow="Differs from the books" title="Homebrew in Effect" />
          <div class="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            <div v-for="(h, n) in homebrew" :key="h.rule" class="rounded-xl border border-topaz/25 bg-gradient-to-br from-topaz/[0.07] to-transparent p-4">
              <div class="flex items-start gap-3">
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-topaz/40 font-display text-xs text-topaz">{{ n + 1 }}</span>
                <div>
                  <h3 class="text-sm font-semibold text-parchment">{{ h.rule }}</h3>
                  <p class="mt-1 text-[12.5px] leading-relaxed text-dim">{{ h.detail }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Decided by the DM" title="Rulings" />
          <div class="grid gap-px overflow-hidden rounded-xl border border-obsidian-600/70 bg-obsidian-600/60 2xl:grid-cols-2">
            <div v-for="r in rulings" :key="r.ruling" class="flex gap-3 bg-obsidian-900 px-4 py-3.5">
              <span class="mt-0.5 text-gold">⚖</span>
              <div>
                <h3 class="text-sm font-semibold text-parchment">{{ r.ruling }}</h3>
                <p class="mt-0.5 text-[12.5px] leading-relaxed text-dim">{{ r.detail }}</p>
              </div>
            </div>
          </div>
          <div class="mt-4 rounded-xl border border-dashed border-topaz/40 p-4">
            <div class="mb-2 flex items-center justify-between gap-3">
              <p class="eyebrow text-topaz">Waiting on the DM</p>
              <NuxtLink to="/dm#questions" class="text-[12px] text-topaz transition hover:text-parchment">Answer on the DM page →</NuxtLink>
            </div>
            <ul class="space-y-1.5">
              <li v-for="q in dmQuestions" :key="q.id" class="flex gap-2 text-[13px] text-parchment/85"><span class="text-topaz">?</span>{{ q.question }}</li>
            </ul>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="What content is legal" title="Source Policy" />
          <div class="grid gap-4 md:grid-cols-2">
            <div class="panel p-5">
              <p class="eyebrow mb-3 text-jade">Allowed</p>
              <ul class="space-y-2">
                <li v-for="a in sourcePolicy.allowed" :key="a" class="flex gap-2 text-[13px] leading-relaxed text-parchment/85"><span class="text-jade">✓</span>{{ a }}</li>
              </ul>
            </div>
            <div class="panel p-5">
              <p class="eyebrow mb-3 text-ruby">Excluded</p>
              <ul class="space-y-2">
                <li v-for="e in sourcePolicy.excluded" :key="e" class="flex gap-2 text-[13px] leading-relaxed text-parchment/85"><span class="text-ruby">✕</span>{{ e }}</li>
              </ul>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <div v-for="l in sourcePolicy.labels" :key="l.label" class="flex items-center gap-2 text-[12.5px] text-dim">
              <span class="chip" :class="labelTone[l.label]">{{ l.label }}</span>{{ l.text }}
            </div>
          </div>
        </section>
      </div>

      <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div class="panel p-5">
          <p class="eyebrow">Next session</p>
          <h2 class="heading mb-1 text-lg">Open Decisions</h2>
          <p class="mb-3 text-[11px] text-faint">Tick them off as they’re settled. Saved in this browser.</p>
          <ul class="space-y-1">
            <li v-for="q in openQuestions.immediate" :key="q">
              <label class="flex cursor-pointer gap-2.5 rounded-lg px-2 py-1.5 text-[13px] leading-relaxed transition hover:bg-obsidian-800">
                <input v-model="done[q]" type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-[#d6a84f]" />
                <span :class="done[q] ? 'text-faint line-through' : 'text-parchment/90'">{{ q }}</span>
              </label>
            </li>
          </ul>
          <p class="eyebrow mb-2 mt-4 text-dim">Items</p>
          <ul class="space-y-1.5">
            <li v-for="q in openQuestions.items" :key="q" class="flex gap-2 text-[12.5px] leading-relaxed text-dim"><span class="text-gold/60">◇</span>{{ q }}</li>
          </ul>
        </div>

        <details class="panel group p-5">
          <summary class="flex items-center justify-between">
            <span>
              <span class="eyebrow block">Settled</span>
              <span class="heading text-lg">Closed Decisions</span>
            </span>
            <span class="text-faint transition group-open:rotate-180">▾</span>
          </summary>
          <ul class="mt-3 space-y-1.5">
            <li v-for="c in openQuestions.closed" :key="c" class="flex gap-2 text-[12.5px] leading-relaxed text-dim"><span class="text-jade">✓</span>{{ c }}</li>
          </ul>
        </details>
      </aside>
    </div>

    <!-- The browser's own PDF viewer; phones mostly can't show a PDF inside a page, so they get the buttons -->
    <section id="tweaks" class="mt-12 scroll-mt-24">
      <SectionHeading eyebrow="Homebrew rulebook · PDF" :title="`${tweaksPdf.title} ${tweaksPdf.version}`">
        <a :href="pdf" target="_blank" rel="noopener" class="btn btn-gold">Open in a new tab ↗</a>
        <a :href="pdf" download class="btn">Download</a>
      </SectionHeading>
      <p class="-mt-2 mb-4 max-w-3xl text-[13px] text-dim">{{ tweaksPdf.note }}</p>
      <iframe :src="`${pdf}#view=FitH`" :title="tweaksPdf.title" loading="lazy" class="hidden h-[85vh] min-h-[600px] w-full rounded-2xl border border-gold/15 bg-obsidian-900 md:block" />
      <p class="panel-inset px-4 py-3 text-[12.5px] text-dim md:hidden">The PDF opens in your phone’s own viewer with the buttons above.</p>
    </section>
  </div>
</template>
