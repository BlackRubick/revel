import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: {
    families: [
      { name: 'Playfair Display', provider: 'google' },
      { name: 'Inter', provider: 'google' },
    ],
  },

  image: {
    cloudinary: {
      baseURL: process.env.CLOUDINARY_BASE_URL,
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production-32chars',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-prod-32c',
    databaseUrl: process.env.DATABASE_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    public: {
      socketUrl: process.env.SOCKET_URL || 'http://localhost:3000',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  app: {
    head: {
      title: 'Rével — Organización Profesional de Eventos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Rével es la plataforma  para organización profesional de eventos sociales y corporativos.',
        },
        { property: 'og:title', content: 'Rével — Organización Profesional de Eventos' },
        { name: 'theme-color', content: '#0A0A0A' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
    pageTransition: { name: 'page' },
    layoutTransition: { name: 'layout' },
  },

  ssr: true,

  future: {
    compatibilityVersion: 4,
  },
})
