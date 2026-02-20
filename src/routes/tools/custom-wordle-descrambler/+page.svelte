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
    <h2 class="mt-4">The word is "{outputWord}"</h2>
    <p class="text-wrap">({outputWord})</p>
    <p>Calculated in {outputFinishedIn}s</p>
{/if}
