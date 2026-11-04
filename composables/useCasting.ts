import { spells, type Spell } from '~/data/characters/lucan/spells'

// Casting from the session page: spends the slot and updates what the tracker
// follows (concentration, Armor of Agathys), then says what happened in a toast.
export function useCasting() {
  const tracker = useTracker()
  const { state } = tracker
  const { note } = useDice()

  // via 'slot' spends a pact or Spell Savant slot; the ring and the gem already hold the magic
  function cast(spell: Spell, via: 'slot' | 'ring' | 'gem' = 'slot', level = 5) {
    // The Form of the Lesser Dao can't cast; a spell already running keeps going
    if (tracker.inForm.value) {
      note('No spellcasting in the form', `${spell.name} has to wait until the Lesser Dao form ends`)
      return false
    }
    const parts: string[] = []
    if (via === 'slot' && spell.level > 0) {
      const slot = tracker.spendSlot()
      if (!slot) return false
      parts.push(slot === 'pact' ? `Pact slot · ${tracker.left('pact')} left` : 'Spell Savant slot')
    } else if (via !== 'slot') {
      parts.push(via === 'ring' ? 'From the Ring of Spell Storing' : 'From the Spell Gem')
    }
    if (spell.slug === 'armor-of-agathys') {
      tracker.setTemp(5 * level)
      state.value.agathys = 5 * level
      parts.push(`${5 * level} temp HP`)
    }
    if (spell.concentration) {
      const prev = state.value.concentration
      state.value.concentration = spell.slug
      if (prev && prev !== spell.slug) parts.push(`Dropped ${spells.find(s => s.slug === prev)?.name ?? prev}`)
    }
    note(`Cast ${spell.name}`, parts.join(' · '))
    return true
  }

  return { cast }
}
