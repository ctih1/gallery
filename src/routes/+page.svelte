<script lang="ts">
	import StravaCard from "$lib/components/StravaCard.svelte";
	import { isFlagDay } from "$lib/flagdays";
	import { usingImperial } from "$lib/store";
	import { onMount } from "svelte";
    import type { ProcessedActivity } from "./api/strava/types";
	import BodyClass from "$lib/components/BodyClass.svelte";
	import Badge from "$lib/components/Badge.svelte";
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

<div class="badges grid grid-flow-col grid-rows-2 gap-0.5 w-fit ml-auto mr-auto">
    <Badge redirect="/" imageUrl="/badges/ctih1.png"/>
    <Badge redirect="http://www.orangepi.org/" imageUrl="/badges/orangepi.png"/>
    <Badge redirect="https://www.telia.fi/" imageUrl="/badges/telia.png"/>
    <Badge redirect="" imageUrl="/badges/human.png"/>
    <Badge redirect="https://en.wikipedia.org/wiki/Port_forwarding" imageUrl="/badges/port-forwarded.png"/>
    <Badge redirect="https://en.wikipedia.org/wiki/Self-hosting_(network)" imageUrl="/badges/self-host.png"/>
    <Badge redirect="https://www.frii.site" imageUrl="/badges/friisite.png"/>
    <Badge redirect="https://www.powerpcfan.xyz" imageUrl="/badges/powerpcfan.png"/>
</div>


<style>
    .strava-container {
        scrollbar-color: blue #00000010;
    }

</style>    