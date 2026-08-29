import { WALTTI_KEY } from "$env/static/private";
import { load } from "protobufjs";
import { parse } from "csv-parse"
let tripCache: any = null;

export async function GET({ url, fetch }) {
    const root = await load("src/lib/gtfs-realtime.proto");
    const feedMessage = root.lookupType("transit_realtime.FeedMessage");

    const vehicleRes = await fetch(
        "https://data.waltti.fi/jyvaskyla/api/gtfsrealtime/v1.0/feed/vehicleposition",
        {
            headers: {
                Authorization: `Basic ${WALTTI_KEY}`
            }
        }
    );

    if (!tripCache) {
        const tripRes = await fetch(
            "https://data.waltti.fi/jyvaskyla/api/gtfsrealtime/v1.0/feed/tripupdate",
            {
                headers: {
                    Authorization: `Basic ${WALTTI_KEY}`
                }
            }
        );

        if (!tripRes.ok) {
            console.log(tripRes.status);
            console.log(await tripRes.text());
        }
        tripCache = root.lookupType("transit_realtime.FeedMessage").decode(await tripRes.bytes());
    }

    if (!vehicleRes.ok) {
        console.log(vehicleRes.status);
        console.log(vehicleRes);
    }

    // const vehicles = feedMessage.decode(await vehicleRes.bytes());

    const vehicles = root
        .lookupType("transit_realtime.FeedMessage")
        .decode(await vehicleRes.bytes());

    return new Response(JSON.stringify({ trip: tripCache.toJSON(), vehicles: vehicles.toJSON() }), {
        headers: { "Content-Type": "application/json" }
    });
}
