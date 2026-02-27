/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        sans: ['Inter', 'sans-serif'], // Standard modern font
        heading: ['Philosopher', 'sans-serif'], // Elegant font for headings
        display: ['El Messiri', 'sans-serif'], // New font for mini slider
        jakarta: ['Plus Jakarta Sans', 'sans-serif'], // Modern sans for section badges
        figtree: ['Figtree', 'sans-serif'], // Bold modern font for decorative text
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
