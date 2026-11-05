// Saved state from before the site had more than one character, moved to the
// per-character key the first time it's read
const legacyKeys: Record<string, string> = {
  'lucan-tracker-v1': 'codex-tracker-v1'
}

// localStorage.getItem that picks up a value saved under the old key
export function readSaved(key: string): string | null {
  const saved = localStorage.getItem(key)
  const legacy = legacyKeys[key]
  if (saved !== null || !legacy) return saved
  const old = localStorage.getItem(legacy)
  if (old !== null) {
    localStorage.setItem(key, old)
    localStorage.removeItem(legacy)
  }
  return old
}
