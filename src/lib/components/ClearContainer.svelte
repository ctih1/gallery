<script lang="ts">
    import type { Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";
    import ClearBase from "./ClearBase.svelte";

    let {
        children,
        clear = false,
        className = ""
    }: { children: Snippet; clear?: boolean; className?: string } = $props();
</script>

<ClearBase
    className={twMerge(
        `md:w-9/12 lg:w-8/12 w-11/12 ml-auto -z-10 mr-auto p-4 mt-4 max-w-2xl ${!clear ? "bg-black/30" : ""}`,
        className
    )}
>
    {@render children()}
</ClearBase>
