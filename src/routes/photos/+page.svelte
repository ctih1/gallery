<script>
    import PageConfig from "$lib/components/PageConfig.svelte";
    import images from "$lib/images.json";
</script>

<PageConfig title="Photo gallery" />
<h1>Images</h1>
<p>
    Here are some of the photos I've taken. You can enlarge the image by clicking on it, which will
    also show some metadata about the photo.
</p>

<div class="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-5">
    {#each images as link}
        <a style="border-bottom: 0px; padding-bottom: 0px" href={`/photos/${link}`}>
            <img
                alt={link}
                class="aspect-square w-80 rounded-md bg-cover bg-center object-cover opacity-95 transition-opacity hover:opacity-100 lg:w-96"
                src={`/images/${link}/thumbnail.webp`}
            />
        </a>
    {/each}
</div>
