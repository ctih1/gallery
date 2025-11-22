<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

    let { value = $bindable(""), disablePasting, label, ...rest }: HTMLInputAttributes & { value: any, disablePasting?: boolean, label?: string } = $props();

    const className = "min-w-12 transition-[outline] p-1 bg-white/10 outline-sky-600 outline-1 focus:outline-2 active:outline-4 rounded-lg";
</script>

<div class="flex flex-col">
    <label for={label+"-input"}>{label}</label>
    <input onpaste={e => disablePasting ? e.preventDefault() : ""} bind:value id={label+"-input"} {...rest} class={twMerge(className, ...rest.class?.toString() ?? "")}>
</div>
