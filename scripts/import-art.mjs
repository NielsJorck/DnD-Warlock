// Imports a painted item image (PNG on a plain white background) as site art:
// keys out the white background, fits the subject onto a 600×800 canvas and
// composites it over the same dark, glowing backdrop the SVG illustrations use.
//
//   node scripts/import-art.mjs <input.png> <output.png> [glow hex, default 8c5cff]
//
// No dependencies: PNG decoding and encoding use node:zlib.
import { readFileSync, writeFileSync } from 'node:fs'
import { deflateSync, inflateSync } from 'node:zlib'

const [input, output, glowHex = '8c5cff'] = process.argv.slice(2)
if (!input || !output) {
  console.error('Usage: node scripts/import-art.mjs <input.png> <output.png> [glow hex]')
  process.exit(1)
}

const W = 600
const H = 800
const MARGIN = 28

// ── PNG decode (8-bit RGB/RGBA, non-interlaced) ─────────────
function decode(buf) {
  const w = buf.readUInt32BE(16)
  const h = buf.readUInt32BE(20)
  const depth = buf[24]
  const type = buf[25]
  if (depth !== 8 || ![2, 6].includes(type) || buf[28] !== 0) throw new Error('Only 8-bit, non-interlaced RGB/RGBA PNGs are supported')
  const bpp = type === 6 ? 4 : 3
  const idat = []
  for (let o = 8; o < buf.length; ) {
    const len = buf.readUInt32BE(o)
    if (buf.toString('ascii', o + 4, o + 8) === 'IDAT') idat.push(buf.subarray(o + 8, o + 8 + len))
    o += 12 + len
  }
  const raw = inflateSync(Buffer.concat(idat))
  const stride = w * bpp
  const px = Buffer.alloc(w * h * bpp)
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)]
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x]
      const a = x >= bpp ? px[y * stride + x - bpp] : 0
      const b = y ? px[(y - 1) * stride + x] : 0
      const c = x >= bpp && y ? px[(y - 1) * stride + x - bpp] : 0
      let r = v
      if (f === 1) r += a
      else if (f === 2) r += b
      else if (f === 3) r += (a + b) >> 1
      else if (f === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
        r += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      px[y * stride + x] = r & 255
    }
  }
  // Normalize to float RGBA
  const out = new Float32Array(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    out[i * 4] = px[i * bpp]
    out[i * 4 + 1] = px[i * bpp + 1]
    out[i * 4 + 2] = px[i * bpp + 2]
    out[i * 4 + 3] = bpp === 4 ? px[i * bpp + 3] / 255 : 1
  }
  return { w, h, px: out }
}

// ── PNG encode (RGB) ────────────────────────────────────────
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = buf => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function encode(w, h, rgb) {
  const stride = w * 3
  const raw = Buffer.alloc(h * (stride + 1))
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 1 // Sub filter
    for (let x = 0; x < stride; x++) {
      const v = rgb[y * stride + x]
      const left = x >= 3 ? rgb[y * stride + x - 3] : 0
      raw[y * (stride + 1) + 1 + x] = (v - left) & 255
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

// ── Key out the white background ────────────────────────────
const src = decode(readFileSync(input))
const { w, h, px } = src
const minC = i => Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])
const maxC = i => Math.max(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])
const whitish = i => px[i * 4 + 3] < 0.05 || (minC(i) >= 246 && maxC(i) - minC(i) <= 8)

// Flood fill from the border so light highlights inside the subject survive
const bg = new Uint8Array(w * h)
const stack = []
for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
while (stack.length) {
  const i = stack.pop()
  if (bg[i] || !whitish(i)) continue
  bg[i] = 1
  const x = i % w, y = (i / w) | 0
  if (x > 0) stack.push(i - 1)
  if (x < w - 1) stack.push(i + 1)
  if (y > 0) stack.push(i - w)
  if (y < h - 1) stack.push(i + w)
}

