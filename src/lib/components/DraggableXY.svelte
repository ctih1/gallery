<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    interface Position {
        x: number;
        y: number;
    }
    let {
        parentElement,
        position = $bindable(),
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        parentElement: HTMLDivElement;
        position: Position;
    } = $props();

    let br = $derived(parentElement.getBoundingClientRect());

    addEventListener("resize", _ => {
        br = parentElement.getBoundingClientRect();
    });
</script>

<div
    style={`left: ${Math.min(Math.max(0, position.x), 384 - 56)}px; top: ${Math.min(Math.max(0, position.y), 384 - 56)}px`}
    onmousemove={e => {
        if (e.buttons === 1) {
            position = { x: e.clientX - br.x - 28, y: e.clientY - br.y - 28 };
        }
    }}
    {...rest}
    class={twMerge("absolute h-14 w-14", rest.class?.toString())}
></div>
