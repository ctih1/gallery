<script lang="ts">
    let zones = ["#00bee8", "#00f757", "#f7e700", "#f78000", "#f70800"];
    const MAX_AIR_QUALITY_VALUE = 90_000;
    const MIN_AIR_QUALITY_VALUE = 5000;
    let { data, cpuTemp }: { data: any | undefined; cpuTemp: number } = $props();

    function getAirQualityColor() {
        if (!data) return "#4a4e57";
        const part =
            1 -
            (capQuality() - MIN_AIR_QUALITY_VALUE) /
                (MAX_AIR_QUALITY_VALUE - MIN_AIR_QUALITY_VALUE);
        const index = Math.max(0, Math.floor(part * zones.length));
        return zones[index];
    }

    function getCo2Color() {
        const co2 = Number(data.climate_carbon_dioxide);

        if (co2 > 1300) {
            return zones[4];
        }
        if (co2 > 1100) {
            return zones[3];
        }
        if (co2 > 900) {
            return zones[2];
        }
        if (co2 > 700) {
            return zones[1];
        }
        return zones[0];
    }

    function capQuality(): number {
        if (!data) return 0;
        return Math.max(5000, Math.min(90000, Number(data.climate_air_resistance)));
    }

    function capCo2(): number {
        if (!data) return 0;
        return Math.min(1500, Number(data.climate_carbon_dioxide));
    }

    console.log(data);
</script>

<div class="relative h-40 w-64 rounded-2xl bg-white p-2">
    <div class="absolute right-4">
        {#each zones as zone}
            <div
                style={`background-color: ${zone}`}
                class="mt-0.5 mb-0.5 h-6 w-4 border-white"
            ></div>
        {/each}
    </div>
    {#if data}
        <div style={`top: ${((capCo2() - 400) / (1500 - 400)) * 130}px`} class="absolute right-0">
            <span class="font-sans! text-2xl leading-px font-black text-black!">&lt;</span>
        </div>
    {/if}
    {#if data}
        <div class="flex h-full w-56 flex-col justify-between">
            <div class="*:text-black!">
                <h3 class="text-3xl! font-bold">
                    {Number(data["climate_temp_adjusted"]).toFixed(2)}°C
                </h3>
                <p>Relative Humidity: {Number(data["climate_relative_humidity"]).toFixed(2)}%</p>
                <p>
                    Air Resistance: <span style={`color: ${getAirQualityColor()}`}
                        >{Math.round((Number(data?.climate_air_resistance) || 0) / 100) * 100}</span
                    > Ω
                </p>
                <p>
                    Carbon Dioxide: <span style={`color: ${getCo2Color()}`}
                        >{Math.round(Number(data.climate_carbon_dioxide))}</span
                    > PPM
                </p>
            </div>
            <p class="mt-2 text-black!">CPU Temp: {cpuTemp.toFixed(2)}°C</p>
        </div>
    {/if}
</div>
