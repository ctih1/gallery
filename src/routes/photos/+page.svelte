<script>
    import PageConfig from "$lib/components/PageConfig.svelte";
    import images from "$lib/images.json";
</script>

<svelte:head>
    <meta name="description" content="A collection of some of the photos I've taken" />
</svelte:head>

<PageConfig title="Photo gallery" />
<h1>Images</h1>
<p>
    Here are some of the photos I've taken. You can enlarge the image by clicking on it, which will
    also show some metadata connected the photo.
</p>

<br />
<div class="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-5">
    {#each images as link}
        <a style="border-bottom: 0px; padding-bottom: 0px" href={`/photos/${link}`}>
            <img
                alt={link}
                class="aspect-square w-80 rounded-md bg-cover bg-center object-cover opacity-90 saturate-95 transition-opacity hover:opacity-100 hover:saturate-100 lg:w-96"
                src={`/images/${link}/thumbnail.webp`}
            />
        </a>
    {/each}
</div>

<br />

<div class="opacity-75">
    <p>
        The server is hosted in Finland (and on a residential internet plan), so don't expect
        lightning fast image loading. I've implemented a neat little WEBP preload thing, so it
        should feel smooth-ish?
    </p>
    <br />
    <p>
        Even though I own a "proper" camera, most of the photos have been captured on a phone, as
        it's much more convinient. My actual camera's sensor is also smaller than my current
        phone's. Check out <a href="/sensors">my camera size comparison tool</a>
    </p>
</div>
