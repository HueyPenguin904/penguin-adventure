import { defineConfig } from 'vite'

export default defineConfig({
  base: '/penguin-adventure/', // GitHub Pages project path
  build: {
    outDir: 'docs', // GitHub Pages can serve from /docs folder
    emptyDirBeforeWrite: true,
  }
})
