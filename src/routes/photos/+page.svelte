<script>
    import ClearContainer from "$lib/components/ClearContainer.svelte";
	import Container from "$lib/components/Container.svelte";
    import images from "$lib/images.json";

    const modules = import.meta.glob('/src/routes/photos/*/+page.svelte');


    document.body.style.overflowY = "unset";
</script>

<h1>Images</h1>

<div class="grid md:grid-cols-3 lg:grid-cols-4 gap-1">
    {#each images as link}
        <a style="border-bottom: 0px; padding-bottom: 0px" href={`photos/${link}`}>
            <img alt={link} class="bg-cover object-cover bg-center rounded-md aspect-square opacity-95 hover:opacity-100 transition-opacity w-96" src={`images/${link}.webp`}>
        </a>
    {/each}
</div>
