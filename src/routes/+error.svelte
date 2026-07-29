<script lang="ts">
    import { page } from "$app/state";
</script>

<!-- This probably isnt the best way to do this but hey it works -->
<!-- NOTE: this is an iframe since +error.svelte doesnt support a SSR block so if you try to 
 create random things it'll change between the client and server making an ugly flaswh -->

<iframe
    src={`/error?code=${page.status}&message=${page.error?.message}&path=${page.url.pathname}`}
    title="Error"
    class="absolute top-0 left-0 z-10 h-full min-h-screen w-screen"
></iframe>
