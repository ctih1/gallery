<script lang="ts">
    import { browser } from "$app/environment";
    import type { OccupationColumn } from "../../routes/api/occupation/types";

    let disabledTakeoverIndexes: boolean[] = $state(Array(9).fill(false));

    let {
        takeoverData,
        takeoverDisabled,
        takeoverAvailableIn
    }: {
        takeoverData: any[];
        takeoverDisabled: boolean;
        takeoverAvailableIn: Date;
    } = $props();
    async function takeoverIndex(index: number) {
        if (!browser) return;

        disabledTakeoverIndexes[index] = true;

        const req = await fetch(`/api/occupation?i=${index}`, {
            method: "POST"
        });

        if (req.ok) {
            const json: OccupationColumn = await req.json();
            takeoverData = takeoverData.filter(obj => obj.id !== json.id);
            takeoverData.push(json);
        }

        disabledTakeoverIndexes[index] = false;
        takeoverDisabled = true;
        takeoverAvailableIn = new Date();
        takeoverAvailableIn.setSeconds(takeoverAvailableIn.getSeconds() + 30);

        setTimeout(() => {
            takeoverDisabled = false;
        }, 30000);
    }
</script>

<div class="grid max-w-2xl grid-cols-2 gap-2 rounded-2xl md:grid-cols-3">
    {#key takeoverData}
        {#each new Array(9) as _, index}
            <button
                onclick={async () => {
                    await takeoverIndex(index);
                }}
                disabled={takeoverDisabled || disabledTakeoverIndexes[index]}
                class="game-button aspect-video rounded-sm bg-black/40 p-2 pt-0 pb-0 transition-transform hover:scale-105 enabled:hover:bg-red-500/30 disabled:opacity-55 md:nth-[1]:rounded-tl-2xl md:nth-[3]:rounded-tr-2xl md:nth-[7]:rounded-bl-2xl md:nth-[9]:rounded-br-2xl"
            >
                {#if takeoverData.length == 0}
                    Loading...
                {:else if takeoverData.find(d => d.id === index)}
                    {@const data = takeoverData.find(d => d.id === index)!}
                    <div class="claim-info flex-col">
                        <span class="flex items-center space-x-2">
                            <p class="text-left text-xl! font-semibold">
                                {takeoverData[index].nation}
                            </p>
                            <img
                                class="h-8"
                                src={`/flags/${data.country}.webp`}
                                alt={`Flag of ${data.country}`}
                            />
                        </span>
                        <p class="h-12 overflow-hidden text-left text-ellipsis opacity-55">
                            {data.isp}
                        </p>
                    </div>
                    <p class="text-left text-sm opacity-55">
                        Claimed {new Date(data.occupied).toLocaleDateString()}
                    </p>
                {:else}
                    Unclaimed!
                {/if}
            </button>
        {/each}
    {/key}
</div>
