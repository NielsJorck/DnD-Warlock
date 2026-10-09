<script setup lang="ts">
import { items, itemBySlug, groupLabels, sourceNames } from '~/data/items'
import { roomBySlug } from '~/data/vessel'

const route = useRoute()
const item = itemBySlug[route.params.slug as string]
if (!item) throw createError({ statusCode: 404, statusMessage: 'Item not found', fatal: true })

useHead({ title: `${item.name} — ${item.group === 'vessel' ? 'The Genie Vessel' : 'Lucan’s Treasury'}` })

const rarity = item.rarity ? rarityTone[item.rarity] : null
const room = item.room ? roomBySlug[item.room] : null
const siblings = items.filter(i => i.group === item.group && i.slug !== item.slug)

const facts = [
  { label: 'Type', value: item.type },
  { label: 'Rarity', value: item.rarity, tone: rarity?.text },
  { label: 'Attunement', value: item.attunement ?? 'Not required' },
  { label: 'Source', value: item.source ? sourceNames[item.source] ?? item.source : 'Not recorded' },
  { label: 'Charges', value: item.charges },
  { label: 'Status', value: item.status }
].filter(f => f.value)

const copied = ref(false)
async function copyPrompt() {
  if (!item.art) return
  await navigator.clipboard.writeText(item.art.prompt)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <NuxtLink v-if="room" :to="`/vessel#${room.slug}`" class="text-xs text-dim hover:text-jade">← The Vessel · {{ room.name }}</NuxtLink>
    <NuxtLink v-else to="/items" class="text-xs text-dim hover:text-gold-light">← Treasury</NuxtLink>

    <article class="panel relative mt-4 overflow-hidden">
      <div class="h-1 w-full" :style="{ background: `linear-gradient(90deg, ${rarity?.hex ?? '#d6a84f'}, transparent)` }" />
      <div class="relative p-6 sm:p-9">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
          <figure v-if="item.art" class="w-full shrink-0 sm:w-64">
            <a :href="publicPath(item.art.src)" target="_blank" rel="noopener" class="block overflow-hidden rounded-2xl border shadow-glow transition hover:brightness-110" :style="{ borderColor: `${rarity?.hex ?? '#d6a84f'}66` }">
              <img :src="publicPath(item.art.src)" :alt="item.art.alt" class="aspect-[3/4] w-full object-cover" />
            </a>
            <figcaption class="mt-2 text-[12px] italic leading-relaxed text-dim">{{ item.art.caption }}</figcaption>
          </figure>
          <div
            v-else
            class="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border bg-gradient-to-b from-obsidian-700 to-obsidian-950 text-5xl shadow-glow"
            :style="{ color: rarity?.hex ?? '#d6a84f', borderColor: `${rarity?.hex ?? '#d6a84f'}66` }"
            aria-hidden="true"
          >{{ item.glyph }}</div>
          <div class="min-w-0">
            <div class="flex flex-wrap gap-2">
              <span class="chip" :class="itemGroupTone[item.group]">{{ groupLabels[item.group] }}</span>
              <NuxtLink v-if="room" :to="`/vessel#${room.slug}`" class="chip border-jade/40 text-jade hover:text-parchment">{{ room.glyph }} {{ room.name }}</NuxtLink>
            </div>
            <h1 class="mt-3 font-display text-3xl font-bold tracking-wide text-parchment sm:text-4xl">{{ item.name }}</h1>
            <p class="mt-1 font-serif text-xl italic text-dim">{{ item.role }}</p>
          </div>
        </div>

        <dl class="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-obsidian-600/70 bg-obsidian-600/70 sm:grid-cols-3">
          <div v-for="f in facts" :key="f.label" class="bg-obsidian-950/80 px-3 py-2">
            <dt class="text-[10px] uppercase tracking-[0.14em] text-faint">{{ f.label }}</dt>
            <dd class="text-[13px] text-parchment" :class="f.tone">{{ f.value }}</dd>
          </div>
        </dl>

        <div class="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4">
          <p class="eyebrow mb-1">Effect</p>
          <p class="text-lg text-parchment">{{ item.effect }}</p>
        </div>

        <div v-if="item.caveat" class="mt-4 rounded-xl border border-topaz/30 bg-topaz/5 p-4">
          <p class="eyebrow mb-1 text-topaz">Appraiser’s caveat</p>
          <p class="text-[14.5px] leading-relaxed text-parchment/85">{{ item.caveat }}</p>
        </div>

        <h2 class="heading mt-8 text-lg">How it works</h2>
        <ul class="mt-3 space-y-2.5">
          <li v-for="r in item.rules" :key="r" class="flex gap-3 text-[15px] leading-relaxed text-parchment/85">
            <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />{{ r }}
          </li>
        </ul>

        <div v-if="item.forCharacter" class="mt-8 border-t border-obsidian-600 pt-6">
          <p class="eyebrow mb-2">For Lucan</p>
          <p class="lore">{{ item.forCharacter }}</p>
        </div>

        <details v-if="item.art" class="group mt-6 rounded-xl border border-obsidian-600 bg-obsidian-950/60 p-4">
          <summary class="flex items-center justify-between text-[12.5px] text-dim transition hover:text-gold-light">
            <span><span class="inline-block transition group-open:rotate-90">▸</span> Art brief for a painted version</span>
            <button type="button" class="btn px-2.5 py-1 text-[11px]" @click.prevent="copyPrompt">{{ copied ? 'Copied' : 'Copy prompt' }}</button>
          </summary>
          <p class="mt-3 text-[13px] leading-relaxed text-parchment/80">{{ item.art.prompt }}</p>
          <p class="mt-2 text-[11px] text-faint">Save the result as <code class="text-gold-light">public{{ item.art.src }}</code> (or change the path in <code>data/items.ts</code>) and it replaces the illustration everywhere.</p>
        </details>
      </div>
    </article>

    <section v-if="siblings.length" class="mt-10">
      <h2 class="eyebrow mb-3 text-dim">More {{ groupLabels[item.group].toLowerCase() }}</h2>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="s in siblings"
          :key="s.slug"
          :to="`/items/${s.slug}`"
          class="flex items-center gap-3 rounded-xl border border-obsidian-600 bg-obsidian-900/70 px-3 py-2.5 transition hover:border-gold/40"
        >
          <img v-if="s.art" :src="publicPath(s.art.src)" alt="" class="h-9 w-9 shrink-0 rounded-lg border border-obsidian-500 object-cover" :style="{ objectPosition: s.art.focus }" />
          <span v-else class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-obsidian-500 bg-obsidian-800 text-lg" :style="s.rarity ? { color: rarityTone[s.rarity].hex } : undefined">{{ s.glyph }}</span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-parchment">{{ s.name }}</span>
            <span class="block truncate text-[11px] text-faint">{{ s.role }}</span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
