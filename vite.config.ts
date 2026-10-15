import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// VORSCHAU=1: Build mit relativen Pfaden und ohne Service Worker (für eine Vorschau außerhalb von Vercel)
const vorschau = process.env.VORSCHAU === '1'

// https://vite.dev/config/
export default defineConfig({
  base: vorschau ? './' : '/',
  build: { outDir: vorschau ? 'dist-vorschau' : 'dist' },
  plugins: [
    react(),
    tailwindcss(),
    !vorschau &&
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Sprachbuddy',
        short_name: 'Sprachbuddy',
        description: 'Den Ort verstehen – Deutsch lernen, lokal verständlich.',
        lang: 'de',
        theme_color: '#502379',
        background_color: '#F6F3F9',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
})
