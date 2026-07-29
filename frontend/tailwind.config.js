/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1B19',
        paper: '#F6F3EC',
        moss: {
          DEFAULT: '#5B6650',
          light: '#7C8A6E',
          dark: '#3E4636',
        },
        clay: '#B5502F',
        gold: '#C9A050',
        line: '#DAD3C3',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

