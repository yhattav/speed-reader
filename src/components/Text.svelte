<script lang="ts">
    import BeforeText from './BeforeText.svelte';
    import CenterText from './CenterText.svelte';
    import AfterText from './AfterText.svelte';
  
    export let before = '';
    export let center = '';
    export let after = '';
    export let isReading = false;
    export let textSize = 24;
</script>
  
<div class="speed-reader-content" style="--text-size: {textSize}px;">
  <div class="speed-reader-line"></div>
  {#if isReading || (center && center !== 'Click to start')}
    <BeforeText {before} />
    <CenterText {center} />
    <AfterText {after} />
  {:else}
    <CenterText center="Click to start" />
  {/if}
</div>
  
<style>
  .speed-reader-content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: var(--text-size);
  }
  
  .speed-reader-line {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>
