<script lang="ts">
    let {
        tick,
        nextDate
    }: {
        tick: number;
        nextDate: Date;
    } = $props();
</script>

<span class="font-[JetBrains-Mono]!">
    {#key tick}
        {(Math.round((nextDate.getTime() - new Date().getTime()) / 100) / 10).toFixed(
            1
        )}s{/key}</span
>
