export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        surface: "var(--bg-surface)",
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          teal: "var(--accent-teal)",
        },
        warning: "var(--warning)",
        danger: "var(--danger)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
