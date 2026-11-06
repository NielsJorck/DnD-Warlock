<template>
  <!-- Stands in for a portrait until there is a painting: a wave curling into an undertow, ringed by the five elements -->
  <div class="relative grid aspect-[3/4] w-full place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,rgba(79,179,154,0.22),rgba(11,10,9,0.9)_70%)]">
    <svg viewBox="0 0 120 160" class="h-[82%] w-[82%] text-jade" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <!-- The reach: a dotted ring at the edge of the fist's range -->
      <circle cx="60" cy="80" r="56" stroke-width="0.6" stroke-dasharray="2 4" opacity="0.35" />
      <circle cx="60" cy="80" r="44" stroke-width="0.5" stroke-dasharray="1 5" opacity="0.4" />
      <!-- The wave, curling into a spiral -->
      <g stroke-width="1.6">
        <path d="M18 112c10-4 18-14 22-28 6-22 24-34 42-30 15 3 22 17 17 29-4 10-15 14-23 9-7-4-7-13-1-16 4-2 8 0 8 4" fill="currentColor" fill-opacity="0.12" />
        <path d="M18 112c14 2 30-2 44-12M14 124c20 4 46 0 70-14 10-6 18-14 22-22" opacity="0.8" />
        <path d="M22 136c18 4 44 2 66-8" opacity="0.45" />
      </g>
      <!-- The five elements, round the edge -->
      <g stroke-width="1.2" class="text-quartz" opacity="0.75">
        <!-- fire -->
        <path d="M60 18c-4 5-4 9 0 12 4-3 4-7 0-12z" />
        <!-- cold -->
        <path d="M100 46l8-4M104 40v8M100 42l8 4" />
        <!-- lightning -->
        <path d="M108 92l-5 6h5l-5 7" />
        <!-- acid -->
        <path d="M14 92c-3 4-3 7 0 8 3-1 3-4 0-8z" />
        <!-- thunder -->
        <path d="M14 44a6 6 0 0 1 0 8M18 41a10 10 0 0 1 0 14" />
      </g>
    </svg>
    <span class="absolute bottom-2 left-0 right-0 text-center text-[9px] uppercase tracking-[0.2em] text-faint">Portrait to come</span>
  </div>
</template>
