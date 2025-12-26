<script lang="ts">
    // this component is meant to be used for making other components. If you want a simple containre, please use Container or ClearContainer
    import { type Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";

    let {
        children,
        className,
        styleOverride
    }: { children: Snippet; className: string | undefined; styleOverride?: string } = $props();

    let ball: HTMLDivElement;
    let container: HTMLDivElement;
</script>

<div
    bind:this={container}
    style={styleOverride}
    class={twMerge(
        "overflow-hidden rounded-2xl bg-black/10 outline-1 outline-[#ffffff66] backdrop-blur-sm backdrop-brightness-75 backdrop-saturate-150",
        className
    )}
>
    {@render children?.()}
</div>
