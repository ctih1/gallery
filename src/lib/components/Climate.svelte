<script lang="ts">
    import { getRelativeTime } from "$lib/helpers";

    let zones = ["#00bee8", "#00f757", "#f7e700", "#f78000", "#f70800"];
    const MAX_VALUE = 90_000;
    const MIN_VALUE = 5000;
    let { data, cpuTemp }: { data: ClimateData | undefined; cpuTemp: number } = $props();

    function getQualityColour() {
        if (!data) return "#4a4e57";
        const part = 1 - (capQuality() - MIN_VALUE) / (MAX_VALUE - MIN_VALUE);
        const index = Math.max(0, Math.floor(part * zones.length));
        return zones[index];
    }

    function capQuality(): number {
        if (!data) return 0;
        return Math.max(5000, Math.min(90000, data.air_resistance));
    }
</script>

<div class="relative h-[270px] w-64 rounded-2xl bg-white p-2">
    <div class="absolute right-4">
        {#each zones as zone}
            <div
                style={`background-color: ${zone}`}
                class="mt-0.5 mb-0.5 h-12 w-4 border-white"
            ></div>
        {/each}
    </div>
    {#if data}
        <div
            style={`top: ${245 - ((capQuality() - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 245}px`}
            class="absolute right-0"
        >
            <span class="font-sans! text-2xl leading-px font-black text-black!">&lt;</span>
        </div>
    {/if}
    <div class="flex h-full w-56 flex-col justify-between">
        <div class="*:text-black!">
            <h3 class="text-3xl! font-bold">{data?.temperature.toFixed(2)}°C</h3>
            <p class="mb-4">
                Offset: <b class="text-black!">{data?.temperature_offset.toFixed(2)}°C</b>
            </p>
            <p>Relative Humidity: {data?.relative_humidity.toFixed(2)}%</p>
            <p>Air Pressure: {data?.air_pressure.toFixed(2)} hPa</p>
            {#key data}
                <p>
                    Air Resistance: <span style={`color: ${getQualityColour()}`}
                        >{Math.round((data?.air_resistance || 0) / 100) * 100}</span
                    > Ohms
                </p>
            {/key}
        </div>
        <p class="mt-2 text-black!">CPU Temp: {cpuTemp.toFixed(2)}°C</p>
        {#if data}
            {@const date = new Date(data?.last_update * 1000)}
            <p class="mt-auto mb-0 text-black!">
                Last updated: <nobr class="font-medium text-black!"
                    >{getRelativeTime(
                        (new Date().getTime() - date.getTime()) / 1000 / 60 / 60 / 24
                    )} at
                    {date.toLocaleString("en-US", {
                        hour: "numeric",
                        hour12: true,
                        minute: "numeric"
                    })}</nobr
                >
            </p>
        {/if}
    </div>
</div>
