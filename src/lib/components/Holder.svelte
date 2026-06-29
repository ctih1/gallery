<script lang="ts">
    let { children } = $props();
</script>

<div
    class="-z-10 mt-4 mr-auto ml-auto w-11/12 max-w-4xl rounded-2xl bg-black/30 p-4 md:w-9/12 lg:w-8/12"
>
    {@render children()}
</div>
