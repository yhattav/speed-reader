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
  import { splitWord, splitWords } from './utils/stringUtils';

  export let words = [];
  export let wordsPerMinute = 400;
  export let isExpanded = false;
  export let offsetColor = '255, 69, 0'; // Default to orange-red
  export let textSize = 24;
  export let onPopupIn: () => void;
  export let onPopupOut: () => void;


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

  export function startReading() {
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

  export function stopReading() {
    console.log('stopReading called');
    isReading = false;
    clearInterval(interval);
  }

  export function handleClick() {
    console.log('handleClick called');
    if (isExpanded) {
      if (isReading) {
        stopReading();
      } else {
        startReading();
      }
    }
  }
  function handleMouseLeave() {
      console.log('Popup mouse leave');
      onPopupOut();
    }

  onDestroy(() => {
    if (interval) clearInterval(interval);
    console.log('SpeedReader component destroyed');
  });
</script>
<div class="speed-reader" data-testid="speed-reader"     on:mouseleave={handleMouseLeave}
>
<Popup 
  {isExpanded} 
  {offsetColor} 
  {progress}
  on:click={handleClick}
  {onPopupIn}
>
  {#if showContent}
    <Text
      before={currentWord.before}
      center={currentWord.center}
      after={currentWord.after}
      {isReading}
      {textSize}
    />
  {/if}
</Popup>
</div>

<style>

  .speed-reader {
    padding: 10px;
  }

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
    box-shadow: 0 0 3px 3px rgba(var(--offsetColor), 0.2);
    border-radius: 2px;
  }

  :root {
    --offsetColor: 255, 69, 0;
  }

  :global(.speed-reader-div.moving) {
     
    pointer-events: none;
}

:global(.speed-reader-div.moving *) {
    pointer-events: none;
}
  

</style>
