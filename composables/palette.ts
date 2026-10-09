import type { School, SpellAccess, SpellStatus } from '~/data/spells'
import type { ItemGroup, Rarity } from '~/data/items'

// Full class strings so Tailwind can see them.
export const schoolTone: Record<School, { text: string; border: string; bg: string; hex: string }> = {
  Abjuration: { text: 'text-sapphire', border: 'border-sapphire/40', bg: 'bg-sapphire/10', hex: '#6595dc' },
  Conjuration: { text: 'text-topaz', border: 'border-topaz/40', bg: 'bg-topaz/10', hex: '#e3a640' },
  Divination: { text: 'text-quartz', border: 'border-quartz/40', bg: 'bg-quartz/10', hex: '#c9d3dc' },
  Enchantment: { text: 'text-rose', border: 'border-rose/40', bg: 'bg-rose/10', hex: '#d8789b' },
  Evocation: { text: 'text-ruby', border: 'border-ruby/40', bg: 'bg-ruby/10', hex: '#d65a50' },
  Illusion: { text: 'text-amethyst', border: 'border-amethyst/40', bg: 'bg-amethyst/10', hex: '#a682dc' },
  Necromancy: { text: 'text-verdigris', border: 'border-verdigris/40', bg: 'bg-verdigris/10', hex: '#7fb07a' },
  Transmutation: { text: 'text-jade', border: 'border-jade/40', bg: 'bg-jade/10', hex: '#4fb39a' }
}

export const rarityTone: Record<Rarity, { text: string; hex: string }> = {
  Common: { text: 'text-quartz', hex: '#c9d3dc' },
  Uncommon: { text: 'text-jade', hex: '#4fb39a' },
  Rare: { text: 'text-sapphire', hex: '#6595dc' },
  'Very Rare': { text: 'text-amethyst', hex: '#a682dc' },
  Legendary: { text: 'text-topaz', hex: '#e3a640' },
  Varies: { text: 'text-dim', hex: '#b0a48f' }
}

export const statusTone: Record<SpellStatus, string> = {
  known: 'border-gold/50 bg-gold/10 text-gold-light',
  book: 'border-amethyst/50 bg-amethyst/10 text-amethyst',
  wishlist: 'border-obsidian-500 bg-obsidian-800 text-dim',
  candidate: 'border-sapphire/40 bg-sapphire/10 text-sapphire',
  future: 'border-topaz/40 bg-topaz/10 text-topaz'
}

export const accessTone: Record<SpellAccess, string> = {
  Warlock: 'text-gold-light',
  'Pact of the Tome': 'text-amethyst',
  Telekinetic: 'text-sapphire',
  'Genie Patron': 'text-topaz',
  'Dao Patron': 'text-jade',
  'Book of Shadows': 'text-amethyst'
}

export const itemGroupTone: Record<ItemGroup, string> = {
  attuned: 'border-gold/50 bg-gold/10 text-gold-light',
  gear: 'border-obsidian-500 bg-obsidian-800 text-dim',
  vessel: 'border-jade/40 bg-jade/10 text-jade',
  suggestion: 'border-sapphire/40 bg-sapphire/10 text-sapphire'
}
