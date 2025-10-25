<script>
	import Container from "$lib/components/Container.svelte";

</script>

<Container>
    <h2>&lt;meta&gt;</h2>
    <p>This is just a lil website I made to showcase some cool stuff</p>

    <h2>hrefs</h2>
    <ul class="flex flex-col">
        <a href="https://github.com/ctih1">My GitHub</a>
        <a href="https://www.frii.site">frii.site</a>
    </ul>

</Container>

<style>
    :global(body) {
        overflow-x: hidden;
        background-image: url("background.webp");
        width: 100vw;
        min-height: 100vh;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }
</style>