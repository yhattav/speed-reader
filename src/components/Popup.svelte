<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import BackslashLogo from './BackslashLogo.svelte';
    
    export let isExpanded = false;
    export let offsetColor = '255, 69, 0'; // Default to orange-red
    
    const dispatch = createEventDispatcher();

    onMount(() => {
      console.log('Popup component mounted');
    });

    $: {
      console.log('Popup isExpanded changed:', isExpanded);
    }

    function handleClick() {
      console.log('Popup clicked');
      dispatch('click');
    }
</script>

<div class="speed-reader-popup" class:expanded={isExpanded} on:click={handleClick}>
  <div class="logo-container left decoration-level">
    <BackslashLogo {isExpanded} {offsetColor} position="left" />
  </div>
  {#if isExpanded}
    <div class="content content-level">
      <slot></slot>
    </div>
    {/if}
    <div class="logo-container right decoration-level">
      <BackslashLogo {isExpanded} {offsetColor} position="right" />
    </div>
</div>

<style>
  .speed-reader-popup {
    z-index: 9999;
    font-family: Arial, sans-serif;
    background: rgba(250, 250, 250, 0.86);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(6.9px);
    -webkit-backdrop-filter: blur(6.9px);
    border: 1px solid rgba(250, 250, 250, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }



  .decoration-level {
    z-index: 0;
  }
  .content-level {
    z-index: 1;
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

  .speed-reader-popup:not(.expanded) .logo-container {
    top: 2.5px;
  }

  .speed-reader-popup .logo-container {
    width: 40px;
    height: 100%;
  }

  .speed-reader-popup.expanded .logo-container.left {
    left: 0px;
  }

  .speed-reader-popup .logo-container.right {
    right: 0px;
  }

  .content {
    flex-grow: 1;
    margin: 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
