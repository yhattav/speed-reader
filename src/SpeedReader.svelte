<script>
  import { onMount, onDestroy } from 'svelte';
  import Popup from './components/Popup.svelte';
  import Text from './components/Text.svelte';
  import ProgressBar from './components/ProgressBar.svelte';

  export let words = [];
  export let wordsPerMinute = 400;
  export let isExpanded = false;

  let currentWord = { before: '', center: '', after: '' };
  let progress = 0;
  let isReading = false;
  let wordIndex = 0;

  let interval;

  onMount(() => {
    console.log('SpeedReader component mounted');
  });

  $: {
    console.log('isExpanded changed:', isExpanded);
  }

  function splitWord(word) {
    const length = word.length;
    const centerIndex = Math.floor((length - 1) / 2);
    return {
      before: word.slice(0, centerIndex),
      center: word[centerIndex],
      after: word.slice(centerIndex + 1)
    };
  }

  function startReading() {
    console.log('startReading called');
    isReading = true;
    wordIndex = 0;
    interval = setInterval(() => {
      if (wordIndex < words.length) {
        currentWord = splitWord(words[wordIndex]);
        progress = ((wordIndex + 1) / words.length) * 100;
        wordIndex++;
      } else {
        stopReading();
        currentWord = { before: '', center: 'Finished', after: '' };
      }
    }, 60000 / wordsPerMinute);
  }

  function stopReading() {
    console.log('stopReading called');
    isReading = false;
    clearInterval(interval);
  }

  function handleClick() {
    console.log('handleClick called');
    if (isExpanded) {
      if (isReading) {
        stopReading();
      } else {
        startReading();
      }
    }
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
    console.log('SpeedReader component destroyed');
  });
</script>

<Popup {isExpanded} on:click={handleClick}>
  {#if isExpanded}
    <Text 
      before={currentWord.before}
      center={currentWord.center}
      after={currentWord.after}
      {isReading}
    />
    <ProgressBar {progress} />
  {:else}
    <div class="small-icon">SR</div>
  {/if}
</Popup>

<style>
  .speed-reader-popup {
    z-index: 9999;
    font-family: Arial, sans-serif;
    background: rgba(250, 250, 250, 0.86);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(6.9px);
    -webkit-backdrop-filter: blur(6.9px);
    border: 1px solid rgba(250, 250, 250, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .speed-reader-popup:not(.expanded) {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    padding: 0;
  }

  .speed-reader-popup.expanded {
    width: 300px;
    height: 100px;
    border-radius: 16px;
    padding: 10px;
    font-size: 24px;
  }

  :global(.paragraph-highlight) {
    transition: box-shadow 0.3s ease;
  }

  :global(.paragraph-highlight.expanded) {
    box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.2);
    border-radius: 2px;
  }
</style>
