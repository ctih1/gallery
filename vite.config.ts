import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        host: true
    },
    preview: {
        allowedHosts: ["gallery.frii.site", "ctih1.frii.site", "ctih1.fi", "www.ctih1.fi"]
    }
});
