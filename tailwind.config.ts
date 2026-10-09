import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default <Partial<Config>>{
  content: ['./components/**/*.vue', './layouts/**/*.vue', './pages/**/*.vue', './app.vue', './data/**/*.ts', './composables/**/*.ts'],
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0b0a09',
          900: '#12100e',
          850: '#171512',
          800: '#1d1a16',
          700: '#29241f',
          600: '#3a332b',
          500: '#4d4439'
        },
        parchment: '#ece2cf',
        dim: '#b0a48f',
        faint: '#7a705f',
        gold: {
          DEFAULT: '#d6a84f',
          light: '#f1d08a',
          dark: '#97712c'
        },
        jade: '#4fb39a',
        ruby: '#d65a50',
        sapphire: '#6595dc',
        amethyst: '#a682dc',
        topaz: '#e3a640',
        rose: '#d8789b',
        quartz: '#c9d3dc',
        verdigris: '#7fb07a'
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(241,208,138,0.06) inset, 0 20px 40px -24px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(214,168,79,0.35), 0 0 24px -4px rgba(214,168,79,0.35)'
      },
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        shimmer: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        'toast-in': 'toast-in 220ms ease-out',
        shimmer: 'shimmer 4s ease-in-out infinite'
      }
    }
  }
}
