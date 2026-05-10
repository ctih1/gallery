<script lang="ts">
    import ContactMethod from "$lib/components/ContactMethod.svelte";

    let catImage: HTMLVideoElement | undefined = $state();

    let scrollY = $state(0);

    $effect(() => {
        if (!catImage) return;

        const catRect = catImage.getBoundingClientRect();
        let relativeScroll = (scrollY - catRect.y) / catRect.height;

        let cappedScroll = Math.min(Math.max(0, relativeScroll), 1);
    });
</script>

<svelte:window bind:scrollY />

<div id="introduction-bg">
    <div class="absolute top-0 left-0 h-[90vh] w-screen overflow-hidden">
        <img
            src="./IMG_7565.jpeg"
            alt="Nice lake"
            class="absolute top-0 left-0 -z-20 min-h-[90vh] object-cover object-center will-change-transform transform-3d"
        />
    </div>
    <div class="dark-overlay absolute top-0 left-0 -z-10 h-[90vh] w-screen"></div>
</div>

<div id="project-bg">
    <div class="absolute top-[105vh] left-0 h-[140vh] w-screen overflow-hidden">
        <img
            src="./IMG_1280.jpg"
            class="absolute top-0 left-0 -z-20 min-h-[140vh] object-cover object-top"
            alt="Forest"
        />
    </div>
    <div class="dark-overlay absolute top-[105vh] left-0 -z-10 h-[140vh] w-screen"></div>
</div>

<div class="md:p-8 lg:p-16 xl:p-32">
    <div id="introduction" class="flex h-[80vh] w-screen items-center">
        <div
            class="mb-42 max-w-3/5 squircle-md bg-black/30 p-6 outline-1 outline-white/20 backdrop-blur-md"
        >
            <h2 class="text-6xl!">Hello!</h2>
            <h1 class="mb-1! text-2xl! font-medium opacity-80">
                I'm ctih1, a full-stack dev from Finland
            </h1>

            <p class="opacity-40">(who occasionally makes some cool things)</p>

            <div class="mt-4 flex">
                <ContactMethod
                    link="https://github.com/ctih1/"
                    imageUrl="./logos/GitHub_Invertocat_White.svg"
                />
            </div>
        </div>
    </div>
    <div id="projects">
        <h1>My programming projects</h1>

        <div class="flex flex-col p-16 md:flex-row md:justify-between">
            <div class="space-y-52 pr-16 md:w-1/2" id="left">
                <div>
                    <h2>frii.site</h2>
                    <p>
                        A free subdomain registrar, which I've been developing over the past 2
                        years. The service has amassed <span
                            class="font-semibold text-[rgb(50,180,255)]!">over 5000 users</span
                        > from over a hundred different countries.
                    </p>

                    <div class="mt-4 flex space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/frii.site-frontend"
                        />
                        <ContactMethod imageUrl="./logos/open.svg" link="https://www.frii.site" />
                    </div>
                </div>

                <div>
                    <h2>goober</h2>
                    <p>
                        A fork of an existing Discord bot. Rewrote a large part of the codebase, and
                        improved the developer experience. Also wrote many cogs for it, such as a
                        YouTube song translator, OCR translator (Google Lens alternative), and many
                        more.
                    </p>

                    <div class="mt-4 flex space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/goober"
                        />
                    </div>
                </div>
                <div>
                    <h2>fitness-tracker</h2>
                    <p>
                        Does exactly what's said on the tin. Let's you create custom exercises, log
                        progress, and view your progress. Made with Tauri and Svelte
                    </p>

                    <div class="mt-4 flex space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/fitness-tracker"
                        />
                    </div>
                </div>
            </div>

            <div id="timeline" class="hidden h-[900px] w-[3px] md:block"></div>

            <div class="text-righ mt-52 space-y-52 pl-16 md:w-1/2" id="right">
                <div>
                    <h2>kake</h2>
                    <p>
                        A "virus" written to joke around with my friends. The client, installer,
                        updater, and server are all programmed in Rust. I had a lot of fun learning
                        about low-level stuff, working with the Win32 API, and figuring out how go
                        undetected by antiviruses.
                    </p>
                    <div class="ml-auto flex justify-end space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/ctih1/kake"
                        />
                    </div>
                </div>
                <div>
                    <h2>betternotifications</h2>
                    <p>
                        A Vencord plugin which improved the look and customization of notifications
                        on the instant messaging service Discord. I learnt a lot about Typescript,
                        Electron, and reverse-engineering during building this.
                    </p>
                    <div class="float-right mt-4 flex space-x-4">
                        <ContactMethod
                            imageUrl="./logos/GitHub_Invertocat_White.svg"
                            link="https://github.com/Vendicated/Vencord/pull/3430"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <hr class="mt-20 opacity-10" />

    <div class="mt-20" id="fun-stuff">
        <h1>Local climate</h1>
        <p>
            I installed a couple of sensors indoors and outdoors, and here is the data they're
            currently providing me with:
        </p>
    </div>
</div>

<style>
    .dark-overlay {
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.6) 19%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.6) 70%,
            rgba(0, 0, 0, 1) 100%
        );
    }

    #timeline {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='9' stroke-dasharray='20%2c30' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    }

    :global(body) {
        height: 100%;
        background-color: black;
    }
</style>
