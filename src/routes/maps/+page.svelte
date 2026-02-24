<script lang="ts">
    import ZoomableImage from "$lib/components/ZoomableImage.svelte";

    type Focus = "Europe" | "World";
</script>

{#snippet Map(
    url: string,
    title: string | undefined = undefined,
    description: string | undefined = undefined,
    location: Focus = "Europe"
)}
    <div class="w-full">
        <ZoomableImage
            alt={title || location}
            src={url}
            class="max-h-[400px] cursor-pointer rounded-xl"
        />
        <h3 class:opacity-80={!title} class="mb-0 w-full break-after-avoid">
            {title || url.split("/maps/")[1]}
        </h3>
        <p class="whitespace-pre-line">{description}</p>
    </div>
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
