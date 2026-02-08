<script lang="ts">
    import { browser } from "$app/environment";
    import Badge from "$lib/components/Badge.svelte";
    import ClearBase from "$lib/components/ClearBase.svelte";
    import ConvertableFormat from "$lib/components/ConvertableFormat.svelte";
    import Input from "$lib/components/Input.svelte";
    import PageConfig from "$lib/components/PageConfig.svelte";
    import StravaCard from "$lib/components/StravaCard.svelte";
    import Thermometer from "$lib/components/Thermometer.svelte";
    import { hslToHex } from "$lib/helpers";
    import { usingImperial } from "$lib/store";
    import { onMount } from "svelte";
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

    let weatherCanvas: HTMLCanvasElement | undefined = $state();
    let weatherCtx: CanvasRenderingContext2D | null | undefined = $derived(
        weatherCanvas?.getContext("2d")
    );
    let renderEnvironment = $state({
        snowFallSpeed: 0.5,
        snowAmount: 1500,

        waterAmount: 1.0,
        waterSpeed: 1,

        visibilityMeters: 0,
        cloudCover: 0,

        windSpeed: 0
    });

    let renderObjects: {
        flakes: RainlikeParticle[];
        rain: RainlikeParticle[];
        clouds: Cloud[];
        sun: {
            x: number;
            y: number;
        };
    } = {
        flakes: createParticles(renderEnvironment.snowAmount),
        rain: createParticles(500),
        clouds: [],
        sun: { x: 0, y: 0 }
    };

    let debugMonth = $state(-1);
    let debugHour = $state(-1);
    let debugWeather: boolean = $state(false);

    let renderTick = 0;

    interface RainlikeParticle {
        offset: number;
        position: {
            x: number;
            y: number;
        };
    }

    interface Cloud {
        position: {
            x: number;
            y: number;
        };
        rotation: number;
        scaleX: number;
        scaleY: number;
    }

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

    setInterval(async () => {
        await getOccupations();
        nextOccupationRefresh.setTime(new Date().getTime() + 5000);
        nextOccupationRefresh = nextOccupationRefresh;
    }, 5000);

    onMount(async () => {
        fetch("/api/strava")
            .then(data => data.json())
            .then(json => {
                stravaData = json;
            });

        fetch("/api/weather")
            .then(data => data.json())
            .then(json => {
                weatherData = json;

                if (weatherData) {
                    const d = new Date();
                    const searchString = `${d.getFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${d.getHours()}:00+02:00`;

                    const coverNow = weatherData.cloudCover[searchString] || 0;
                    const rainNow = weatherData.rain[searchString] || 0;
                    const snowNow = weatherData.snowfall[searchString] || 0;

                    console.log("Current weather data: ");
                    console.log(`Rain in 1h: ${rainNow}mm`);
                    console.log(`Cloud cover: ${rainNow}%`);
                    console.log(`Snow in 1h: ${snowNow}cm`);

                    renderEnvironment = {
                        cloudCover: coverNow,
                        snowFallSpeed: weatherData.windNow / 4,
                        waterAmount: rainNow * 100,
                        waterSpeed: 6 + weatherData.windNow * 3,
                        snowAmount: snowNow * 50,
                        visibilityMeters: 59000,
                        windSpeed: weatherData.windNow
                    };

                    renderObjects.clouds = createClouds(5, 8);

                    console.log("Rendering environment");
                    console.log(renderEnvironment);
                }
            });

        await getOccupations();

        setInterval(canvasUpdate, 1000 / 60);
    });

    let checked = $state(false);

    $effect(() => {
        console.log("Setting usingImperial");
        usingImperial.set(checked);
    });

    function createParticles(amount: number): RainlikeParticle[] {
        let particles: RainlikeParticle[] = [];
        for (let i = 0; i < amount; i++) {
            const offset = Math.random() * 300;
            particles.push({
                offset: offset,
                position: {
                    x: Math.random() * 300,
                    y: Math.random() * 500 - 300
                }
            });
        }
        return particles;
    }

    $effect(() => {
        renderEnvironment.snowAmount;
        renderObjects.flakes = createParticles(renderEnvironment.snowAmount);
    });

    $effect(() => {
        renderEnvironment.waterAmount;
        renderObjects.rain = createParticles(renderEnvironment.waterAmount);
    });

    function createClouds(cloudsNum: number, clumpSize: number): Cloud[] {
        let clouds: Cloud[] = [];
        const cloudSpacing = 300 / cloudsNum;

        for (let i = 0; i < cloudsNum; i++) {
            const baseX = i * cloudSpacing;
            const baseY = Math.random() * 50 - 40;

            for (let j = 0; j < clumpSize; j++) {
                clouds.push({
                    position: {
                        x: baseX + Math.random() * 10 - 5,
                        y: baseY + Math.random() * 10 - 10
                    },
                    rotation: Math.random() * 20,
                    scaleX: 50 + Math.random() * 50,
                    scaleY: 20 + Math.random() * 40
                });
            }
        }
        return clouds;
    }

    function dayOfYear(date: Date): number {
        return (
            (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
                Date.UTC(date.getFullYear(), 0, 0)) /
            24 /
            60 /
            60 /
            1000
        );
    }

    function getSunDeclanationDegrees(date: Date): number {
        const day = dayOfYear(date);
        const rads = ((360 / 365.25) * (day - 81) * Math.PI) / 180;
        return 23.445 * Math.sin(rads);
    }

    function degToRad(deg: number) {
        return (deg * Math.PI) / 180;
    }

    function getSunAngle(date: Date) {
        const declanationRad = degToRad(getSunDeclanationDegrees(date));
        const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

        return Math.asin(
            Math.sin(declanationRad) * Math.sin(degToRad(62)) +
                Math.cos(declanationRad) *
                    Math.cos(degToRad(62)) *
                    Math.cos(degToRad(15 * (hour - 12)))
        );
    }

    function getSunPositionY(date: Date): number {
        const y = 350 * Math.tan(getSunAngle(date));
        return y;
    }

    // TODO: Move everything into a separate component (but I know I'll never do that.) 08/02/2026 (dd/mm/yyyy)
    function canvasUpdate() {
        if (!weatherCtx || !weatherCanvas) return;
        const ctx = weatherCtx;

        ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
        const offset = new Date().getTimezoneOffset() * 60000;
        let date = new Date(new Date().getTime() - offset + 2 * 60 * 60 * 1000);

        if (debugMonth !== -1 && debugHour !== -1) {
            date = new Date(
                `2026-${debugMonth.toString().padStart(2, "0")}-21T${debugHour.toString().padStart(2, "0")}:12:00`
            );
        }

        const relativeSunStrength = (getSunAngle(date) + 0.9) / 1.8;
        const sunPos = getSunPositionY(date);
        console.log(relativeSunStrength);
        const skyGradient = ctx.createLinearGradient(
            0,
            3180 * Math.max(0, Math.min(relativeSunStrength + 0.3, 1.1)) - 3000,
            0,
            700
        );

        const lightMultiplier = Math.min(
            1,
            Math.max(0, 1 / (1 + Math.exp(-20 * (relativeSunStrength - 0.5))))
        );

        skyGradient.addColorStop(0, hslToHex(215, 100, 50 * lightMultiplier));
        skyGradient.addColorStop(0.44, hslToHex(198, 100, 85 * lightMultiplier));
        skyGradient.addColorStop(0.57, hslToHex(191, 100 * lightMultiplier, 84 * lightMultiplier));
        skyGradient.addColorStop(0.73, hslToHex(57, 50 * lightMultiplier, 60 * lightMultiplier));
        skyGradient.addColorStop(1.0, hslToHex(30, 100, 50 * lightMultiplier));

        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);

        const sunColor = hslToHex(
            10 * (relativeSunStrength * 2) + 25,
            100 - renderEnvironment.cloudCover / 2,
            60
        );
        ctx.fillStyle = sunColor;
        ctx.beginPath();
        ctx.arc(150, 300 - sunPos, 50, 0, 2 * Math.PI, false);
        ctx.fill();

        const sunGradientSize = (300 - sunPos) / 2;
        const sunGradient = ctx.createRadialGradient(
            150,
            300 - sunPos,
            50,
            150,
            300 - sunPos,
            Math.max(50, sunGradientSize)
        );
        sunGradient.addColorStop(0, sunColor);
        sunGradient.addColorStop(1, "transparent");

        ctx.fillStyle = sunGradient;
        ctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);

        ctx.fillStyle =
            "#848484" +
            Math.max(
                20,
                150 - Math.round(250 * (renderEnvironment.visibilityMeters / 20000))
            ).toString(16);
        ctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);

        for (let flake of renderObjects.flakes) {
            const normalizedOffset = flake.offset / 300;
            const fillColor =
                "#ffffff" + Math.round(Math.min(255, normalizedOffset * 255 + 30) / 2).toString(16);
            ctx.fillStyle = fillColor;
            ctx.beginPath();

            flake.position.x += Math.sin(Math.random() / 10) * Math.random() * normalizedOffset * 8;
            if (flake.position.x > 300) {
                flake.position.x = 0;
            }

            flake.position.y += renderEnvironment.snowFallSpeed + normalizedOffset;

            if (flake.position.y > 300) {
                flake.position.y = -Math.random() * 200;
            }

            ctx.arc(
                flake.position.x,
                flake.position.y,
                0.5 + normalizedOffset * 2,
                0,
                2 * Math.PI,
                false
            );
            ctx.fill();
        }

        for (let droplet of renderObjects.rain) {
            const normalizedOffset = droplet.offset / 300;
            const fillColor =
                "#ffffff" + Math.round(Math.min(100, normalizedOffset * 100 + 30) / 2).toString(16);
            ctx.fillStyle = fillColor;
            ctx.beginPath();

            droplet.position.x += renderEnvironment.windSpeed / 2;
            if (droplet.position.x > 300) {
                droplet.position.x = -normalizedOffset * 4 - Math.random() * 300;
            }

            droplet.position.y += renderEnvironment.waterSpeed + normalizedOffset * 2;

            if (droplet.position.y > 300) {
                droplet.position.y = -Math.random() * 200;
            }

            ctx.ellipse(
                droplet.position.x,
                droplet.position.y,
                1.0,
                2.0 + normalizedOffset * 2 + renderEnvironment.waterSpeed,
                -(renderEnvironment.windSpeed / 100),
                0,
                2 * Math.PI
            );
            ctx.fill();
        }

        ctx.fillStyle =
            "#dddddd" +
            Math.round((renderEnvironment.cloudCover / 100) * 50 * relativeSunStrength)
                .toString(16)
                .padStart(2, "0");

        for (let cloud of renderObjects.clouds) {
            ctx.beginPath();
            ctx.ellipse(
                cloud.position.x,
                cloud.position.y,
                cloud.scaleX,
                cloud.scaleY,
                cloud.rotation,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }

        renderTick++;

        if (renderTick > 300) {
            renderTick = 0;
        }
    }

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

                        <canvas
                            onclick={_ => (debugWeather = !debugWeather)}
                            width="300px"
                            height="300px"
                            bind:this={weatherCanvas}
                        ></canvas>

                        {#if debugWeather}
                            <p>debug controls (hide by pressing the canvas)</p>
                            <Input
                                label="sky 1"
                                bind:value={gradientTestY}
                                type="range"
                                min="-3000"
                                max="1000"
                                step="10"
                            />
                            <Input
                                label="sky 2"
                                bind:value={gradientTestY2}
                                type="range"
                                min="-1000"
                                max="1000"
                                step="10"
                            />
                            <Input
                                label="snow speed"
                                bind:value={renderEnvironment.snowFallSpeed}
                                type="range"
                                min="0.01"
                                max="50"
                                step="0.01"
                            />
                            <Input
                                label="snow amount"
                                bind:value={renderEnvironment.snowAmount}
                                type="range"
                                min="0"
                                max="5000"
                                step="10"
                            />

                            <Input
                                label="water speed"
                                bind:value={renderEnvironment.waterSpeed}
                                type="range"
                                min="0.01"
                                max="50"
                                step="0.01"
                            />
                            <Input
                                label="water amount"
                                bind:value={renderEnvironment.waterAmount}
                                type="range"
                                min="0"
                                max="5000"
                                step="10"
                            />
                            <Input
                                label="wind speed (kmh)"
                                bind:value={renderEnvironment.windSpeed}
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                            />
                            <Input
                                label="hour"
                                bind:value={debugHour}
                                type="range"
                                min="0"
                                max="23"
                                step="1"
                            />
                            <Input
                                label="month"
                                bind:value={debugMonth}
                                type="range"
                                min="1"
                                max="12"
                                step="1"
                            />
                            <Input
                                label="cloud cover (%)"
                                bind:value={renderEnvironment.cloudCover}
                                type="range"
                                min="1"
                                max="100"
                                step="1"
                            />
                            <Input
                                label="visibility (m)"
                                bind:value={renderEnvironment.visibilityMeters}
                                type="range"
                                min="1"
                                max="30000"
                                step="500"
                            />
                        {/if}
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
