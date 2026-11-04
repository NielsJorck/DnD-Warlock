export type Verdict = 'allow' | 'discuss' | 'deny'

interface DmReviewState {
  verdicts: Record<string, Verdict> // item slug → verdict
  notes: Record<string, string> // item slug → DM note
  variants: Record<string, string> // item slug → variant id, when the DM changes it
  answers: Record<string, string> // question id → DM answer
}

const STORAGE_KEY = 'lucan-dm-review-v1'

const fresh = (): DmReviewState => ({ verdicts: {}, notes: {}, variants: {}, answers: {} })

export const verdictLabels: Record<Verdict, string> = {
  allow: 'Allowed',
  discuss: 'Let’s talk',
  deny: 'Not allowed'
}

export function useDmReview() {
  const state = useState<DmReviewState>('dm-review', fresh)
  const loaded = useState('dm-review-loaded', () => false)

  onMounted(() => {
    if (!loaded.value) {
      loaded.value = true
      try {
        const saved = readSaved(STORAGE_KEY)
        if (saved) state.value = { ...fresh(), ...JSON.parse(saved) }
      } catch {
        // ignore corrupt storage
      }
    }
    watch(state, v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })
  })

  // Clicking the active verdict again clears it
  function setVerdict(slug: string, verdict: Verdict) {
    if (state.value.verdicts[slug] === verdict) delete state.value.verdicts[slug]
    else state.value.verdicts[slug] = verdict
  }

  function reset() {
    state.value = fresh()
  }

  return { state, setVerdict, reset }
}
