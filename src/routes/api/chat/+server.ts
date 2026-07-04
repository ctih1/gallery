import { error } from "@sveltejs/kit";
import Database from "better-sqlite3";
import type { User } from "./types";

const database = new Database("chat.db");

const ipMap: Map<String, User> = new Map();

function cycleAndGetTimeout(ip: String): Date | undefined {
    const user = ipMap.get(ip);

    if (!user) {
        console.log("No user !");
        return undefined;
    }

    user.eventList = user.eventList.filter(
        date => (new Date().getTime() - date.getTime()) / 1000 < 86_400
    );

    if (user.eventList.length === 0) return undefined;

    console.log(user.eventList.length);
    const timeToWaitSeconds = Math.pow(8, user.eventList.length);

    const date = user.eventList.at(-1);
    if (!date) return undefined;
    const futureDate = new Date(date);
    futureDate.setSeconds(date.getSeconds() + timeToWaitSeconds);

    if (futureDate.getTime() < new Date().getTime()) return undefined;
    return futureDate;
}

function addEvent(ip: string) {
    const user = ipMap.get(ip);

    if (!user) {
        ipMap.set(ip, { eventList: [new Date()] });
        return;
    }

    user.eventList.push(new Date());
}

function createDb() {
    database.exec(`
        CREATE TABLE IF NOT EXISTS chats (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            source    VARCHAR(255) NOT NULL,
            ip        VARCHAR(64) NOT NULL,
            text      VARCHAR(255),
            sent_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    database.exec("CREATE INDEX IF NOT EXISTS idx_sent_at ON chats(sent_at)");
}

export async function POST({ request, url }) {
    createDb();

    let {
        source,
        ip,
        text
    }: {
        source: string;
        ip: string;
        text: string;
    } = await request.json();

    if (request.headers.get("X-Real-IP")) {
        return error(401, "You can't upload stuff from the public API!");
    }

    const nextMessagePossibility = cycleAndGetTimeout(ip);
    if (nextMessagePossibility) {
        return error(
            429,
            `You must wait ${(nextMessagePossibility.getTime() - new Date().getTime()) / 1000}s before sending next message`
        );
    }

    text = text.trim();
    if (text.length > 255 || text.length < 5) {
        return error(400, "Text must be less than 255 characters and more than 5 characters");
    }

    database.prepare("INSERT INTO chats(source, ip, text) VALUES (?, ?, ?)").run(source, ip, text);

    addEvent(ip);

    return new Response("oki!");
}

export async function GET({ request, url }) {
    createDb();

    return new Response(
        JSON.stringify(
            database
                .prepare(
                    "SELECT id, source, text, sent_at FROM chats ORDER BY sent_at DESC LIMIT 10"
                )
                .all()
        )
    );
}
