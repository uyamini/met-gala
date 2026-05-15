/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        void: '#0A0908',
        bone: '#E8E0D2',
        gold: '#C9A84C',
        ash: '#6B6560',
        dim: '#1C1A18',
        border: 'rgba(232, 224, 210, 0.15)',
      },
      letterSpacing: {
        widest: '0.3em',
      },
    },
  },
  plugins: [],
};
