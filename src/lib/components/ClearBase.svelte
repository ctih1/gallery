<script lang="ts">
	import { flashlight } from '$lib/store';

	// this component is meant to be used for making other components. If you want a simple containre, please use Container or ClearContainer
	import { onMount, type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		className,
		styleOverride
	}: { children: Snippet; className: string | undefined; styleOverride?: string } = $props();

	let ball: HTMLDivElement;
	let container: HTMLDivElement;

	onMount(() => {
		container.addEventListener('pointermove', (event) => {
			if (!$flashlight) return;
			requestAnimationFrame(() => {
				const rect: DOMRect = container.getBoundingClientRect();
				const left = event.clientX - rect.left;
				const top = event.clientY - rect.top;

				ball.style.top = top - ball.clientHeight / 2 + 'px';
				ball.style.left = left - ball.clientWidth / 2 + 'px';
			});
		});

		container.addEventListener('mouseleave', (_) => {
			if (!$flashlight) return;
			ball.style.opacity = '0%';
		});

		container.addEventListener('mouseenter', (_) => {
			if (!$flashlight) return;
			ball.style.opacity = '30%';
		});
	});
</script>

<div
	bind:this={container}
	style={styleOverride}
	class={twMerge(
		'overflow-hidden rounded-2xl bg-white/10 outline-1 outline-[#ffffff66] drop-shadow-2xl backdrop-blur-sm backdrop-brightness-150 backdrop-saturate-150',
		className
	)}
>
	{#if $flashlight}
		<div
			class="absolute -top-full -z-10 aspect-square w-40 rounded-[100%] bg-white blur-[120px] transition-opacity"
			bind:this={ball}
		></div>
	{/if}

	{@render children?.()}
</div>
