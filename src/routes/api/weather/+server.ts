import { env } from '$env/dynamic/private';
import type { MeteoResponse, ServerResponse } from './types.js';

const LATITUDE = env.WEATHER_LATITUDE;
const LONGITUDE = env.WEATHER_LONGITUDE

type MeasurementMap = Map<string, number> 

function formatOffset(stamp: string) {
    const numberOffset = Number(stamp);
    const sign = numberOffset >= 0 ? "+" : "-";
 
    const hours = String(Math.abs(numberOffset)).padStart(2, "0");

    return `${sign}${hours}:00`;
}

let cacheMap: [Date, unknown] = [new Date(-1), undefined];

export async function GET({ request, fetch }) {
    if(cacheMap[0].getTime()/1000 + 10800 < new Date().getTime()) {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.search = new URLSearchParams({
            "latitude": LATITUDE as string,
            "longitude": LONGITUDE as string,
            "daily": "sunrise,sunset,sunshine_duration",
            "hourly": "temperature_2m,cloud_cover,snowfall",
            // even though the code normalizes this into GMT+0, we can get the current offset in Helsinki and use it for other stuff
            "timezone": "Europe/Helsinki",
            "forecast_days": "1"
        }).toString()

        const res = await fetch(url);
        const json: MeteoResponse = await res.json();
        cacheMap = [new Date(), json];
    }
    
    // @ts-ignore
    const json: MeteoResponse = cacheMap[1];

    const stringOffset = json.timezone_abbreviation.split("GMT")[1];
    const timezoneOffset = formatOffset(stringOffset);

    const snowMap: MeasurementMap = new Map();
    const cloudMap: MeasurementMap = new Map();
    const temperatureMap: MeasurementMap = new Map();

    for(let i=0; i<json.hourly.time.length; i++) {
        const time = json.hourly.time[i]+timezoneOffset;

        snowMap.set(time, json.hourly.snowfall[i])
        cloudMap.set(time, json.hourly.cloud_cover[i])
        temperatureMap.set(time, json.hourly.temperature_2m[i]);
    }
    
    console.log(temperatureMap);

    const response: ServerResponse = {
        sunrise: new Date(json.daily.sunrise[0]+timezoneOffset),
        sunset: new Date(json.daily.sunset[0]+timezoneOffset),
        timezoneOffsetHours: Number(stringOffset),
        snowfall: Object.fromEntries(snowMap),
        cloudCover: Object.fromEntries(cloudMap),
        temperature: Object.fromEntries(temperatureMap)
    }

    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}