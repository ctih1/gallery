<script lang="ts">
    import type { Snippet } from "svelte";
    import { slide } from "svelte/transition";
    import ClearBase from "./ClearBase.svelte";
    let open: boolean = $state(false);

    let { title, children }: { title: string; children: Snippet } = $props();
</script>

<div>
    <ClearBase className="p-2 bg-white/5 w-fit">
        <button onclick={_ => (open = !open)}>{title}</button>
    </ClearBase>

    {#if open}
        <div transition:slide>
            <ClearBase className="w-full p-2 mt-2 ml-auto mr-auto">
                {@render children()}
            </ClearBase>
        </div>
    {/if}
</div>
