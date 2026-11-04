import { character, lesserDao, type AbilityKey } from '~/data/characters/lucan/character'

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

export function skillBonus(ability: AbilityKey, proficient = true, withItems = true, expertise = false) {
  const prof = proficient ? character.proficiencyBonus * (expertise ? 2 : 1) : 0
  return abilityMod(ability) + prof + (withItems ? character.itemBonuses.checks : 0)
}

export const allSkills: { name: string; ability: AbilityKey }[] = [
  { name: 'Acrobatics', ability: 'dex' },
  { name: 'Animal Handling', ability: 'wis' },
  { name: 'Arcana', ability: 'int' },
  { name: 'Athletics', ability: 'str' },
  { name: 'Deception', ability: 'cha' },
  { name: 'History', ability: 'int' },
  { name: 'Insight', ability: 'wis' },
  { name: 'Intimidation', ability: 'cha' },
  { name: 'Investigation', ability: 'int' },
  { name: 'Medicine', ability: 'wis' },
  { name: 'Nature', ability: 'int' },
  { name: 'Perception', ability: 'wis' },
  { name: 'Performance', ability: 'cha' },
  { name: 'Persuasion', ability: 'cha' },
  { name: 'Religion', ability: 'int' },
  { name: 'Sleight of Hand', ability: 'dex' },
  { name: 'Stealth', ability: 'dex' },
  { name: 'Survival', ability: 'wis' }
]

// Every skill with Lucan's proficiency and bonus, Stone of Good Luck included
export const skillList = allSkills.map(s => {
  const prof = character.skills.find(p => p.name === s.name)
  return { ...s, proficient: !!prof, expertise: !!prof?.expertise, source: prof?.source, bonus: skillBonus(s.ability, !!prof, true, prof?.expertise) }
})

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

// What a d20 roll adds up to, for Lucan or for the Form of the Lesser Dao
export interface RollStats {
  abilities: Record<AbilityKey, { score: number; check: number; save: number; proficient: boolean }>
  skills: typeof skillList
  initiative: number
  passive: { perception: number; insight: number; investigation: number }
}

export const lucanStats: RollStats = {
  abilities: Object.fromEntries(
    abilityOrder.map(k => [k, { score: character.abilities[k], check: abilityMod(k) + character.itemBonuses.checks, save: saveBonus(k), proficient: character.saveProficiencies.includes(k) }])
  ) as RollStats['abilities'],
  skills: skillList,
  initiative: derived.initiative,
  passive: { perception: derived.passivePerception, insight: derived.passiveInsight, investigation: derived.passiveInvestigation }
}

// The form rolls with its own scores and proficiencies; the Stone of Good Luck's +1 still applies
const daoMod = (k: AbilityKey) => modifier(lesserDao.abilities[k])
const daoSkill = (name: string, ability: AbilityKey) =>
  daoMod(ability) + (lesserDao.skills.some(s => s.name === name) ? lesserDao.proficiencyBonus : 0) + lesserDao.itemBonus

export const formStats: RollStats = {
  abilities: Object.fromEntries(
    abilityOrder.map(k => {
      const proficient = lesserDao.saveProficiencies.includes(k)
      return [k, { score: lesserDao.abilities[k], check: daoMod(k) + lesserDao.itemBonus, save: daoMod(k) + (proficient ? lesserDao.proficiencyBonus : 0) + lesserDao.itemBonus, proficient }]
    })
  ) as RollStats['abilities'],
  skills: allSkills.map(s => {
    const proficient = lesserDao.skills.some(p => p.name === s.name)
    return { ...s, proficient, expertise: false, source: proficient ? 'Lesser Dao' : undefined, bonus: daoSkill(s.name, s.ability) }
  }),
  initiative: daoMod('dex') + lesserDao.itemBonus,
  passive: { perception: 10 + daoSkill('Perception', 'wis'), insight: 10 + daoSkill('Insight', 'wis'), investigation: 10 + daoSkill('Investigation', 'int') }
}

// Probability that a d20 attack with `bonus` hits `ac` (nat 1 misses, nat 20 hits)
export function hitChance(bonus: number, ac: number, advantage = false) {
  const p = Math.min(0.95, Math.max(0.05, (21 - (ac - bonus)) / 20))
  return advantage ? 1 - (1 - p) ** 2 : p
}
