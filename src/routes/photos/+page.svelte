<script>
    import images from "$lib/images.json";
</script>

<h1>Images</h1>

<div class="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-5">
    {#each images as link}
        <a style="border-bottom: 0px; padding-bottom: 0px" href={`photos/${link}`}>
            <img
                alt={link}
                class="aspect-square w-80 rounded-md bg-cover bg-center object-cover opacity-95 transition-opacity hover:opacity-100 lg:w-96"
                src={`images/${link}.webp`}
            />
        </a>
    {/each}
</div>
