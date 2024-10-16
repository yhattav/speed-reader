<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
  
    function handleClick() {
      dispatch('click');
    }
  </script>
  
  <div class="speed-reader-popup" on:click={handleClick}>
    <slot></slot>
  </div>
  
  <style>
    .speed-reader-popup {
      /* position: fixed; */
      z-index: 9999;
      padding: 10px;
      width: 300px;
      height: 100px;
      font-family: Arial, sans-serif;
      font-size: 24px;

      /* background-color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(8px); */
      /* From https://css.glass */
background: rgba(250, 250, 250, 0.86);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(6.9px);
-webkit-backdrop-filter: blur(6.9px);
border: 1px solid rgba(250, 250, 250, 0.5);
      cursor: pointer;
    }
  </style>