import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const basePath: string = "/images/" + params.slug;
    const metadataPath: string = basePath + "/metadata.json";

    const response = await fetch(metadataPath);
    const responseJson = await response.json();

    return {
        image: {
            description: responseJson["description"],
            model: responseJson["model"],
            make: responseJson["make"],
            time: responseJson["time"],
            iso: responseJson["iso"],
            rawImage: responseJson["unedited"],
            exposure: responseJson["exposure"],
            focalLength: responseJson["focal-length"],
            aperature: responseJson["aperature"]
        }
    };
};
