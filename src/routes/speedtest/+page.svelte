<script lang="ts">
    let progress = $state(0);
    let speed = $state(0);
    let progressElement: HTMLDivElement | undefined = $state();
    let lastEvent = new Date();
    let lastAmount = 0;
    let speeds: number[] = $state([]);
    let ongoing = $state(false);

    function beginTest() {
        ongoing = true;
        speed = 0;
        speeds = [];

        const xhr = new XMLHttpRequest();
        xhr.addEventListener("progress", e => {
            progress = e.loaded / e.total;
            const now = new Date();
            speed = (e.loaded - lastAmount) / ((now.getTime() / 1000) - (lastEvent.getTime() / 1000)) / 1000000;
            speeds.push(speed);
            requestAnimationFrame(() => {
                if(!progressElement) {
                    return; 
                }
                progressElement.style.backgroundImage = `conic-gradient(var(--color-sky-600) ${360*progress}deg, var(--color-zinc-800) ${360*progress+1}deg)`;         
            })
            lastEvent = now;
            lastAmount = e.loaded;
        });
        xhr.addEventListener("loadend", _ => {
            ongoing = false;
        })
        xhr.open("GET", "/speedtest-100m");
        xhr.send();
    }
</script>

<h1>speedtest</h1>
<p>Test your connection speed to this server!</p>
<p>note: this test will use approximately 100MB of bandwidth each run</p>
<button onclick={_ => beginTest()} class="bg-sky-600 p-2 rounded-xl">Begin test</button>

<div class="donut absolute">
    <div bind:this={progressElement} id="progress" class="absolute progress-bar aspect-square w-80 rounded-full">
        <div class="absolute progress-bar aspect-square w-72 ml-4 mt-4 rounded-full bg-zinc-800 items-center flex flex-col justify-center">
            <h1>{Math.round(speed*10)/10}MB/s</h1>
            {#if !ongoing && speeds.length > 1}
                <h2>Average: {Math.round(speeds.reduce((a,b) => a + b) / speeds.length)}MB/s</h2>
            {/if}
        </div>
    </div>
</div>
