import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webfontDownload from "vite-plugin-webfont-dl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webfontDownload([
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600&display=swap",
      "https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap",
    ]),
  ],
  resolve: {
    dedupe: ["svelte"],
  },
});
