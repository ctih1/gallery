<script lang="ts">
    import { browser } from "$app/environment";
    import Climate from "$lib/components/Climate.svelte";
    import ContactMethod from "$lib/components/ContactMethod.svelte";
    import WeatherBox from "$lib/components/Weatherbox/WeatherBox.svelte";
    import { onDestroy, onMount } from "svelte";

    let catImage: HTMLVideoElement | undefined = $state();

    let scrollY = $state(0);
    let mediaDevices: string[] = $state([]);
    let localClimateData: any | undefined = $state();
    let weatherData: {} | undefined = $state();

    let tickInterval: ReturnType<typeof setInterval>;
    let tick = $state(0);

    $effect(() => {
        if (!catImage) return;

        const catRect = catImage.getBoundingClientRect();
        let relativeScroll = (scrollY - catRect.y) / catRect.height;

        let cappedScroll = Math.min(Math.max(0, relativeScroll), 1);
    });

    onMount(async () => {
        for (let device of await navigator.mediaDevices.enumerateDevices()) {
            mediaDevices.push(device.kind);
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

        tickInterval = setInterval(() => (tick += 1), 1000);
    });

    onDestroy(() => {
        // @ts-ignore
        clearInterval(tickInterval);
    });

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

    function getSpeechSynthesis() {
        if (!browser) return "Checking...";

        try {
            let ss = window.speechSynthesis;

            var resp = "";
            for (let voice of ss.getVoices()) {
                resp += voice.name + ",";
            }
        } catch (e) {
            var resp = "No voices";
        }

        return resp;
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

<div id="introduction-bg">
    <div class="absolute top-0 left-0 h-[90vh] w-screen overflow-hidden">
        <img
            src="./IMG_7565.jpeg"
            alt="Nice lake"
            class="absolute top-0 left-0 -z-20 min-h-[90vh] object-cover object-center will-change-transform transform-3d"
        />
    </div>
    <div class="dark-overlay absolute top-0 left-0 -z-10 h-[90vh] w-screen"></div>
</div>

<div class="[&>div]:p-4 [&>div]:md:p-8 [&>div]:lg:p-16 [&div>]:xl:p-32">
    <div id="introduction" class="flex h-[80vh] w-screen items-center">
        <div
            class="max-w-3/5 squircle-md bg-black/30 p-6 outline-1 outline-white/20 backdrop-blur-md md:mb-24 lg:mb-38"
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

    <div id="fun">
        <h1>Fun stuff</h1>
        <p class="max-w-[65ch]">
            This section of the web page is dedicated to showcasing some fun stuff.<br />Unlike this
            paragraph, some of them might be pretty interesting!
        </p>

        <div class="mt-16" id="fingerprinting">
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
                <li>Speech Synthesis: <code>{getSpeechSynthesis()}</code></li>
                <li>Time zone: <code>{getDateStuff()}</code></li>
                <li>Media devices: <code>{mediaDevices}</code></li>
            </ul>
        </div>

        <div class="mt-16" id="weather">
            <h2>Local weather</h2>
            <p>
                I have a small array of sensors located both outdoors and indoors, and I can use
                them to monitor trends.
            </p>

            <div class="mt-4">
                <h3 class="font-semibold">Indoors</h3>
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
                {#if weatherData && localClimateData}
                    <div class="flex flex-col space-y-4 space-x-4 md:flex-row">
                        <div class="flex-row">
                            <WeatherBox {weatherData}></WeatherBox>
                        </div>
                        <code
                            class="h-fit max-h-[300px] w-96 rounded-2xl bg-gray-900 p-2 md:w-full"
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

    <div class="relative mt-32" id="projects">
        <div id="project-bg">
            <div class="absolute top-20 left-0 min-h-full w-screen overflow-hidden">
                <img
                    src="./IMG_1280.jpg"
                    class="absolute top-0 left-0 -z-20 h-[900px] object-cover object-top"
                    alt="Forest"
                />
            </div>
            <div class="dark-overlay absolute top-20 left-0 -z-10 h-[900px] w-screen"></div>
        </div>

        <h1>My programming projects</h1>

        <div class="flex flex-col p-16 md:flex-row md:justify-between">
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
    </div>

    <hr class="mt-20 opacity-10" />
</div>

<style>
    .dark-overlay {
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.6) 19%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.6) 70%,
            rgba(0, 0, 0, 1) 100%
        );
    }

    #timeline {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='9' stroke-dasharray='20%2c30' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    }

    :global(body) {
        height: 100%;
        background-color: black;
    }
</style>
