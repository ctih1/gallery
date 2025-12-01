<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	let { className } = $props();

	onMount(() => {
		if (browser) {
			document.body.classList.add(className);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.body.classList.remove(className);
		}
	});
</script>
