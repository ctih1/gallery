// DIY component library :sunglasses:
// using anonymous functions to sseparate them from REAL functions

import { hslToHex } from "$lib/helpers";
import type { Cloud, RainlikeParticle, RenderEnvironment, Star } from "./types";

export const drawStreetlight = (ctx: CanvasRenderingContext2D, relativeSunStrength: number) => {
    const lightX = 250 - 40 + 20 - 10 + 10;
    const lightY = 300 - 170;
    const streetlightGradiant = ctx.createRadialGradient(lightX, lightY, 4, lightX, lightY, 150);

    streetlightGradiant.addColorStop(
        0,
        hslToHex(39, 100, 50) +
            Math.round(
                Math.max(
                    0,
                    Math.min(
                        1,
                        (1 - (relativeSunStrength + 0.4)) * (relativeSunStrength > 0.4 ? 0 : 1)
                    ) * 255
                )
            )
                .toString(16)
                .padStart(2, "0")
    );
    streetlightGradiant.addColorStop(1, "transparent");
    ctx.fillStyle = streetlightGradiant;
    ctx.beginPath();
    ctx.moveTo(lightX, lightY - 10);
    ctx.lineTo(lightX - 80, lightY + (300 - lightY));
    ctx.lineTo(lightX + 80, lightY + (300 - lightY));
    ctx.lineTo(lightX, lightY - 10);
    ctx.fill();

    ctx.fillStyle = hslToHex(0, 0, 50);
    ctx.beginPath();
    // Sorry I was supposed to give these variables but I forgot what they were. Just figure it out
    ctx.fillRect(250 - 50 + 20 + 5, 300 - 170 - 15, 50, 15);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(250 - 40 + 20 - 10 + 5, 300 - 170 - 15 / 2, 15 / 2, 0, 2 * Math.PI);
    ctx.fill();
};

export const drawFlake = (
    ctx: CanvasRenderingContext2D,
    flake: RainlikeParticle,
    renderEnvironment: RenderEnvironment,
    timeDelta: number
) => {
    const normalizedOffset = flake.offset / 300;
    const fillColor =
        "#ffffff" + Math.round(Math.min(255, normalizedOffset * 255 + 30) / 3).toString(16);
    ctx.fillStyle = fillColor;
    ctx.beginPath();

    flake.position.x +=
        Math.sin(Math.random() / 10) * Math.random() * normalizedOffset * 8 +
        (renderEnvironment.windSpeed / 9) * (timeDelta * 100);
    if (flake.position.x > 300) {
        flake.position.x = 0;
    }

    flake.position.y +=
        renderEnvironment.snowFallSpeed +
        normalizedOffset +
        (renderEnvironment.windSpeed / 8) * (timeDelta * 100);

    if (flake.position.y > 300) {
        flake.position.y = -Math.random() * 200;
        flake.position.x = Math.random() * 300;
    }

    ctx.ellipse(
        flake.position.x,
        flake.position.y,
        0.5 + normalizedOffset * 2,
        0.5 + normalizedOffset + renderEnvironment.snowFallSpeed / 5,
        -(renderEnvironment.windSpeed / 100),
        0,
        2 * Math.PI
    );
    ctx.fill();
};

export const drawRaindrop = (
    ctx: CanvasRenderingContext2D,
    droplet: RainlikeParticle,
    renderEnvironment: RenderEnvironment,
    timeDelta: number
) => {
    const normalizedOffset = droplet.offset / 300;
    const fillColor =
        "#ffffff" + Math.round(Math.min(100, normalizedOffset * 100 + 30) / 2).toString(16);
    ctx.fillStyle = fillColor;
    ctx.beginPath();

    droplet.position.x += (renderEnvironment.windSpeed / 2) * timeDelta;
    if (droplet.position.x > 300) {
        droplet.position.x = -normalizedOffset * 4 - Math.random() * 300;
    }

    droplet.position.y += renderEnvironment.waterSpeed + normalizedOffset * 2 * timeDelta;

    if (droplet.position.y > 300) {
        droplet.position.y = -Math.random() * 200;
        droplet.position.x = Math.random() * 300;
    }

    ctx.ellipse(
        droplet.position.x,
        droplet.position.y,
        1.0,
        2.0 + normalizedOffset * 2 + renderEnvironment.waterSpeed,
        -(renderEnvironment.windSpeed / 100),
        0,
        2 * Math.PI
    );
    ctx.fill();
};

