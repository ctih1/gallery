<script lang="ts">
    import Holder from "$lib/components/Holder.svelte";
    import PageConfig from "$lib/components/PageConfig.svelte";

    const artworks = ["fsuniversity.jpg"];
</script>

<PageConfig title="Photoshop creation gallery" />

<Holder>
    <h1>Photoshop image gallery</h1>
    <p>Some creations I've made with Photoshop</p>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each artworks as artwork}
        <img alt="" src={`https://cdn.ctih1.fi/photoshop/${artwork}`} /> 
        {/each}
    </div>
</Holder>
