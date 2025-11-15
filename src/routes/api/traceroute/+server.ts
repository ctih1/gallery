import { exec } from 'node:child_process';
import rawAirports from "$lib/airports.json";
import net from "node:net"
import type { ProbeResult } from './types';
import { error } from '@sveltejs/kit';
const airports = new Map(Object.entries(rawAirports));

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
