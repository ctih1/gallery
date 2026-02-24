<script lang="ts">
    let iframeElement: HTMLIFrameElement | undefined = $state();

    function restart() {
        if (!iframeElement) return;
        iframeElement.contentWindow!.location.reload();
    }
</script>

<h1>This is a little game I made with Rust (macroquad)</h1>
<p><a href="https://github.com/ctih1/bouncy-ball">Source code is available here</a></p>

<p>Basically:</p>
<ul>
    <li>don't hit enemy</li>
    <li>pink moves towards you</li>
    <li>red moves in a horizontal line</li>
    <li>touching the wall will deduct points</li>
    <li>dying is real</li>
</ul>

<button onclick={_ => restart()}>restart</button>
<iframe
    bind:this={iframeElement}
    src="/games/bouncy-ball/iframe"
    width="600"
    height="800"
    title="The game"
></iframe>
