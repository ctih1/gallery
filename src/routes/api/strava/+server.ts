import { error } from '@sveltejs/kit';
import { STRAVA_CLIENT_SECRET, STRAVA_CLIENT_ID, STRAVA_REFRESH_TOKEN } from '$env/dynamic/private';
import type { ActivityType } from './types.js';

const cache = new Map<string, any>();

type FetchFunction = (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>

async function refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string, fetch: FetchFunction): Promise<string> {
    const url = new URL("https://www.strava.com/api/v3/oauth/token");
    url.search = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken
    }).toString();

    console.log(`Fetching ${url}`)
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json()
    cache.set("accessToken", json["access_token"]);
    cache.set("expiresAt", json["expires_at"]);
    return json["access_token"]
}

async function getAthleteId(fetch: FetchFunction): Promise<string> {
    const res = await fetch("https://www.strava.com/api/v3/athlete", {
        headers: {
            "Authorization": `Bearer ${cache.get('accessToken')}`
        }
    });
    const json = await res.json();
    cache.set("athleteData", JSON.stringify(json));
    cache.set("athleteId", json["id"]);
    return json["id"];
}

async function getActivityHistory(fetch: FetchFunction): Promise<ActivityType[]> {
    const res = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=10", {
        headers: {
            "Authorization": `Bearer ${cache.get('accessToken')}`
        }
    });

    const json: ActivityType[] = await res.json();
    return json
}

export async function GET({ url, fetch }) {
    if (Date.now() / 1000 > (Number(cache.get("expiresAt")) || 0)) {
        await refreshAccessToken(STRAVA_REFRESH_TOKEN, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, fetch);
    }
    
    if(!cache.get("athleteId")) {
        await getAthleteId(fetch);
    }


    if(cache.get("processedActivities") && (cache.get("activityUpdateDate") ?? 0) > (new Date().getTime() / 1000)-7200) {
        return new Response(JSON.stringify(cache.get("processedActivities")), {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    const activities = await getActivityHistory(fetch);
    console.log(activities);
    const processedActivities = activities.map(activity => ({
        distance: activity.distance,
        type: activity.sport_type,
        time: activity.elapsed_time,
        startTime: activity.start_date,
        kilojoules: activity.kilojoules,
        averageSpeed: activity.average_speed,
        maxSpeed: activity.max_speed,
        name: activity.name
    }));

    cache.set("processedActivities", processedActivities);
    cache.set("activityUpdateDate", new Date().getTime()/1000);


    return new Response(JSON.stringify(processedActivities), {
        headers: {
            "Content-Type": "application/json"
        }
    })
};