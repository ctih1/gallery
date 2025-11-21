import { exec } from 'node:child_process';
import { readFile } from "node:fs/promises";
import net from "node:net"
import type { AirportCSV, AirportMap, CityMap, CSVCities, ProbeResult } from './types';
import { error } from '@sveltejs/kit';
import { parse } from "csv-parse/sync";
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import airports from "$lib/airports.json";
import worldCities from "$lib/cities/worldcities.json";
import Database from "better-sqlite3";

const KNOWN_REPLACEMENTS = new Map(Object.entries({
    "hls": "hel",
    "sto": "arn",
    "kbn": "cph",
    "kan": "mci",
    "pal": "pao",
    "chi": "ord",
    "prs": "cdg"
}));

const TEST_TRACEROUTE = `traceroute to koti.frii.site (193.208.10.244), 25 hops max, 60 byte packets
 1  *
 2  10.74.196.63 (10.74.196.63)  1.250 ms
 3  138.197.248.228 (138.197.248.228)  1.285 ms
 4  143.244.192.168 (143.244.192.168)  0.970 ms
 5  143.244.225.90 (143.244.225.90)  1.935 ms
 6  143.244.225.23 (143.244.225.23)  1.202 ms
 7  ix-ae-22-0.tcore4.njy-newark.as6453.net (66.198.111.6)  1.649 ms
 8  if-ae-1-3.tcore4.njy-newark.as6453.net (216.6.57.6)  2.756 ms
 9  63.243.218.8 (63.243.218.8)  2.168 ms
10  *
11  *
12  kbn-bb6-link.ip.twelve99.net (80.91.254.90)  84.885 ms
13  prs-bb2-link.ip.twelve99.net (62.115.140.106)  118.245 ms
14  adm-bb2-link.ip.twelve99.net (62.115.137.4)  116.014 ms
15  sto-bb1-link.ip.twelve99.net (62.115.139.180)  95.215 ms
16  *
17  *
18  *
19  telia-ic-366423.ip.twelve99-cust.net (62.115.153.141)  118.735 ms
20  *
21  141.208.192.78 (141.208.192.78)  118.424 ms
22  *
23  mobile-access-c1d00a-244.dhcp.inet.fi (193.208.10.244)  124.233 ms`

const database = new Database('ips.db');

// @ts-expect-error TS2740
const rawCityData: CSVCities[] = worldCities;
const cityData: CityMap = Object.fromEntries(rawCityData.map(city => [city.city_ascii.toLowerCase(), {...city}]));

// @ts-ignore
const rawAirportData: AirportCSV[] = airports
const airportData: AirportMap = Object.fromEntries(rawAirportData.map(airport => [airport.code.toLowerCase(), {...airport}]));

async function parseOutput(lines: string[]): Promise<ProbeResult[]> {
    console.log(lines);
    const domainLocationRegex = /[a-z]{3}/g;
    let results: ProbeResult[] = [];

    for(const line of lines) {
        console.log();
        console.log(line);
        const parts = line.match(/\S+/g) || [];
        if(parts.length != 5) {
            console.log(`Skipping line ${parts[0]} insufficent data ${parts.length} ${line}`);
            continue;
        }

        const index = parts[0];
        const domain = parts[1];
        const ip = parts[2].replace("(", "").replace(")", "");
        const delay = parts[3];
        
        let result: ProbeResult = {
            index: Number(index),
            delay: Number(delay),
            domain: domain,
            ip: ip,
            domainAnalysis: undefined
        }
        
        for(let city of rawCityData) {
            if(domain.toLowerCase().includes(city.city.toLocaleLowerCase()) && city.city.length > 5) {
                if(Number(city.population) > 50000 && Number(city.population) > (result.domainAnalysis?.population || 0)) {
                    console.log("Matched city " + city.city);
                    result.domainAnalysis = {
                        cityOrAirport: city.city.toLocaleLowerCase(),
                        coordinates: [Number(city.lat), Number(city.lng)],
                        population: Number(city.population)
                    }
                }
            }
        } 

        if(!result.domainAnalysis)  {
            const matches = domain.match(domainLocationRegex);
            if(matches) {
                for(let match of matches) {
                    const replacement = KNOWN_REPLACEMENTS.get(match.toLocaleLowerCase().trim())
                    console.log(match);
                    if(replacement) {
                        match = replacement;
                    }

                    console.log("Checking match " + match);

                    const data = airportData[match.toLocaleLowerCase()];
                    if(!data || !data.url || !data.icao || Number(cityData[data.city.toLocaleLowerCase().trim()]?.population ?? 0) < 25000) {
                        console.log("Skipping airport because URL isnt there");
                    } else {
                        console.log("Which was succesfull");
                        console.log(cityData[match.toLowerCase().trim()]);
                        result.domainAnalysis = {
                            cityOrAirport: match.toUpperCase(),
                            // @ts-ignore
                            coordinates: [Number(data.latitude), Number(data.longitude)]
                        }
                        break;
                    }
                }
            }
        }

       if(!result.domainAnalysis) {
            const geolocation = await getLocationFromIp(ip);
            if(geolocation[0]) {
                result.domainAnalysis = {
                    cityOrAirport: "unknown",
                    coordinates: geolocation,
                    population: 0
                }
            }
       }
        results.push(result);
    }

    console.log(results);
    return results.slice(1);
} 

async function getLocationFromIp(ip: string): Promise<[number, number]> {
    database.exec(`
        CREATE TABLE IF NOT EXISTS ips (
            ip  TEXT primary key,
            lat REAL NOT     NULL,
            lng REAL NOT     NULL
        )
    `)

    // @ts-expect-error
    const result: {lat: number, lng: number} | undefined = database.prepare("SELECT * FROM ips WHERE ip=?").get(ip);

    if(result) {
        console.log(`Found ip ${ip} in database`);
        return [result.lat, result.lng]
    } else {
        console.log(`Getting geolocation for ip ${ip}`);
        const result = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,lat,lon`);
        const json = await result.json();

        const [lat, lng] = [Number(json["lat"]), Number(json["lon"])];
        if(lat && lng) {
            database.prepare("INSERT INTO ips (ip, lat, lng) VALUES (?, ?, ?)").run(ip, lat, lng);
        }
        
        return [lat, lng];
    }
}

export async function GET({ request }) {
    const ip = request.headers.get("X-Real-IP");
    if(!net.isIP(ip!)) {
        console.log("Invalid ip! Headers: ");
        console.log(request.headers);
        return error(422);
    }

    // return new Response(JSON.stringify(await parseOutput(TEST_TRACEROUTE.split("\n"))), {
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // });


    return new Promise(async (resolve) => {
        exec(`traceroute -w 0.5 -q 1 -m 25 ${ip}`, async (err, stdout, stderr) => {
            if (err) {
                resolve(new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } }));
                return;
            }

            const output = await parseOutput(stdout.trim().split("\n"));
            resolve(new Response(JSON.stringify(output), {
                headers: { "Content-Type": "application/json" }
            }));
        });
    });


}
