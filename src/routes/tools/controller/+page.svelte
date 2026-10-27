<script lang="ts">
    import DraggableXY from "$lib/components/DraggableXY.svelte";
    import { onMount } from "svelte";

    let gamepad: Gamepad | undefined = $state();
    let vibrationInterval: any | undefined = undefined;
    let tick = 0;

    let element: HTMLDivElement | undefined = $state(undefined);

    interface Position {
        x: number;
        y: number;
    }

    let mouseDown = $state(false);
    let vibrationPosition: Position = $state({ x: 0, y: 0 });

    window.addEventListener("gamepadconnected", e => {
        gamepad = e.gamepad;
    });

    function startVibration() {
        vibrationInterval = setInterval(async () => {
            await handleVibration();
        }, 50);
    }

    function stopVibration() {
        if (!vibrationInterval) return;
        clearInterval(vibrationInterval);
    }

    async function handleVibration(): Promise<GamepadHapticsResult | undefined> {
        if (!gamepad) return;

        const weakIntensity = Math.max(330 - vibrationPosition.y, 0) / 330;
        const speed = vibrationPosition.x / 330;

        let weakModified = weakIntensity * (Math.abs(Math.sin(speed * (tick / 10))) / 0.8 + 0.2);
        tick++;

        return gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 100,
            weakMagnitude: weakModified
        });
    }

    onMount(() => {
        console.log("Starting");
        startVibration();
    });
</script>

<div class="mt-8 mr-auto ml-auto w-11/12 max-w-5xl bg-black/20 p-4">
    <h1>Vibrator (test)</h1>
    <p>Totally inconspicious controller vibration test software</p>

    <div class="mt-16">
        {#if !gamepad}
            <h2>Please press a button on the controller</h2>
        {:else}
            <div>
                <code>{gamepad.id}</code>
            </div>

            <button onclick={_ => startVibration()} class="rounded-xl bg-sky-600 p-2"
                >Start
            </button>
        {/if}

        <div class="">
            <div class="flex">
                <div class="flex h-96 w-12 flex-col justify-between">
                    <span>MAX</span>
                    <span>LOW</span>
                </div>
                <div>
                    <div bind:this={element} class="relative h-96 w-96 bg-zinc-900">
                        <DraggableXY
                            class="bg-purple-900"
                            parentElement={element}
                            bind:position={vibrationPosition}
                        />
                    </div>
                    <div class="flex justify-between">
                        <span>SLOW</span>
                        <span>FAST</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(.controller-body) {
        background-color: rgb(29, 21, 29);
    }
</style>
