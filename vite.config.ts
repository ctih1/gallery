import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        host: true
    },
    preview: {
        allowedHosts: true,
        port: 3001,
        strictPort: true,
        host: "0.0.0.0"
    }
});
