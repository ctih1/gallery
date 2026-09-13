<script lang="ts">
    import ZoomableImage from "$lib/components/ZoomableImage.svelte";

    const PROJECTS = [
        ["tux.JPG", "Penguin I drew in arts"],
        [
            "tombstone.JPG",
            '3D-printed tombstone for frii.site which I designed, printed by <a href="https://www.oskari.top/">Oskari</a>'
        ],
        ["friisiteuniversity.png", "Inspired from crypto courses"],
        ["red.png", "Bicycle speedo"]
    ];

    let colAmount = 2;
    let requiredRows = Math.ceil(PROJECTS.length / colAmount);
</script>

<h1>Random projects I've done</h1>
<p>Note: click on an image to zoom in</p>
<br />

<div class="w-full space-y-4">
    {#each Array(requiredRows) as _, i (i)}
        {@const scaledI = i * colAmount}
        <div class="flex w-full space-x-4 bg-black">
            {#each PROJECTS.slice(scaledI, scaledI + 2) as project}
                {@const filename = project[0]}
                {@const description = project[1]}
                <div class="min-h-full max-w-2/3">
                    <ZoomableImage
                        class="h-full object-cover"
                        relativeCaption={description}
                        src={`https://cdn.ctih1.fi/public/projects/${filename}`}
                    />
                </div>
            {/each}
        </div>
    {/each}
</div>
