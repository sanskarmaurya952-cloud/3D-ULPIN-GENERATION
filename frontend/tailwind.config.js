/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        gov: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        cadastre: {
          primary: '#1e3a8a',
          accent: '#0284c7',
          highlight: '#38bdf8',
          parcel: '#0284c7',
          building: '#475569',
          unit: '#0284c7',
          utility: '#ea580c',
          conflict: '#dc2626',
          valid: '#16a34a',
        }
      }
    },
  },
  plugins: [],
}
