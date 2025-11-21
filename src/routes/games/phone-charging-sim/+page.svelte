<script lang="ts">
	import { browser } from "$app/environment";

    let percentage = $state(0);
    let charging = $state(false);
    let turnedOn = $state(false);
    let bricked = $state(false);
    let wattage = $state(2);

    let maxWattageForDevice = $state((Math.random()*95)+5);

    let cable: HTMLDivElement | undefined = $state();
    let chargingPort: HTMLDivElement | undefined = $state();

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    type MoveEvent = MouseEvent & { currentTarget: EventTarget & HTMLElement; }

    function cableMoveStart(event: MoveEvent) {
        if(!cable) return
        

        offsetX = event.clientX - cable.offsetLeft;
        offsetY = event.clientY - cable.offsetTop;
        dragging = true;
        document.body.style.userSelect = "none";
    }

    function cableMoveEnd() {
        dragging = false;
        document.body.style.userSelect = ""
    }

    if(browser) {
        document.addEventListener("mousemove", event => {
            if(!dragging || !cable || !chargingPort) return;

            let topPos = event.clientY - offsetY

            if(topPos < document.body.clientHeight - cable.clientHeight) {
                topPos = document.body.clientHeight - cable.clientHeight
            }

            let leftPos = event.clientX - offsetX;

            let chargingRect = chargingPort.getBoundingClientRect();
            let cableRect = cable.getBoundingClientRect();
        
            cable.style.left = leftPos + "px"
            cable.style.top = topPos + "px";

            
            if(
                Math.abs(chargingRect.left - cableRect.left) < 20 && Math.abs(chargingRect.right - cableRect.right) < 20 &&
                Math.abs(chargingRect.top - cableRect.top) < 20
            ) {
                if(!charging) {
                    turnedOn = true;
                }
                charging = true;
            } else {
                charging = false
            }
        });
    }

    setInterval(() => {
        if(charging && Math.round((Math.round(Math.random()*30)/10)*(Math.max(0,95-wattage))) == 0 && wattage > maxWattageForDevice) {
            bricked = true;
        }

        if(charging) {
            percentage += wattage/100;
        } else if(percentage > 0) {
            percentage -= 0.005;
        }
    }, 1000);
</script>

<h1>Phone charging sim</h1>

<div class="wattage w-96">
    <p>Charger wattage: {wattage}w</p>
    <input class="w-96" type="range" bind:value={wattage} min=0 max=100>
    <div class="flex justify-between">
        <p>0w</p>
        <p>100w</p>
    </div>

    <p>note: ramping up the wattage may cause the device to explode<br> <i>Explodes at a level 6 with deeper combustion at a level 7</i></p>
</div>

<div id="phone" class="w-80">
    <div class="flex items-center">
        <div class="aspect-9/20 rounded-2xl w-80 bg-black flex justify-center items-center">
            {#if bricked}
                <div class="flex flex-col justify-center">
                    <h1 class="text-center">your device exploded <br> :(</h1>
                    <button class="ml-auto mr-auto" onclick={_ => location.reload()}>restart</button>
                </div>
            {:else if turnedOn}
                <h1>{Math.round(percentage*100)/100}%</h1>
            {/if}
        </div>
        <button onclick={_ => turnedOn = !turnedOn} class="bg-zinc-900 h-32 w-2 active:bg-white">I</button>
    </div>

    <div bind:this={chargingPort} id="charging-port" class="w-8 h-2 bg-white ml-auto mr-auto"></div>
</div>



<div bind:this={cable} onmouseup={cableMoveEnd} onmousedown={cableMoveStart} id="cable" class="w-6 absolute -z-10">
    <div id="top" class="bg-amber-300 w-4 h-4 ml-auto mr-auto rounded-t-md"></div>
    <div id="bottom" class="bg-white w-6 h-96 rounded-t-md"></div>
</div>

<div class="spacer h-40 w-1"></div>