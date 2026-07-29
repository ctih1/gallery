import { building } from "$app/environment";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
    if (!building) {
        throw error(500, "Internal server error");
    }

    return {
        yearOfLinuxDesktop: 9999
    };
};
