<script>
    import { createEventDispatcher, onMount } from 'svelte';
    
    export let isExpanded = false;
    
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
  <slot></slot>
</div>

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

  :global(.expanded .paragraph-highlight) {
    box-shadow: 0 0 0 3px rgba(var(--offsetColor), 0.2);
    border-radius: 2px;
  }
</style>
