/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a56db', // Valid blue from design button
          dark: '#1e3a8a',    // Darker blue
          light: '#dbeafe',   // Light blue background
        },
        secondary: {
          DEFAULT: '#1e293b', // Dark slate for headings
          light: '#64748b',   // Body text
        },
        brand: {
          navy: '#0f172a',    // Footer/Header dark background
          magic: '#113A74',   // Magic Navy from design
          heading: '#16243D', // Header text color from design
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        philosopher: ['var(--font-philosopher)', 'Philosopher', 'serif'],
        heading: ['var(--font-philosopher)', 'Philosopher', 'serif'],
        display: ['var(--font-el-messiri)', 'El Messiri', 'sans-serif'],
        jakarta: ['var(--font-plus-jakarta-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        figtree: ['var(--font-figtree)', 'Figtree', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
