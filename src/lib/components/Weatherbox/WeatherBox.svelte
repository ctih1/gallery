<script lang="ts">
    import { getNearestMapValue, hslToHex } from "$lib/helpers";
    import { onMount } from "svelte";
    import Input from "../Input.svelte";
    import {
        createSunGradient,
        drawCloud,
        drawFlake,
        drawRaindrop,
        drawStreetlight,
        drawSun,
        drawSunGlow
    } from "./drawables";
    import { getSunAngle, getSunPositionY } from "./sunUtils";
    import type {
        Cloud,
        FullPercentage,
        Props,
        RainlikeParticle,
        RenderEnvironment,
        RenderObjects
    } from "./types";

    let { weatherData }: Props = $props();

    let weatherCanvas: HTMLCanvasElement | undefined = $state();
    let weatherCtx: CanvasRenderingContext2D | null | undefined = $derived(
        weatherCanvas?.getContext("2d")
    );

    let renderEnvironment: RenderEnvironment = $state({
        snowFallSpeed: 0.5,
        snowAmount: 1500,

        waterAmount: 1.0,
        waterSpeed: 1,

        visibilityMeters: 0,
        cloudCover: 0,

        windSpeed: 0
    });

    let renderObjects: RenderObjects = {
        flakes: [],
        rain: [],
        clouds: [],
        sun: { x: 0, y: 0 }
    };

    let debugVariables = $state({
        turnedOn: false,
        month: -1,
        hour: -1,
        overlay: false
    });

    let renderTick = 0;
    let lastRenderTimestamp = 0;

    onMount(() => {
        if (weatherData) {
            const coverNow: FullPercentage = getNearestMapValue(weatherData.cloudCover) || 0;
            const rainNowMm: number = getNearestMapValue(weatherData.rain) || 0;
            const snowNowCm: number = getNearestMapValue(weatherData.snowfall) || 0;

            console.log("Current weather data: ");
            console.log(`Rain in 1h: ${rainNowMm}mm`);
            console.log(`Cloud cover: ${coverNow}%`);
            console.log(`Snow in 1h: ${snowNowCm}cm`);

            renderEnvironment = {
                cloudCover: coverNow,
                snowFallSpeed: weatherData.windNow / 4,
                waterAmount: rainNowMm * 100,
                waterSpeed: 6 + weatherData.windNow * 3,
                snowAmount: snowNowCm * 50,
                visibilityMeters: 59000,
                windSpeed: weatherData.windNow
            };

            renderObjects.clouds = createClouds(5, 8);

            console.log("Rendering environment: ");
            console.log(renderEnvironment);
        }

        requestAnimationFrame(canvasUpdate);
    });

    $effect(() => {
        renderEnvironment.snowAmount;
        renderObjects.flakes = createParticles(renderEnvironment.snowAmount);
    });

    $effect(() => {
        renderEnvironment.waterAmount;
        renderObjects.rain = createParticles(renderEnvironment.waterAmount);
    });

    function createParticles(amount: number): RainlikeParticle[] {
        let particles: RainlikeParticle[] = [];
        for (let i = 0; i < amount; i++) {
            const offset = Math.random() * 300;
            particles.push({
                offset: offset,
                position: {
                    x: Math.random() * 300,
                    y: Math.random() * 500 - 300
                }
            });
        }
        return particles;
    }

    function createClouds(cloudsNum: number, clumpSize: number): Cloud[] {
        let clouds: Cloud[] = [];
        const cloudSpacing = 300 / cloudsNum;

        for (let i = 0; i < cloudsNum; i++) {
            const baseX = i * cloudSpacing;
            const baseY = Math.random() * 50 - 40;

            for (let j = 0; j < clumpSize; j++) {
                clouds.push({
                    position: {
                        x: baseX + Math.random() * 10 - 5,
                        y: baseY + Math.random() * 10 - 10
                    },
                    rotation: Math.random() * 20,
                    scaleX: 50 + Math.random() * 50,
                    scaleY: 20 + Math.random() * 40
                });
            }
        }
        return clouds;
    }

    // TODO: Move everything into a separate component (but I know I'll never do that.) 08/02/2026 (dd/mm/yyyy)
    function canvasUpdate(timestampMs: number) {
        if (lastRenderTimestamp == 0) {
            lastRenderTimestamp = timestampMs;
        }

        const fps = 1 / ((timestampMs - lastRenderTimestamp) / 1000);
        const delta = 1 / fps;

        if (!weatherCtx || !weatherCanvas) return;
        const ctx = weatherCtx;

        ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
        let date = new Date();

        if (debugVariables.month !== -1 && debugVariables.hour !== -1) {
            date = new Date(
                `2026-${debugVariables.month.toString().padStart(2, "0")}-21T${debugVariables.hour.toString().padStart(2, "0")}:12:00`
            );
        }

        const relativeSunStrength = (getSunAngle(date) + 0.9) / 1.8;
        const sunPos = getSunPositionY(date);
        const sunColor = hslToHex(
            10 * (relativeSunStrength * 2) + 25,
            100 - renderEnvironment.cloudCover / 2,
            60
        );

        const skyGradient = createSunGradient(
            ctx,
            relativeSunStrength,
            renderEnvironment.cloudCover
        );
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);

        drawSun(ctx, sunPos, sunColor, relativeSunStrength, renderEnvironment.cloudCover);
        drawSunGlow(
            ctx,
            sunPos,
            sunColor,
            relativeSunStrength,
            weatherCanvas,
            renderEnvironment.visibilityMeters
        );

        drawStreetlight(ctx, relativeSunStrength);

        for (let flake of renderObjects.flakes) {
            drawFlake(ctx, flake, renderEnvironment, delta);
        }

        for (let droplet of renderObjects.rain) {
            drawRaindrop(ctx, droplet, renderEnvironment, delta);
        }

        ctx.fillStyle =
            "#dddddd" +
            Math.round((renderEnvironment.cloudCover / 100) * 50 * relativeSunStrength)
                .toString(16)
                .padStart(2, "0");

        for (let cloud of renderObjects.clouds) {
            drawCloud(ctx, cloud);
        }

        if (debugVariables.turnedOn && debugVariables.overlay) {
            const fontSize = 18;
            ctx.fillStyle = "#ff0000";
            ctx.font = `${fontSize}px monospace`;
            ctx.fillText(
                `${fps.toFixed(1)}fps, ${(delta * 1000).toFixed(4)}ms, tick# ${renderTick}`,
                0,
                fontSize,
                300
            );
            ctx.fillText(
                `sun ${((getSunAngle(date) * 180) / Math.PI).toFixed(3)}*, ${sunPos.toFixed(3)}Y`,
                0,
                fontSize * 2,
                300
            );
            ctx.fillText(`sun strength: ${relativeSunStrength.toFixed(2)}`, 0, fontSize * 3, 300);
            ctx.fillText(
                `cloud: ${renderEnvironment.cloudCover}%, visibility: ${renderEnvironment.visibilityMeters}m`,
                0,
                fontSize * 5,
                300
            );

            ctx.fillText(
                `snow amount: ${renderEnvironment.snowAmount}, speed ${renderEnvironment.snowFallSpeed}`,
                0,
                fontSize * 6,
                300
            );

            ctx.fillText(
                `rain amount: ${renderEnvironment.waterAmount}, speed ${renderEnvironment.waterSpeed}`,
                0,
                fontSize * 7,
                300
            );

            ctx.fillText(`wind: ${renderEnvironment.windSpeed}kmh`, 0, fontSize * 8, 300);

            ctx.fillText(
                `${renderObjects.clouds.length + renderObjects.flakes.length + renderObjects.rain.length} objects rendered`,
                0,
                fontSize * 10,
                300
            );
        }

        renderTick++;

        if (renderTick > 300) {
            renderTick = 0;
        }

        lastRenderTimestamp = timestampMs;
        requestAnimationFrame(canvasUpdate);
    }
