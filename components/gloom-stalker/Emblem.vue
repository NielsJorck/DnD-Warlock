<template>
  <!-- In place of a portrait until one is painted: a crescent moon with an arrow across it -->
  <svg viewBox="0 0 120 160" class="h-full w-full" role="img" aria-label="The Lightless Hunter’s emblem: an arrow across a crescent moon in the dark">
    <defs>
      <radialGradient id="gs-dusk" cx="50%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#1c2433" />
        <stop offset="100%" stop-color="#0b0a09" />
      </radialGradient>
      <linearGradient id="gs-moon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#c9d3dc" />
        <stop offset="100%" stop-color="#6595dc" />
      </linearGradient>
    </defs>
    <rect width="120" height="160" fill="url(#gs-dusk)" />
    <g fill="none" stroke="#6595dc" stroke-opacity="0.18" stroke-width="0.6">
      <circle cx="60" cy="70" r="46" stroke-dasharray="2 4" />
      <circle cx="60" cy="70" r="40" />
    </g>
    <!-- Crescent -->
    <path d="M70 34a36 36 0 1 0 0 72a45 45 0 0 1 0-72z" fill="url(#gs-moon)" opacity="0.85" />
    <!-- Arrow -->
    <g stroke="#d6a84f" stroke-width="2.2" stroke-linecap="round" fill="none">
      <path d="M22 108 98 32" />
      <path d="M98 32l-11 2.5M98 32l-2.5 11" />
      <path d="M28 102l-7-1.5M28 102l1.5 7M33 97l-7-1.5M33 97l1.5 7" stroke-width="1.6" />
    </g>
    <text x="60" y="142" text-anchor="middle" font-family="Cinzel, serif" font-size="8" letter-spacing="2.5" fill="#b0a48f">PORTRAIT TO COME</text>
  </svg>
</template>
