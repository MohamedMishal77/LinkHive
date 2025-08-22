import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // optional, fixes port
  },
  preview: {
    port: 4173, // optional, when running `vite preview`
  },
  resolve: {
    alias: {
      "@": "/src", // lets you do import X from "@/components/X"
    },
  },
  build: {
    outDir: "dist", // default, but keep for clarity
    sourcemap: true, // useful for debugging in production
  },
});
