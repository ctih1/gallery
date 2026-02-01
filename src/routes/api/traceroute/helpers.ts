import Database from "better-sqlite3";
const database = new Database("ips.db");

interface Geolocation {
    countryCode: string;
    country: string;
    city: string;
    continentCode: string;
    isp: string;
}

export async function getLocationFromIp(ip: string): Promise<[number, number]> {
    database.exec(`
        CREATE TABLE IF NOT EXISTS ips (
            ip  TEXT primary key,
            lat REAL NOT     NULL,
            lng REAL NOT     NULL
        )
    `);

    // @ts-expect-error
    const result: { lat: number; lng: number } | undefined = database
        .prepare("SELECT * FROM ips WHERE ip=?")
        .get(ip);

    if (result) {
        console.log(`Found ip ${ip} in database`);
        return [result.lat, result.lng];
    } else {
        console.log(`Getting geolocation for ip ${ip}`);
        const result = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,lat,lon`);
        const json = await result.json();

        const [lat, lng] = [Number(json["lat"]), Number(json["lon"])];
        if (lat && lng) {
            database.prepare("INSERT INTO ips (ip, lat, lng) VALUES (?, ?, ?)").run(ip, lat, lng);
        }

        return [lat, lng];
    }
}

export async function getCountryFromIp(
    ip: string,
    search: boolean = true
): Promise<Geolocation | undefined> {
    database.exec(`
        CREATE TABLE IF NOT EXISTS geolocations (
            ip            TEXT primary key,
            countryCode   TEXT,
            city          TEXT,
            continentCode TEXT,
            country       TEXT,
            isp           TEXT
        );
    `);

    // @ts-expect-error
    const result: Geolocation | undefined = database
        .prepare("SELECT * FROM geolocations WHERE ip=?")
        .get(ip);

    if (result) {
        console.log(`Found ip ${ip} in database`);
        console.log(result);
        return result;
    } else if (search) {
        console.log(`Getting geolocation for ip ${ip}`);
        const result = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,message,isp,city,continentCode,countryCode,country`
        );
        const json = await result.json();
        console.log(json);

        database
            .prepare(
                "INSERT INTO geolocations (ip, countryCode, country, city, continentCode, isp) VALUES (?, ?, ?, ?, ?, ?)"
            )

            .run(ip, json.countryCode, json.country, json.city, json.continentCode, json.isp);

        return await getCountryFromIp(ip, false);
    }
}
