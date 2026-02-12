export function dayOfYear(date: Date): number {
    return (
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
            Date.UTC(date.getFullYear(), 0, 0)) /
        24 /
        60 /
        60 /
        1000
    );
}

export function getSunDeclanationDegrees(date: Date): number {
    const day = dayOfYear(date);
    const rads = ((360 / 365.25) * (day - 81) * Math.PI) / 180;
    return 23.445 * Math.sin(rads);
}

export function degToRad(deg: number) {
    return (deg * Math.PI) / 180;
}

export function getSunAngle(date: Date) {
    const declanationRad = degToRad(getSunDeclanationDegrees(date));
    const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

    return Math.asin(
        Math.sin(declanationRad) * Math.sin(degToRad(62)) +
            Math.cos(declanationRad) * Math.cos(degToRad(62)) * Math.cos(degToRad(15 * (hour - 12)))
    );
}

export function getSunPositionY(date: Date): number {
    const y = 350 * Math.tan(getSunAngle(date));
    return y;
}
