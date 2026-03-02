<script lang="ts">
    import { browser } from "$app/environment";
    import Badge from "$lib/components/Badge.svelte";
    import ClearBase from "$lib/components/ClearBase.svelte";
    import ConvertableFormat from "$lib/components/ConvertableFormat.svelte";
    import PageConfig from "$lib/components/PageConfig.svelte";
    import StravaCard from "$lib/components/StravaCard.svelte";
    import Thermometer from "$lib/components/Thermometer.svelte";
    import WeatherBox from "$lib/components/Weatherbox/WeatherBox.svelte";
    import { logg } from "$lib/loggy";
    import { usingImperial } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import type { OccupationColumn } from "./api/occupation/types";
    import type { ProcessedActivity } from "./api/strava/types";
    import type { ServerResponse } from "./api/weather/types";

    let stravaData: ProcessedActivity[] | undefined = $state([]);
    let weatherData: ServerResponse | undefined = $state();
    let occupationData: OccupationColumn[] = $state([]);
    let disabledIndexes: boolean[] = $state(new Array(3 * 3).fill(false));
    let squaresDisabled: boolean = $state(false);
    let squaresAvailableIn: Date = $state(new Date());
    let currentTime: Date = $state(new Date());

    let gradientTestY = $state(0);
    let gradientTestY2 = $state(300);

    let nextOccupationRefresh: Date = $state(new Date());
    nextOccupationRefresh.setTime(nextOccupationRefresh.getTime() + 5000);
    let occupationInterval = undefined;

    logg("verbose", "hello");
    logg("info", "hello");
    logg("warn", "hello");
    logg("error", "hello");

    async function getOccupations() {
        if (!browser) return;
        fetch("/api/occupation")
            .then(data => data.json())
            .then(json => {
                occupationData = json;
            });
    }

    setInterval(() => {
        currentTime = new Date();
    }, 1000);

    occupationInterval = setInterval(async () => {
        await getOccupations();
        nextOccupationRefresh.setTime(new Date().getTime() + 5000);
        nextOccupationRefresh = nextOccupationRefresh;
    }, 5000);

    onMount(async () => {
        logg("fetch", "Fetching Strava data");
        fetch("/api/strava")
            .then(data => data.json())
            .then(json => {
                logg("fetch", "Strava data received");
                stravaData = json;
            });

        logg("fetch", "Fetching weather data");
        fetch("/api/weather")
            .then(data => data.json())
            .then(json => {
                logg("fetch", "Weather data data received");
                weatherData = json;
            });

        await getOccupations();
    });

    let checked = $state(false);

    $effect(() => {
        logg("info", "Setting usingImperial");
        usingImperial.set(checked);
    });

    async function claimSpace(index: number) {
        if (!browser) return;

        disabledIndexes[index] = true;

        const req = await fetch(`/api/occupation?i=${index}`, {
            method: "POST"
        });

        if (req.ok) {
            const json: OccupationColumn = await req.json();
            occupationData = occupationData.filter(obj => obj.id !== json.id);
            occupationData.push(json);
        }
        disabledIndexes[index] = false;
        squaresDisabled = true;
        squaresAvailableIn = new Date();
        squaresAvailableIn.setSeconds(squaresAvailableIn.getSeconds() + 30);

        setTimeout(() => {
            squaresDisabled = false;
        }, 30000);
    }

    // stupid ass wakatime wont let you share your current stats, and since I'm not paying for it, I can only show the past 6 days.
    // if we use a static link (eg. start=2026-02-18&end=2026-02-24) it'll stop working after a day, since "you can't view past stats without buying premium!"
    function generateWakatimeArgs(): string {
        const nowMs = new Date().getTime();

        const endDate = new Date(nowMs - 1 * 24 * 60 * 60 * 1000);
        const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);

        return `start=${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}&end=${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
    }

    onDestroy(() => {
        if (occupationInterval) {
            clearInterval(occupationInterval);
        }
    });
</script>

<h1>yellooo</h1>
<p>
    This is my own very cool little website. It's hosted on <a href="/devices/orangepi3b"
        >my Orange Pi 3B</a
    >. Sorry if the site feels a bit slow, the server is located in Finland, and I have residential
    internet plan, which upload speeds are about 60mbps.
</p>
<p>Feel free to explore this site in peace!</p>
<br />

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

<iframe
    class="mt-8"
    title="frii.site webring"
    width="304px"
    height="204px"
    src="https://webring.frii.site/embed.html?website=https://ctih1.frii.site"
></iframe>

<div class="mt-16">
    <h1>Take over the area</h1>
    <p>Click a square to occupy it</p>
    <div class="grid grid-cols-2 grid-rows-3 gap-1 lg:grid-cols-3">
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
                                    <p>{data?.nation ?? "Unclaimed"}</p>
                                    {#if data}
                                        <p class="opacity-60"><i>{data?.isp}</i></p>
                                        <p class="opacity-40">
                                            Claimed {new Date(data?.occupied).toLocaleDateString()}
                                        </p>
                                    {/if}
                                </div>
                                {#if data}
                                    <img
                                        class="mr-0 ml-auto w-12"
                                        alt={`Flag of ${data?.nation}`}
                                        src={`/flags/${data?.country.toUpperCase()}.webp`}
                                    />
                                {/if}
                            {/if}
                        {/if}
                    </ClearBase>
                </button>
            {/key}
        {/each}
    </div>
    {#key currentTime}
        {#if squaresDisabled}
            <p>
                Cooldown: {Math.round(
                    (squaresAvailableIn.getTime() - currentTime.getTime()) / 1000
                )}s
            </p>
        {/if}

        <p>
            Next refresh: {Math.round(
                (nextOccupationRefresh.getTime() - currentTime.getTime()) / 1000
            )}s
        </p>
    {/key}
</div>

<div class="mt-16">
    <h1>weather</h1>
    <p>The current weather where the server is located</p>
    <ClearBase className="p-2 max-w-xl min-h-40 mb-8 squircle-md">
        {#if weatherData}
            <div class="justify-between sm:flex">
                <div>
                    <h2>Today</h2>
                    <p>
                        <b>Sunrise</b>: {new Date(weatherData.sunrise ?? 0).toLocaleTimeString(
                            "en-US",
                            {
                                timeZone: "Europe/Helsinki"
                            }
                        )}
                    </p>
                    <p>
                        <b>Sunset</b>: {new Date(weatherData.sunset ?? 0).toLocaleTimeString(
                            "en-US",
                            {
                                timeZone: "Europe/Helsinki"
                            }
                        )}
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
                    <div>
                        <h2>weather box</h2>
                        <p>Simulation of what it currently looks like outside</p>

                        <WeatherBox {weatherData} />
                    </div>
                </div>

                <div>
                    <h2>Right now</h2>
                    <Thermometer temperature={weatherData.tempNow} />
                </div>
            </div>
        {/if}
    </ClearBase>
</div>

<div class="badges grid-row-col mr-auto ml-auto grid w-fit grid-cols-3 gap-1 sm:grid-cols-4">
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
    <Badge redirect="https://whatdidyouexpect.eu" imageUrl="/badges/expect.png" />
    <Badge
        redirect={`https://wakatime.com/@ctih1/projects/jbxjzaudtx?${generateWakatimeArgs()}`}
        imageUrl="/badges/wakatime.png"
    />
    <Badge redirect="https://svelte.dev" imageUrl="/badges/svelte.png" />
    <Badge redirect="https://nginx.org/" imageUrl="/badges/nginx.png" />
    <Badge redirect="https://www.visitfinland.com/en/" imageUrl="/badges/finland.png" />
</div>
<p class="text-center opacity-60">
    note: want your badge here? <a href="/contact">contact me!</a>
</p>

<div class="mt-12 mr-auto ml-auto w-fit text-center">
    <h2 class="w-fit text-4xl!">Made with love &lt;3</h2>
    <p class="opacity-60">(aka <a href="https://svelte.dev/">Svelte</a>)</p>
    <a href="https://github.com/ctih1/gallery">Source code for this website</a>
</div>

<PageConfig className="index-body" />

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
