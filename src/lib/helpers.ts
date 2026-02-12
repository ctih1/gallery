import type { MapData } from "../routes/api/weather/types";

// https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
export function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function getNearestMapValue(map: MapData): any {
    let nearestDate = new Date(0);
    let nearestValue: any = undefined;

    const now = new Date();
    for (let pair of Object.entries(map)) {
        const date = new Date(pair[0]);
        const val = pair[1];

        if (
            Math.abs(now.getTime() - date.getTime()) <
            Math.abs(now.getTime() - nearestDate.getTime())
        ) {
            nearestValue = val;
            nearestDate = date;
        }
    }

    return nearestValue;
}
