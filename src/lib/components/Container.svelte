<script lang="ts">
    let { children } = $props();
</script>

<div
    class="mt-4 mr-auto ml-auto w-11/12 max-w-2xl rounded-2xl bg-[rgba(12,12,12,0.4)] p-2 md:w-9/12 lg:w-8/12"
>
    {@render children?.()}
</div>
