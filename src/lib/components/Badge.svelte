<script lang="ts">
    let { imageUrl, redirect }: { imageUrl: string; redirect: string | URL } = $props();
</script>

<a class="badge-container flex w-[88px]" href={redirect as string}>
    <img src={imageUrl} alt="88x31 badge" class="badge h-[31px] w-[88px] overflow-hidden" />
</a>

<style>
    .badge {
        image-rendering: pixelated;
    }

    .badge-container::after {
        content: "";
        position: absolute;
        inset: 0;
        border: 1px solid white;
        pointer-events: none;
        box-sizing: border-box;
    }

    a {
        border-bottom-width: 0px;
    }
</style>
