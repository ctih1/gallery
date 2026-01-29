import images from "$lib/images.json";
import type { RequestHandler } from "./$types";
type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface Location {
    url: `/${string}`;
    priority: number;
    lastMod: Date;
    changes: ChangeFrequency;
}

function constructSitemap(
    urls: Location[],
    baseDomain: string = "https://ctih1.frii.site"
): string {
    let stringedUrls = "";

    urls.forEach(url => {
        stringedUrls += `
        <url>
            <loc>${baseDomain}${url.url}</loc>
            <lastmod>${url.lastMod.toISOString()}</lastmod>
            <priority>${url.priority.toString()}</priority>
            <changefreq>${url.changes}</changefreq>
        </url>
        `
            .trim()
            .trimEnd();
    });

    return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${stringedUrls}
    </urlset>
    `
        .trim()
        .trimEnd();
}

function location(
    path: `/${string}`,
    priority: number = 0.5,
    changes: ChangeFrequency = "monthly",
    lastMod: Date | undefined = undefined
): Location {
    const date = lastMod || new Date();
    return {
        url: path,
        changes: changes,
        lastMod: date,
        priority: priority
    };
}

export const GET: RequestHandler = ({}) => {
    const urls: Location[] = [
        location("/devices", 0.4, "weekly"),
        location("/devices/orangepi3b"),
        location("/games/account-creation"),
        location("/games/phone-charging-sim"),
        location("/guides/telia-portforwarding"),
        location("/lightpollution", 0.7),
        location("/sensors", 0.7),
        location("/photos", 0.9, "weekly"),
        location("/speedtest", 0.2),
        location("/tools/local-docs", 0.6, "weekly"),
        location("/", 1.0, "weekly"),
        location("/links", 0.4)
    ];

    images.forEach(image => {
        urls.push(location(`/photos/${image}`, 0.3));
    });

    const sitemap = constructSitemap(urls);

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml"
        }
    });
};
