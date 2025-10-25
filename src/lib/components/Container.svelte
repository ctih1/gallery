<script lang="ts">
	import type { Snippet } from "svelte";
	import ClearContainer from "./ClearContainer.svelte";

    let { children }: {children: Snippet} = $props();
</script>


<ClearContainer className="min-w-80 p-2 mt-8 ml-auto mr-auto w-7/12 ">
    {@render children?.()}
</ClearContainer>