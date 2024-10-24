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

import { SpeedReaderManager } from './SpeedReaderManager';
import { debounce, throttle } from './utils'; // Import throttle instead of debounce
import { APP_CONSTANTS } from './readerConfig';

const speedReaderManager = new SpeedReaderManager();

function handleMouseMove(e: MouseEvent): void {
    console.log('Mouse move event detected');
    speedReaderManager.handleMouseMove(e);
}

const debouncedHandleMouseMove = debounce(handleMouseMove, 100);

document.addEventListener('mousemove', debouncedHandleMouseMove);

function handleScroll(e: Event): void {
    speedReaderManager.handleScroll(e);
}

const throttledHandleScroll = throttle(handleScroll, APP_CONSTANTS.SCROLL_THROTTLE_TIME, { leading: true, trailing: false });

document.addEventListener('scroll', throttledHandleScroll);

// Clean up
window.addEventListener('unload', () => {
    document.removeEventListener('mousemove', debouncedHandleMouseMove);
    document.removeEventListener('scroll', throttledHandleScroll);
    speedReaderManager.cleanup();
});

// Listen for changes in chrome storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        speedReaderManager.updateSettings(changes);
    }
});

console.log('Content script loaded');
