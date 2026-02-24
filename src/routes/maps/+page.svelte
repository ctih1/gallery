<script lang="ts">
    import PageConfig from "$lib/components/PageConfig.svelte";

    type Focus = "Europe" | "World";

    let expandedMaps: { [key: string]: boolean } = $state({});
    let previousScroll: number = 0;

    function toggleMap(url: string) {
        let val = expandedMaps[url];

        if (val) {
            window.scrollTo(0, previousScroll);
        } else {
            previousScroll = window.scrollY;
            window.scrollTo(0, 0);
        }

        expandedMaps[url] = !val;
    }
</script>

{#snippet Map(
    url: string,
    title: string | undefined = undefined,
    description: string | undefined = undefined,
    location: Focus = "Europe"
)}
    <div class="w-full">
        <button onclick={_ => toggleMap(url)}>
            <img
                alt={title || location}
                src={url}
                class="max-h-[400px] cursor-pointer rounded-xl"
            />
        </button>
        <h3 class:opacity-80={!title} class="mb-0 w-full break-after-avoid">
            {title || url.split("/maps/")[1]}
        </h3>
        <p class="whitespace-pre-line">{description}</p>
    </div>

    {#if expandedMaps[url]}
        <div class="absolute top-0 left-0 flex min-h-screen w-screen items-center bg-[#000000dd]">
            <div class="mr-auto ml-auto">
                <img
                    class="mr-auto ml-auto max-h-screen max-w-screen"
                    alt={description}
                    src={url}
                />
                <button
                    class="absolute top-10 right-10 flex aspect-square w-8 items-center justify-center rounded-full text-4xl outline-1 outline-white drop-shadow-2xl hover:cursor-pointer"
                    onclick={_ => (expandedMaps[url] = false)}
                    ><span class="pb-1 leading-6">x</span></button
                >
            </div>
        </div>
        <PageConfig className="overflow-y-hidden" />
    {/if}
{/snippet}

<h1>Maps</h1>
<p>These are some of the interesting (and less interesting) maps I've made through out the years</p>
<p>You can click a map to zoom in on it</p>

<div class="grid gap-4 md:grid-cols-2">
    {@render Map(
        "/maps/finland_winterbreak_zones.png",
        "Winter break zones in Finland",
        "The number under the zone is the zone's population. \nZones and their weeks: \nZone 1: 16. - 20.2.\nZone 2: 23. - 27.2\nZone 3: 3. - 8.3."
    )}
    {@render Map(
        "/maps/name_altenration_en_fi.png",
        "How much each country's name differes between English and Finnish",
        "(in characters. for example, Canada -> Kanada is a difference of 1 characters)"
    )}
    {@render Map("/maps/reflectors.png", "Legal mandations for reflectors")}
    {@render Map(
        "/maps/Theoretical_age_to_start_secondary_and_vocational_school.png",
        "Earliest theoreticla age to start secondary school"
    )}
</div>
