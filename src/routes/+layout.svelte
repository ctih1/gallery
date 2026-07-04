<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/state";
    import Holder from "$lib/components/Holder.svelte";
    import { onMount } from "svelte";
    import "../app.css";

    let { children } = $props();

    onMount(async () => {
        if (!browser) return;

        let script = window.document.createElement("script");
        script.src = "https://analytics.ctih1.fi/script.js";
        script.async = true;
        script.setAttribute("data-website-id", "6cb4b927-0ef8-418b-8463-3818804b2c90");
        window.document.head.appendChild(script);
    });
</script>

<svelte:head>
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
    <meta
        name="description"
        content="An objectively super cool website made for showcasing little stuff I (aka ctih1) have done. Also includes some useful tools, atleast for some people."
    />
    <link rel="dns-prefetch" href="https://analytics.ctih1.fi" />
    <link rel="dns-prefetch" href="https://homecdn.ctih1.fi" />
</svelte:head>

<div
    id="fake-body"
    class:home-dark={page.url.pathname === "/"}
    class="pointer-events-none fixed -z-50 h-full min-h-screen w-full"
></div>

<nav class="h-12 w-full min-w-screen bg-zinc-600/50">
    <div class="mr-4 ml-8 flex h-12 items-center space-x-4 text-2xl font-semibold">
        <a href="/">Home</a>
        <a href="/photos">Photos</a>
        <a href="/tools">Tools</a>
        <a href="/devices">Devices</a>
        <a href="/fun">Misc</a>
    </div>
</nav>

{#if page.url.pathname !== "/" && !page.url.pathname.toString().includes("/photos/")}
    <Holder>
        {@render children?.()}
    </Holder>
{:else}
    {@render children?.()}
{/if}
<br />
