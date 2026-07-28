import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    if (params.slug === "me") {
        throw error(500, "Internal server error");
    }

    return {
        yearOfLinuxDesktop: 9999
    };
};
