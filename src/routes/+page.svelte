<script lang="ts">
    import Badge from "$lib/components/Badge.svelte";
    import BodyClass from "$lib/components/BodyClass.svelte";
    import ClearBase from "$lib/components/ClearBase.svelte";
    import ConvertableFormat from "$lib/components/ConvertableFormat.svelte";
    import StravaCard from "$lib/components/StravaCard.svelte";
    import { usingImperial } from "$lib/store";
    import { onMount } from "svelte";
    import type { OccupationColumn } from "./api/occupation/types";
    import type { ProcessedActivity } from "./api/strava/types";
    import type { ServerResponse } from "./api/weather/types";

    let stravaData: ProcessedActivity[] | undefined = $state([]);
    let weatherData: ServerResponse | undefined = $state();
    let occupationData: OccupationColumn[] = $state([]);
    let disabledIndexes: number[] = $state([]);
    let squaresDisabled: boolean = $state(false);
    let squaresAvailableIn: Date | undefined = $state(new Date());
    let currentTime: Date = $state(new Date());

    setInterval(() => {
        currentTime = new Date();
    }, 1000);

    onMount(() => {
        fetch("/api/strava")
            .then(data => data.json())
            .then(json => {
                stravaData = json;
            });

        fetch("/api/weather")
            .then(data => data.json())
            .then(json => {
                weatherData = json;
            });

        fetch("/api/occupation")
            .then(data => data.json())
            .then(json => {
                occupationData = json;
            });
    });

    let checked = $state(false);

    async function claimSpace(index: number) {
        disabledIndexes.push(index);
        disabledIndexes = disabledIndexes;

        const req = await fetch(`/api/occupation?i=${index}`, {
            method: "POST",
            headers: {
                "X-Real-IP": "193.208.14.33"
            }
        });

        if (req.ok) {
            const json: OccupationColumn = await req.json();
            occupationData = occupationData.filter(obj => obj.id !== json.id);
            occupationData.push(json);
        }
        disabledIndexes = disabledIndexes.filter(i => i !== index);
        squaresDisabled = true;
        squaresAvailableIn = new Date();
        squaresAvailableIn.setSeconds(squaresAvailableIn.getSeconds() + 30);

        setTimeout(() => {
            squaresDisabled = false;
        }, 30000);
    }

    $effect(() => {
        console.log("Setting usingImperial");
        usingImperial.set(checked);
    });
</script>

<h1>yellooo</h1>
<p>This is a cool lil webpage I made for sharin stuff</p>

