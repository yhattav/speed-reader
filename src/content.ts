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
import { throttle } from './utils';

const speedReaderManager = new SpeedReaderManager();

function handleMouseMove(e: MouseEvent): void {
    speedReaderManager.handleMouseMove(e);
}

const throttledHandleMouseMove = throttle(handleMouseMove, 100);

document.addEventListener('mousemove', throttledHandleMouseMove);

// Clean up
window.addEventListener('unload', () => {
    document.removeEventListener('mousemove', throttledHandleMouseMove);
    speedReaderManager.cleanup();
});

// Listen for changes in chrome storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        speedReaderManager.updateSettings(changes);
    }
});

console.log('Content script loaded');
