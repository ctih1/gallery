<script lang="ts">
    let { imageUrl, redirect }: { imageUrl: string, redirect: string | URL } = $props();
</script>

<a class="w-[88px] flex" href={redirect as string}>
    <img src={imageUrl} alt="88x31 badge" class="badge w-[88px] h-[31px] overflow-hidden">
</a>

<style>
    .badge {
        image-rendering: pixelated;
    }

    a {
        border-bottom-width: 0px    ;
    }
</style>