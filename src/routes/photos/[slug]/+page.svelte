<script lang="ts">
	import { page } from "$app/stores";
	import Loader from "$lib/components/Loader.svelte";
	import { fade, fly, scale, slide } from "svelte/transition";

    let filename = $page.params.slug;
    let path = "/images/"+$page.params.slug
    let metadataPath = $derived(path+".json");

    let description = $state("");
    let model = $state("");
    let make = $state("");
    let time = $state("");
    let iso = $state(0);
    let focalLength = $state(0);
    let aperature = $state(0);

    let expousureText = $state("");

    let imageLoaded = $state(false);

    let zoomed = $state(false);
    
    const img = new Image();
    img.src = path!;
    img.onload = _ =>  {
        imageLoaded = true;
    }


    fetch(metadataPath).then(resposne => resposne.json()).then(data => {
        description = data["description"];
        model = data["model"]
        make = data["make"]
        time = data["time"];
        iso = data["iso"];
        
        const expousureParts = data["expousure"];
        if(expousureParts[0] === 1) {
            expousureText = `1/${expousureParts[1]}s`;
        } else {
            expousureText = `${expousureParts[0]/expousureParts[1]}"`;
        }

        const focalLengthParts = data["focal-length"];
        focalLength = focalLengthParts[0] / focalLengthParts[1];

        const aperatureParts = data["aperature"];
        aperature = aperatureParts[0] / aperatureParts[1];
    })

    // https://stackoverflow.com/a/43084928
    function parseDate(exifDate: string): Date {
        let b = exifDate.split(/\D/);
        // @ts-ignore
        return new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5]);
    }
</script>

<svelte:head>
    <link
        rel="preload"
        as="image"
        href={`${path}.webp`}
        type="image/webp"
        crossorigin="anonymous" 
    />

    <title>ctih1's gallery</title>
    <meta name="description" content="A gallery for some photos I've taken">

    <meta property="og:url" content={`https://gallery.frii.site/photos/${filename}`}>
    <meta property="og:type" content="website">
    <meta property="og:title" content={filename}>
    <meta property="og:description" content={`${description}\n\nTaken on ${make} ${model}\nTaken at ${parseDate(time).toLocaleString()}`}>
    <meta property="og:image" content={`https://gallery.frii.site/images/${filename}.webp`}>

    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="gallery.frii.site">
    <meta property="twitter:url" content="https://gallery.frii.site">
    <meta name="twitter:title" content="ctih1's gallery">
    <meta name="twitter:description" content={description}>
    <meta name="twitter:image" content={`https://gallery.frii.site/images/${filename}.webp`}>
</svelte:head>

<img class="w-screen h-screen top-0 left-0 bottom-0 right-0 pointer-events-none scale-150 saturate-75 -z-10 blur-2xl fixed object-cover" alt={description} src={path+".webp"}>

{#if !imageLoaded}
    <div class="flex items-center" transition:slide={{delay: 200}}>
        <Loader/>
        <p>Loading full resolution image...</p>
    </div>
{/if}
<div class="img-container cursor-pointer min-w-32 w-full mb-8 md:mb-0 max-w-4xl">
    {#if imageLoaded}
        <img onclick={_ => zoomed = true} class="rounded-md w-full" alt={description} src={path}>
    {:else}
        <img onclick={_ => zoomed = true} class="rounded-md w-full" alt={description + "(loading)"} src={path+".webp"}>
    {/if}
</div>
<div>
    <h2>{make} {model}</h2>
    <hr class="opacity-50">
    <p><i>{description}</i></p>
    <div class="bottom">
        <h3 class="mb-0 mt-auto">Captured on: {parseDate(time).toLocaleString()} <small>(local)</small></h3>
        <h3 class="mb-0 mt-auto">Aperature: f/{aperature}</h3>
        <h3 class="mb-0 mt-auto">Expousure: {expousureText}</h3>
        <h3 class="mb-0 mt-auto">Focal length: {focalLength}mm</h3>
        <h3 class="mb-0 mt-auto">ISO: {iso}</h3>
    </div>  
</div>
<p class="opacity-50 mt-4">/photos/{$page.params.slug}</p>



{#if zoomed}
<div class="w-screen h-screen bg-[#000000dd] absolute top-0 left-0">
    <img class="ml-auto mr-auto max-w-screen max-h-screen" alt={description} src={path}>
    <button class="hover:cursor-pointer w-8 top-10 right-10 absolute text-4xl outline-1 outline-white rounded-full aspect-square items-center justify-center flex"
        onclick={_ => zoomed = false}
    ><span class="leading-6 pb-1">x</span></button>
</div>
{/if}

