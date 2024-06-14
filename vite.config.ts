import { defineConfig } from "vite";
import plugins from "./plugin";
import { fileURLToPath, resolve } from "node:url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json", "vue", "scss"]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/scss/variables.scss';`
      }
    }
  },
  server: {
    hmr: true,
    port: 2024,
    host: true
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index'),
      name: 'PineLibs',
      // the proper extensions will be added
      fileName: 'pine-libs'
    },
    rollupOptions: {
      external: ['vue'],
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          "group-user": ["./src/login", "./src/home", "./src/notfound"]
        },
        globals: {
          vue: 'Vue'
        }
      }
    },

  }
});
