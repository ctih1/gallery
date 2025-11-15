import { exec } from 'node:child_process';
import rawAirports from "$lib/airports.json";
import net from "node:net"
import type { ProbeResult } from './types';
import { error } from '@sveltejs/kit';
const airports = new Map(Object.entries(rawAirports));

const exampleOutput = `traceroute to 174.138.118.30 (174.138.118.30), 25 hops max, 60 byte packets
 1  _gateway (192.168.32.1)  1.718 ms
 2  *
 3  10.98.44.81 (10.98.44.81)  32.843 ms
 4  10.209.5.37 (10.209.5.37)  32.490 ms
 5  10.209.5.38 (10.209.5.38)  33.460 ms
 6  *
 7  141.208.27.6 (141.208.27.6)  44.452 ms
 8  hls-b4-link.ip.twelve99.net (62.115.153.140)  43.403 ms
 9  sto-bb1-link.ip.twelve99.net (62.115.123.26)  48.811 ms
10  sto-b9-link.ip.twelve99.net (62.115.139.181)  49.499 ms
11  *
12  be4593.ccr21.sto03.atlas.cogentco.com (154.54.75.86)  76.481 ms
13  be2555.rcr21.cph01.atlas.cogentco.com (154.54.61.237)  85.067 ms
14  be2496.ccr41.ham01.atlas.cogentco.com (154.54.61.221)  59.693 ms
15  be2815.ccr41.ams03.atlas.cogentco.com (154.54.38.205)  64.730 ms
16  be12488.ccr42.lon13.atlas.cogentco.com (130.117.51.41)  155.962 ms
17  be2317.ccr41.jfk02.atlas.cogentco.com (154.54.30.185)  118.277 ms
18  be3501.ccr42.jfk02.atlas.cogentco.com (154.54.95.101)  120.923 ms
19  be3496.ccr31.jfk10.atlas.cogentco.com (154.54.0.142)  124.748 ms
20  gi0-0-0-0.3419.nr11.b002894-1.ewr02.atlas.cogentco.com (38.104.44.17)  156.476 ms
21  *
22  *
23  *
24  *
25  *`

const KNOWN_REPLACEMENTS = new Map(Object.entries({
    "hls": "hel",
    "sto": "arn",
}));


function parseOutput(lines: string[]): ProbeResult[] {
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

        const matches = domain.match(domainLocationRegex);
        if(!matches) {
            console.log("no matches for " + domain);
        } else {
            for(let match of matches) {
                console.log("Checking match " + match);
                const replacement = KNOWN_REPLACEMENTS.get(match)
                if(replacement) {
                    match = replacement;
                }

                const data = airports.get(match.toUpperCase());

                if(data) {
                    console.log("Which was succesfull");
                    result.domainAnalysis = {
                        airport: match.toUpperCase(),
                        // @ts-ignore
                        coordinates: [Number(data.lat), Number(data.lon)]
                    }
                    break;
                }
            }
        }
        results.push(result);
    }
    return results.slice(1);
} 

export async function GET({ request }) {
    const ip = request.headers.get("X-Real-IP");
    if(!net.isIP(ip!)) {
        return error(422);
    }

    const tracerouteOutput = await exec(`traceroute -w 0.5 -q 1 -m 25 ${ip}`);
    return new Response(JSON.stringify(parseOutput(String(tracerouteOutput.stdout!).trim().split("\n"))), {
        headers: {"Content-Type": "application/json"}
    });
}
