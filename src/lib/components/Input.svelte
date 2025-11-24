<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

    let { value = $bindable(""), disablePasting, label, children, ...rest }: HTMLInputAttributes & { value: any, disablePasting?: boolean, label?: string, children?: Snippet } = $props();

    let className = $state("");
    if (rest.type === "range") {
        className = "min-w-12 min-h-4 accent-sky-600";
    } else {
        className = "min-w-12 transition-[outline] p-1 bg-white/10 outline-sky-600 outline-1 focus:outline-2 active:outline-4 rounded-lg";
    }
</script>

<div class="flex flex-col">
    {#if children}
        <div class="block">
            {@render children()}
        </div>
    {:else}
        <label for={label+"-input"}>{label}</label>
    {/if}
    <input onpaste={e => disablePasting ? e.preventDefault() : ""} bind:value id={label+"-input"} {...rest} class={twMerge(className, ...rest.class?.toString() ?? "")}>
</div>
