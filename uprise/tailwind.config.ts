import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: '#1A1A1D',
          light: '#222226',
          lighter: '#2A2A2E',
        },
        sand: {
          DEFAULT: '#F4F1EC',
          dark: '#E8E4DE',
        },
        orange: {
          DEFAULT: '#E07A2F',
          light: '#F09040',
        },
        steel: '#3A86FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
export default config