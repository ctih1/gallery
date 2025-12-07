<script lang="ts">
    import { page } from "$app/state";
    import favicon from "$lib/assets/favicon.svg";
    import BodyClass from "$lib/components/BodyClass.svelte";
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import "../app.css";

    let { children } = $props();
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

<BodyClass className="basic-bg"></BodyClass>

{#if !page.url.pathname.includes("/photos/")}
    <ClearContainer>
        {@render children?.()}
    </ClearContainer>
{:else}
    {@render children?.()}
{/if}

<style>
    :global(.basic-bg) {
        background-image: url("/images/img_6973.jpg.webp");
        padding-bottom: 48px;
    }
</style>
