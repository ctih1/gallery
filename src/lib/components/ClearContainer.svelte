<script lang="ts">
    import type { Snippet } from "svelte";
    import ClearBase from "./ClearBase.svelte";

    let { children }: { children: Snippet } = $props();
</script>

<ClearBase className="md:w-9/12 lg:w-8/12 w-11/12 ml-auto -z-10 mr-auto p-2 mt-4 max-w-2xl">
    {@render children()}
</ClearBase>
