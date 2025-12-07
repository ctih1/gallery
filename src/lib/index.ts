// place files you want to import through the `$lib` alias in this folder.
export function formatMinutes(rawNumber: number) {
    const minutes = Math.floor(rawNumber);
    const seconds = Math.round((rawNumber - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
