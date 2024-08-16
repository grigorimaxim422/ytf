/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            body: [
                'Roboto',
            ],
        },
        extend: {
            colors: {
                appBg: "#111113",
                cardBg: '#2B2B2B',
                primary: '#4096ff',
                white: {
                    DEFAULT: "#FFFFFF"
                }
            },
        },

    },
    plugins: [],
}

