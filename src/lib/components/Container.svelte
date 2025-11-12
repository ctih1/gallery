<script lang="ts">
    let { children } = $props();
</script>

<div class="md:w-9/12 lg:w-8/12 w-11/12 bg-zinc-800 ml-auto mr-auto rounded-2xl p-2 mt-4 max-w-2xl">
    {@render children?.()}  
</div>
