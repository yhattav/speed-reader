<script>
  import { onMount, onDestroy } from 'svelte';
  import Popup from './components/Popup.svelte';
  import Text from './components/Text.svelte';
  import ProgressBar from './components/ProgressBar.svelte';

  export let words = [];
  export let wordsPerMinute = 400;

  let currentWord = { before: '', center: '', after: '' };
  let progress = 0;
  let isReading = false;
  let wordIndex = 0;

  let interval;

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
    isReading = false;
    clearInterval(interval);
  }

  function handleClick() {
    if (isReading) {
      stopReading();
    } else {
      startReading();
    }
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<Popup on:click={handleClick}>
  <Text 
    before={currentWord.before}
    center={currentWord.center}
    after={currentWord.after}
    {isReading}
  />
  <ProgressBar {progress} />
</Popup>