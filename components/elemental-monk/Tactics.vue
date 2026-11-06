<script setup lang="ts">
import { economy, tactics } from '~/data/characters/elemental-monk/tactics'
</script>

<template>
  <!-- How the build fights and works a dungeon, on the Elemental Attunement page: the plan and their turn -->
  <section class="panel overflow-hidden">
    <div class="border-b border-gold/10 px-6 py-4 sm:px-9">
      <p class="eyebrow text-jade">The plan around the reach</p>
      <h2 class="heading mt-1 text-xl">How They Fight</h2>
    </div>
    <div class="grid gap-px bg-obsidian-600/60 md:grid-cols-2">
      <article v-for="(t, n) in tactics" :key="t.title" class="flex gap-4 bg-obsidian-900 p-5 sm:p-6">
        <span class="font-display text-3xl font-bold leading-none text-jade/50">{{ n + 1 }}</span>
        <div>
          <h3 class="heading text-base">{{ t.title }}</h3>
          <p class="mt-1.5 text-[13.5px] leading-relaxed text-parchment/85">{{ t.text }}</p>
        </div>
      </article>
    </div>
    <div class="grid items-start gap-4 border-t border-obsidian-600/70 p-5 sm:grid-cols-2 sm:p-6 2xl:grid-cols-4">
      <div v-for="e in economy" :key="e.slot">
        <h3 class="eyebrow">{{ e.slot }}</h3>
        <ul class="mt-2 space-y-1.5 text-[13px] text-parchment/85">
          <li v-for="i in e.items" :key="i" class="flex gap-2"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-jade/70" />{{ i }}</li>
        </ul>
        <p v-if="e.note" class="mt-3 border-t border-obsidian-600 pt-2 text-[12px] leading-relaxed text-dim">{{ e.note }}</p>
      </div>
    </div>
  </section>
</template>
