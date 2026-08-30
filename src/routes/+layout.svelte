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
    class:body-error={page.error?.message !== undefined || page.url.pathname.startsWith("/error")}
    class:default-body={page.url.pathname !== "/" &&
        page.error?.message === undefined &&
        !page.url.pathname.startsWith("/error")}
    class="pointer-events-none fixed -z-50 h-full min-h-screen w-full"
></div>

<nav class="h-12 w-full min-w-screen bg-zinc-600/20">
    <div class="text-md ml-4 flex h-12 items-center space-x-4 font-semibold sm:text-xl md:text-2xl">
        <a target="_parent" href="/">Home</a>
        <a target="_parent" href="/photos">Photos</a>
        <a target="_parent" href="/tools">Tools</a>
        <a target="_parent" href="/devices">Devices</a>
        <a target="_parent" href="/fun">Misc</a>
    </div>
</nav>

{#if page.url.pathname !== "/" && page.url.pathname !== "/waltti" && !page.url.pathname
        .toString()
        .includes("/photos/") && !page.error && !page.url.pathname.startsWith("/error")}
    <Holder>
        {@render children?.()}
    </Holder>
{:else}
    {@render children?.()}
{/if}
<br />

<style>
    /* :global(.default-body) {
        background-color: var(--color-zinc-900);
        background:
            radial-gradient(circle at 80% 40%, rgba(64, 0, 255, 0.1), transparent 80%),
            radial-gradient(circle at -10% 10%, rgba(230, 0, 255, 0.1), transparent 80%),
            linear-gradient(200deg, rgba(255, 192, 203, 0.01), rgba(128, 0, 128, 0.3)),
            linear-gradient(
                180deg,
                rgba(0, 2, 14, 0.8) 0%,
                rgba(3, 5, 29, 0.8) 40%,
                rgba(1, 7, 29, 0.9) 90%
            );
    } */
</style>
