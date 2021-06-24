module.exports = {
    purge: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          'myblack': '#252525',
          'mydark': '#3B3B3B',
          'mygreen': '#9DB899',
          'myfade-brown': '#FFCDAA',
          'mybold-brown': '#ED897F',
          'myred': '#F14666',
          'mygray': '#AAAAAA'
        }
      }
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }
  