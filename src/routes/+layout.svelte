<script lang="ts">
    import { onNavigate } from "$app/navigation";
    import { page } from "$app/state";
    import favicon from "$lib/assets/favicon.svg";
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { onMount } from "svelte";
    import "../app.css";

    let { children } = $props();

    function createGrain(baseFreq: number): string {
        return `data:image/svg+xml,%3Csvg viewBox='0 0 362 362' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;
    }

    let gradientEnabled = false;

    // https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
    function hslToHex(h: number, s: number, l: number) {
        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, "0"); // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function generateRandomGradient() {
        if (document.body.classList.contains("index-body")) return;

        console.log("creating new gradient");
        const grainCss = createGrain(2);

        const x = Math.random() * 500 - 50;
        const y = Math.random() * 460 - 80;

        const hue = Math.random() * 360;
        const color = hslToHex(hue, 30, 50);

        console.log(color);

        document.body.style.background = `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, rgba(255,255,255, 0.4) 100%), url("${grainCss}")`;
        document.body.style.backdropFilter = "invert(1)";

        gradientEnabled = true;
    }

    onNavigate(() => {
        generateRandomGradient();
        if (window.location.pathname === "/" && gradientEnabled) {
            window.location.reload();
        }
    });

    onMount(() => {
        generateRandomGradient();
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link
        rel="preload"
        as="font"
        href="/fonts/InterVariable.woff2"
        type="font/woff2"
        crossorigin="anonymous"
    />
    <link
        rel="preload"
        as="font"
        href="/fonts/JetBrainsMonoSemiBold.woff2"
        type="font/woff2"
        crossorigin="anonymous"
    />
</svelte:head>

<Navbar>
    <a href="/">Home</a>
    <a href="/photos">Photos</a>
    <a href="/links">Links</a>
    <a href="/tools">Tools</a>
</Navbar>

{#if !page.url.pathname.includes("/photos/") && !page.url.pathname.includes("local-docs")}
    <ClearContainer>
        {@render children?.()}
    </ClearContainer>
{:else}
    {@render children?.()}
{/if}

<br />
