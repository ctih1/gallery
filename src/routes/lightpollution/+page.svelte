<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    const LEAST_POLLUTION = 22;
    const MAX_POLLUTION = 16;

    let pollutionValue: number = $state(22);
    let relative = $derived(getPollutionPercentage(pollutionValue));
    let bordle = $derived(getBortle(pollutionValue));

    function getBortle(pollution: number) {
        if (pollution > 21.76) {
            return 1;
        }
        if (pollution > 21.6) {
            return 2;
        }
        if (pollution > 21.3) {
            return 3;
        }
        if (pollution > 20.8) {
            return 4;
        }
        if (pollution > 20.3) {
            return 4.5;
        }
        if (pollution > 19.25) {
            return 5;
        }
        if (pollution > 18.5) {
            return 6;
        }
        if (pollution > 18) {
            return 7;
        }
        if (pollution > 17.5) {
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
<p>
    note: this is a very rough approximation of how you may be able to capture the sky using a
    camera under optimal conditions
</p>
<p>
    Don't know your home's sky brightness? Check <a href="https://www.lightpollutionmap.info/"
        >https://www.lightpollutionmap.info/</a
    >
</p>

<div class="mt-8 flex flex-col">
    <Input id="pollution" type="range" min="16" max="22" step="0.1" bind:value={pollutionValue}>
        Sky brightness: <input bind:value={pollutionValue} class="w-8 bg-zinc-900/10" /> mag/arcsec²
    </Input>
</div>
<p>Pollution percentage: {Math.round(relative * 100)}%</p>

<p>Bortle class {bordle}</p>
<div class="h-96">
    <img
        style={`filter: blur(${relative}px) contrast(${1 - relative}) saturate(${1 - relative * 0.5})`}
        class="absolute aspect-square w-96 object-cover"
        alt="sky at night"
        src="https://images.pexels.com/photos/13041555/pexels-photo-13041555.jpeg"
    />
    <div
        style={`opacity: ${relative > 0.2 ? (relative - 0.2) * 0.9 : 0}`}
        class="absolute aspect-square w-96 bg-radial from-[#ffb066] to-[#9bb0c4] mix-blend-screen"
    ></div>
</div>
<a href="https://www.pexels.com/photo/low-angle-shot-of-stars-in-the-night-sky-13041555/"
    >Image: Philipp Deus's "Low Angle Shot of Stars in the Night Sky"</a
>
