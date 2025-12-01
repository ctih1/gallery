<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<nav
	class="flex h-12 items-center space-x-2 bg-[#00000022] pr-2 pl-2 [&>a]:text-xl [&>a]:font-semibold"
>
	{@render children?.()}
</nav>
