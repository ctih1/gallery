import { error } from "@sveltejs/kit";
import { readFileSync } from "fs";

export async function GET({ url, fetch }) {
    try {
        const temperature = readFileSync("/sys/class/thermal/thermal_zone0/temp");
        return new Response(JSON.stringify({ cpu: Number(temperature) / 1000 }), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.log(err);
        return error(500, "Failed to get temperature");
    }
}
