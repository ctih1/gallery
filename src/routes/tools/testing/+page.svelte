<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    let testElement: HTMLDivElement | undefined = $state();
    let width = $state(0);
    let height = $state(0);
    let octaves = $state(10);
    let x = $state(25);
    let y = $state(25);
    let color = $state("");
    let color2 = $state("");
    let color2percentage = $state(0);

    function hexToRgb(hex: string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
            : null;
    }

    function createGrain(baseFreq: number): string {
        return `data:image/svg+xml,%3Csvg viewBox='0 0 362 362' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;
    }

    function generateRandomGradient() {
        if (!testElement) return;

        console.log("creating new gradient");
        const grainCss = createGrain(octaves);

        document.body.style.background = `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, rgba(${hexToRgb(color2)}, 0.5) ${color2percentage}%), url("${grainCss}")`;
    }

    $effect(() => {
        octaves;
        x;
        y;
        color;
        color2;
        color2percentage;

        console.log(color2);
        console.log(hexToRgb(color2));

        generateRandomGradient();
    });
</script>

<h1>Gradient gen test</h1>
<button onclick={_ => generateRandomGradient()}>create new</button>

<Input bind:value={octaves} min="0" max="30" label="Octaves" type="range" />

<Input bind:value={x} label="X%" max="200" min="-200" type="range" />
<Input bind:value={y} label="Y%" max="200" min="-200" type="range" />
<Input bind:value={color} label="Colour 1" type="color" />
<Input bind:value={color2} label="Colour 2" type="color" />
<Input bind:value={color2percentage} label="Colour 2s starting %" type="range" />

<div bind:this={testElement} class="aspect-square w-64"></div>
