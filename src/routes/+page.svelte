<script lang="ts">
	import StravaCard from "$lib/components/StravaCard.svelte";
	import { isFlagDay } from "$lib/flagdays";
	import { usingImperial } from "$lib/store";
	import { onMount } from "svelte";
    import type { ProcessedActivity } from "./api/strava/types";
	import BodyClass from "$lib/components/BodyClass.svelte";
    let stravaData: ProcessedActivity[] | undefined = $state()

    onMount(() => {
        fetch("/api/strava").then(data => data.json()).then(json => {
            stravaData = json
        });
    })


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


<style>
    .strava-container {
        scrollbar-color: blue #00000010;
    }

</style>    