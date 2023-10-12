/** @type {import('tailwindcss').Config} */
export default {
  // content: [
  //   './src/modules/sb/**/*.{html,js,ts}',
  // ],
  content: [
    './src/modules/sb/**/*.{html,js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // https://tailwindcss.com/docs/plugins
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/container-queries'),
  ],
  // corePlugins: {
  //   preflight: false, // remove base styles
  // },
  // experimental: {
  //   optimizeUniversalDefaults: true, // remove --tw properties
  // }
}

