<script lang="ts">
    import { formatMinutes } from "$lib";

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

<div class="strava m-1 h-52 min-w-80 rounded-md bg-gray-800/50 p-2 transition-colors">
    <h2>{name}</h2>
    <p>Duration: {formatMinutes(Math.round(time / 6) / 10)} mins</p>
    {#if type === "Run"}
        <p>
            Average speed: {Math.round((16.6667 / avgSpeed) * 100) / 100} /km
        </p>
        <p>Max speed: {Math.round((16.6667 / maxSpeed) * 100) / 100} /km</p>
    {:else}
        <p>
            Average speed: {Math.round(avgSpeed * (60 * 60)) / 1000} km/h
        </p>
        <p>
            Max speed: {Math.round(maxSpeed * (60 * 60)) / 1000} km/h
        </p>
    {/if}
    <p>
        Distance: {Math.round(distance / 10) / 100} km
    </p>
    {#if kilojoules}
        <p>Calories burnt: {Math.round(kilojoules / 0.239005) || 0} kcal</p>
    {/if}
    <p>Date: {new Date(started).toLocaleString()}</p>
</div>
