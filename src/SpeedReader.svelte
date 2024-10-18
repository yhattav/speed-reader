
<script lang="ts">
  /* Copyright 2024 Yonatan Hattav
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. */
  import { onMount, onDestroy } from 'svelte';
  import Popup from './components/Popup.svelte';
  import Text from './components/Text.svelte';
  import ProgressBar from './components/ProgressBar.svelte';

  export let words = [];
  export let wordsPerMinute = 400;
  export let isExpanded = false;
  export let offsetColor = '255, 69, 0'; // Default to orange-red
  export let textSize = 24;
  $: console.log('textSize text', textSize);


  let currentWord = { before: '', center: '', after: '' };
  let progress = 0;
  let isReading = false;
  let wordIndex = 0;

  let interval;

  let showContent = false;
  let expandTransitionDuration = 300; // in milliseconds, adjust as needed

  onMount(() => {
    console.log('SpeedReader component mounted');
  });

  $: {
    if (isExpanded) {
      setTimeout(() => {
        showContent = true;
      }, expandTransitionDuration);
    } else {
      showContent = false;
    }
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

<Popup {isExpanded} {offsetColor} on:click={handleClick}>
  {#if showContent}
    <Text
      before={currentWord.before}
      center={currentWord.center}
      after={currentWord.after}
      {isReading}
      {textSize}
    />
    <ProgressBar {progress} />
  {/if}
</Popup>

<style>
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .content-wrapper.fade-in {
    opacity: 1;
  }

  :global(.paragraph-highlight) {
    transition: box-shadow 0.3s ease;
  }

  :global(.paragraph-highlight.expanded) {
    box-shadow: 0 0 0 3px rgba(var(--offsetColor), 0.2);
    border-radius: 2px;
  }
</style>
