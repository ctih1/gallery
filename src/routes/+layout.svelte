<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/state";
    import Holder from "$lib/components/Holder.svelte";
    import { onMount } from "svelte";
    import "../app.css";

    let { children } = $props();
    let uptimeDownItems: string[] = $state([]);

    onMount(async () => {
        if (!browser) return;

        let script = window.document.createElement("script");
        script.src = "https://analytics.ctih1.fi/script.js";
        script.async = true;
        script.setAttribute("data-website-id", "6cb4b927-0ef8-418b-8463-3818804b2c90");
        window.document.head.appendChild(script);

        const indexResponse = fetch("https://uptime.ctih1.fi/status/home");
        let erroredIndices: number[] = [];

        await fetch("https://uptime.ctih1.fi/api/status-page/heartbeat/home")
            .then(res => res.json())
            .then(jason => {
                for (const [id, heartbeats] of Object.entries(jason.heartbeatList)) {
                    const latestStatus = (heartbeats as { [key: string]: any }[]).at(-1)!.status;
                    if (latestStatus === 1) {
                        continue;
                    }
                    erroredIndices.push(Number(id));
                }
            });

        if (erroredIndices.length >= 1) {
            const idNames: { [key: number]: string } = {};

            const statusHtml = await (await indexResponse).text();
            const parser = new DOMParser();
            const parsedHtml = parser.parseFromString(statusHtml, "text/html");
            const fuckedJason = parsedHtml
                .getElementById("preload-data")
                ?.innerHTML.replaceAll("'", '"')
                .replaceAll(";", "")
                .replaceAll("window.preloadData =", "");

            const properJason = JSON.parse(fuckedJason!);
            console.log(properJason);

            for (const [_, group] of Object.entries(properJason.publicGroupList)) {
                console.log(group);
                for (const monitor of (group as any).monitorList as {
                    [key: string]: any;
                }[]) {
                    console.log(monitor);
                    idNames[monitor.id] = monitor.name.replace("\n", "");
                }
            }

            for (let errorIndex of erroredIndices) {
                uptimeDownItems.push(idNames[errorIndex]);
            }
        }
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
    <title>{page.url.pathname} - ctih1.fi</title>
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

{#if uptimeDownItems.length >= 1}
    <div class="w-full bg-red-500/20 pr-2 pb-2 pl-2">
        <div class="mr-4 flex items-center justify-between">
            <h3 class="font-bold">The following services are offline:</h3>
            <a href="https://uptime.ctih1.fi">Visit status page</a>
        </div>

        <ul class="flex">
            {#each uptimeDownItems as downItem}
                <li>{downItem}</li>
            {/each}
        </ul>
    </div>
{/if}
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
