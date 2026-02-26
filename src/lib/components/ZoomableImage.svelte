<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";
    import PageConfig from "./PageConfig.svelte";

    let { ...rest }: HTMLImgAttributes & {} = $props();
    let maximized: boolean = $state(false);
    let previousScroll = 0;

    function toggleZoom() {
        if (!maximized) {
            window.document.body.style.overflowX = "unset";
            previousScroll = window.scrollY;
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
            }
            window.document.body.style.overflowX = "hidden";
        } else {
            window.document.body.style.overflowX = "unset";
            window.scrollTo(0, previousScroll);
            document.body.scrollTop = previousScroll;

            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = previousScroll;
            }
            // fuckass iOS requires overflow-x to not be hidden when scrolling
            window.document.body.style.overflowX = "hidden";
        }
        maximized = !maximized;
    }

    function keypressEvent(event: KeyboardEvent) {
        if (event.key === "Escape") {
            maximized = false;
        }
    }
</script>

<svelte:window onkeyup={keypressEvent} />

<button class={`cursor-zoom-in ${rest.class}`} onclick={_ => toggleZoom()}>
    <img {...rest} />
</button>

{#if maximized}
    <div class="absolute top-0 left-0 z-50 flex min-h-screen w-screen items-center bg-[#000000ee]">
        <div class="mr-auto ml-auto">
            <img
                class="mr-auto ml-auto max-h-screen max-w-screen cursor-default"
                alt={rest.alt}
                src={rest.src}
            />
            <button
                class="absolute top-10 right-10 flex aspect-square w-8 items-center justify-center rounded-full bg-black text-4xl outline-1 outline-white transition-transform hover:scale-110 hover:invert-100"
                onclick={_ => toggleZoom()}
            >
                <span class="pb-1.5 leading-6">x</span>
            </button>
        </div>
    </div>
    <PageConfig className="overflow-y-hidden" />
{/if}
