import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
      configFile: './tailwind.config.mjs',
    }),
  ],
  vite: {
    build: {
      sourcemap: import.meta.env.MODE === 'development',
      chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000kB
    },
    envDir: '../../',
  },
  server: { port: 3210 },
  adapter: node({
    mode: 'standalone',
  }),
  output: 'server',
});
