<script lang="ts">
    import { page } from "$app/stores";
    import Accordion from "$lib/components/Accordion.svelte";
    import BodyClass from "$lib/components/BodyClass.svelte";
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    let filename = $page.params.slug;
    let path = "/images/" + $page.params.slug;
    let metadataPath = $derived(path + ".json");

    let description = $state("");
    let model = $state("");
    let make = $state("");
    let time = $state("");
    let iso = $state(0);
    let focalLength = $state(0);
    let aperature = $state(0);

    let expousureText = $state("");
    let rawImage: string | undefined = $state();

    let imageLoaded = $state(false);

    let zoomed = $state(false);
    let previousScroll = 0;

    onMount(() => {
        const img = new Image();
        img.src = path!;
        img.onload = _ => {
            imageLoaded = true;
        };

        fetch(metadataPath)
            .then(resposne => resposne.json())
            .then(data => {
                description = data["description"];
                model = data["model"];
                make = data["make"];
                time = data["time"];
                iso = data["iso"];

                rawImage = data["unedited"];

                const expousureParts = data["expousure"];
                if (expousureParts[0] === 1) {
                    expousureText = `1/${expousureParts[1]}s`;
                } else {
                    expousureText = `${expousureParts[0] / expousureParts[1]}"`;
                }

                const focalLengthParts = data["focal-length"];
                focalLength = focalLengthParts[0] / focalLengthParts[1];

                const aperatureParts = data["aperature"];
                aperature = aperatureParts[0] / aperatureParts[1];
            });
    });

    $effect(() => {
        if (zoomed) {
            previousScroll = window.scrollY;
            window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, previousScroll);
        }
    });

    // https://stackoverflow.com/a/43084928
    function parseDate(exifDate: string): Date {
        let b = exifDate.split(/\D/);
        // @ts-ignore
        return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
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
    <meta name="description" content="A gallery for some photos I've taken" />

    <meta property="og:url" content={`https://ctih1.frii.site/photos/${filename}`} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={filename} />
    <meta property="og:description" content={`${description}`} />
    <meta property="og:image" content={`https://ctih1.frii.site/images/${filename}.webp`} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="ctih1.frii.site" />
    <meta property="twitter:url" content="https://ctih1.frii.site" />
    <meta name="twitter:title" content="ctih1's gallery" />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={`https://ctih1.frii.site/images/${filename}.webp`} />
</svelte:head>

<img
    class="pointer-events-none fixed top-0 right-0 bottom-0 left-0 -z-10 min-h-screen w-screen scale-150 object-cover blur-lg saturate-75"
    alt={description}
    src={path + ".webp"}
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
            <img
                onclick={_ => (zoomed = true)}
                class="w-full rounded-xl"
                alt={description}
                src={path}
            />
        {:else}
            <img
                onclick={_ => (zoomed = true)}
                class="w-full rounded-xl"
                alt={description + "(loading)"}
                src={path + ".webp"}
            />
        {/if}
    </div>
    <div>
        <h2>{make} {model}</h2>
        <hr class="opacity-50" />
        <p><i>{description}</i></p>
        <div class="bottom">
            <h3 class="mt-auto mb-0">
                Captured on: {parseDate(time).toLocaleString()} <small>(local)</small>
            </h3>
            <h3 class="mt-auto mb-0">Aperature: f/{aperature}</h3>
            <h3 class="mt-auto mb-0">Expousure: {expousureText}</h3>
            <h3 class="mt-auto mb-0">Focal length: {focalLength}mm</h3>
            <h3 class="mt-auto mb-0">ISO: {iso}</h3>
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
            {#if rawImage}
                <a href={"/images/" + rawImage}>View unedited version</a>
            {/if}
        </div>

        <p>/photos/{$page.params.slug}</p>
    </div>
</ClearContainer>

{#if zoomed}
    <div class="absolute top-0 left-0 flex min-h-screen w-screen items-center bg-[#000000dd]">
        <div class="mr-auto ml-auto">
            <img class="mr-auto ml-auto max-h-screen max-w-screen" alt={description} src={path} />
            <button
                class="absolute top-10 right-10 flex aspect-square w-8 items-center justify-center rounded-full text-4xl outline-1 outline-white hover:cursor-pointer"
                onclick={_ => (zoomed = false)}><span class="pb-1 leading-6">x</span></button
            >
        </div>
    </div>
    <BodyClass className="overflow-y-hidden"></BodyClass>
{/if}
