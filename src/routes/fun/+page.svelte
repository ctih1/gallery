<script lang="ts">
</script>

{#snippet Link(link: string)}
    <a href={link}>{link}</a>
{/snippet}

<h1>Some fun stuff</h1>

<h2>hacky stuff</h2>
<p>Sitemap: {@render Link("/sitemap.xml")}</p>
<p>Background grain test: {@render Link("/tools/testing")}</p>

<h2>games</h2>
<p>Some of the little games I've made.</p>
<ul>
    <li>Account creation sim: {@render Link("/games/account-creation")}</li>
    <li>Bouncy ball: {@render Link("/games/bouncy-ball")}</li>
    <li>Phone charging sim: {@render Link("/games/phone-charging-sim")}</li>
    <li>Numeropeli: {@render Link("https://ctih1.github.io/aleksiope-numeropeli/")}</li>
    <li>Ufopeli: {@render Link("https://github.com/ctih1/Ufopeli")}</li>
</ul>

<h2>EFIs</h2>
<p>These are some of the EFIs I've made for my machines</p>

<ul>
    <li>
        <a href="https://github.com/ctih1/Asus-H81M-Plus-EFI">Monterey, GT 1030, i7-4770, H81M-D</a>
    </li>
    <li>
        <a href="https://github.com/ctih1/Dell-Latitude-E6220-EFI"
            >Dell Latitude E6220, Catalina, i7-2640m, 8GB DDR3, Intel HD 3000</a
        >
    </li>
</ul>

<h2>misc stuff</h2>
<p>Desktop thing: {@render Link("https://desktop.arr.ovh")}</p>
<p>some random maps {@render Link("/maps")}</p>
<p>insane song:</p>
<audio src="/misc/MU1_own_song.mp3" controls></audio>

<p>planned background image: <img src="/bg-tile.png" alt="squiggly lines thing" /></p>
