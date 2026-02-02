<script lang="ts">
    import { browser } from "$app/environment";
    import { onDestroy, onMount } from "svelte";

    let { title, className }: { title?: string; className?: string } = $props();

    onMount(() => {
        if (browser && className) {
            console.log(`Adding ${className} to classlist`);
            document.body.classList.add(className);
        }
    });

    onDestroy(() => {
        if (browser && className) {
            document.body.classList.remove(className);
        }
    });
</script>

<svelte:head>
    <title>
        {title || "ctih1.frii.site"}
    </title>
</svelte:head>
