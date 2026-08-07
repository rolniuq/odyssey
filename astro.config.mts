// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],

  build: {
    // Inline small styles into the HTML so the browser fetches fewer assets.
    inlineStylesheets: 'auto',
  },

  vite: {
    // Tailwind v4 as a Vite plugin (CSS is compiled at build/dev time, not scanned).
    plugins: [tailwindcss()],

    optimizeDeps: {
      // Pre-bundle React up front so dev startup and island hydration are snappier.
      include: ['react', 'react-dom'],
    },

    server: {
      warmup: {
        // Warm the most-visited modules on dev cold start for a faster first load.
        clientFiles: ['/src/layouts/BaseLayout.astro', '/src/components/Quiz.tsx'],
      },
    },

    build: {
      // Target modern browsers ⇒ smaller/faster output, no legacy transforms.
      target: 'esnext',
      // Fast Rust-powered CSS minification instead of the JS default.
      cssMinify: 'lightningcss',
    },
  },
});
