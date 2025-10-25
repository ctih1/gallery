<script lang="ts">
	import ClearContainer from "./ClearContainer.svelte";

    let {path, metadataPath} = $props();

    let description = $state("");
    let model = $state("");
    let make = $state("");
    let time = $state("");
    let iso = $state(0);
    let expousure = $state(0);
    let focalLength = $state(0);
    let aperature = $state(0);

    let imageLoaded = $state(false);

    let zoomed = $state(false);
    
    const img = new Image();
    img.src = path;
    img.onload = _ =>  {
        imageLoaded = true;
    }
    document.body.style.overflowY = "hidden";

    fetch(metadataPath).then(resposne => resposne.json()).then(data => {
        description = data["description"];
        model = data["model"]
        make = data["make"]
        time = data["time"];
        iso = data["iso"];
        
        const expousureParts = data["expousure"];
        expousure = expousureParts[0] / expousureParts[1];

        const focalLengthParts = data["focal-length"];
        focalLength = focalLengthParts[0] / focalLengthParts[1];

        const aperatureParts = data["aperature"];
        aperature = aperatureParts[0] / aperatureParts[1];
    })
</script>

<svelte:head>
    	<link
            rel="preload"
            as="image"
            href={`${path}.webp`}
            type="image/webp"
            crossorigin="anonymous" 
        />
</svelte:head>

<img class="w-screen max-h-screen top-0 left-0 pointer-events-none scale-150 saturate-75 -z-10 blur-2xl absolute object-cover" alt={description} src={path}>
<div class="container flex ml-auto mr-auto mt-8 w-10/12 min-w-60 max-h-screen">
    <div class="img-container cursor-pointer min-w-32 w-10/12 max-w-4xl">
        {#if imageLoaded}
            <img onclick={_ => zoomed = true} class="rounded-md rounded-r-none w-full" alt={description} src={path}>
        {:else}
            <img onclick={_ => zoomed = true} class="rounded-md w-full" alt={description} src={path+".webp"}>
        {/if}
    </div>
    <ClearContainer className="w-2/5 p-2 rounded-l-none">
        <h2>{make} {model}</h2>
        <hr class="opacity-50">
        <p><i>{description}</i></p>
        <div class="bottom">
        <h3 class="mb-0 mt-auto">@ {time} (Local)</h3>
        <h3 class="mb-0 mt-auto">Aperature: f/{aperature}</h3>
        <h3 class="mb-0 mt-auto">Expousure: {Math.round(expousure*1000)/1000}s</h3>
        <h3 class="mb-0 mt-auto">Focal length: {focalLength}mm</h3>
        <h3 class="mb-0 mt-auto">ISO: {iso}</h3>
        </div>
    </ClearContainer>
</div>


{#if zoomed}
<div class="w-screen h-screen bg-[#000000dd] absolute top-0 left-0">
    <img class="ml-auto mr-auto max-w-screen max-h-screen" alt={description} src={path}>
    <button class="top-10 right-10 absolute text-4xl" onclick={_ => zoomed = false}>x</button>
</div>
{/if}


<style>
    .container {
        overflow-y: hidden;
    }
</style>
