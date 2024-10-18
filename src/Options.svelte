<script lang="ts">
    /// <reference types="chrome"/>
    import { onMount } from 'svelte';
    import Slider from './components/Slider.svelte';

    let wordsPerMinute = 400;
    let minWords = 10;
    let chromeApiAvailable = false;

    onMount(() => {
        console.log('Options component mounted');
        chromeApiAvailable = typeof chrome !== 'undefined' && 
                             chrome.storage !== undefined && 
                             chrome.storage.sync !== undefined;
        console.log('Chrome API available:', chromeApiAvailable);

        if (chromeApiAvailable) {
            // Load saved settings from storage
            chrome.storage.sync.get(['wordsPerMinute', 'minWords'], (result) => {
                console.log('Chrome storage get result:', result);
                wordsPerMinute = result.wordsPerMinute || 400;
                minWords = result.minWords || 10;
            });
        } else {
            console.error('Chrome storage API not available');
        }
    });

    function saveSettings() {
        console.log('Saving settings:', { wordsPerMinute, minWords });
        if (chromeApiAvailable) {
            chrome.storage.sync.set({ wordsPerMinute, minWords }, () => {
                console.log('Settings saved successfully');
            });
        } else {
            console.error('Unable to save settings: Chrome storage API not available');
        }
    }

    function handleWordsPerMinuteChange(newValue: number) {
        wordsPerMinute = newValue;
        saveSettings();
    }

    function handleMinWordsChange(newValue: number) {
        minWords = newValue;
        saveSettings();
    }
</script>

<main>
    <h1>Speed Reader Options</h1>

    <Slider
        label="Words per minute"
        min={100}
        max={1000}
        step={10}
        value={wordsPerMinute}
        onChange={handleWordsPerMinuteChange}
    />

    <Slider
        label="Minimum words to activate"
        min={5}
        max={50}
        step={1}
        value={minWords}
        onChange={handleMinWordsChange}
    />
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        text-align: center;
        color: #333;
    }
</style>
