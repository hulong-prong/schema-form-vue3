import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      insertTypesEntry: true, // 插入 .d.ts 文件的入口文件
      outDir: "dist", // 输出 .d.ts 文件的目录
      // staticImport: true, // 使用静态导入模式
    }),
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/package/schemaForm/index.ts",
      name: "schema-form",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue", "ant-design-vue", "@ant-design/icons-vue"],
      output: {
        globals: {
          vue: "vue",
          "ant-design-vue": "ant-design-vue",
          "@ant-design/icons-vue": "@ant-design/icons-vue",
        },
      },
    },
  },
});
