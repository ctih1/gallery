const SUN_ANGLE_OVERRIDE = undefined;

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
    const day = dayOfYear(date) + 1;

    return degToRad(23.445 * Math.sin(degToRad((360 / 365.25) * (day - 81))));
}

export function radToDeg(rad: number) {
    return (rad * 180) / Math.PI;
}

export function degToRad(deg: number) {
    return (deg * Math.PI) / 180;
}

export function getSunAngle(date: Date) {
    const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    const solarHour = hour + (25.9 - 45) / 15; // 45 is in UTC+3, replace with UTC+2 at some point!!
    const declanation = getSunDeclanationDegrees(date);
    const hourAngle = degToRad(15 * (solarHour - 12));

    let angle = radToDeg(
        Math.asin(
            Math.sin(declanation) * Math.sin(degToRad(62.2)) +
                Math.cos(declanation) * Math.cos(degToRad(62.2)) * Math.cos(hourAngle)
        )
    );

    if (angle > -1.0) {
        let refraction = 1.02 / Math.tan(degToRad(angle + 10.3 / (angle + 5.11))) / 60;
        angle += refraction;
    }

    return SUN_ANGLE_OVERRIDE ?? angle;
}

export function getSunPositionY(date: Date): number {
    const y = (600 * getSunAngle(date)) / 90 - 70;
    return y;
}
