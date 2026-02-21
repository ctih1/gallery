import { readFileSync } from "fs";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch, url }) => {
    const metadata = readFileSync(`static/images/${params.slug}/metadata.json`);
    const dataJson = JSON.parse(metadata.toString());

    return {
        image: {
            description: dataJson["description"],
            model: dataJson["model"],
            make: dataJson["make"],
            time: dataJson["time"],
            iso: dataJson["iso"],
            rawImage: dataJson["unedited"],
            exposure: dataJson["exposure"],
            focalLength: dataJson["focal-length"],
            aperature: dataJson["aperature"]
        }
    };
};
