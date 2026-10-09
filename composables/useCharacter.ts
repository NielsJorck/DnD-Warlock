import { character, type AbilityKey } from '~/data/character'

export const abilityOrder: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export function modifier(score: number) {
  return Math.floor((score - 10) / 2)
}

// Signed number with a typographic minus, e.g. +5 / −1
export function signed(n: number) {
  return n >= 0 ? `+${n}` : `−${Math.abs(n)}`
}

export function abilityMod(key: AbilityKey) {
  return modifier(character.abilities[key])
}

export function saveBonus(key: AbilityKey, withItems = true) {
  const prof = character.saveProficiencies.includes(key) ? character.proficiencyBonus : 0
  return abilityMod(key) + prof + (withItems ? character.itemBonuses.saves : 0)
}

export function skillBonus(ability: AbilityKey, proficient = true, withItems = true) {
  return abilityMod(ability) + (proficient ? character.proficiencyBonus : 0) + (withItems ? character.itemBonuses.checks : 0)
}

export const derived = {
  spellDcBase: 8 + character.proficiencyBonus + abilityMod('cha'),
  spellDc: 8 + character.proficiencyBonus + abilityMod('cha') + character.itemBonuses.spell,
  spellAttackBase: character.proficiencyBonus + abilityMod('cha'),
  spellAttack: character.proficiencyBonus + abilityMod('cha') + character.itemBonuses.spell,
  initiative: abilityMod('dex') + character.itemBonuses.checks,
  passivePerception: 10 + skillBonus('wis', false),
  passiveInsight: 10 + skillBonus('wis'),
  passiveInvestigation: 10 + skillBonus('int'),
  eldritchBeams: character.level >= 17 ? 4 : character.level >= 11 ? 3 : character.level >= 5 ? 2 : 1,
  cantripDice: character.level >= 17 ? 4 : character.level >= 11 ? 3 : character.level >= 5 ? 2 : 1,
  genieWrath: character.proficiencyBonus,
  agonizing: abilityMod('cha'),
  vesselAc: 8 + character.proficiencyBonus + abilityMod('cha') + character.itemBonuses.spell,
  vesselHp: character.level + character.proficiencyBonus
}

// Probability that a d20 attack with `bonus` hits `ac` (nat 1 misses, nat 20 hits)
export function hitChance(bonus: number, ac: number, advantage = false) {
  const p = Math.min(0.95, Math.max(0.05, (21 - (ac - bonus)) / 20))
  return advantage ? 1 - (1 - p) ** 2 : p
}
