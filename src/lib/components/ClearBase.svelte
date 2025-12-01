<script lang="ts">
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
		container.addEventListener('mousemove', (event) => {
			requestAnimationFrame(() => {
				const rect: DOMRect = container.getBoundingClientRect();
				const left = event.clientX - rect.left;
				const top = event.clientY - rect.top;

				ball.style.top = top - ball.clientHeight / 2 + 'px';
				ball.style.left = left - ball.clientWidth / 2 + 'px';
			});
		});

		container.addEventListener('mouseleave', (_) => {
			ball.style.opacity = '0%';
		});

		container.addEventListener('mouseenter', (_) => {
			ball.style.opacity = '30%';
		});
	});
</script>

<div
	bind:this={container}
	style={styleOverride}
	class={twMerge(
		'overflow-hidden rounded-xl bg-white/10 outline-1 outline-[#ffffff66] drop-shadow-2xl backdrop-blur-sm backdrop-brightness-75 backdrop-saturate-150',
		className
	)}
>
	<div
		class="absolute -top-full -z-10 aspect-square w-40 rounded-[100%] bg-white blur-[120px] transition-opacity"
		bind:this={ball}
	></div>
	{@render children?.()}
</div>