export const drawSun = (
    ctx: CanvasRenderingContext2D,
    sunPos: number,
    sunColor: string,
    relativeSunStrength: number,
    cloudCover: number
) => {
    ctx.fillStyle = sunColor;
    ctx.beginPath();
    ctx.arc(150, 300 - sunPos, 50, 0, 2 * Math.PI, false);
    ctx.fill();
};

export const drawSunGlow = (
    ctx: CanvasRenderingContext2D,
    sunPos: number,
    sunColor: string,
    relativeSunStrength: number,
    weatherCanvas: HTMLCanvasElement,
    visibilityMeters: number
) => {
    const sunGradientSize = (250 - sunPos) / 2;
    const sunGradient = ctx.createRadialGradient(
        150,
        300 - sunPos,
        50,
        150,
        300 - sunPos,
        Math.max(50, sunGradientSize)
    );
    sunGradient.addColorStop(0, sunColor);
    sunGradient.addColorStop(1, relativeSunStrength > 0.44 ? "#ffffff05" : "transparent");

    ctx.fillStyle = sunGradient;
    ctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);

    ctx.fillStyle =
        "#848484" + Math.max(20, 150 - Math.round(250 * (visibilityMeters / 20000))).toString(16);
    ctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);

    ctx.fillStyle = hslToHex(41, 100, 36.2 * Math.max(0.3, relativeSunStrength));
    ctx.beginPath();
    ctx.fillRect(250, 300 - 170, 20, 170);
    ctx.fill();
};

export const drawCloud = (ctx: CanvasRenderingContext2D, cloud: Cloud) => {
    ctx.beginPath();
    ctx.ellipse(
        cloud.position.x,
        cloud.position.y,
        cloud.scaleX,
        cloud.scaleY,
        cloud.rotation,
        0,
        2 * Math.PI
    );
    ctx.fill();
};

export const drawStar = (
    ctx: CanvasRenderingContext2D,
    star: Star,
    renderEnvironment: RenderEnvironment,
    relativeSunStrength: number,
    delta: number
) => {
    ctx.beginPath();
    if (star.blinkReversing) {
        star.currentBlink -= star.blinkSpeed * delta;
    } else {
        star.currentBlink += star.blinkSpeed * delta;
    }

    if (star.currentBlink > 1) {
        star.blinkReversing = true;
    }
    if (star.currentBlink < 0) {
        star.blinkReversing = false;
    }

    const starOpacity = Math.max(0, 1 - relativeSunStrength - 0.6) * 3;

    ctx.fillStyle =
        "#ffffff" +
        Math.round(
            Math.min(255, (star.currentBlink + 0.3) * 255) *
                Math.max(0, 1 - renderEnvironment.cloudCover / 100 - 0.4) *
                starOpacity
        )
            .toString(16)
            .padStart(2, "0");

    ctx.ellipse(
        star.position.x,
        star.position.y,
        star.magnitude,
        star.magnitude,
        0,
        0,
        2 * Math.PI
    );
    ctx.fill();
};

export function createSunGradient(
    ctx: CanvasRenderingContext2D,
    relativeSunStrength: number,
    cloudCover: number
): CanvasGradient {
    const saturationMultiplier = cloudCover > 90 ? 0 : 1;
    const skyGradient = ctx.createLinearGradient(
        0,
        3180 * Math.max(0, Math.min(relativeSunStrength + 0.3, 1.1)) - 3000,
        0,
        600
    );

    const lightMultiplier = Math.min(
        1,
        Math.max(0, 1 / (1 + Math.exp(-20 * (relativeSunStrength - 0.5))))
    );

    skyGradient.addColorStop(0, hslToHex(215, 100 * saturationMultiplier, 50 * lightMultiplier));
    skyGradient.addColorStop(0.44, hslToHex(198, 100 * saturationMultiplier, 85 * lightMultiplier));
    skyGradient.addColorStop(
        0.57,
        hslToHex(
            191,
            100 * saturationMultiplier * lightMultiplier,
            80 * Math.min(1, lightMultiplier * 2)
        )
    );
    skyGradient.addColorStop(
        0.73,
        hslToHex(
            57,
            50 * lightMultiplier * saturationMultiplier,
            60 * Math.min(1, lightMultiplier * 2)
        )
    );
    skyGradient.addColorStop(1.0, hslToHex(30, 100 * saturationMultiplier, 50 * lightMultiplier));

    return skyGradient;
}
