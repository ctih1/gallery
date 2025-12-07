<script lang="ts">
    import { formatMinutes } from "$lib";
    import ClearBase from "./ClearBase.svelte";
    import ConvertableFormat from "./ConvertableFormat.svelte";

    let {
        type,
        maxSpeed,
        avgSpeed,
        time,
        started,
        distance,
        kilojoules,
        name
    }: {
        type: "Run" | "Ride";
        maxSpeed: number;
        avgSpeed: number;
        time: number;
        started: string;
        distance: number;
        kilojoules: number;
        name: string;
    } = $props();
</script>

<ClearBase className="min-w-80 min-h-40 p-2 m-1 hover:bg-white/5 transition-colors">
    <h2>{name}</h2>
    <p>Duration: {formatMinutes(Math.round(time / 6) / 10)} mins</p>
    {#if type === "Run"}
        <p>
            Average speed: <ConvertableFormat
                metricValue={Math.round((16.6667 / avgSpeed) * 100) / 100}
                metricUnit="/km"
                imperialUnit="/mile"
                type="m/km"
            />
        </p>
        <p>
            Max speed: <ConvertableFormat
                metricValue={Math.round((16.6667 / maxSpeed) * 100) / 100}
                metricUnit="/km"
                imperialUnit="/mile"
                type="m/km"
            />
        </p>
    {:else}
        <p>
            Average speed: <ConvertableFormat
                metricValue={Math.round(avgSpeed * (60 * 60)) / 1000}
                metricUnit="km/h"
                imperialUnit="mp/h"
            />
        </p>
        <p>
            Max speed: <ConvertableFormat
                metricValue={Math.round(maxSpeed * (60 * 60)) / 1000}
                metricUnit="km/h"
                imperialUnit="mp/h"
            />
        </p>
    {/if}
    <p>
        Distance: <ConvertableFormat
            metricValue={Math.round(distance / 10) / 100}
            metricUnit="km"
            imperialUnit="miles"
        />
    </p>
    {#if kilojoules}
        <p>Calories burnt: {Math.round(kilojoules / 0.239005) || 0} kcal</p>
    {/if}
    <p>Date: {new Date(started).toLocaleString()}</p>
</ClearBase>
