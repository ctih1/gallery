export async function GET({ fetch }) {
    const res = await fetch("http://host.docker.internal:7778/data");
    const json = await res.text();

    return new Response(json, { headers: { "Content-Type": "application/json" } });
}
