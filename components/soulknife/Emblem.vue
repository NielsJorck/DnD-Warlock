<template>
  <!-- Stands in for a portrait until there is a painting: two blades of thought under a crescent moon -->
  <div class="relative grid aspect-[3/4] w-full place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,rgba(166,130,220,0.22),rgba(11,10,9,0.9)_70%)]">
    <svg viewBox="0 0 120 160" class="h-[82%] w-[82%] text-amethyst" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <!-- The crescent -->
      <path d="M78 22a24 24 0 1 0 6 34 19 19 0 1 1-6-34z" stroke-width="1.4" class="text-quartz" stroke="currentColor" opacity="0.55" />
      <!-- Two blades of light, crossed -->
      <g stroke-width="1.6">
        <path d="M34 138 82 58l4-14-11 9-48 81z" fill="currentColor" fill-opacity="0.18" />
        <path d="M86 138 38 58l-4-14 11 9 48 81z" fill="currentColor" fill-opacity="0.12" />
        <path d="M28 128l12 8M92 128l-12 8" stroke-width="2.2" opacity="0.8" />
      </g>
      <!-- Sparks of thought -->
      <g stroke-width="1" opacity="0.6">
        <circle cx="60" cy="96" r="2.2" fill="currentColor" />
        <circle cx="60" cy="96" r="9" stroke-dasharray="1.5 3" />
        <circle cx="60" cy="96" r="18" stroke-dasharray="1 5" opacity="0.6" />
      </g>
      <circle cx="60" cy="80" r="56" stroke-width="0.6" stroke-dasharray="2 4" opacity="0.35" />
    </svg>
    <span class="absolute bottom-2 left-0 right-0 text-center text-[9px] uppercase tracking-[0.2em] text-faint">Portrait to come</span>
  </div>
</template>
