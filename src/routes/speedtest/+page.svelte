<script lang="ts">
    import PageConfig from "$lib/components/PageConfig.svelte";

    let progress = $state(0);
    let speed = $state(0);
    let progressElement: HTMLDivElement | undefined = $state();
    let lastEvent = new Date();
    let lastAmount = 0;
    let speeds: number[] = $state([]);
    let ongoing = $state(false);

    function beginTest() {
        if (ongoing) {
            return;
        }

        ongoing = true;
        speed = 0;
        speeds = [];

        const xhr = new XMLHttpRequest();
        xhr.addEventListener("progress", e => {
            progress = e.loaded / e.total;
            const now = new Date();
            speed =
                ((e.loaded - lastAmount) /
                    (now.getTime() / 1000 - lastEvent.getTime() / 1000) /
                    1000000) *
                8;
            speeds.push(speed);
            requestAnimationFrame(() => {
                if (!progressElement) {
                    return;
                }
                progressElement.style.backgroundImage = `conic-gradient(var(--color-sky-600) ${360 * progress}deg, var(--color-zinc-800) ${360 * progress + 1}deg)`;
            });
            lastEvent = now;
            lastAmount = e.loaded;
        });
        xhr.addEventListener("loadend", _ => {
            ongoing = false;
        });
        xhr.open("GET", "/speedtest-100m");
        xhr.send();
    }
</script>

<PageConfig title="Speedtest" />

<h1>speedtest</h1>
<p>
    Test your connection speed to this server! Mostly meant to measure my server's internet speed,
    as it's most likely the bottleneck.
</p>
<p>
    My internet caps out at around ~40mbps upload speed (which this test is measuring). You can also
    try running <code>traceroute</code> to this server
</p>

<p class="mt-4"><b>NOTE</b>: this test will use approximately 100MB of bandwidth each run</p>
<button onclick={_ => beginTest()} class="rounded-xl bg-sky-600 p-2">Begin test</button>

<div class="donut absolute">
    <div
        bind:this={progressElement}
        id="progress"
        class="progress-bar absolute aspect-square w-80 rounded-full"
    >
        <div
            class="progress-bar absolute mt-4 ml-4 flex aspect-square w-72 flex-col items-center justify-center rounded-full bg-zinc-800"
        >
            <h1>{Math.round(speed * 10) / 10} mbps</h1>
            {#if !ongoing && speeds.length > 1}
                <h2>Average: {Math.round(speeds.reduce((a, b) => a + b) / speeds.length)} mbps</h2>
            {/if}
        </div>
    </div>
</div>

<div class="h-80"></div>
