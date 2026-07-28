import { error } from "@sveltejs/kit";
import { readFileSync } from "fs";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch, url }) => {
    try {
        var metadata = readFileSync(`static/images/${params.slug}/metadata.json`);
    } catch (err) {
        throw error(404, "Image not found");
    }
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
