<script lang="ts">
	import StravaCard from "$lib/components/StravaCard.svelte";
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

<h1>yellooo</h1>
<p>This is a cool lil webpage I made for sharin stuff</p>

<div class="strava-activity">
    <h1>Strava activities</h1>
    <div>
        <label for="imperial-check">Use imperial units</label>
        <input bind:checked id="imperial-check" type="checkbox">
    </div>
    
    <div class="strava-container overflow-x-scroll flex flex-row-reverse" >
        {#each stravaData as activity}
            <StravaCard name={activity.name} avgSpeed={activity.averageSpeed} distance={activity.distance} maxSpeed={activity.maxSpeed} started={activity.startTime} time={activity.time} type={activity.type!} kilojoules={activity.kilojoules} />
        {/each}
    </div>

</div>

<div class="grid grid-cols-2 grid-rows-[repeat(10, 1fr)] items-[flex-start] items-center">
    <iframe title="frii.site badge" class="pointer-events-none h-30" src="https://www.frii.site/badges/modern.html" sandbox=""></iframe>
    <img src="/orangepi.png" alt="Hosted on orange pi 3b badge">
</div>

<style>
    .strava-container {
        scrollbar-color: #FC5200 var(--color-zinc-900);
    }
</style>
