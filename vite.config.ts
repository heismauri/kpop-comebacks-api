import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  root: "app",
  resolve: {
    alias: {
      "@api": fileURLToPath(new URL("./src", import.meta.url)),
      "@app": fileURLToPath(new URL("./app/src", import.meta.url))
    }
  },
  server: {
    proxy: {
      "/api": "http://localhost:8787"
    }
  }
});
