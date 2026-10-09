<script setup lang="ts">
import { character } from '~/data/character'
import { items } from '~/data/items'
import { vessel, rooms } from '~/data/vessel'

useHead({ title: 'The Genie Vessel — Lucan Beryll' })

const { shortRest } = useTracker()

const vesselFeatures = character.features.filter(f => ['Genie’s Vessel', 'Bottled Respite', 'Sanctuary Vessel'].includes(f.name))
const vesselItems = items.filter(i => i.group === 'vessel')
const roomItems = (slug: string) => vesselItems.filter(i => i.room === slug)

const rested = ref(false)
function takeVesselRest() {
  shortRest()
  rested.value = true
  setTimeout(() => (rested.value = false), 1500)
}
</script>

<template>
  <div>
    <!-- Hero -->
    <header class="panel relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(79,179,154,0.14),transparent_60%)]" aria-hidden="true" />
      <svg class="pointer-events-none absolute -right-16 top-1/2 h-[420px] w-[420px] -translate-y-1/2 text-jade opacity-[0.09]" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="0.5" aria-hidden="true">
        <path d="M50 4 70 18v22l12 10v34L50 96 18 84V50l12-10V18Z" />
        <path d="M30 18h40M30 40h40M18 50h64M18 84h64M50 4v92" />
        <circle cx="50" cy="62" r="10" />
      </svg>
      <div class="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p class="eyebrow text-jade">Genie Patron · Extradimensional home</p>
          <h1 class="mt-3 font-display text-4xl font-bold tracking-wide sm:text-6xl"><span class="text-gilded">{{ vessel.name }}</span></h1>
          <p class="mt-3 font-serif text-xl italic text-dim">{{ vessel.form }}</p>
          <p class="lore mt-5 max-w-2xl">{{ vessel.intro }}</p>
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <div class="panel-inset px-4 py-3"><div class="eyebrow text-dim">Vessel AC</div><div class="stat-num text-3xl">{{ derived.vesselAc }}</div><div class="text-[11px] text-faint">Equals spell save DC</div></div>
          <div class="panel-inset px-4 py-3"><div class="eyebrow text-dim">Vessel HP</div><div class="stat-num text-3xl">{{ derived.vesselHp }}</div><div class="text-[11px] text-faint">Level + PB</div></div>
          <div class="panel-inset col-span-2 px-4 py-3"><div class="eyebrow text-dim">Immune</div><div class="text-sm text-parchment">Poison and psychic damage</div></div>
          <div class="panel-inset border-topaz/30 px-4 py-3">
            <div class="eyebrow text-dim">Bottled Respite</div>
            <div class="stat-num mt-1 text-xl">At will</div>
            <div class="text-[11px] text-topaz/90">Homebrew: no long-rest limit</div>
          </div>
          <div class="panel-inset px-4 py-3">
            <div class="eyebrow text-dim">10 min inside</div>
            <div class="mt-1 flex items-center justify-between gap-2">
              <span class="text-sm text-parchment">Short rest</span>
              <button type="button" class="btn px-2 py-1 text-[11px]" title="Sanctuary Vessel: 10 minutes inside counts as a short rest. Recovers pact slots in the tracker." @click="takeVesselRest">{{ rested ? 'Rested' : 'Rest' }}</button>
            </div>
            <div class="text-[11px] text-faint">Hit Dice heal +4 (PB)</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Patron features -->
    <section class="mt-10">
      <SectionHeading eyebrow="Patron features" title="What the Vessel Does in Play" />
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="f in vesselFeatures" :key="f.name" class="panel p-5">
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="heading text-base">{{ f.name }}</h3>
            <span class="text-[11px] text-faint">Lv {{ f.level }}</span>
          </div>
          <div class="mt-1.5 flex flex-wrap gap-1">
            <span v-if="f.uses" class="chip py-0 text-[10px]">{{ f.uses }}</span>
            <span v-if="f.homebrew" class="chip border-topaz/40 py-0 text-[10px] text-topaz">Homebrew</span>
          </div>
          <p class="mt-2 text-[13.5px] leading-relaxed text-dim">{{ f.summary }}</p>
          <p v-if="f.detail" class="mt-2 text-[12.5px] leading-relaxed text-faint">{{ f.detail }}</p>
        </div>
      </div>
    </section>

    <!-- Residence features -->
    <section class="mt-12">
      <SectionHeading eyebrow="Campaign Vessel" title="The Residence" />
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="f in vessel.features"
          :key="f.name"
          class="rounded-xl border p-4"
          :class="f.homebrew ? 'border-topaz/30 bg-topaz/5' : 'border-obsidian-600 bg-obsidian-900/70'"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-parchment">{{ f.name }}</h3>
            <span v-if="f.homebrew" class="chip border-topaz/40 py-0 text-[10px] text-topaz">Homebrew</span>
          </div>
          <p class="mt-1.5 text-[12.5px] leading-relaxed text-dim">{{ f.text }}</p>
        </div>
      </div>
    </section>

    <!-- Rooms -->
    <section class="mt-12">
      <SectionHeading id="rooms" eyebrow="Floor plan" title="Rooms of the Vessel" />
      <p class="-mt-2 mb-5 max-w-3xl text-[13px] text-dim">{{ rooms.length }} rooms holding {{ vesselItems.length }} pieces of household magic. These don’t use attunement slots, and the DM rules on how they work outside the Vessel.</p>
      <div class="grid gap-4 md:grid-cols-2">
        <article
          v-for="(r, n) in rooms"
          :id="r.slug"
          :key="r.slug"
          class="panel scroll-mt-24 overflow-hidden transition target:border-jade/60 target:shadow-glow"
        >
          <div class="flex items-start gap-4 p-5">
            <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-jade/40 bg-gradient-to-b from-jade/15 to-obsidian-900 text-xl text-jade">{{ r.glyph }}</span>
            <div class="min-w-0">
              <p class="text-[10px] uppercase tracking-[0.2em] text-faint">Room {{ String(n + 1).padStart(2, '0') }}</p>
              <h3 class="heading text-lg">{{ r.name }}</h3>
              <p class="mt-1.5 text-[13.5px] leading-relaxed text-dim">{{ r.summary }}</p>
              <p v-for="d in r.details" :key="d" class="mt-1.5 text-[12.5px] italic leading-relaxed text-faint">{{ d }}</p>
            </div>
          </div>
          <div v-if="roomItems(r.slug).length" class="border-t border-obsidian-600/70 bg-obsidian-950/50 px-5 py-4">
            <p class="eyebrow mb-2.5 text-dim">Fixtures &amp; magic items</p>
            <ul class="space-y-2">
              <li v-for="i in roomItems(r.slug)" :key="i.slug">
                <NuxtLink :to="`/items/${i.slug}`" class="group flex gap-3 rounded-lg border border-obsidian-600 bg-obsidian-900/70 px-3 py-2.5 transition hover:border-jade/50">
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-jade/30 bg-jade/10 text-jade">{{ i.glyph }}</span>
                  <span class="min-w-0">
                    <span class="flex flex-wrap items-baseline gap-x-2">
                      <span class="text-sm font-semibold text-parchment transition group-hover:text-jade">{{ i.name }}</span>
                      <span class="text-[11px] text-faint">
                        <span v-if="i.rarity" :class="rarityTone[i.rarity].text">{{ i.rarity }}</span><template v-if="i.rarity && i.source"> · </template>{{ i.source }}<template v-if="i.charges"> · {{ i.charges }}</template>
                      </span>
                    </span>
                    <span class="mt-0.5 block text-[12.5px] leading-relaxed text-dim">{{ i.effect }}</span>
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </article>
      </div>
      <p class="mt-3 text-[11px] text-faint">Which room each item sits in is a suggested arrangement. Move them around as the story needs.</p>
    </section>

    <!-- Rules -->
    <section class="mt-12">
      <div class="panel p-6">
        <p class="eyebrow">House rules for the Vessel</p>
        <h2 class="heading mb-4 text-xl">Limits &amp; Rulings</h2>
        <ul class="space-y-2.5">
          <li v-for="r in vessel.rules" :key="r" class="flex gap-3 text-[14px] leading-relaxed text-parchment/85">
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-jade/70" />{{ r }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
