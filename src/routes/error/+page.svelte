<script lang="ts">
    import Holder from "$lib/components/Holder.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<div class="relative top-1/2 translate-y-1/2">
    <Holder>
        {@html data.targetText[0]}
        {@html data.targetText[1].replace("{path}", data.originalPath ?? "")}

        <br />

        <h3><code>{data.status} - {data.message}</code></h3>
    </Holder>
</div>

<style>
    :global(.body-error) {
        background-color: var(rgb(38, 0, 0));
        background:
            radial-gradient(circle at center, rgb(5, 0, 0, 0.9) 60%, rgba(255, 29, 29, 0.8) 300%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 362 362' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='10' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
</style>
