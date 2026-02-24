<script lang="ts">
    import { page } from "$app/stores";
    import Accordion from "$lib/components/Accordion.svelte";
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import ZoomableImage from "$lib/components/ZoomableImage.svelte";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    let { data } = $props();

    let filename = $page.params.slug;
    let basePath: string = "/images/" + $page.params.slug;
    let imageType = $derived($page.params.slug?.split(".").pop());

    let imagePath: string = $derived(basePath + `/primary.${imageType}`);
    let thumbnailPath: string = $derived(basePath + "/thumbnail.webp");

    let focalLength = $derived(data.image.focalLength[0] / data.image.focalLength[1]);
    let aperature = $derived(data.image.aperature[0] / data.image.aperature[1]);
    let exposureText = $derived(
        data.image.exposure[0] === 1
            ? `1/${data.image.exposure[1]}s`
            : `${data.image.exposure[0] / data.image.exposure[1]}"`
    );

    let imageLoaded = $state(false);

    onMount(() => {
        const img = new Image();
        img.src = imagePath!;
        img.onload = _ => {
            imageLoaded = true;
        };
    });

    // https://stackoverflow.com/a/43084928
    function parseDate(exifDate: string): Date {
        let b = exifDate.split(/\D/);
        // @ts-ignore
        return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
    }
</script>

<svelte:head>
    <link rel="preload" as="image" href={thumbnailPath} type="image/webp" />

    <title>{filename?.toUpperCase()} | ctih1.frii.site</title>
    <meta name="description" content={`${filename} - ${data.image.description}`} />

    <meta property="og:url" content={`https://ctih1.frii.site/photos/${filename}`} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={filename} />
    <meta property="og:description" content={`${data.image.description}`} />
    <meta property="og:image" content={`https://ctih1.frii.site/images/${filename}.webp`} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="ctih1.frii.site" />
    <meta property="twitter:url" content="https://ctih1.frii.site" />
    <meta name="twitter:title" content="ctih1's gallery" />
    <meta name="twitter:description" content={data.image.description} />
    <meta name="twitter:image" content={`https://ctih1.frii.site/images/${filename}.webp`} />
</svelte:head>

<img
    class="pointer-events-none fixed top-0 right-0 bottom-0 left-0 -z-10 min-h-screen w-screen scale-150 object-cover blur-lg saturate-75"
    alt={data.image.description}
    src={thumbnailPath}
/>

<ClearContainer clear={true}>
    {#if !imageLoaded}
        <div class="flex items-center" transition:slide={{ delay: 200 }}>
            <Loader />
            <p>Loading full resolution image...</p>
        </div>
    {/if}
    <div class="img-container w-full max-w-4xl min-w-32 cursor-pointer md:mb-0">
        {#if imageLoaded}
            <ZoomableImage class="w-full rounded-xl" alt={data.image.description} src={imagePath} />
        {:else}
            <ZoomableImage
                class="w-full rounded-xl"
                alt={data.image.description + "(loading)"}
                src={thumbnailPath}
            />
        {/if}
    </div>
    <div>
        <h1 class="mt-2 text-4xl!">{data.image.make} {data.image.model}</h1>
        <hr class="opacity-50" />
        <p><i>{data.image.description}</i></p>
        <div class="bottom opacity-70">
            <h3 class="mt-auto mb-0">
                Captured on: {parseDate(data.image.time).toLocaleString()} <small>(local)</small>
            </h3>
            <h3 class="mt-auto mb-0">Aperature: f/{aperature}</h3>
            <h3 class="mt-auto mb-0">Exposure: {exposureText}</h3>
            <h3 class="mt-auto mb-0">Focal length: {focalLength}mm</h3>
            <h3 class="mt-auto mb-0">ISO: {data.image.iso}</h3>
        </div>
    </div>
    <div class="mt-16 flex flex-col opacity-50">
        <div class="flex items-center space-x-4">
            <Accordion title="CC BY-NC 4.0">
                <p>
                    © ctih1. Licensed under CC BY-NC 4.0. Personal use allowed with credit. No
                    commercial use.
                </p>
                <p>
                    All images share this license unless explicitly stated otherwise in the
                    description.
                </p>
                <p><b>You can:</b></p>
                <ul>
                    <li>Use these images in personal or non-commercial projects (with credit).</li>
                    <li>Modify or edit them as long as attribution is kept.</li>
                </ul>
                <p><b>You can't:</b></p>
                <ul>
                    <li>Use these images for any commercial purposes.</li>
                    <li>Use them without giving proper credit.</li>
                    <li>Claim any of the images as your own.</li>
                    <li>Re-license the images under a different license.</li>
                </ul>
            </Accordion>
            {#if data.image.rawImage}
                {#if data.image.rawImage === "self"}
                    <p>This image has not been edited.</p>
                {:else}
                    <a href={basePath + "/" + data.image.rawImage}>View unedited version</a>
                {/if}
            {/if}
        </div>

        <p>/photos/{$page.params.slug}</p>
    </div>
</ClearContainer>
