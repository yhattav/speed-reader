
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
    import BeforeText from './BeforeText.svelte';
    import CenterText from './CenterText.svelte';
    import AfterText from './AfterText.svelte';
  
    export let before = '';
    export let center = '';
    export let after = '';
    export let isReading = false;
    export let textSize = 24;
    $: console.log('textSize text', textSize);
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
