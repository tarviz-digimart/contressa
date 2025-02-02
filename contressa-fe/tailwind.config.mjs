/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Subtext
        b1: ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }], // 12px, regular
        // Helper Text
        b2: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px, regular
        // Form Labels and Body Text
        b3: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 16px, regular
        // Links/Buttons
        b4: ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }], // 16px, semiBold
        // Section Title
        h1: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // 24px, semiBold
        // SubHeading
        h2: ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }], // 32px, semiBold
        // Main Heading
        h3: ['3rem', { lineHeight: '3.5rem', fontWeight: '700' }], // 48px, bold
      },
    },
  },
  plugins: [],
};
