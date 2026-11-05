<script setup lang="ts">
import { campaign, homebrew, rulings, tweaksPdf } from '~/data/campaign'
import { characters } from '~/data/characters'

useHead({ title: campaign.name })
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <header class="text-center">
      <h1 class="font-display text-4xl font-bold tracking-wide sm:text-6xl"><span class="text-gilded">{{ campaign.name }}</span></h1>
      <div class="divider mx-auto mt-6 max-w-sm text-sm">◆</div>
    </header>

    <section class="mt-10">
      <div class="grid gap-5 lg:grid-cols-2">
        <article v-for="c in characters" :key="c.slug" class="panel flex gap-4 overflow-hidden p-4 sm:gap-6 sm:p-5">
          <NuxtLink v-if="c.portrait" :to="c.nav[0].to" class="group block w-24 shrink-0 self-start overflow-hidden rounded-xl border border-gold/30 sm:w-32">
            <img :src="publicPath(c.portrait.src)" :alt="c.portrait.alt" class="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          </NuxtLink>
          <div class="min-w-0">
            <p class="eyebrow">{{ c.tagline }}</p>
            <h2 class="heading mt-1 text-2xl">
              <NuxtLink :to="c.nav[0].to" class="hover:text-gold-light">{{ c.name }}</NuxtLink>
            </h2>
            <p v-if="c.epithet" class="font-serif text-lg italic text-dim">{{ c.epithet }}</p>
            <p class="mt-2 text-[13px] leading-relaxed text-dim">{{ c.summary }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <NuxtLink
                v-for="item in c.nav"
                :key="item.to"
                :to="item.to"
                class="chip px-2.5 py-1 text-xs transition hover:border-gold/50 hover:text-gold-light"
                :class="item.primary ? 'border-gold/40 text-gold-light' : ''"
              >{{ item.label }}</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-10">
      <NuxtLink to="/rules" class="panel group flex flex-wrap items-center justify-between gap-3 p-5 transition hover:border-gold/40">
        <span>
          <span class="heading text-lg group-hover:text-gold-light">Campaign Rules</span>
          <span class="mt-1 block text-[13px] text-dim">
            {{ homebrew.length }} house rules, {{ rulings.length }} DM rulings, the source policy and {{ tweaksPdf.title }}, plus each character’s own rulings.
          </span>
        </span>
        <span class="text-gold/80 group-hover:text-gold-light">→</span>
      </NuxtLink>
    </section>
  </div>
</template>
