import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

export async function GET({ url, fetch }) {
    const data = readFileSync("src/lib/waltti/stops.txt");

    const rows = parse(data);
    rows.shift();

    // id, name, lat, lon, zone id
    const properRows = rows.map(row => [row[0], row[2], row[3], row[4], row[5]]);
    return new Response(JSON.stringify(properRows), {
        headers: { "Content-Type": "application/json" }
    });
}
