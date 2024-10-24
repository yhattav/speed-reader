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
    import { createEventDispatcher, onMount } from 'svelte';
    import BackslashLogo from './BackslashLogo.svelte';
    import ProgressBar from './ProgressBar.svelte';
    export let isExpanded = false;
    export let offsetColor = '255, 69, 0'; // Default to orange-red
    export let onPopupIn: () => void;
    
    export let progress = 0;
    
    const dispatch = createEventDispatcher();

    onMount(() => {
      console.log('Popup component mounted');
    });

    $: {
      console.log('Popup isExpanded changed:', isExpanded);
    }

    $: backgroundColor = isExpanded ? `rgba(250, 250, 250, 0.86)` : `rgba(0, 0, 0, 0.5)`;

    function handleClick() {
      console.log('Popup clicked');
      dispatch('click');
    }

    function handleMouseEnter() {
      console.log('Popup mouse enter');
      onPopupIn();
    }

</script>

<div 
    class="speed-reader-popup" 
    class:expanded={isExpanded} 
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    style="--background-color: {backgroundColor};"
>
  <div class="logo-container left lower-content-level">
    <BackslashLogo {isExpanded} {offsetColor} position="left" />
  </div>
  {#if isExpanded}
    <div class="content content-level">
      <slot></slot>
    </div>
    <div class="progress-bar-container decoration-level">
      <ProgressBar {progress} />
    </div>
  {/if}
  <div class="logo-container right lower-content-level">
    <BackslashLogo {isExpanded} {offsetColor} position="right" />
  </div>
  <div class="popup-background"> 
  </div>
</div>

<style>
  .speed-reader-popup {
    z-index: 9999;
    font-family: Arial, sans-serif;
    background: var(--background-color);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    /* border: 1px solid rgba(250, 250, 250, 0.5); */
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    position: relative;
    overflow: hidden;
  }

  .popup-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(6.9px);
    -webkit-backdrop-filter: blur(6.9px);
  }


  .decoration-level {
    z-index: 0;
  }

  .lower-content-level {
    z-index: 1;
  }
  .content-level {
    z-index: 2;
  }

  .speed-reader-popup:not(.expanded) {
    width: 30px;
    height: 30px;
    border-radius: 5%;
    padding: 0;
    overflow: visible;
  }

  .speed-reader-popup.expanded {
    width: 300px;
    height: 100px;
    border-radius: 16px;
    padding: 10px;
    font-size: 24px;
  }

  .logo-container {
    width: 10px;
    height: 100%;
    flex-shrink: 0;
    position: absolute;
    overflow: visible;
  }

  /* .speed-reader-popup:not(.expanded) .logo-container {
    top: 2.5px;
  } */

  .speed-reader-popup .logo-container {
    width: 40px;
    height: 100%;
  }

  .speed-reader-popup .logo-container.left {
    left: -10px;
  }

  .speed-reader-popup .logo-container.right {
    right: -10px;
  }

  .content {
    flex-grow: 1;
    margin: 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .progress-bar-container {
    width: 100%;
    bottom: 0;
    opacity: 0.8;
    position: absolute;
    height: 5px;
    transform: translateZ(-10px);
  }
</style>
