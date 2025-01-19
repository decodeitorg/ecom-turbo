import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { loadEnv } from 'vite';

const { PORT } = loadEnv(process.env.NODE_ENV, '../../', '');
console.log('🚀 ~ PORT:', PORT);

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
  server: { port: Number(PORT) },
  adapter: node({
    mode: 'standalone',
  }),
  output: 'server',
});
