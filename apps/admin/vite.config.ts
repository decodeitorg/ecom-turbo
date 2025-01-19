import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
                type: "module",
                navigateFallback: "index.html",
            },
            srcDir: "public",
            filename: "service-worker.js",
            strategies: "generateSW",
            workbox: {
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                navigateFallback: "/admin/index.html",
                globDirectory: "dist",
                modifyURLPrefix: {
                    "": "/admin/",
                },
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-stylesheets",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-webfonts",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                        },
                    },
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "images",
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                            },
                        },
                    },
                ],
            },
            scope: "/admin/",
            base: "/admin/",
            manifest: false,
            includeAssets: [
                "favicon.svg",
                "robots.txt",
                "apple-touch-icon.png",
            ],
        }),
    ],
    base: "/admin/", // This will prefix all assets with /admin/
    build: {
        outDir: "../frontend/public/admin",
        emptyOutDir: true,
        assetsDir: "assets",
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    envDir: "../../",
});
