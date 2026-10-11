<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    let fuelPrice: number = $state(2.4);
    let distance: number = $state(25.0);
    let distanceType: string = $state("week");

    let fuelConsumption: number = $state(5.1);

    let pricePerMonth = $derived.by(() => {
        let distMultiplierToMonth = 1.0;

        if (distanceType === "day") {
            distMultiplierToMonth = 30.5;
        } else if (distanceType === "week") {
            distMultiplierToMonth = 4;
        } else if (distanceType === "year") {
            distMultiplierToMonth = 1 / 12;
        }

        let litresPerMonth = (fuelConsumption / 100) * distance * distMultiplierToMonth;
        return litresPerMonth * fuelPrice;
    });
</script>

<h1>Gas usage calculator</h1>

<div class="mt-4 mb-4">
    <div class="mb-4 flex w-full justify-between">
        <Input class="w-half" type="number" bind:value={fuelPrice}><p>Gas price per liter</p></Input
        >
        <Input class="w-half" type="number" bind:value={fuelConsumption}
            ><p>Gas consumption per 100km</p></Input
        >
    </div>
    <Input type="number" bind:value={distance}>
        <p>
            Kilometers driven per
            <select class="code" bind:value={distanceType}>
                <option>year</option>
                <option>month</option>
                <option>week</option>
                <option>day</option>
            </select>
        </p>
    </Input>
</div>

<div>
    <div>
        <p>Per year:</p>
        <h2 class="code mt-16">{(pricePerMonth * 12).toFixed(2)},-</h2>
    </div>

    <div>
        <p>Per month:</p>
        <h2 class="code mt-16">{pricePerMonth.toFixed(2)},-</h2>
    </div>

    <div>
        <p>Per week:</p>
        <h2 class="code mt-16">{(pricePerMonth / 4).toFixed(2)},-</h2>
    </div>
</div>
