<script lang="ts">
    import Loader from "$lib/components/Loader.svelte";
    import PageConfig from "$lib/components/PageConfig.svelte";
    import L, { type LatLngExpression } from "leaflet";
    import "leaflet-rotatedmarker";
    import { Marker, Map as MLMap, Popup, setWorkerUrl } from "maplibre-gl";
    import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
    import "maplibre-gl/dist/maplibre-gl.css";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import type { Root } from "./types";

    let loading = $state(true);

    let map: MLMap | undefined = undefined;
    let popup = new Popup({ closeOnClick: false, closeOnMove: false, closeButton: false });

    interface BusHistory {
        marker: Marker | null;
        polyline: L.Polyline | null;
        history: LatLngExpression[];
    }
    const busHistory: Map<String, BusHistory> = new Map();

    const LINE_NUMBER_REGEX = /20[0-9]{2}-[0-9]{1,2}-[0-9]{1,2}_([A-Za-z0-9]{1,3})/g;

    onMount(async () => {
        setWorkerUrl(workerUrl);
        map = new MLMap({
            container: "map",
            style: "https://api.maptiler.com/maps/base-v4/style.json?key=mYP3qnL99AGnmhof4dGL",
            center: [25.9, 62.35],
            zoom: 8
        });
        map.getCanvas().onclick = () => {
            popup.setLngLat([0, 90]);
        };
        const req = await fetch("/api/waltti");
        const json = await req.json();
        const stopReqs = await fetch("/api/waltti/stops");
        const stopJson = await stopReqs.json();
        // initStops(stopJson);
        addBuses(json);
        setInterval(async () => {
            const req = await fetch("/api/waltti");
            const json = await req.json();
            addBuses(json);
        }, 1000);

        popup.addTo(map);
    });

    function addBuses(data: Root) {
        if (!map) return;
        const busRouteMap = new Map();
        const routeMap = new Map();

        for (let route of data["trip"]["entity"]) {
            console.log(route);

            if (!route["tripUpdate"]["vehicle"]) {
                continue;
            }
            busRouteMap.set(route["tripUpdate"]["vehicle"]["id"], route["id"]);
            routeMap.set(route["id"], route);
        }

        for (let bus of data["vehicles"]["entity"]) {
            const lineNumber =
                String(busRouteMap.get(bus["id"])).matchAll(LINE_NUMBER_REGEX).next().value?.[1] ??
                "??";

            const [lat, lon] = [
                bus["vehicle"]["position"]["latitude"],
                bus["vehicle"]["position"]["longitude"]
            ];

            const busHist = busHistory.getOrInsert(bus["id"], {
                history: [],
                marker: null,
                polyline: null
            });
            if (!busHist.marker) {
                const marker = document.createElement("div");
                marker.classList.add("bus-marker");

                busHist.marker = new Marker({ element: marker }).setLngLat([lon, lat]).addTo(map);
            }

            const markerElement = busHist.marker.getElement();

            markerElement.innerHTML = `
                <div style="position: absolute; left: -1px; top: -1px; border-radius: 100%; border: 2px solid green; width: 30px; height:30px; rotate: ${Number(bus["vehicle"]["position"]["bearing"]) + 90}deg;">
                    <span style="color: green; font-size: 14px; font-weight: 900; position: absolute; left: -13px; top: 3px;">◀</span>
                </div>
                <span style="color: black; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">${lineNumber}</span>
                `;

            markerElement.onclick = () => {
                popup.setHTML(`
                    <div>
                        <h2 style="color: black">${lineNumber}</h2>
                        <p style="color: black">${bus["vehicle"]["vehicle"]["label"]}</p>
                        <code style="color: black">${busRouteMap.get(bus["id"])} . ${bus["id"]}</code>
                        <button style="color: black; width: 100%; margin-top: 8px; text-align: center; border: solid 2px green; border-radius: 0.5em;">Route info</button>
                    </div>
                `);

                popup.setLngLat([lon, lat]);
            };
            // busHist.marker.bindPopup(`
            //         <div>
            //             <h3 style="color: black">${lineNumber} - ${bus["vehicle"]["vehicle"]["label"]}</h3>
            //             <div style="border-radius: 4px; outline: 1px solid black; width: 64px; text-align: center; background-color: rgb(230, 230, 230)">
            //                 <code style="color: black">${bus["vehicle"]["vehicle"]["licensePlate"]}</code>
            //             </div>
            //             <p style="color: black">${Math.round(bus["vehicle"]["position"]["speed"] * 3.6)}km/h</p>
            //         </div>
            //         `);

            // busHist.marker.setIcon(
            //     new L.DivIcon({
            //         className: "sexy-marker",
            //         html: `
            //             <div style="background: white;  width: 28px; height: 28px; border-radius: 100%; display: flex; align-items: center; text-align: center;">
            //                 <span style="color: black; text-align: center; width: 28px;">${lineNumber}</span>
            //             </div>
            //             `
            //     })
            // );
            // busHist.marker.setLatLng([lat, lon]);
            busHist.marker.setLngLat([lon, lat]);
            busHist.history.push([lat, lon]);
        }
    }

    // function initStops(stops: string[]) {
    //     for (let stop of stops) {
    //         let [id, name, lat, lon, zone] = stop;

    //         const marker = L.marker([Number(lat), Number(lon)], {
    //             icon: new L.DivIcon({
    //                 className: "sexy-stop",
    //                 html: `
    //                     <div style="background: white;  width: 18px; height: 18px; border-radius: 100%; display: flex; align-items: center; text-align: center;">
    //                         <span></span>
    //                     </div>
    //                 `
    //             })
    //         });

    //         marker.bindPopup(`
    //             <div>
    //                 <h3 style="color: black">${name}<h3>
    //             </div>
    //         `);

    //         marker.addTo(map!);
    //     }
    // }
</script>

<PageConfig title="Traceroute map" />

<h1>Waltti bus locations in Jyväskylä</h1>
{#if loading}
    <div class="flex items-center" transition:slide>
        <Loader></Loader>
        <p>Finding buses!</p>
    </div>
{/if}
<div class="aspect-video" id="map"></div>

<style>
    :global(.bus-marker) {
        background-color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
    }
</style>
