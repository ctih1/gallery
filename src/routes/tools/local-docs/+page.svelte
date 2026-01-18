<script lang="ts">
    import ClearContainer from "$lib/components/ClearContainer.svelte";
    import Input from "$lib/components/Input.svelte";

    const valueMap = $state(new Map());

    type RequestTypes = "GET" | "POST" | "DELETE" | "PUT";

    interface RequestPart {
        name: string;
        description: string;
        type: "number" | "string" | "list" | "map" | "boolean" | string;
        value: string;
        optional: boolean;
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
        loading?: boolean;
        open?: boolean;
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
                    value: "",
                    optional: false
                }
            ]
        },
        {
            type: "GET",
            body: [],
            domain: "kavi.frii.site",
            endpoint: "/search/episodes",
            headers: [],
            urlParams: [
                {
                    name: "id",
                    description: "ID of the show (see /search/series)",
                    type: "string",
                    value: "",
                    optional: false
                },
                {
                    name: "starting_episode",
                    description:
                        "Episode number to start the search from. If this is defined, starting_season must also be",
                    type: "number",
                    value: "",
                    optional: true
                },
                {
                    name: "ending_episode",
                    description: "Episode number to end the search to",
                    type: "number",
                    value: "",
                    optional: true
                },
                {
                    name: "starting_season",
                    description: "Season number to start the search from",
                    type: "number",
                    value: "",
                    optional: true
                },
                {
                    name: "ending_season",
                    description: "Episode number to end the search to",
                    type: "number",
                    value: "",
                    optional: true
                },
                {
                    name: "episode_filtering",
                    description: "How to filter the starting and ending episodes",
                    type: '"every-season" | "begin-end"',
                    value: "",
                    optional: true
                }
            ]
        },
        {
            type: "POST",
            body: [
                {
                    name: "prompt",
                    description: "The beginning of the sentence that will be completed",
                    type: "string",
                    value: "",
                    optional: false
                },
                {
                    name: "person",
                    description: "The model used.",
                    type: "string",
                    value: "",
                    optional: true
                }
            ],
            domain: "ai.koti.frii.site",
            endpoint: "/generate",
            headers: [
                {
                    name: "X-Auth",
                    description: "Authentication string to prove that you arent a random guy",
                    type: "string",
                    value: "",
                    optional: false
                }
            ],
            urlParams: []
        }
    ]);

    async function sendFetch(request: Request) {
        request.loading = true;

        const url = new URL(`https://${request.domain}${request.endpoint}`);
        request.urlParams.forEach(param => {
            url.searchParams.append(param.name, param.value);
        });

        const response = await fetch(url, {
            method: request.type,
            cache: "no-store",
            headers: request.headers.map(header => [header.name, header.value]),
            body:
                request.type !== "GET"
                    ? JSON.stringify(
                          Object.fromEntries(request.body.map(body => [body.name, body.value]))
                      )
                    : null
        });

        let text = "";
        if (response.headers.get("content-type")?.includes("application/json")) {
            console.log("Contains JSON");
            text = JSON.stringify(await response.json(), null, 4);
        } else {
            text = await response.text();
        }

        console.log("Fetch completted");
        request.result = {
            response: response.status,
            text: text.slice(0, 4500)
        };
        request.loading = false;
    }
</script>

{#snippet Type(type: RequestTypes)}
    <div class={`w-fit rounded-xl p-2 ${type === "GET" ? "bg-green-700" : "bg-yellow-500"}`}>
        <span class="text-3xl font-semibold">{type}</span>
    </div>
{/snippet}

<ClearContainer className="max-w-6xl">
    <h1>Docs for my local self hosted services</h1>

    <div class="space-y-8">
        {#each REQUESTS as req}
            {@const url = `${req.domain}${req.endpoint}`}

            <div>
                <div class="flex items-center space-x-4">
                    {@render Type(req.type)}
                    <a href="#" onclick={_ => (req.open = !req.open)}><h2>{url}</h2></a>
                </div>

                {#if req.open}
                    <br />
                    {#if req.headers.length >= 1}
                        <h2>Headers</h2>
                    {/if}
                    {#each req.headers as header}
                        <div>
                            <span class="text-xl font-semibold">{header.name}</span>
                            <p>
                                {header.description} <span class="opacity-70">({header.type})</span>
                            </p>
                            {#if header.optional}
                                <p>(optional)</p>
                            {/if}
                        </div>
                        <Input bind:value={header.value} />
                    {/each}
                    {#if req.body.length >= 1}
                        <h2>JSON body</h2>
                    {/if}
                    {#each req.body as body}
                        <div>
                            <span class="text-xl font-semibold">{body.name}</span>
                            <p>{body.description} <span class="opacity-70">({body.type})</span></p>
                            {#if body.optional}
                                <p>(optional)</p>
                            {/if}
                        </div>
                        <Input bind:value={body.value} />
                    {/each}
                    {#if req.urlParams.length >= 1}
                        <h2>Query Parameters</h2>
                    {/if}
                    {#each req.urlParams as param}
                        <div class="flex items-center justify-around space-y-4">
                            <div class="w-1/2">
                                <span class="text-xl">{param.name}</span>
                                <p class="opacity-70"><i>{param.type}</i></p>
                                {#if param.optional}
                                    <p>(optional)</p>
                                {/if}
                            </div>
                            <div class="w-1/2">
                                <p>{param.description}</p>
                                <Input class="w-60" bind:value={param.value} />
                            </div>
                        </div>
                        <hr class="mt-2 opacity-40" />
                    {/each}

                    {#if req.result}
                        <h1>{req.result.response}</h1>
                        <pre><code class="">
                        {req.result.text}
                    </code></pre>
                        <p>(max 4500 characters displayed)</p>
                    {/if}

                    <button
                        onclick={_ => sendFetch(req)}
                        class="mt-8 h-8 w-full rounded-xl bg-sky-600 pr-2 pl-2"
                    >
                        {#if req.loading}
                            Sending...
                        {:else}
                            Send request
                        {/if}
                    </button>
                {/if}
            </div>
        {/each}
    </div>
</ClearContainer>
