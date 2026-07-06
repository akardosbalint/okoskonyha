/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f2f7f0',
          100: '#e2ede0',
          200: '#c6dcc2',
          300: '#a9c9a4', // primary background green (matches reference screenshots)
          400: '#8fb888',
          500: '#72a06a',
          600: '#598452',
          700: '#456842',
          800: '#385237',
          900: '#2f4330',
        },
        forest: {
          50: '#eef3f1',
          100: '#d3e0da',
          200: '#a7c1b6',
          300: '#7aa290',
          400: '#537d6c',
          500: '#3a6153',
          600: '#2b4a40',
          700: '#1f3d33', // primary heading color
          800: '#182f28',
          900: '#12221d',
        },
        clay: {
          50: '#fbf3ec',
          100: '#f4dfcb',
          200: '#e9bd97',
          300: '#dd9a63',
          400: '#cf7f43',
          500: '#bd6631', // CTA accent (terracotta)
          600: '#9c5227',
          700: '#7a4020',
          800: '#5c3018',
          900: '#3e2010',
        },
        cream: {
          DEFAULT: '#fdfbf5',
          100: '#fdfbf5',
          200: '#f8f3e6',
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        script: ['Caveat', 'cursive'],
        body: ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
