// Generates the Golden Pact illustration in public/images/.
//   node scripts/generate-art.mjs
//
// The Golden Pact's runes are a cipher: every letter maps to one rune, so the
// inscriptions really spell the phrases listed in TATTOO_TEXT.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')
const W = 600
const H = 800

const TATTOO_TEXT = {
  chest: 'A DEAL MADE IS A DEAL KEPT',
  rightArm: 'ZAHIR IBN KHARUM',
  leftArm: 'LUCAN BERYLL',
  sternum: 'SWORN IN STONE',
  seal: 'SEALED IN GOLD'
}

// ── Helpers ─────────────────────────────────────────────────

function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = n => Math.round(n * 100) / 100
const pts = list => list.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')
const mirrorX = ([x, y]) => [W - x, y]

function frame() {
  return `
  <rect x="14" y="14" width="572" height="772" rx="10" fill="none" stroke="#d6a84f" stroke-opacity="0.45" stroke-width="1.2"/>
  <rect x="22" y="22" width="556" height="756" rx="6" fill="none" stroke="#d6a84f" stroke-opacity="0.16"/>
  <polygon points="300,8 306,14 300,20 294,14" fill="#d6a84f"/>
  <polygon points="300,780 306,786 300,792 294,786" fill="#d6a84f"/>
  <polygon points="8,400 14,394 20,400 14,406" fill="#d6a84f" fill-opacity="0.7"/>
  <polygon points="580,400 586,394 592,400 586,406" fill="#d6a84f" fill-opacity="0.7"/>`
}

function background(id, glow) {
  return `
  <radialGradient id="${id}" cx="50%" cy="45%" r="75%">
    <stop offset="0" stop-color="${glow}"/>
    <stop offset="0.55" stop-color="#110e0c"/>
    <stop offset="1" stop-color="#070605"/>
  </radialGradient>`
}

function motes(rand, n, colors, box = [30, 30, 570, 770]) {
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = box[0] + rand() * (box[2] - box[0])
    const y = box[1] + rand() * (box[3] - box[1])
    const r = 0.4 + rand() * 1.3
    const c = colors[Math.floor(rand() * colors.length)]
    out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${c}" opacity="${f(0.15 + rand() * 0.55)}"/>`
  }
  return out
}

// Cubic bezier sampled by arc length
function bezier(p0, p1, p2, p3) {
  const at = t => {
    const u = 1 - t
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
    ]
  }
  const samples = [{ t: 0, s: 0, p: at(0) }]
  for (let i = 1; i <= 400; i++) {
    const p = at(i / 400)
    const prev = samples[i - 1]
    samples.push({ t: i / 400, s: prev.s + Math.hypot(p[0] - prev.p[0], p[1] - prev.p[1]), p })
  }
  const length = samples[samples.length - 1].s
  const pointAt = s => {
    let i = samples.findIndex(x => x.s >= s)
    if (i <= 0) i = 1
    const a = samples[i - 1]
    const b = samples[i]
    const k = (s - a.s) / (b.s - a.s || 1)
    const p = [a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k]
    const angle = Math.atan2(b.p[1] - a.p[1], b.p[0] - a.p[0])
    return { p, angle }
  }
  return { length, pointAt }
}

// ── The Golden Pact: the pact written in Primordial (Terran) ──

// 26 runes, one per letter: a centre stem plus a unique pair of strokes.
const STROKES = [
  'M4 0 L0 4', 'M4 0 L8 4', 'M4 7 L8 4', 'M4 7 L0 10',
  'M4 14 L8 10', 'M4 14 L0 10', 'M1 7 H7', 'M0 3 L4 6 L8 3'
]
const PAIRS = []
for (let a = 0; a < STROKES.length; a++) for (let b = a + 1; b < STROKES.length; b++) PAIRS.push([a, b])

function rune(ch) {
  if (ch === ' ') return 'M4 5 L6 7 L4 9 L2 7 Z'
  const [a, b] = PAIRS[ch.charCodeAt(0) - 65]
  return `M4 0 V14 ${STROKES[a]} ${STROKES[b]}`
}

function glyph(ch, x, y, deg, scale) {
  return `<path d="${rune(ch)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)}) scale(${scale}) translate(-4 -7)"${ch === ' ' ? ' class="sep"' : ''}/>`
}

// Text band along a cubic bezier, framed by two border lines
function band(curve, text, { vertical = false, half = 10, scale = 1, maxAdvance = 18 } = {}) {
  const b = bezier(...curve)
  const chars = text.split('')
  const advance = Math.min(maxAdvance, b.length / chars.length)
  const start = (b.length - advance * chars.length) / 2 + advance / 2
  let out = ''
  chars.forEach((ch, i) => {
    const { p, angle } = b.pointAt(start + i * advance)
    const deg = (angle * 180) / Math.PI - (vertical ? 90 : 0)
    out += glyph(ch, p[0], p[1], deg, scale)
  })
  for (const side of [-1, 1]) {
    const line = []
    for (let i = 0; i <= 60; i++) {
      const { p, angle } = b.pointAt((i / 60) * b.length)
      line.push([p[0] - Math.sin(angle) * half * side, p[1] + Math.cos(angle) * half * side])
    }
    out += `<polyline points="${pts(line)}" class="border"/>`
  }
  for (const s of [0, b.length]) {
    const { p, angle } = b.pointAt(s)
    const deg = (angle * 180) / Math.PI
    out += `<path d="M0 -${half + 3} L4 0 L0 ${half + 3} L-4 0 Z" transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(deg)})" class="fill"/>`
  }
  return out
}

