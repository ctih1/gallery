export async function GET({ fetch }) {
    const metrics = [
        "temp",
        "humidity",
        "mc2p5",
        "mc10p0",
        "climate_pressure",
        "climate_carbon_dioxide",
        "climate_temp_adjusted",
        "climate_relative_humidity",
        "climate_air_resistance"
    ];
    const res = await fetch(
        `http://192.168.32.88:9999/api/v1/query?query={__name__=~"${metrics.join("|")}"}`
    );
    const json = await res.json();

    if (json["status"] !== "success") {
        return new Response("fail", { status: 500 });
    }

    const map = new Map();
    for (let result of json["data"]["result"]) {
        map.set(result["metric"]["__name__"], result["value"][1]);
    }

    return new Response(JSON.stringify(Object.fromEntries(map)), {
        headers: { "Content-Type": "application/json" }
    });
}
