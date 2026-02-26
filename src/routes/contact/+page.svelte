<script lang="ts">
    import Input from "$lib/components/Input.svelte";

    let message = $state("");
    let contact = $state("");

    let loading = $state(false);
    let success = $state(false);
    let sent = $state(false);

    function sendMessage() {
        sent = true;
        fetch("https://mail.koti.frii.site", {
            method: "POST",
            body: JSON.stringify({ msg: message, contact: contact }),
            mode: "no-cors"
        }).then(async res => {
            success = true;
            loading = false;
        });
    }
</script>

<h1>How to contact me</h1>

<p>
    You can either send me a message on Discord (@ctih), or use the form below! (I promise I'll try
    to respond quickly)
</p>

<div class="mt-8 max-w-xl">
    <Input bind:value={message} label="message" placeholder="Lets be friends!" />
    <Input
        bind:value={contact}
        label="how to contact you"
        placeholder="Shoot me an email me@gmail.com"
    />

    <button
        class="mt-2 w-32 rounded-xl bg-blue-600 p-1 hover:bg-blue-500"
        onclick={_ => sendMessage()}
    >
        {#if loading}
            Sending..
        {/if}
        {#if !loading}
            {#if sent}
                {success ? "Sent succesfully!" : "Failed to send :("}
            {:else}
                Send
            {/if}
        {/if}
    </button>
</div>

<p>Note: please don't spam as I didn't implement a rate limit</p>
