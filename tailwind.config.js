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
        bone: '#F2EDE4',
        ink: '#0D0B0A',
        oxblood: '#5C0A18',
        ash: '#A8A29A',
        cream: '#E8E0D2',
      },
      letterSpacing: {
        widest: '0.3em',
      },
    },
  },
  plugins: [],
};
