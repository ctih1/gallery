<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    let word: string = $state("");
    let outputWord: string = $state("");
    let outputDone: boolean = $state(false);
    let outputFinishedIn: number = 0;

    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    const WORD_MAP = {
        a: "wordle",
        b: "xpsemf",
        c: "yqtfng",
        d: "zrugoh",
        e: "asvhpi",
        f: "btwiqj",
        g: "cuxjrk",
        h: "dvyksl",
        i: "ewzltm",
        j: "fxamun",
        k: "gybnvo",
        l: "hzcowp",
        m: "iadpxq",
        n: "jbeqyr",
        o: "kcfrzs",
        p: "ldgsat",
        q: "mehtbu",
        r: "nfiucv",
        s: "ogjvdw",
        t: "phkwex",
        u: "qilxfy",
        v: "rjmygz",
        w: "sknzha",
        x: "tloaib",
        y: "umpbjc",
        z: "vnqckd"
    };

    function encodeString(val: string): string {
        let newString = "";

        let currentIndex = 0;
        for (let char of val.split("")) {
            // @ts-expect-error
            newString += WORD_MAP[char][currentIndex];

            let newValue = currentIndex + 1;

            if (newValue >= 6) {
                newValue = 0;
            }

            currentIndex = newValue;
        }

        return newString;
    }

    function startProcess() {
        console.log("Starting cracking process");
        let start = new Date();

        let currentIndex = 0;
        let currentString = "";

        while (true) {
            const testLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            const guess = currentString + testLetter;

            if (encodeString(guess)[currentIndex] == word[currentIndex]) {
                currentString += testLetter;
                currentIndex++;
            }

            if (currentIndex >= word.length) {
                break;
            }
        }

        console.log("Cracking process done");

        outputFinishedIn = (new Date().getTime() - start.getTime()) / 1000;
        outputWord = currentString;
        outputDone = true;
    }
</script>

<h1>Custom worlde descrambler</h1>
<p class="text-3xl font-semibold">Unscrambles words from mywordle.strivemath.com</p>
<hr class="mb-6 opacity-40" />

<Input bind:value={word} label="encoded word (text after /?word=)" />

<button
    class="mt-4 rounded-xl bg-blue-500 p-2 pr-4 pl-4 active:bg-blue-600"
    onclick={_ => startProcess()}>Start cracking!</button
>

{#if outputDone}
    <h2 class="mt-4 max-w-full wrap-break-word!">The word is "{outputWord}"</h2>
    <p class="text-wrap">({outputWord})</p>
    <p>Calculated in {outputFinishedIn}s</p>
{/if}
<h2 class="mt-16!">How does it work?</h2>
<p>strivemath uses quite a clever approach to hiding their word. They combine multiple words!</p>
<p>
    Now what does that mean? Well, strivemath has associated each letter with a combination of
    letters.
</p>
<p>
    For exampe, <b
        >if you create a wordle "AAAAAA", you'll see that the url contains <code>?word=worlde</code
        ></b
    >, this is because the letter "A" has been assigned the letters W,O,R,D,L,E
</p>
<p>
    Each letter has a combination of letters like this. Now the question is, "how does the word
    length match?"
</p>
<p>They use indices!</p>

<p>here's a diagram on how it works:</p>
<img alt="Diagram of how strivemath algorithm works" src="/misc/strivemath.png" />

<p>A really simple code implementation would look like this:</p>
<pre>
    <code>
        <span>guess = ""</span>
        <span>current_solving = 0</span>
        <span>while True:</span>
        <span>    if encode(guess + random_letter)[current_solving] == secret[current_solving]:</span
        >
        <span>        guess += random_letter</span>
        <span>        current_solving++</span>
        <span>    if len(guess) == len(secret): break</span>
        <span>print(guess)</span>
    </code>
</pre>

<p>
    if you want to see the full example, <a
        href="https://github.com/ctih1/gallery/blob/master/src/routes/tools/custom-wordle-descrambler/%2Bpage.svelte"
        >here's the source code for this page</a
    >
</p>
