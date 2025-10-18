import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve("../Backend/keys/localhost+1-key.pem")),
      cert: fs.readFileSync(path.resolve("../Backend/keys/localhost+1.pem")),
    },
    port: 5173,
  },
});
