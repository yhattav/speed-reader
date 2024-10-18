import SpeedReader from './SpeedReader.svelte';
import { debounce, throttle, isOverElement, splitWords, clamp } from './utils';

const HIDE_DELAY = 1000;
let MIN_WORDS = 10;
const SMALL_SIZE = 30;
const FULL_WIDTH = 300;
const FULL_HEIGHT = 100;
const SHOW_DELAY = 500;
const CURSOR_OFFSET_X = 10;
const CURSOR_OFFSET_Y = -10;
let WORDS_PER_MINUTE = 400;

let speedReader: SpeedReader | null = null;
let currentElement: HTMLElement | null = null;
let speedReaderDiv: HTMLDivElement | null = null;
let isParagraphConsideredHovered = false;
let isOverPopup = false;
let lastMousePosition = { x: 0, y: 0 };
let removalTimeout: number | null = null;

function isOverSpeedReaderOrParagraph(e: MouseEvent): boolean {
    return (speedReaderDiv && isOverElement(speedReaderDiv, e)) || (currentElement && isOverElement(currentElement, e));
}

function handleMouseMove(e: MouseEvent): void {
    console.log('Mouse moved');
  
    if (isOverPopup) {
        isParagraphConsideredHovered = true;
        stopRemovalCountdown('because im not over the paragraph');
    } else {
        console.log('Initiating popup removal');
        initiatePopupRemoval();
    }

    lastMousePosition = { x: e.clientX, y: e.clientY };
    const target = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y) as HTMLElement;
    const text = target.innerText;
    const words = text.split(/\s+/);
  
    if (words.length >= MIN_WORDS && target !== currentElement) {
        debouncedShowPopup(target, words);
    }

    if (speedReaderDiv) {
        debouncedHidePopup();
    }
}

function initiatePopupRemoval(): void {
    console.log('Initiating popup removal');
    if (removalTimeout) {
        console.log('Removal countdown already initiated');
        return;
    }
    console.log('>>>>Initiating removal countdown');
    removalTimeout = window.setTimeout(() => {
        console.log('>>>>Removal countdown complete');
        hidePopup();
    }, HIDE_DELAY);
}

function stopRemovalCountdown(reason: string): void {
    if (removalTimeout) {
        console.log('Stopping removal countdown', reason);
        clearTimeout(removalTimeout);
        removalTimeout = null;
    }
    isParagraphConsideredHovered = true;
}

function showPopup(target: HTMLElement, words: string[]): void {
    console.log('showPopup called');
    stopRemovalCountdown('because im showing popup');
    if (speedReader) {
        console.log('Destroying existing SpeedReader');
        speedReader.$destroy();
    }

    speedReaderDiv = document.createElement('div');
    document.body.appendChild(speedReaderDiv);

    target.classList.add('paragraph-highlight');

    speedReader = new SpeedReader({
        target: speedReaderDiv,
        props: {
            words: words,
            wordsPerMinute: WORDS_PER_MINUTE,
            isExpanded: false,
            offsetColor: '255, 69, 0'
        }
    });

    console.log('SpeedReader component created:', speedReader);

    positionSpeedReader();

    speedReaderDiv.addEventListener('mouseenter', () => {
        isOverPopup = true;
        isParagraphConsideredHovered = true;
        expandSpeedReader();
    });
    speedReaderDiv.addEventListener('mouseleave', handleSpeedReaderLeave);

    target.addEventListener('mouseleave', handleParagraphLeave);
}

function hidePopup(): void {
    console.log('hidePopup called');
    if (speedReader) {
        speedReader.$destroy();
        speedReader = null;
    }
    if (speedReaderDiv) {
        speedReaderDiv.remove();
        speedReaderDiv = null;
    }
    if (currentElement) {
        currentElement.classList.remove('paragraph-highlight', 'expanded');
        currentElement = null;
    }
    isParagraphConsideredHovered = false;
    removalTimeout = null;
}

const debouncedShowPopup = debounce((target: HTMLElement, words: string[]) => {
    console.log('Debounced show popup');
    currentElement = target;
    isParagraphConsideredHovered = true;
    showPopup(target, words);
}, SHOW_DELAY);

const debouncedHidePopup = debounce(() => {
    console.log('Debounced hide popup');
    if (!isParagraphConsideredHovered) {
        hidePopup();
    }
}, SHOW_DELAY);

function handleParagraphLeave(e: MouseEvent): void {
    console.log('Paragraph left');
    if (!isOverSpeedReaderOrParagraph(e)) {
        initiatePopupRemoval();
    }
}

function handleSpeedReaderLeave(e: MouseEvent): void {
    console.log('SpeedReader left');
    isOverPopup = false;
    shrinkSpeedReader();
}

function positionSpeedReader(): void {
    if (speedReaderDiv) {
        const left = lastMousePosition.x + CURSOR_OFFSET_X;
        const top = lastMousePosition.y + CURSOR_OFFSET_Y;

        speedReaderDiv.style.position = 'fixed';
        speedReaderDiv.style.left = `${Math.max(0, left)}px`;
        speedReaderDiv.style.top = `${Math.max(0, top)}px`;
        speedReaderDiv.style.width = `${SMALL_SIZE}px`;
        speedReaderDiv.style.height = `${SMALL_SIZE}px`;
        speedReaderDiv.style.overflow = 'hidden';
        speedReaderDiv.style.transition = 'width 0.3s, height 0.3s';
    }
}

function expandSpeedReader(): void {
    console.log('Expanding SpeedReader');
    if (speedReader && speedReaderDiv) {
        speedReaderDiv.style.width = `${FULL_WIDTH}px`;
        speedReaderDiv.style.height = `${FULL_HEIGHT}px`;
        speedReader.$set({ isExpanded: true });
        if (currentElement) {
            currentElement.classList.add('expanded');
        }
    }
}

function shrinkSpeedReader(): void {
    console.log('Shrinking SpeedReader');
    if (speedReader && speedReaderDiv) {
        speedReaderDiv.style.width = `${SMALL_SIZE}px`;
        speedReaderDiv.style.height = `${SMALL_SIZE}px`;
        speedReader.$set({ isExpanded: false });
        if (currentElement) {
            currentElement.classList.remove('expanded');
        }
    }
}

const throttledHandleMouseMove = throttle(handleMouseMove, 100);

document.addEventListener('mousemove', throttledHandleMouseMove);

// Clean up
window.addEventListener('unload', () => {
    document.removeEventListener('mousemove', throttledHandleMouseMove);
    hidePopup();
});

function loadSettings() {
    chrome.storage.sync.get(['minWords', 'wordsPerMinute'], (result) => {
        MIN_WORDS = result.minWords || 10;
        WORDS_PER_MINUTE = result.wordsPerMinute || 400;
        console.log('Settings loaded:', { MIN_WORDS, WORDS_PER_MINUTE });
    });
}

// Call loadSettings when the content script is injected
loadSettings();
console.log('Content script loaded');
// Listen for changes in chrome storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.minWords) {
            MIN_WORDS = changes.minWords.newValue;
        }
        if (changes.wordsPerMinute) {
            WORDS_PER_MINUTE = changes.wordsPerMinute.newValue;
        }
        console.log('Settings updated:', { MIN_WORDS, WORDS_PER_MINUTE });
    }
});
