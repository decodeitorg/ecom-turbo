// vite.config.ts
import { defineConfig } from "file:///C:/Users/nayan/Desktop/Development/testing/turbopack-monorepo-test/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.9_terser@5.37.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/nayan/Desktop/Development/testing/turbopack-monorepo-test/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.11_@types+node@20.17.9_terser@5.37.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/nayan/Desktop/Development/testing/turbopack-monorepo-test/node_modules/.pnpm/vite-plugin-pwa@0.21.1_vite@5.4.11_@types+node@20.17.9_terser@5.37.0__workbox-build@7.3.0_@ty_xg3do7hzj3dmtjn6narynvn22a/node_modules/vite-plugin-pwa/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\nayan\\Desktop\\Development\\testing\\turbopack-monorepo-test\\apps\\admin";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Dashboard-DecodeIT",
        short_name: "Admin",
        description: "My Ecom Dashboard Admin",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024
        // 3 MB
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  base: "/admin",
  // This will prefix all assets with /admin/
  build: {
    outDir: "../frontend/public/admin",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  envDir: "../../"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxuYXlhblxcXFxEZXNrdG9wXFxcXERldmVsb3BtZW50XFxcXHRlc3RpbmdcXFxcdHVyYm9wYWNrLW1vbm9yZXBvLXRlc3RcXFxcYXBwc1xcXFxhZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbmF5YW5cXFxcRGVza3RvcFxcXFxEZXZlbG9wbWVudFxcXFx0ZXN0aW5nXFxcXHR1cmJvcGFjay1tb25vcmVwby10ZXN0XFxcXGFwcHNcXFxcYWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL25heWFuL0Rlc2t0b3AvRGV2ZWxvcG1lbnQvdGVzdGluZy90dXJib3BhY2stbW9ub3JlcG8tdGVzdC9hcHBzL2FkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgcmVhY3QoKSxcclxuICAgICAgICBWaXRlUFdBKHtcclxuICAgICAgICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcclxuICAgICAgICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiRGFzaGJvYXJkLURlY29kZUlUXCIsXHJcbiAgICAgICAgICAgICAgICBzaG9ydF9uYW1lOiBcIkFkbWluXCIsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJNeSBFY29tIERhc2hib2FyZCBBZG1pblwiLFxyXG4gICAgICAgICAgICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICAgICAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogXCJwd2EtMTkyeDE5Mi5wbmdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IFwicHdhLTUxMng1MTIucG5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgd29ya2JveDoge1xyXG4gICAgICAgICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z31cIl0sXHJcbiAgICAgICAgICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMyAqIDEwMjQgKiAxMDI0LCAvLyAzIE1CXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRldk9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICBdLFxyXG4gICAgYmFzZTogXCIvYWRtaW5cIiwgLy8gVGhpcyB3aWxsIHByZWZpeCBhbGwgYXNzZXRzIHdpdGggL2FkbWluL1xyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBvdXREaXI6IFwiLi4vZnJvbnRlbmQvcHVibGljL2FkbWluXCIsXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICAgICAgYXNzZXRzRGlyOiBcImFzc2V0c1wiLFxyXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0uanNgLFxyXG4gICAgICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcclxuICAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS5bZXh0XWAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZW52RGlyOiBcIi4uLy4uL1wiLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyYSxTQUFTLG9CQUFvQjtBQUN4YyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsZUFBZTtBQUh4QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDSixjQUFjO0FBQUEsTUFDZCxVQUFVO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDSDtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDSSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDVjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDTCxjQUFjLENBQUMsZ0NBQWdDO0FBQUEsUUFDL0MsK0JBQStCLElBQUksT0FBTztBQUFBO0FBQUEsTUFDOUM7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNiO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTDtBQUFBLEVBQ0EsTUFBTTtBQUFBO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDSixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNwQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ25DO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUNaLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
