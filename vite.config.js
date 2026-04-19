import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  publicDir: "assets/public",
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        inspire: resolve(__dirname, "inspire.html"),
        guides: resolve(__dirname, "guides.html"),
        about: resolve(__dirname, "about.html"),
        "inspire-story": resolve(__dirname, "inspire-story.html"),
      },
    },
  },
});