function gemDiagram(cx, cy, r, rot = 0) {
  const outer = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 + Math.PI / 8
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  })
  const inner = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 + Math.PI / 8
    return [cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5]
  })
  let out = `<polygon points="${pts(outer)}" class="border"/><polygon points="${pts(inner)}" class="border"/>`
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4
    const mid = [cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92]
    out += `<polyline points="${pts([inner[i], mid, inner[(i + 7) % 8]])}" class="border thin"/>`
  }
  return `<g transform="rotate(${rot} ${cx} ${cy})">${out}</g>`
}

function tattoo() {
  const rand = rng(11)

  const bodyHalf = `M298,800 L298,190 L326,190 C328,232 332,240 340,246 C370,254 410,252 440,262 C470,272 482,300 484,330 C488,380 494,420 500,470 C506,530 512,590 516,640 C524,680 530,720 524,760 C520,785 505,795 492,790 C480,770 478,740 476,700 C474,670 470,650 468,640 C462,590 452,530 446,480 C442,450 436,400 430,370 C426,355 420,348 414,348 C410,400 400,450 392,520 C388,560 386,600 390,650 C396,700 400,750 402,800 Z`
  const headHalf = `M298,40 C340,40 360,70 360,110 C362,130 360,150 352,165 C340,185 322,198 298,201 Z M356,100 C372,92 388,78 397,64 C391,90 379,118 362,138 Z`
  const mirror = `transform="translate(${W} 0) scale(-1 1)"`

  const rightArm = [[466, 352], [474, 440], [482, 530], [492, 612]]
  const chest = [[172, 296], [222, 340], [378, 340], [428, 296]]

  const sealR = 44
  let seal = ''
  const sealChars = TATTOO_TEXT.seal.split('')
  sealChars.forEach((ch, i) => {
    const a = -Math.PI / 2 + (i / sealChars.length) * Math.PI * 2
    seal += glyph(ch, 300 + Math.cos(a) * sealR, 405 + Math.sin(a) * sealR, (a * 180) / Math.PI + 90, 0.95)
  })

  const cuff = (x1, y1, x2, y2) => {
    const mx = (x1 + x2) / 2
    let out = `<path d="M${x1},${y1} Q${mx},${y1 + 10} ${x2},${y2}" class="border"/><path d="M${x1},${y1 + 8} Q${mx},${y1 + 18} ${x2},${y2 + 8}" class="border"/>`
    for (let i = 1; i < 5; i++) {
      const t = i / 5
      const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2
      const y = (1 - t) * (1 - t) * (y1 + 4) + 2 * (1 - t) * t * (y1 + 14) + t * t * (y2 + 4)
      out += `<path d="M${f(x)},${f(y - 3)} l3,3 l-3,3 l-3,-3 Z" class="fill"/>`
    }
    return out
  }

  const facetsRight = `
    <polyline points="336,446 370,476 386,528 378,580" class="border"/>
    <polyline points="336,446 352,500 386,528" class="border thin"/>
    <polyline points="352,500 346,560 378,580" class="border thin"/>
    <path d="M386,528 l4,-5 l4,5 l-4,5 Z" class="fill"/>
    <path d="M378,580 l4,-5 l4,5 l-4,5 Z" class="fill"/>`

  const muscle = `
    <path d="M330,256 C360,266 400,264 436,272" />
    <path d="M300,374 C330,390 380,384 410,352" />
    <path d="M300,460 V640" />
    <path d="M312,500 C330,498 346,500 360,506 M312,560 C330,558 344,560 356,566" />`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<title>Barrier Tattoo: Lucan’s pact with Zahir, written in Primordial (Terran) across his arms and torso</title>
<!-- Cipher text. Chest: ${TATTOO_TEXT.chest}. Right arm: ${TATTOO_TEXT.rightArm}. Left arm: ${TATTOO_TEXT.leftArm}. Sternum: ${TATTOO_TEXT.sternum}. Seal: ${TATTOO_TEXT.seal}. -->
<defs>
  ${background('bg', '#2a1d10')}
  <radialGradient id="skin" cx="50%" cy="42%" r="62%">
    <stop offset="0" stop-color="#4a3426"/><stop offset="0.55" stop-color="#2c1f17"/><stop offset="1" stop-color="#120c09"/>
  </radialGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f3c77a"/><stop offset="0.6" stop-color="#b9813f"/><stop offset="1" stop-color="#5a3a1c"/>
  </linearGradient>
  <linearGradient id="sash" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a1e3d"/><stop offset="1" stop-color="#120c1c"/>
  </linearGradient>
  <clipPath id="body">
    <path d="${bodyHalf}"/><path d="${bodyHalf}" ${mirror}/>
  </clipPath>
  <clipPath id="rightOfSeam"><rect x="303" y="0" width="${W}" height="${H}"/></clipPath>
  <filter id="hugeBlur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="50"/></filter>
  <filter id="rimBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
  <filter id="inkGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>
    <feFlood flood-color="#ffb84a" flood-opacity="0.75"/><feComposite in2="b" operator="in" result="glow"/>
    <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <style>
    .ink path, .ink polyline, .ink polygon, .ink circle { fill: none; stroke: #f6cf7a; stroke-width: 1.25; stroke-linecap: square; stroke-linejoin: miter; }
    .ink .border { stroke-width: 1; stroke-opacity: 0.85; }
    .ink .thin { stroke-width: 0.7; stroke-opacity: 0.6; }
    .ink .fill, .ink .sep { fill: #f6cf7a; stroke: none; }
  </style>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<circle cx="300" cy="380" r="250" fill="#e3a640" opacity="0.12" filter="url(#hugeBlur)"/>
<g fill="none" stroke="#d6a84f" stroke-opacity="0.07" stroke-width="1">
  <circle cx="300" cy="400" r="230"/><circle cx="300" cy="400" r="262"/>
  <polygon points="${pts(Array.from({ length: 8 }, (_, i) => [300 + Math.cos((i * Math.PI) / 4) * 246, 400 + Math.sin((i * Math.PI) / 4) * 246]))}"/>
</g>
${motes(rand, 60, ['#d6a84f', '#f0c768', '#a07a4a'])}

<!-- Figure -->
<g>
  <path d="${bodyHalf}" fill="url(#skin)"/><path d="${bodyHalf}" ${mirror} fill="url(#skin)"/>
  <path d="${headHalf}" fill="#1a120d"/><path d="${headHalf}" ${mirror} fill="#1a120d"/>
  <g clip-path="url(#body)" fill="none" stroke-linecap="round">
    <g stroke="#0c0806" stroke-opacity="0.65" stroke-width="3" filter="url(#soft)">${muscle}<g ${mirror}>${muscle}</g></g>
    <g stroke="#7a5638" stroke-opacity="0.22" stroke-width="1.2" transform="translate(0 3)">${muscle}<g ${mirror}>${muscle}</g></g>
    <circle cx="300" cy="648" r="3" fill="#0c0806" opacity="0.6"/>
  </g>
  ${[0, 1].map(m => `<g ${m ? mirror : ''}><g clip-path="url(#rightOfSeam)">
    <g fill="none" stroke="url(#rim)" stroke-width="2.4" opacity="0.55" filter="url(#rimBlur)"><path d="${bodyHalf}"/><path d="${headHalf}"/></g>
    <g fill="none" stroke="url(#rim)" stroke-width="0.9" opacity="0.6"><path d="${bodyHalf}"/><path d="${headHalf}"/></g>
  </g></g>`).join('')}

  <!-- The pact, in liquid-gold ink -->
  <g clip-path="url(#body)">
    <g class="ink" filter="url(#inkGlow)">
      ${band(chest, TATTOO_TEXT.chest, { half: 11, maxAdvance: 13 })}
      ${band(rightArm, TATTOO_TEXT.rightArm, { vertical: true, half: 10, maxAdvance: 17 })}
      ${band(rightArm.map(mirrorX), TATTOO_TEXT.leftArm, { vertical: true, half: 10, maxAdvance: 17 })}
      ${band([[300, 466], [300, 520], [300, 580], [300, 632]], TATTOO_TEXT.sternum, { vertical: true, half: 9, maxAdvance: 12, scale: 0.85 })}
      <circle cx="300" cy="405" r="${sealR + 12}" class="border"/>
      <circle cx="300" cy="405" r="${sealR - 12}" class="border"/>
      ${seal}
      ${gemDiagram(300, 405, 26)}
      ${gemDiagram(462, 312, 18, 20)}
      ${gemDiagram(138, 312, 18, -20)}
      ${cuff(468, 626, 516, 632)}
      ${cuff(84, 632, 132, 626)}
      ${facetsRight}
      <g ${mirror}>${facetsRight}</g>
    </g>
  </g>

  <!-- Sash -->
  <g clip-path="url(#body)">
    <path d="M150,712 C230,700 370,700 450,712 L450,800 L150,800 Z" fill="url(#sash)"/>
    <path d="M150,712 C230,700 370,700 450,712" fill="none" stroke="#d6a84f" stroke-width="2"/>
    <path d="M150,720 C230,708 370,708 450,720" fill="none" stroke="#d6a84f" stroke-opacity="0.45" stroke-width="0.8"/>
    <path d="M250,712 C262,740 258,770 266,800 M340,712 C334,744 342,772 336,800" fill="none" stroke="#06040a" stroke-opacity="0.6" stroke-width="2"/>
  </g>
</g>
${frame()}
</svg>
`
}

mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'the-golden-pact.svg'), tattoo())
console.log(`Wrote the illustration to ${OUT}`)
