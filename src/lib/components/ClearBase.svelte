<script lang="ts">
    // this component is meant to be used for making other components. If you want a simple containre, please use Container or ClearContainer
    import { twMerge } from "tailwind-merge";
	import { onMount, type Snippet } from "svelte";

    let { children, className, styleOverride }: {children: Snippet, className: string | undefined, styleOverride?: string } = $props();

    let ball: HTMLDivElement;
    let container: HTMLDivElement;

    onMount(() => {
        container.addEventListener("mousemove", event => {
            const rect: DOMRect = container.getBoundingClientRect();
            const left = event.clientX - rect.left;
            const top = event.clientY - rect.top;


            ball.style.top = top - ball.clientHeight/2 + "px";
            ball.style.left = left - ball.clientWidth/2 + "px";
        });

        container.addEventListener("mouseleave", _ => {
            ball.style.opacity = "0%";
        });

        container.addEventListener("mouseenter", _ => {
            ball.style.opacity = "30%";
        });
    });
</script>


<div bind:this={container} style={styleOverride} class={twMerge(
        "outline-1 overflow-hidden bg-white/10 outline-[#ffffff66] drop-shadow-2xl backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-75 rounded-xl",
        className
    )}>

    <div class="w-40 aspect-square transition-opacity absolute rounded-[100%] blur-[120px] bg-blend-lighten -z-10 -top-full bg-white" bind:this={ball}></div>
    {@render children?.()}
</div>
