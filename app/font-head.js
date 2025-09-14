// Add Viga font from Google Fonts
export default defineNuxtConfig({
  // ...existing config...
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Viga:wght@400&display=swap'
        }
      ]
    }
  }
})
