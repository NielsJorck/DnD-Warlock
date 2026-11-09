<script setup lang="ts">
import { character } from '~/data/characters/gloom-stalker/character'
import { appearance, commission, hooks, story } from '~/data/characters/gloom-stalker/lore'

useHead({ title: `Story — ${character.name}` })
</script>

<template>
  <div class="mx-auto max-w-5xl 2xl:max-w-6xl">
    <header class="text-center">
      <h1 class="font-display text-4xl font-bold tracking-wide sm:text-6xl"><span class="text-gilded">Story &amp; the Mountains</span></h1>
      <div class="divider mx-auto mt-6 max-w-sm text-sm">☾</div>
    </header>

    <section class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <article>
        <p class="eyebrow">{{ character.species }} · {{ character.background }} · first draft</p>
        <h2 class="heading mt-1 text-3xl">{{ character.name }}</h2>
        <p class="mt-1 font-serif text-lg italic text-dim">{{ character.epithet }}</p>
        <div class="mt-6 space-y-5">
          <p
            v-for="(p, n) in story.paragraphs"
            :key="n"
            class="lore"
            :class="n === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-gold' : ''"
          >{{ p }}</p>
        </div>
      </article>

      <aside class="panel h-fit p-6">
        <h3 class="heading mb-4 text-lg">Still to Settle</h3>
        <ul class="space-y-3">
          <li v-for="o in story.open" :key="o" class="flex gap-3 text-[13.5px] leading-relaxed text-parchment/85">
            <span class="mt-1.5 h-2 w-2 shrink-0 rotate-45 border border-sapphire/80" />{{ o }}
          </li>
        </ul>
      </aside>
    </section>

    <section class="mt-16">
      <SectionHeading title="Appearance" />
      <div class="panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <figure>
          <div class="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-sapphire/40"><GloomStalkerEmblem /></div>
          <figcaption class="mt-2 text-[12px] italic leading-relaxed text-faint">No portrait yet. The art brief for one is kept with the lore data.</figcaption>
        </figure>
        <div class="space-y-5">
          <p v-for="(p, n) in appearance.paragraphs" :key="n" class="lore">{{ p }}</p>
          <NuxtLink to="/gloom-stalker/items" class="inline-block text-sm text-gold/80 hover:text-gold-light">Their gear →</NuxtLink>
        </div>
      </div>
    </section>

    <section class="panel relative mt-16 overflow-hidden">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(101,149,220,0.14),transparent_55%)]" aria-hidden="true" />
      <div class="relative p-6 sm:p-10">
        <h2 class="heading text-3xl sm:text-4xl">{{ commission.name }}</h2>
        <p class="mt-1 font-serif text-lg italic text-dim">{{ commission.title }}</p>
        <div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div class="space-y-5">
            <p v-for="(p, n) in commission.paragraphs" :key="n" class="lore">{{ p }}</p>
          </div>
          <figure class="flex flex-col justify-center rounded-2xl border border-sapphire/40 bg-obsidian-950/70 p-6 text-center">
            <span class="font-display text-3xl text-sapphire" aria-hidden="true">☾</span>
            <blockquote class="mt-3 font-display text-xl leading-snug text-gilded">“{{ commission.creed }}”</blockquote>
            <figcaption class="mt-3 text-[11px] uppercase tracking-[0.2em] text-faint">A smuggler’s rule for the deep places</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <SectionHeading title="Story Hooks" />
      <div class="grid gap-4 sm:grid-cols-2">
        <div v-for="(h, n) in hooks" :key="h" class="panel flex gap-4 p-5">
          <span class="font-display text-3xl font-bold leading-none text-sapphire/40">{{ ['I', 'II', 'III', 'IV', 'V', 'VI'][n] }}</span>
          <p class="text-[14px] leading-relaxed text-parchment/85">{{ h }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
