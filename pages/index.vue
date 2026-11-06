<script setup lang="ts">
import { type Ruleset, campaign, rulesPath, rulesetList, rulesets } from '~/data/campaign'
import { characters } from '~/data/characters'

useHead({ title: campaign.name })

const contents = (r: Ruleset) => {
  if (!r.homebrew.length && !r.rulings.length && !r.sourcePolicy) return 'in progress, nothing settled yet'
  const parts = [`${r.homebrew.length} ${r.homebrewLabel?.noun ?? 'house rules'}`, `${r.rulings.length} DM rulings`]
  if (r.sourcePolicy) parts.push('the source policy')
  if (r.rulebook) parts.push(r.rulebook.title)
  return `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
}
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
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p class="eyebrow">{{ c.tagline }}</p>
              <NuxtLink :to="rulesPath(c.ruleset)" class="chip py-0 text-[10px] transition hover:border-gold/50 hover:text-gold-light">{{ c.ruleset }} rules</NuxtLink>
            </div>
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
          <span v-for="r in rulesetList" :key="r.id" class="mt-1 block text-[13px] text-dim">
            <span class="text-parchment/85">{{ r.name }}:</span> {{ contents(r) }}.
          </span>
          <span class="mt-1 block text-[13px] text-dim">Plus each character’s own rulings, under their ruleset.</span>
        </span>
        <span class="text-gold/80 group-hover:text-gold-light">→</span>
      </NuxtLink>
    </section>
  </div>
</template>