<div class="strava-activity">
    <h1>Strava activities</h1>
    <div class="strava-container flex flex-row-reverse overflow-x-scroll">
        {#each stravaData as activity}
            <StravaCard
                name={activity.name}
                avgSpeed={activity.averageSpeed}
                distance={activity.distance}
                maxSpeed={activity.maxSpeed}
                started={activity.startTime}
                time={activity.time}
                type={activity.type as "Run" | "Ride"}
                kilojoules={activity.kilojoules}
            />
        {/each}
    </div>
    <div>
        <label for="imperial-check">Use imperial units</label>
        <input bind:checked id="imperial-check" type="checkbox" />
    </div>
</div>

<div class="mt-16">
    <h1>Take over the area</h1>
    <p>Click a square to occupy it</p>
    <div class="grid grid-cols-3 grid-rows-3 gap-1">
        {#each new Array(3 * 3) as _, index}
            {#key disabledIndexes}
                <button
                    class={`rounded-xl ${squaresDisabled ? "pointer-events-none opacity-50" : ""}`}
                    disabled={squaresDisabled}
                    onclick={_ => claimSpace(index)}
                >
                    <ClearBase
                        className="min-h-16 flex justify-center items-center hover:bg-white/10 p-2"
                    >
                        {#if occupationData}
                            {@const data = occupationData.find(obj => obj.id === index)}
                            {#if disabledIndexes[index]}
                                <p>Loading...</p>
                            {:else}
                                <div class="ml-2 text-left">
                                    <p>{data?.nation}</p>
                                    <p class="opacity-60"><i>{data?.isp}</i></p>
                                    <p class="opacity-40">
                                        Claimed {new Date(data?.occupied).toLocaleDateString()}
                                    </p>
                                </div>
                                <img
                                    class="mr-0 ml-auto w-12"
                                    alt={`Flag of ${data?.nation}`}
                                    src={`/flags/${data?.country.toUpperCase()}.webp`}
                                />
                            {/if}
                        {/if}
                    </ClearBase>
                </button>
            {/key}
        {/each}

        {#key currentTime}
            {#if squaresDisabled}
                <p>Cooldown: {squaresAvailableIn.getSeconds() - currentTime.getSeconds()}s</p>
            {/if}
        {/key}
    </div>
</div>

<div class="mt-16">
    <h1>weather</h1>
    <ClearBase className="p-2 max-w-80 min-h-40 mb-8 squircle-md">
        {#if weatherData}
            <p>
                <b>Sunrise</b>: {new Date(weatherData.sunrise ?? 0).toLocaleTimeString("en-US", {
                    timeZone: "Europe/Helsinki"
                })}
            </p>
            <p>
                <b>Sunset</b>: {new Date(weatherData.sunset ?? 0).toLocaleTimeString("en-US", {
                    timeZone: "Europe/Helsinki"
                })}
            </p>
            <p>
                <b>Coldest</b>: <ConvertableFormat
                    imperialUnit="°F"
                    metricUnit="°C"
                    type="c"
                    metricValue={Math.min(
                        ...Object.entries(weatherData.temperature)
                            .values()
                            .map(e => e[1])
                    )}
                />
            </p>
            <p>
                <b>Warmest</b>: <ConvertableFormat
                    imperialUnit="°F"
                    metricUnit="°C"
                    type="c"
                    metricValue={Math.max(
                        ...Object.entries(weatherData.temperature)
                            .values()
                            .map(e => e[1])
                    )}
                />
            </p>
            <p>
                <b>Snowfall in 24h</b>: <ConvertableFormat
                    imperialUnit="inches"
                    metricUnit="cm"
                    metricValue={Math.round(
                        Object.entries(weatherData.snowfall)
                            .map(e => e[1])
                            .reduce((partialSum, a) => partialSum + a, 0) * 1000
                    ) / 1000}
                />
            </p>
        {/if}
    </ClearBase>
</div>

<div class="badges mr-auto ml-auto grid w-fit grid-flow-col grid-rows-3 gap-0.5">
    <Badge redirect="/" imageUrl="/badges/ctih1.png" />
    <Badge redirect="http://www.orangepi.org/" imageUrl="/badges/orangepi.png" />
    <Badge redirect="" imageUrl="/badges/human.png" />
    <Badge
        redirect="https://en.wikipedia.org/wiki/Port_forwarding"
        imageUrl="/badges/port-forwarded.png"
    />
    <Badge
        redirect="https://en.wikipedia.org/wiki/Self-hosting_(network)"
        imageUrl="/badges/self-host.png"
    />
    <Badge redirect="https://www.frii.site" imageUrl="/badges/friisite.png" />
    <Badge redirect="https://www.powerpcfan.xyz" imageUrl="/badges/powerpcfan.png" />
    <Badge redirect="https://oskari2.arr.ovh" imageUrl="/badges/oskariwashere.png" />
</div>

<BodyClass className="index-body"></BodyClass>

<style>
    .strava-container {
        scrollbar-color: white #00000010;
    }

    :global(.index-body) {
        background: url("/images/img_6973.jpg/thumbnail.webp");
        background-repeat: no-repeat;
        background-size: cover;
        backdrop-filter: blur(8px) saturate(150%);
    }
</style>
