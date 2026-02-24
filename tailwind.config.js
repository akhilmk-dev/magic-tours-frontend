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
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Standard modern font
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
