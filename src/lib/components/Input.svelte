<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
    import { twMerge } from "tailwind-merge";
    import ClearBase from "./ClearBase.svelte";
    import { fade } from "svelte/transition";

    let {
        value = $bindable(""),
        element = $bindable<HTMLInputElement>(),
        disablePasting,
        label,
        children,
        ...rest
    }: HTMLInputAttributes & {
        value: any;
        disablePasting?: boolean;
        element?: HTMLInputElement;
        label?: string;
        children?: Snippet;
    } = $props();

    let hintShown: boolean = $state(false);

    let className = $state("");

    if (rest.type === "range") {
        className = "min-w-12 min-h-4 accent-sky-600";
    } else {
        className =
            "min-w-12 transition-[outline] p-1 bg-white/10 outline-sky-600 outline-1 focus:outline-2 active:outline-4 rounded-lg";
    }

    function calculateHintStyling(): string {
        const rect = element.getBoundingClientRect();
        const min = Number(element.min);
        const max = Number(element.max);

        const percent = (value - min) / (max - min);
        const res = element.offsetLeft + percent * rect.width;

        return `left: ${res}px; top: ${element.offsetTop - 25}px`;
    }
</script>

{#if rest.type === "range"}
    <div class="h-6 w-1"></div>
{/if}
<div class="flex flex-col">
    {#if children}
        <div class="block">
            {@render children()}
        </div>
    {:else}
        <label for={label + "-input"}>{label}</label>
    {/if}
    {#if rest.type === "range" && element !== undefined && hintShown}
        <div transition:fade={{ duration: 300 }}>
            {#key value}
                <ClearBase
                    styleOverride={calculateHintStyling()}
                    className="min-w-12 max-w-32 w-fit h-6 flex items-center justify-center absolute z-20 -translate-x-1/2"
                >
                    <p class="p-0">{value}</p>
                </ClearBase>
            {/key}
        </div>
    {/if}
    <input
        ontouchstart={_ => (hintShown = true)}
        onmousedown={_ => (hintShown = true)}
        ontouchend={_ => setTimeout(_ => (hintShown = false), 500)}
        onmouseup={_ => setTimeout(_ => (hintShown = false), 500)}
        onpaste={e => (disablePasting ? e.preventDefault() : "")}
        bind:this={element}
        bind:value
        id={label + "-input"}
        {...rest}
        class={twMerge(className, ...(rest.class?.toString() ?? ""))}
    />
</div>
