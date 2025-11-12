import { createHighlighter } from "@bitmachina/highlighter";
import oneDark from "./themes/one-dark-pro.json" with { type: "json" };

/** @type {import('mdsvex').MdsvexOptions} */
export default {
    extensions: [".svx"],
    highlight: {
        highlighter: await createHighlighter({ theme: oneDark, langs: ["python", "css", "csharp", "rust", "javascript" ,"typescript", "markdown", "make", "docker", "java", "bash", "html", "svelte"] }),
    },
};