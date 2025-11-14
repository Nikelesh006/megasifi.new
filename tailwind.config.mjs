/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Old Money Color Palette
        'old-gold': '#8B7355',
        'old-olive': '#4A4A3C',
        'old-brown': '#A67C52',
        'old-cream': '#F5F0E6',
        'old-dark': '#2C2C2C',
        'old-muted': '#8C8C8C',
        'old-light': '#E8E0D0',
        'old-border': '#D1C9B8',
      },
      fontFamily: {
        'serif': ['"Playfair Display"', 'serif'],
        'sans': ['"Lora"', 'serif'],
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
      borderColor: {
        'light': 'rgba(209, 201, 184, 0.3)',
      }
    },
  },
  plugins: [],
};