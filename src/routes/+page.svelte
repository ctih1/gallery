<script lang="ts">
	import StravaCard from "$lib/components/StravaCard.svelte";
	import { isFlagDay } from "$lib/flagdays";
	import { usingImperial } from "$lib/store";
    import type { ProcessedActivity } from "./api/strava/types";
    let stravaData: ProcessedActivity[] | undefined = $state()
    fetch("/api/strava").then(data => data.json()).then(json => {
        stravaData = json
    });

    let checked = $state(false);

    $effect(() => {
        console.log("Setting usingImperial")
        usingImperial.set(checked);
    })
</script>

{#if isFlagDay}
    <img src="/fi.webp" alt="Finnish flag" class="w-full">
    <h1>Happy flag day!</h1>
{/if}
<h1>yellooo</h1>
<p>This is a cool lil webpage I made for sharin stuff</p>

<div class="strava-activity">
    <h1>Strava activities</h1>
    <div class="strava-container overflow-x-scroll flex flex-row-reverse" >
        {#each stravaData as activity}
            <StravaCard name={activity.name} avgSpeed={activity.averageSpeed} distance={activity.distance} maxSpeed={activity.maxSpeed} started={activity.startTime} time={activity.time} type={activity.type as "Run" | "Ride"} kilojoules={activity.kilojoules} />
        {/each}
    </div>
    <div>
        <label for="imperial-check">Use imperial units</label>
        <input bind:checked id="imperial-check" type="checkbox">
    </div>

</div>

<div class="grid sm:grid-cols-2 grid-rows-[repeat(10, 1fr)] items-[flex-start] items-center mt-8">
    <img src="https://www.frii.site/badges/modern.png" alt="frii.site badge">
    <img class="bg-zinc-700 pb-0 rounded-xl w-full" src="/orangepi.png" alt="Hosted on orange pi 3b badge">
</div>
<p class="ml-4 leading-3 mt-2"><small class="opacity-70">note: I'm affiliated with frii.site</small></p>


<style>
    .strava-container {
        scrollbar-color: #FC5200 var(--color-zinc-900);
    }
</style>