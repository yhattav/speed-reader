<script>
    import { onMount } from 'svelte';

    let minWords = 10;
    let wordsPerMinute = 200;

    onMount(() => {
        // Load saved settings from chrome.storage.sync
        chrome.storage.sync.get(['minWords', 'wordsPerMinute'], (result) => {
            minWords = result.minWords || 10;
            wordsPerMinute = result.wordsPerMinute || 200;
        });
    });

    function saveSettings() {
        chrome.storage.sync.set({ minWords, wordsPerMinute }, () => {
            console.log('Settings saved');
        });
    }
</script>

<main>
    <h1>Speed Reader Options</h1>
    
    <div class="option">
        <label for="minWords">Min words to activate:</label>
        <input type="range" id="minWords" bind:value={minWords} min="1" max="50" on:change={saveSettings}>
        <span>{minWords}</span>
    </div>

    <div class="option">
        <label for="wordsPerMinute">Words per minute:</label>
        <input type="range" id="wordsPerMinute" bind:value={wordsPerMinute} min="100" max="1000" step="10" on:change={saveSettings}>
        <span>{wordsPerMinute}</span>
    </div>
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
    }

    .option {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input[type="range"] {
        width: 100%;
    }
</style>

