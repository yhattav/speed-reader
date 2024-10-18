
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
<script lang="ts">
    /// <reference types="chrome"/>
    import { onMount } from 'svelte';
    import Slider from './components/Slider.svelte';

    let wordsPerMinute = 400;
    let minWords = 10;
    let textSize = 24; // Default text size
    let chromeApiAvailable = false;

    onMount(() => {
        console.log('Options component mounted');
        chromeApiAvailable = typeof chrome !== 'undefined' && 
                             chrome.storage !== undefined && 
                             chrome.storage.sync !== undefined;
        console.log('Chrome API available:', chromeApiAvailable);

        if (chromeApiAvailable) {
            // Load saved settings from storage
            chrome.storage.sync.get(['wordsPerMinute', 'minWords', 'textSize'], (result) => {
                console.log('Chrome storage get result:', result);
                wordsPerMinute = result.wordsPerMinute || 400;
                minWords = result.minWords || 10;
                textSize = result.textSize || 24;
            });
        } else {
            console.error('Chrome storage API not available');
        }
    });

    function saveSettings() {
        console.log('Saving settings:', { wordsPerMinute, minWords, textSize });
        if (chromeApiAvailable) {
            chrome.storage.sync.set({ wordsPerMinute, minWords, textSize }, () => {
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

    function handleTextSizeChange(newValue: number) {
        textSize = newValue;
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

    <Slider
        label="Text size"
        min={12}
        max={36}
        step={1}
        value={textSize}
        onChange={handleTextSizeChange}
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
