<script setup lang="ts">
import { character } from '~/data/character'
import { appearance, backstory, zahir } from '~/data/lore'
import { items } from '~/data/items'

const signature = items.filter(i => i.art)

const copied = ref(false)
async function copyPrompt() {
  await navigator.clipboard.writeText(appearance.portraitPrompt)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

useHead({ title: 'Story & Patron — Lucan Beryll' })
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <!-- Lucan -->
    <header class="text-center">
      <p class="eyebrow">The jeweler and the Dao</p>
      <h1 class="mt-3 font-display text-4xl font-bold tracking-wide sm:text-6xl"><span class="text-gilded">Story &amp; Patron</span></h1>
      <div class="divider mx-auto mt-6 max-w-sm text-sm">◆</div>
    </header>

    <section class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <article>
        <p class="eyebrow">{{ character.race }} · {{ character.background }}</p>
        <h2 class="heading mt-1 text-3xl">{{ character.name }}</h2>
        <p class="mt-1 font-serif text-lg italic text-dim">{{ character.epithet }}</p>
        <div class="mt-6 space-y-5">
          <p
            v-for="(p, n) in backstory.paragraphs"
            :key="n"
            class="lore"
            :class="n === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-gold' : ''"
          >{{ p }}</p>
        </div>
      </article>

      <aside class="panel h-fit p-6">
        <p class="eyebrow">Personality</p>
        <h3 class="heading mb-4 text-lg">Traits</h3>
        <p class="mb-4 text-[13.5px] leading-relaxed text-dim">{{ character.identity.summary }}</p>
        <ul class="space-y-3">
          <li v-for="t in character.identity.traits" :key="t" class="flex gap-3 text-[13.5px] leading-relaxed text-parchment/85">
            <GemIcon color="#d6a84f" :size="12" class="mt-1 shrink-0" />{{ t }}
          </li>
        </ul>
      </aside>
    </section>

    <!-- Appearance -->
    <section class="mt-16">
      <SectionHeading eyebrow="The Dao's warlock" title="Appearance" />
      <div class="panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <figure class="overflow-hidden rounded-2xl border border-gold/30 lg:row-span-2">
          <img :src="publicPath(appearance.portrait.src)" :alt="appearance.portrait.alt" class="aspect-[3/4] w-full object-cover" loading="lazy" />
        </figure>
        <div class="space-y-5">
          <p v-for="(p, n) in appearance.paragraphs" :key="n" class="lore">{{ p }}</p>
        </div>
        <dl class="grid gap-3 sm:grid-cols-2">
          <div v-for="f in appearance.features" :key="f.label" class="flex gap-3 text-[13.5px] leading-relaxed">
            <GemIcon color="#d6a84f" :size="12" class="mt-1 shrink-0" />
            <div>
              <dt class="eyebrow">{{ f.label }}</dt>
              <dd class="text-parchment/85">{{ f.text }}</dd>
            </div>
          </div>
        </dl>
        <details class="group rounded-xl border border-obsidian-600 bg-obsidian-950/60 p-4 lg:col-span-2">
          <summary class="flex items-center justify-between text-[12.5px] text-dim transition hover:text-gold-light">
            <span><span class="inline-block transition group-open:rotate-90">▸</span> Art brief for a portrait</span>
            <button type="button" class="btn px-2.5 py-1 text-[11px]" @click.prevent="copyPrompt">{{ copied ? 'Copied' : 'Copy prompt' }}</button>
          </summary>
          <p class="mt-3 text-[13px] leading-relaxed text-parchment/80">{{ appearance.portraitPrompt }}</p>
        </details>
      </div>
    </section>

    <!-- Signature pieces -->
    <section v-if="signature.length" class="mt-16">
      <SectionHeading eyebrow="What he carries" title="Signature Pieces" />
      <div class="grid gap-6 md:grid-cols-2">
        <figure v-for="i in signature" :key="i.slug" class="panel group overflow-hidden">
          <NuxtLink :to="`/items/${i.slug}`" class="block overflow-hidden border-b border-obsidian-600">
            <img :src="publicPath(i.art!.src)" :alt="i.art!.alt" class="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
          </NuxtLink>
          <figcaption class="p-5">
            <NuxtLink :to="`/items/${i.slug}`" class="font-display text-lg font-semibold tracking-wide text-parchment transition hover:text-gold-light">{{ i.name }}</NuxtLink>
            <p class="mt-1 text-[13px] leading-relaxed text-dim">{{ i.art!.caption }}</p>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Zahir -->
    <section class="panel relative mt-16 overflow-hidden">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(227,166,64,0.12),transparent_55%)]" aria-hidden="true" />
      <div class="relative p-6 sm:p-10">
        <p class="eyebrow text-topaz">The patron</p>
        <h2 class="heading mt-1 text-3xl sm:text-4xl">{{ zahir.name }}</h2>
        <p class="mt-1 font-serif text-lg italic text-dim">{{ zahir.title }}</p>

        <div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div class="space-y-5">
            <p v-for="(p, n) in zahir.paragraphs" :key="n" class="lore">{{ p }}</p>
          </div>
          <figure class="flex flex-col justify-center rounded-2xl border border-gold/30 bg-obsidian-950/70 p-6 text-center">
            <GemIcon color="#e3a640" :size="28" class="mx-auto" />
            <blockquote class="mt-4 font-display text-2xl leading-snug text-gilded">“{{ zahir.principle }}”</blockquote>
            <figcaption class="mt-3 text-[11px] uppercase tracking-[0.2em] text-faint">The principle of the pact</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Hooks -->
    <section class="mt-12">
      <SectionHeading eyebrow="For the DM" title="Story Hooks" />
      <div class="grid gap-4 sm:grid-cols-2">
        <div v-for="(h, n) in zahir.hooks" :key="h" class="panel flex gap-4 p-5">
          <span class="font-display text-3xl font-bold leading-none text-gold/40">{{ ['I', 'II', 'III', 'IV', 'V', 'VI'][n] }}</span>
          <p class="text-[14px] leading-relaxed text-parchment/85">{{ h }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
