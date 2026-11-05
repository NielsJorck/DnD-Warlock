<script setup lang="ts">
import { homebrew, rulings, sourcePolicy, tweaksPdf } from '~/data/campaign'
import { characters } from '~/data/characters'

useHead({ title: 'Campaign Rules' })

const pdf = publicPath(tweaksPdf.src)

const withRules = characters.filter(c => c.rules)
</script>

<template>
  <div>
    <header class="panel relative overflow-hidden p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-6 -top-12 font-display text-[200px] leading-none text-topaz/[0.07]" aria-hidden="true">⚖</div>
      <p class="eyebrow">Table agreements</p>
      <h1 class="mt-2 font-display text-4xl font-bold tracking-wide sm:text-5xl"><span class="text-gilded">Campaign Rules</span></h1>
      <p class="mt-3 max-w-2xl font-serif text-lg text-dim">
        House rules, DM rulings and the source policy for the whole table, then each character’s own rulings and the questions still waiting on the DM. Every number on this site follows these rules.
      </p>
      <div class="mt-5 flex flex-wrap gap-2">
        <span class="chip px-3 py-1 text-xs">{{ sourcePolicy.baseline }}</span>
        <a :href="sourcePolicy.index.url" target="_blank" rel="noopener" class="chip px-3 py-1 text-xs text-gold-light hover:border-gold/50">Reference: {{ sourcePolicy.index.label }} ↗</a>
        <a href="#tweaks" class="chip border-topaz/40 px-3 py-1 text-xs text-topaz hover:border-topaz/70">{{ tweaksPdf.title }} (PDF) ↓</a>
        <a v-for="c in withRules" :key="c.slug" :href="`#${c.slug}`" class="chip px-3 py-1 text-xs hover:border-gold/50 hover:text-gold-light">{{ c.name }}’s rulings ↓</a>
      </div>
    </header>

    <div class="mt-10 space-y-12">
      <section>
        <SectionHeading eyebrow="Differs from the books" title="Homebrew in Effect" />
        <HouseRules :rules="homebrew" />
      </section>

      <section>
        <SectionHeading eyebrow="Decided by the DM" title="Rulings" />
        <RulingList :rulings="rulings" />
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
      </section>

      <CharacterRules v-for="c in withRules" :key="c.slug" :character="c" />
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
