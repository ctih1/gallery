<script lang="ts">
    import { browser } from "$app/environment";
    import Badge from "$lib/components/Badge.svelte";
    import Climate from "$lib/components/Climate.svelte";
    import ContactMethod from "$lib/components/ContactMethod.svelte";
    import WeatherBox from "$lib/components/Weatherbox/WeatherBox.svelte";
    import { onDestroy, onMount } from "svelte";
    import type { OccupationColumn } from "./api/occupation/types";
    import type { ProcessedActivity } from "./api/strava/types";

    let catImage: HTMLVideoElement | undefined = $state();

    let scrollY = $state(0);
    let mediaDevices: string[] = $state([]);
    let localClimateData: any | undefined = $state();
    let weatherData: {} | undefined = $state();

    let takeoverData: OccupationColumn[] = $state([]);
    let takeoverInterval: ReturnType<typeof setInterval>;

    let disabledTakeoverIndexes: boolean[] = $state(Array(9).fill(false));
    let takeoverDisabled: boolean = $state(false);
    let takeoverAvailableIn: Date = $state(new Date());

    let nextTakeoverRefresh: Date = $state(new Date());
    nextTakeoverRefresh.setTime(nextTakeoverRefresh.getTime() + 5000);

    let stravaData: ProcessedActivity[] = $state([]);

    let tickInterval: ReturnType<typeof setInterval>;
    let tick = $state(0);

    $effect(() => {
        if (!catImage) return;

        const catRect = catImage.getBoundingClientRect();
        let Scroll = (scrollY - catRect.y) / catRect.height;

        let cappedScroll = Math.min(Math.max(0, Scroll), 1);
    });

    onMount(async () => {
        if (!browser) return;

        try {
            for (let device of await navigator.mediaDevices.enumerateDevices()) {
                mediaDevices.push(device.kind);
            }
        } catch (e) {
            console.log("Failed to get media devices");
        }

        fetch("/api/local/climate")
            .then(req => req.json())
            .then(jason => {
                localClimateData = jason;
            });

        fetch("/api/weather")
            .then(req => req.json())
            .then(jason => {
                weatherData = jason;
            });

        takeoverInterval = setInterval(async () => {
            await updateTakeover();
        }, 5000);

        updateTakeover();
        tickInterval = setInterval(() => (tick += 1), 100);
    });

    onDestroy(() => {
        clearInterval(tickInterval);
        clearInterval(takeoverInterval);
    });

    async function updateTakeover() {
        await fetch("/api/occupation")
            .then(req => req.json())
            .then(jason => {
                takeoverData = jason;

                nextTakeoverRefresh.setTime(new Date().getTime() + 5000);
                nextTakeoverRefresh = nextTakeoverRefresh;
            });
    }

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

    function getGpuName() {
        if (!browser) return "Checking...";

        const gl = document.createElement("canvas").getContext("webgl");
        if (!gl) {
            return "No GPU information";
        }

        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (!debugInfo) {
            return "No debug info!";
        }
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    function getCpuInfo() {
        if (!browser) return "Checking...";

        // @ts-expect-error navigator.deviceMemory not defined for some reason in intellisense?
        return `${navigator.hardwareConcurrency} Threads and ${navigator.deviceMemory ?? "Unknown"} GB RAM ${navigator.brave ? "(Inaccurate on Brave)" : ""}`;
    }

    function getSpeechSynthesis(): string[] {
        if (!browser) return ["Checking..."];

        try {
            let ss = window.speechSynthesis;

            var resp: string[] = [];
            for (let voice of ss.getVoices()) {
                resp.push(voice.name);
            }
        } catch (e) {
            var resp = ["No voices"];
        }

        return resp;
    }

    function generateWakatimeArgs(): string {
        const nowMs = new Date().getTime();

        const endDate = new Date(nowMs - 1 * 24 * 60 * 60 * 1000);
        const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);

        return `start=${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}&end=${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
    }

    function getLanguages() {
        if (!browser) return "Checking...";

        return window.navigator.languages.join(",");
    }

    function getDateStuff() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
</script>

<svelte:window bind:scrollY />

<div class="[&>div]:p-4 [&>div]:md:p-8 [&>div]:lg:p-16 [&div>]:xl:p-32">
    <div id="introduction" class="bg flex h-[90vh] w-screen items-center">
        <div
            class="mr-4 w-full max-w-lg squircle-md bg-black/30 p-6 outline-1 outline-white/20 backdrop-blur-md md:mb-24 lg:mb-38"
        >
            <h2 class="text-6xl!">Hello!</h2>
            <h1 class="mb-1! text-2xl! font-medium opacity-80">
                I'm ctih1, a full-stack dev from Finland
            </h1>

            <p class="opacity-40">(who occasionally makes some cool things)</p>

            <div class="mt-4 flex">
                <ContactMethod
                    link="https://github.com/ctih1/"
                    imageUrl="./logos/GitHub_Invertocat_White.svg"
                />
            </div>
        </div>
    </div>

    <div class="bg mt-8" id="fun">
        <h1>Fun stuff</h1>
        <p class="max-w-[65ch]">
            This section of the web page is dedicated to showcasing some fun stuff.<br />Unlike this
            paragraph, some of them might be pretty interesting!
        </p>

        <div class="mt-16 rounded-2xl bg-gray-800/30 p-4" id="fingerprinting">
            <h2>Take over game</h2>
            <p>Click on a square to steal it!</p>

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
                                    <p
                                        class="h-12 overflow-hidden text-left text-ellipsis opacity-55"
                                    >
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
            {#key tick}
                <p>
                    Next refresh: <span class="font-[JetBrains-Mono]!">
                        {(
                            Math.round(
                                (nextTakeoverRefresh.getTime() - new Date().getTime()) / 100
                            ) / 10
                        ).toFixed(1)}s</span
                    >
                </p>
                {#if takeoverDisabled}
                    <p>
                        Next turn: <span class="font-[JetBrains-Mono]!">
                            {(
                                Math.round(
                                    (takeoverAvailableIn.getTime() - new Date().getTime()) / 100
                                ) / 10
                            ).toFixed(1)}s</span
                        >
                    </p>
                {/if}
            {/key}
        </div>

        <!-- <div class="mt-16 rounded-2xl bg-gray-800/30 p-4" id="strava">
            <h2>Strava activities</h2>

            <div
                class="strava-container flex h-60 max-w-6xl flex-row-reverse space-x-2 overflow-x-scroll"
            >
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
                    ></StravaCard>
                {/each}
            </div>
        </div> -->

        <div class="mt-16 rounded-2xl bg-gray-800/30 p-4" id="fingerprinting">
            <h2>Fingerprinting</h2>
            <p class="max-w-[65ch]">
                By default, most browser give out a lot of information, which can be used to
                fingerprint you. For example, here are a few things I noted from your browser:
            </p>

            <ul class="mt-4 list-disc">
                <li>
                    GPU: <code>{getGpuName()}</code>
                </li>
                <li>
                    CPU: <code>{getCpuInfo()}</code>
                </li>
                <li>Languages: <code>{getLanguages()}</code></li>
                <li>
                    Speech Synthesis: <br />{#each getSpeechSynthesis() as voice}
                        <code>{voice}</code><br />
                    {/each}
                </li>
                <li>Time zone: <code>{getDateStuff()}</code></li>
                <li>Media devices: <code>{mediaDevices}</code></li>
            </ul>
        </div>

        <div
            class="mt-16 rounded-2xl bg-linear-to-b from-gray-800/30 from-70% to-transparent p-4"
            id="weather"
        >
            <h2>Local climate</h2>
            <p>
                I have a small array of sensors located both outdoors and indoors, and I can use
                them to monitor trends.
            </p>

            <div class="mt-4">
                <h3 class="font-semibold">Indoors</h3>
                <p>Data from a BME680, and an SCD40</p>
                {#if localClimateData}
                    <Climate data={localClimateData} cpuTemp={50}></Climate>
                {:else}
                    <div
                        class="flex h-40 w-65 items-center justify-center rounded-2xl bg-gray-800 text-center"
                    >
                        <p class="text-center">Loading...</p>
                    </div>
                {/if}
            </div>
            <div class="mt-4">
                <h3 class="font-semibold">Outdoors</h3>
                <p>Data from an SHT30 and SPS30</p>
                {#if weatherData && localClimateData}
                    <div class="flex flex-col space-y-4 space-x-4 md:flex-row">
                        <div class="flex-row">
                            <WeatherBox {weatherData}></WeatherBox>
                        </div>
                        <code
                            class="h-fit max-h-[300px] w-96 max-w-2xl rounded-2xl bg-zinc-900/60 p-2 md:w-full"
                        >
                            <p>website@ctih1.fi:~$ ./stuff.sh</p>
                            <p>air_temp={localClimateData["temp"]} *C</p>
                            <p>air_humidity={localClimateData["humidity"]} %</p>
                            <p>
                                air_pressure={Math.round(
                                    localClimateData["climate_pressure"] *
                                        Math.pow(1 - 119 / 44330, -5.225) *
                                        10
                                ) / 10} hPa
                            </p>
                            <p>pm_2_5={localClimateData["mc2p5"]} µg/m³</p>
                            <p>pm_10_0={localClimateData["mc10p0"]} µg/m³</p>
                            {#key tick}
                                <p>
                                    local_time={new Date().toLocaleString("sv", {
                                        timeZone: "Europe/Helsinki"
                                    })}
                                </p>
                            {/key}
                            <p></p>
                        </code>
                    </div>
                {:else}
                    <div
                        class="flex h-[300px] w-[300px] items-center justify-center rounded-2xl bg-gray-800 text-center"
                    >
                        <p class="text-center">Loading...</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="bg mt-16" id="projects">
        <h1>My programming projects</h1>

        <div class="flex flex-col md:flex-row md:justify-between md:p-16">
            <div class="space-y-24 pr-16 md:w-1/2 md:space-y-52" id="left">
                <div>
                    <h2>frii.site</h2>
                    <p>
                        A free subdomain registrar, which I developed for over 2 years. The service
                        has amassed <span class="font-semibold text-[rgb(50,180,255)]!"
                            >over 5000 users</span
                        > from over a hundred different countries. I had to shut down the service due
                        to monetary issues.
                    </p>

                    <div class="mt-4 flex space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/frii.site-frontend"
                        />
                        <ContactMethod imageUrl="./logos/open.svg" link="https://www.frii.site" />
                    </div>
                </div>

                <div>
                    <h2>goober</h2>
                    <p>
                        A fork of an existing Discord bot. Rewrote a large part of the codebase, and
                        improved the developer experience. Also wrote many cogs for it, such as a
                        YouTube song translator, OCR translator (Google Lens alternative), and many
                        more.
                    </p>

                    <div class="mt-4 flex space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/goober"
                        />
                    </div>
                </div>
                <div>
                    <h2>fitness-tracker</h2>
                    <p>
                        Does exactly what's said on the tin. Let's you create custom exercises, log
                        progress, and view your progress. Made with Tauri and Svelte
                    </p>

                    <div class="mt-4 flex space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/fitness-tracker"
                        />
                    </div>
                </div>
            </div>

            <div id="timeline" class="hidden h-[900px] w-[3px] md:block"></div>

            <div
                class="mt-24 space-y-24 md:mt-52 md:w-1/2 md:space-y-52 md:pl-16 md:text-right"
                id="right"
            >
                <div>
                    <h2>kake</h2>
                    <p>
                        A "virus" written to joke around with my friends. The client, installer,
                        updater, and server are all programmed in Rust. I had a lot of fun learning
                        about low-level stuff, working with the Win32 API, and figuring out how go
                        undetected by antiviruses.
                    </p>
                    <div class="ml-auto flex space-x-4 md:justify-end">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/kake"
                        />
                    </div>
                </div>
                <div>
                    <h2>betternotifications</h2>
                    <p>
                        A Vencord plugin which improved the look and customization of notifications
                        on the instant messaging service Discord. I learnt a lot about Typescript,
                        Electron, and reverse-engineering during building this.
                    </p>
                    <div class="mt-4 flex space-x-4 md:float-right">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/Vendicated/Vencord/pull/3430"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center">
            <h2>And many more!</h2>
            <p>Check out my <a href="https://github.com/ctih1">GitHub account here!</a></p>
        </div>
    </div>

    <div class="bg" id="shoutouts">
        <div class="mt-32 pt-2! text-center">
            <h2>made with love &lt;3</h2>
            <p class="opacity-80">(aka Svelte)</p>
            <a class="opacity-55" href="https://github.com/ctih1/gallery/"
                >Source code for this website</a
            >
        </div>

        <div
            class="badges grid-row-col mt-52 mr-auto mb-4 ml-auto grid w-fit grid-cols-3 gap-1 pb-0! sm:grid-cols-4"
        >
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
        <p class="pt-0! text-center text-sm! opacity-40">
            note: want your badge here? Contact me contact@ctih1.fi
        </p>
    </div>
</div>

<style>
    @keyframes -global-fear-shake {
        0% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(-4deg);
        }
        50% {
            transform: rotate(0deg);
        }
        75% {
            transform: rotate(4deg);
        }
        100% {
            transfrom: rotate(0deg);
        }
    }

    :root {
        --vignette: radial-gradient(
            ellipse 200% 50% at center,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.6) 60%,
            rgba(0, 0, 0, 1) 100%
        );
    }

    #shoutouts {
        background-image: var(--vignette), url("/home/aurora.webp"), url("/home/aurora_tiny.webp");
    }

    #projects {
        background-image:
            var(--vignette), url("/home/IMG_1280.webp"), url("/home/IMG_1280_tiny.webp");
    }

    #fun {
        background-image:
            var(--vignette), url("/home/IMG_2420.webp"), url("/home/IMG_2420_tiny.webp");
    }

    #introduction {
        background-image:
            var(--vignette), url("/home/IMG_7565.webp"), url("/home/IMG_7565_tiny.webp");
    }

    .bg {
        background-size: cover;
        background-position: center;
    }

    .game-button:hover:enabled {
        animation: 0.2s infinite fear-shake;
        cursor: pointer;
    }

    :global(.home-dark) {
        background-color: black;
    }

    .strava-container {
        scrollbar-color: rgba(255, 255, 255, 0.295) rgba(65, 71, 80, 0.6);
    }
    #timeline {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='9' stroke-dasharray='20%2c30' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    }
</style>