</script>

<canvas
    onclick={_ => (debugVariables.turnedOn = !debugVariables.turnedOn)}
    width="300px"
    height="300px"
    bind:this={weatherCanvas}
></canvas>

{#if debugVariables.turnedOn}
    <p>debug controls (hide by pressing the canvas)</p>

    <Input bind:value={debugVariables.overlay} label="debug overlay" type="checkbox" />
    <Input
        label="snow speed"
        bind:value={renderEnvironment.snowFallSpeed}
        type="range"
        min="0.01"
        max="50"
        step="0.01"
    />
    <Input
        label="snow amount"
        bind:value={renderEnvironment.snowAmount}
        type="range"
        min="0"
        max="5000"
        step="10"
    />

    <Input
        label="water speed"
        bind:value={renderEnvironment.waterSpeed}
        type="range"
        min="0.01"
        max="50"
        step="0.01"
    />
    <Input
        label="water amount"
        bind:value={renderEnvironment.waterAmount}
        type="range"
        min="0"
        max="5000"
        step="10"
    />
    <Input
        label="wind speed (kmh)"
        bind:value={renderEnvironment.windSpeed}
        type="range"
        min="0"
        max="100"
        step="1"
    />
    <Input label="hour" bind:value={debugVariables.hour} type="range" min="0" max="23" step="1" />
    <Input label="month" bind:value={debugVariables.month} type="range" min="1" max="12" step="1" />
    <Input
        label="cloud cover (%)"
        bind:value={renderEnvironment.cloudCover}
        type="range"
        min="1"
        max="100"
        step="1"
    />
    <Input
        label="visibility (m)"
        bind:value={renderEnvironment.visibilityMeters}
        type="range"
        min="1"
        max="30000"
        step="500"
    />
{/if}
