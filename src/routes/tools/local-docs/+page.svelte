<script lang="ts">
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import Input from "$lib/components/Input.svelte";

    const valueMap = $state(new Map());

    type RequestTypes = "GET" | "POST" | "DELETE" | "PUT";

    interface RequestPart {
        name: string;
        description: string;
        type: "number" | "string" | "list" | "map" | "boolean";
        value: string;
    }

    interface Request {
        type: RequestTypes;
        domain: string;
        endpoint: `/${string}`;
        headers: RequestPart[];
        body: RequestPart[];
        urlParams: RequestPart[];
        result?: {
            response: number;
            text: string;
        };
    }

    const REQUESTS: Request[] = $state([
        {
            type: "GET",
            body: [],
            domain: "kavi.frii.site",
            endpoint: "/search/series",
            headers: [],
            urlParams: [
                {
                    name: "name",
                    description: "Name of the show",
                    type: "string",
                    value: ""
                }
            ]
        }
    ]);

    async function sendFetch(request: Request) {
        const url = new URL(`https://${request.domain}${request.endpoint}`);
        request.urlParams.forEach(param => {
            url.searchParams.append(param.name, param.value);
        });

        const response = await fetch(url, {
            method: request.type,
            headers: request.headers.map(header => [header.name, header.value]),
            body:
                request.type !== "GET"
                    ? JSON.stringify(
                          Object.fromEntries(request.body.map(body => [body.name, body.value]))
                      )
                    : null
        });

        const text = await response.text();
        request.result = {
            response: response.status,
            text: text
        };
    }
</script>

<h1>Docs for my local self hosted services</h1>

{#snippet Type(type: RequestTypes)}
    <div class="w-fit rounded-xl bg-green-700 p-2"><span class="text-3xl">{type}</span></div>
{/snippet}

<ClearContainer className="max-w-6xl">
    {#each REQUESTS as req}
        {@const url = `${req.domain}${req.endpoint}`}
        <div class="flex items-center space-x-4">
            {@render Type(req.type)}
            <h2>{url}</h2>
        </div>

        <br />

        {#each req.headers as header}
            <Input bind:value={header.value} label={header.name} />
        {/each}
        {#each req.body as body}
            <Input bind:value={body.value} label={body.name} />
        {/each}
        {#if req.urlParams}
            <h2>Query Parameters</h2>
        {/if}
        {#each req.urlParams as param}
            <div class="flex items-center justify-around">
                <div>
                    <span class="text-xl">{param.name}</span>
                    <p class="opacity-70"><i>{param.type}</i></p>
                </div>
                <div>
                    <p>{param.description}</p>
                    <Input class="w-60" bind:value={param.value} />
                </div>
            </div>
        {/each}

        {#if req.result}
            <h1>{req.result.response}</h1>
            <pre><code>
                {req.result.text}
            </code></pre>
        {/if}

        <button
            onclick={_ => sendFetch(req)}
            class="mt-8 h-8 w-full rounded-xl bg-sky-600 pr-2 pl-2">Send request</button
        >
    {/each}
</ClearContainer>
