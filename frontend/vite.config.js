import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  plugins: [react()],
  build: { outDir: "dist" }
});
