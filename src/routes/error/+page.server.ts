import type { PageServerLoad } from "./$types";
export const csr = false;
export const prerender = false;

const NOT_FOUND_TEXTS: string[][] = [
    [
        "<h1>My eyes are over here</h1>",
        "<p>And not at... <code>{path}</code> ?</p><p>What were you even trying to do bruh...</p>"
    ],
    [
        "<h1>Not found</h1>",
        '<p>There is no such thing as <code>{path}</code>...</p><p>If you\'re that lost, <a target="_parent" href="/sitemap.xml">here\'s a map</a></p>'
    ],
    [
        "<h1>Four-oh-no!</h1>",
        "<p>Looks like your search for <code>{path}</code> didn't lead anywhere!</p>"
    ],
    ["<h1>Not found dude</h1>", "<p>The path <code>{path}</code> ? Yeah never heard of 'er.</p>"]
];

const ERROR_TEXTS: string[][] = [
    [
        "<h1>OOPSIE WOOPSIE!!</h1>",
        "<p>Uwu We made a fucky wucky!! A wittle fucko bongo! The code monkeys at our headquarters are working VEWY HAWD to fix this! </p>"
    ],
    [
        "<h1>We messed up.</h1>",
        "<p>We sincerely apologize for completely messing up your experience. We dropped the ball, and we take full responsibility for the issues we caused. We are sorry for the frustration and extra work this created, and we'll do better moving forward.</a></p>" // By AI ChatGPT
    ],
    [
        "<h1>Well this is awkward owo</h1>",
        "<p>Seems like our state-of-the-art high-performance and high-availabiltiy servers have let us down!</p>"
    ],
    [
        "<h1>Yup that's it gg</h1>",
        "<p>You CRASHED my lovely Orange Pi! You should be ashamed of yourself..</p>"
    ],
    [
        "<h1>my bad twin</h1>",
        "<p>Looks like my code wasn't as bulletproof as it seemed... We test things in production around here you know how it is</p>"
    ],
    [
        "<h1>Ope!</h1>",
        "<p>Our server is doing a little bit of unplanned team-building right now! 📉✨</p>" // By AI Google Gemini AI search thing
    ]
];

export const load: PageServerLoad = async ({ params, url }) => {
    const status = Number(url.searchParams.get("code")) ?? 500;

    const targetArray = status === 404 ? NOT_FOUND_TEXTS : ERROR_TEXTS;
    const targetText = targetArray[Math.floor(Math.random() * targetArray.length)];
    return {
        status: status,
        message: url.searchParams.get("message"),
        originalPath: url.searchParams.get("path"),
        targetText: targetText
    };
};
