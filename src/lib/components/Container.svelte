<script lang="ts">
    import { twMerge } from "tailwind-merge";

    let { children, className } = $props();
</script>

<div class={twMerge("mr-auto ml-auto w-11/12 max-w-4xl bg-black/50 p-4", className)}>
    {@render children?.()}
</div>
