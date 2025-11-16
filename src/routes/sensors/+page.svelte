<script lang="ts">
    type Millimeters = number;

    interface Sensor {
        model: string,
        aspectRatio: [number, number],
        diagonal: Millimeters,
    }

    let sensorSize: number = $state(0);
    let sensorRatio: string = $state("");
    let sensorName: string = $state("");

    const COLORS = [
        "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
        "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
        "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000"
    ]
    let sensors: Sensor[] = $state([
        {
            model: "Sony DSC-HX100V",
            aspectRatio: [6.17, 4.55],
            diagonal: 7.67
        },
        {
            model: "iPhone 13",
            aspectRatio: [4, 3],
            diagonal: 8.42
        },
        {
            model: "iPhone 16 Pro",
            aspectRatio: [4, 3],
            diagonal: 12.5
        },

    ])

    let offset = $state(1);

    function addSensor() {
        sensors.push({
            // @ts-ignore
            aspectRatio: sensorRatio.split("/").map(a => Number(a)),
            diagonal: sensorSize,
            model: sensorName
        })
    }

    function removeSensor(name: string) {
        sensors = sensors.filter(sensor => sensor.model !== name);
    }
</script>

<h1>Sensor size comparison</h1>

<div class="sensors h-96 bg-zinc-900">
    {#each sensors.toSorted((a,b) => b.diagonal - a.diagonal) as sensor, index} 
        {@const width = sensor.diagonal * sensor.aspectRatio[0] / Math.sqrt(Math.pow(sensor.aspectRatio[0],2) + Math.pow(sensor.aspectRatio[1], 2))}
        {@const height =  sensor.diagonal * sensor.aspectRatio[1] / Math.sqrt(Math.pow(sensor.aspectRatio[0],2) + Math.pow(sensor.aspectRatio[1], 2))}
        <div style={`width: ${width * offset}mm; height: ${height * offset}mm; outline-color: ${COLORS[index]}`} class="absolute outline-2 bg-transparent"></div>

    {/each}

    <ul class="float-right mr-2">
        {#each sensors.toReversed() as sensor, index}
            <div class="flex items-center">
                <button class="mr-2" onclick={_ => removeSensor(sensor.model)}>x</button>
                <p class="" style={`color: ${COLORS[index]}`}>{sensor.model}</p>
            </div>
        {/each}
    </ul>

</div>

<h2>Add sensors</h2>
<div class="flex justify-between w-full">
    <div class="label flex flex-col">
        <label for="diagonal">Diagonal size (mm)</label>
        <input bind:value={sensorSize} type="number" class="bg-zinc-900 p-1 rounded-md w-48" id="diagonal" placeholder="0mm">
    </div>

    <div class="label flex flex-col">
        <label for="ratio">Aspect ratio</label>
        <input bind:value={sensorRatio} type="text" class="bg-zinc-900 p-1 rounded-md w-48" id="ratio" placeholder="4/3">
    </div>

    <div class="label flex flex-col">
        <label for="name">Name</label>
        <input bind:value={sensorName} type="text" class="bg-zinc-900 p-1 rounded-md" id="name" placeholder="my sensor">
    </div>
</div>
<button onclick={_ => addSensor()} class="bg-sky-600 pl-2 pr-2 w-full rounded-xl mt-2 h-8 mb-8">add</button>


<label for="offset-slider">Size offset</label>
<input id="offset-slider" class="w-full" type="range" max="5" min="0" step="0.05" bind:value={offset}>


<div style={`width: ${2*offset}cm`} class="bg-white aspect-square"></div>
<p>This square should be 2cm by 2cm</p>
