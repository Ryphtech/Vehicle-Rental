/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "primary-hover": "#0f6bd0",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "sidebar-bg": "#F4F4F4",
        "card-bg": "#ffffff",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2632",
        "text-primary-light": "#111418",
        "text-primary-dark": "#f0f2f4",
        "text-secondary-light": "#617589",
        "text-secondary-dark": "#9ba8b6",
        "background-alt": "#f8f9fa",
        "text-main": "#333333",
        "text-muted": "#64748b",
        "border-subtle": "#e2e8f0",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
  plugins: [],
}
