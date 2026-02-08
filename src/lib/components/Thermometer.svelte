<script lang="ts">
    import { hslToHex } from "$lib/helpers";

    let { temperature }: { temperature: number } = $props();

    let tempPercentage = $derived(100 - (temperature + 40));

    function getTempColor(): string {
        const hue = (tempPercentage / 100) * 40 + 200;
        return hslToHex(hue, 100, 65);
    }
</script>

{#snippet Cap(mode: "top" | "bottom")}
    <div class={`h-8 w-16 ${mode === "top" ? "rounded-t-3xl" : "rounded-b-3xl"} bg-zinc-300`}></div>
{/snippet}

<div class="pointer-events-none w-24 pt-2" id="thermo">
    <div class="mr-0 ml-auto w-16">
        {@render Cap("top")}
        <div class="h-[430px] w-16 bg-white pt-1 pb-1">
            {#each new Array(81) as _, index}
                {@const temp = 40 - index}
                {@const major = temp % 10 == 0}

                <div class="mt-1 mb-1 flex">
                    {#if major}
                        <span
                            class={`absolute -translate-x-8 -translate-y-2.5 ${temp > 0 ? "text-red-400!" : "text-blue-500!"}`}
                            >{temp}</span
                        >
                    {/if}
                    <div
                        class={`mr-auto ml-auto ${major ? "h-0.5" : "h-px"} ${major ? "w-1/2" : "w-1/3"} ${temp > 0 ? "bg-red-300!" : "bg-blue-300!"}`}
                    ></div>
                </div>
            {/each}
            <div
                id="bar"
                class="mr-auto ml-auto h-[510px] w-2.5 -translate-y-[515px] rounded-2xl"
                style={`background: linear-gradient(transparent ${tempPercentage}%, ${getTempColor()} ${tempPercentage}%)`}
            ></div>
        </div>

        {@render Cap("bottom")}
    </div>
</div>
