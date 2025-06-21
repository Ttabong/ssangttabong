/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // App Router를 사용하는 경우 중요!
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 4px 12px rgba(243, 156, 18, 0.4)',
      },
    },
  },
  plugins: [],
}