// Soften the edge: pixels near the background are partly blended with white
const nearBg = i => {
  const x = i % w, y = (i / w) | 0
  for (let dy = -2; dy <= 2; dy++)
    for (let dx = -2; dx <= 2; dx++) {
      const xx = x + dx, yy = y + dy
      if (xx >= 0 && yy >= 0 && xx < w && yy < h && bg[yy * w + xx]) return true
    }
  return false
}
for (let i = 0; i < w * h; i++) {
  if (bg[i]) {
    px[i * 4 + 3] = 0
    continue
  }
  if (!nearBg(i)) continue
  const a = Math.min(1, Math.max(0, (255 - minC(i)) / 80)) * px[i * 4 + 3]
  px[i * 4 + 3] = a
  if (a > 0) for (let k = 0; k < 3; k++) px[i * 4 + k] = Math.min(255, Math.max(0, (px[i * 4 + k] - (1 - a) * 255) / a))
}

// Bounding box of the subject
let x0 = w, y0 = h, x1 = 0, y1 = 0
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++)
    if (px[(y * w + x) * 4 + 3] > 0.04) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x)
      y0 = Math.min(y0, y); y1 = Math.max(y1, y)
    }
const bw = x1 - x0 + 1
const bh = y1 - y0 + 1
const scale = Math.min((W - 2 * MARGIN) / bw, (H - 2 * MARGIN) / bh)
const ox = (W - bw * scale) / 2
const oy = (H - bh * scale) / 2

// Premultiplied bilinear sample of the source
function sample(sx, sy) {
  const fx = Math.floor(sx), fy = Math.floor(sy)
  const tx = sx - fx, ty = sy - fy
  const acc = [0, 0, 0, 0]
  for (const [dx, dy, wt] of [[0, 0, (1 - tx) * (1 - ty)], [1, 0, tx * (1 - ty)], [0, 1, (1 - tx) * ty], [1, 1, tx * ty]]) {
    const x = fx + dx, y = fy + dy
    if (x < 0 || y < 0 || x >= w || y >= h) continue
    const i = (y * w + x) * 4
    const a = px[i + 3] * wt
    acc[0] += px[i] * a; acc[1] += px[i + 1] * a; acc[2] += px[i + 2] * a; acc[3] += a
  }
  return acc
}

// ── Backdrop: same radial gradient as the SVG art, plus a soft glow ──
const hex = s => [0, 2, 4].map(k => parseInt(s.slice(k, k + 2), 16))
const stops = [[0, hex('1f1830')], [0.55, hex('110e0c')], [1, hex('070605')]]
const glow = hex(glowHex)
function backdrop(x, y) {
  const t = Math.min(1, Math.hypot((x - W * 0.5) / (W * 0.75), (y - H * 0.45) / (H * 0.75)))
  let k = 0
  while (k < stops.length - 2 && t > stops[k + 1][0]) k++
  const [t0, c0] = stops[k], [t1, c1] = stops[k + 1]
  const u = (t - t0) / (t1 - t0)
  const g = 0.2 * Math.exp(-((x - W / 2) ** 2 + (y - H / 2) ** 2) / (2 * 190 ** 2))
  return c0.map((c, j) => c + (c1[j] - c) * u).map((c, j) => c * (1 - g) + glow[j] * g)
}

const out = Buffer.alloc(W * H * 3)
const SS = 3 // supersampling per axis
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const acc = [0, 0, 0, 0]
    for (let sy = 0; sy < SS; sy++)
      for (let sx = 0; sx < SS; sx++) {
        const s = sample(x0 + (x + (sx + 0.5) / SS - ox) / scale - 0.5, y0 + (y + (sy + 0.5) / SS - oy) / scale - 0.5)
        for (let k = 0; k < 4; k++) acc[k] += s[k] / (SS * SS)
      }
    const back = backdrop(x, y)
    for (let k = 0; k < 3; k++) out[(y * W + x) * 3 + k] = Math.round(Math.min(255, acc[k] + back[k] * (1 - acc[3])))
  }

writeFileSync(output, encode(W, H, out))
console.log(`${output}: ${W}×${H}, subject ${bw}×${bh} scaled ×${scale.toFixed(2)}`)
