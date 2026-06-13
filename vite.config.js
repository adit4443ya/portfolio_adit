import { defineConfig } from 'vite';

// Static build — relative base so it deploys on any host (GH Pages, Vercel, etc.)
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
