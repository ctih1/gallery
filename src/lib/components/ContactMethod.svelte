<script lang="ts">
    let { imageUrl, link } = $props();
</script>

<a href={link}>
    <img
        class="w-8 opacity-70 transition-opacity hover:opacity-100"
        src={imageUrl}
        alt="Contact icon"
    />
</a>
