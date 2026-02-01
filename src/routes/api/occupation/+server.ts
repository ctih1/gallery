import { error } from "@sveltejs/kit";
import Database from "better-sqlite3";
import net from "node:net";
import { getCountryFromIp } from "../traceroute/helpers.js";
import type { OccupationColumn } from "./types.js";
const database = new Database("areas.db");

const ipMap: Map<string, Date> = new Map();

export async function POST({ request, url }) {
    const square = Number(url.searchParams.get("i"));
    if (square === undefined) {
        return error(422);
    }

    const ip = request.headers.get("X-Real-IP");

    if (!ip || !net.isIP(ip)) {
        return error(422);
    }

    if (ipMap.get(ip) && new Date().getTime() / 1000 - ipMap.get(ip).getTime() / 1000 < 30) {
        return error(429);
    }

    const country = await getCountryFromIp(ip);
    console.log(country);

    const res = database
        .prepare(
            `
        REPLACE INTO areas (id, country, nation, isp, continent, city, occupied) VALUES (?, ?, ?, ?, ?, ?, ?);
        `
        )
        .run(
            square,
            country?.countryCode,
            country?.country,
            country?.isp,
            country?.continentCode,
            country?.city,
            new Date().toISOString().replace("T", " ").substring(0, 19)
        );

    const result: OccupationColumn | undefined = database
        .prepare("SELECT * from areas WHERE id=?")
        .get(square);

    ipMap.set(ip, new Date());

    return new Response(JSON.stringify(result), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function GET({ url, fetch }) {
    database.exec(`
        CREATE TABLE IF NOT EXISTS areas (
            id        INTEGER primary key,
            country   CHAR(4) NOT NULL,
            nation    TEXT NOT NULL,
            isp       TEXT,
            continent TEXT,
            city      TEXT,
            occupied  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

    const result: OccupationColumn[] | undefined = database.prepare("SELECT * from areas").all();

    return new Response(JSON.stringify(result), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
