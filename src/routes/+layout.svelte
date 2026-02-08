<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/state";
    import favicon from "$lib/assets/favicon.svg";
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { hslToHex } from "$lib/helpers";
    import { onMount } from "svelte";
    import "../app.css";

    let { children } = $props();

    function createGrain(baseFreq: number): string {
        return `data:image/svg+xml,%3Csvg viewBox='0 0 362 362' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;
    }

    let gradientEnabled = false;

    function createColor(baseHue: number, offset: number) {
        let result: number = 0;

        result = baseHue + offset;
        if (result > 360) {
            result = Math.abs(result) - 360;
        }
        if (result < 0) {
            result = 360 - Math.abs(result);
        }
        return result;
    }

    function generateRandomGradient() {
        if (document.body.classList.contains("index-body")) return;

        console.log("creating new gradient");
        const grainCss = createGrain(Math.random() + 2);

        const x = Math.random() * 300 - 50;
        const y = Math.random() * 360 - 80;

        const x2 = Math.random() * 200 - 50;
        const y2 = Math.random() * 260 - 80;

        const hue = Math.random() * 200;
        const color = hslToHex(hue, 10, 90);

        const color2 = hslToHex(createColor(hue, -60), 5, 80);
        const color3 = hslToHex(createColor(hue, 60), 15, 45);

        const linearGradient = `linear-gradient(${Math.round(Math.random() * 1000) / 1000}turn, ${color} 0%, rgba(255,255,255, 0.4) 100%)`;
        const radialGradient = `radial-gradient(circle at ${x}% ${y}%, ${color2} 0%, rgba(255,255,255, 0.4) 100%)`;
        const radialGradient2 = `radial-gradient(circle at ${x2}% ${y2}%, ${color3} 0%, rgba(255,255,255, 0.4) 100%)`;

        const gradients =
            radialGradient +
            ", " +
            `url("${grainCss}")` +
            ", " +
            radialGradient2 +
            ", " +
            linearGradient;

        document.body.style.background = gradients;

        document.body.style.backdropFilter = "invert(1)";

        gradientEnabled = true;
    }

    afterNavigate(() => {
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
    <script
        defer
        src="https://analytics.koti.frii.site/script.js"
        data-website-id="6cb4b927-0ef8-418b-8463-3818804b2c90"
    ></script>
</svelte:head>

<Navbar>
    <a href="/">Home</a>
    <a href="/photos">Photos</a>
    <a href="/links">Links</a>
    <a href="/tools">Tools</a>
    <a href="/devices">Devices</a>
</Navbar>

{#if !page.url.pathname.includes("/photos/") && !page.url.pathname.includes("local-docs")}
    <ClearContainer>
        {@render children?.()}
    </ClearContainer>
{:else}
    {@render children?.()}
{/if}

<br />
