/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'retro-dark': '#111111',
        'bunuelo': '#FF6B00',
        'bunuelo-dark': '#CC5500',
        'neon': '#00FF66',
        'asfalto': '#2A2A2A',
        'retro-crema': '#F4EFE6',
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      }
    },
  },
  plugins: [],
}