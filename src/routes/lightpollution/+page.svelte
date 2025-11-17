<script lang="ts">
    const LEAST_POLLUTION = 22;
    const MAX_POLLUTION = 16;


    let pollutionValue: number = $state(22);
    let relative = $derived(getPollutionPercentage(pollutionValue));
    let bordle = $derived(getBortle(pollutionValue));

    function getBortle(pollution: number) {
        if(pollution > 21.76) {
            return 1;
        } if(pollution > 21.6) {
            return 2;
        } if(pollution > 21.3) {
            return 3;
        } if(pollution > 20.8) {
            return 4;
        } if(pollution > 20.3) {
            return 4.5;
        } if(pollution > 19.25) {
            return 5;
        } if(pollution > 18.5) {
            return 6;
        } if(pollution > 18) {
            return 7;
        } if(pollution > 17.5) {
            return 8;
        } else {
            return 9;
        }
    }

    function getPollutionPercentage(brightness: number): number {
        const RATIO = Math.pow(10, 0.4 * (LEAST_POLLUTION - brightness));
        const MAX_RATIO = Math.pow(10, 0.4 * (LEAST_POLLUTION - MAX_POLLUTION));

        return Math.log10(RATIO) / Math.log10(MAX_RATIO);
    }
</script>
<h1>Light pollution simulator</h1>
<p>note: this is a very rough approximation of how you may be able to capture the sky using a camera under optimal conditions</p>
<p>Don't know your home's sky brightness? Check <a href="https://www.lightpollutionmap.info/">https://www.lightpollutionmap.info/</a></p>

<div class="flex flex-col mt-8">
    <label for="pollution">Sky brightness: <input bind:value={pollutionValue} class="w-8 bg-zinc-900"> mag/arcsec²</label>
    <input id="pollution" type="range" min=16 max=22 step=0.1 bind:value={pollutionValue}>
</div>
<p>{Math.round(relative*100)}%</p>

<p>bortle class {bordle}</p>
<div class="h-96">
    <img style={`filter: contrast(${Math.max(0.2, 1-(relative*3)**2)}) brightness(${1-relative}) blur(${relative*3  }px)`} class="w-96 aspect-square absolute object-cover" alt="sky at night" src="https://images.pexels.com/photos/13041555/pexels-photo-13041555.jpeg">
    <div style={`opacity: ${relative-0.8}`} class="bg-radial from-[#f5f0a6] to-white w-96 aspect-square absolute mix-blend-screen"></div>
</div>
<a href="https://www.pexels.com/photo/low-angle-shot-of-stars-in-the-night-sky-13041555/">Image: Philipp Deus's "Low Angle Shot of Stars in the Night Sky"</a>