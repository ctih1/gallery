<script lang="ts">
    import type { Snippet } from "svelte";
    import ClearBase from "./ClearBase.svelte";

    let { children, clear = false }: { children: Snippet; clear?: boolean } = $props();
</script>

<ClearBase
    className={`md:w-9/12 lg:w-8/12 w-11/12 ml-auto -z-10 mr-auto p-4 mt-4 max-w-2xl ${!clear ? "bg-black/30" : ""}`}
>
    {@render children()}
</ClearBase>
