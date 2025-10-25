<script>
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import images from "$lib/images.json";

    const modules = import.meta.glob('/src/routes/photos/*/+page.svelte');


    document.body.style.overflowY = "unset";
</script>

<ClearContainer className="md:w-7/12 w-10/12 ml-auto mr-auto mt-8 p-2">
    <h1>Images</h1>

    <div class="grid grid-cols-3 gap-1">
        {#each images as link}
            <a href={`photos/${link}`}><img class="bg-cover object-cover bg-center rounded-md aspect-square opacity-95 hover:opacity-100 transition-opacity" src={`images/${link}.webp`}></a>
        {/each}
    </div>
</ClearContainer>

<style>
    :global(body) {
        overflow-x: hidden;
        background-image: url("/background.webp");
        width: 100vw;
        min-height: 100vh;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }
</style>