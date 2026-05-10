<script lang="ts">
    import "../app.css";

    let { children } = $props();
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
    <script
        defer
        src="https://analytics.koti.frii.site/script.js"
        data-website-id="6cb4b927-0ef8-418b-8463-3818804b2c90"
    ></script>
    <meta
        name="description"
        content="An objectively super cool website made for showcasing little stuff I (aka ctih1) have done. Also includes some useful tools, atleast for some people."
    />
</svelte:head>

{@render children?.()}

<br />
