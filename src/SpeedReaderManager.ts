import SpeedReader from './SpeedReader.svelte';
import { debounce, isOverElement } from './utils';
import { splitWords } from './utils/stringUtils';
import { writable } from 'svelte/store';
import { APP_CONSTANTS, DEFAULT_SETTINGS, ANIMATION_DURATIONS } from './readerConfig';
//import './global.css';

export const speedReaderState = writable({
  isExpanded: false,
  currentWord: '',
  progress: 0,
  isOverPopup: false,
});

export class SpeedReaderManager {
    private speedReader: SpeedReader | null = null;
    private currentElement: HTMLElement | null = null;
    private speedReaderDiv: HTMLDivElement | null = null;
    private lastMousePosition = { x: 0, y: 0 };
    private removalTimeout: number | null = null;
    private settings: typeof DEFAULT_SETTINGS;
    private debouncedHandleParagraphLeave: () => void;
    private blurBackground: boolean = false;

    constructor() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.loadSettings();
        this.debouncedHandleParagraphLeave = debounce(this.handleParagraphLeave.bind(this), 100);
    }

    public handleMouseMove(e: MouseEvent): void {
        // Update the position where the mouse stopped
        this.lastMousePosition = { x: e.clientX, y: e.clientY };

        // Check if the mouse is over the current paragraph
        const isOverCurrentParagraph = this.currentElement && isOverElement(this.currentElement, e) || this.isOverPopup();
        if (!isOverCurrentParagraph) {
            this.initiatePopupRemoval();
        } else if (!this.isOverPopup()) {
            // Update position when mouse moves inside the paragraph
            this.updateSpeedReaderPosition();
        }

        const target = e.target as HTMLElement;
        
        if (target.tagName === 'P' && target.textContent) {
            const words = splitWords(target.textContent);
            if (words.length >= this.settings.MIN_WORDS) {
                this.debouncedShowPopup(target, words);
            }
        } 
    }

    public updateSettings(changes: Record<string, any>): void {
        for (const [key, value] of Object.entries(changes)) {
            if (key in this.settings) {
                this.settings[key] = value;
            }
            if (key === 'blurBackground') {
                this.blurBackground = value;
            }
        }
        if (this.speedReader) {
            this.speedReader.$set({ 
                wordsPerMinute: this.settings.WORDS_PER_MINUTE, 
                textSize: this.settings.TEXT_SIZE 
            });
        }
    }

    public cleanup(): void {
        this.hidePopup('cleanup');
    }

    private loadSettings(): void {
        chrome.storage.sync.get(['wordsPerMinute', 'minWords', 'textSize', 'blurBackground'], (result) => {
            this.settings.WORDS_PER_MINUTE = result.wordsPerMinute || DEFAULT_SETTINGS.WORDS_PER_MINUTE;
            this.settings.MIN_WORDS = result.minWords || DEFAULT_SETTINGS.MIN_WORDS;
            this.settings.TEXT_SIZE = result.textSize || DEFAULT_SETTINGS.TEXT_SIZE;
            this.blurBackground = result.blurBackground || false;
        });
    }

    private showPopup(target: HTMLElement, words: string[]): void {
        console.log('showPopup called');
        this.stopRemovalCountdown('because im showing popup');

        // Check if we're already on the same paragraph
        if (this.currentElement === target) {
            console.log('Already on the same paragraph, not recreating SpeedReader');
            return;
        }

        // If we have an existing SpeedReader, destroy it
        if (this.speedReader) {
            console.log('Destroying existing SpeedReader');
            this.speedReader.$destroy();
            this.speedReader = null;
        }

        // Remove highlight from previous paragraph
        if (this.currentElement && this.currentElement !== target) {
            this.currentElement.classList.remove('paragraph-highlight', 'expanded');
        }

        this.currentElement = target;

        if (!this.speedReaderDiv) {
            this.speedReaderDiv = document.createElement('div');
            this.speedReaderDiv.classList.add('speed-reader-div');
            document.body.parentNode?.insertBefore(this.speedReaderDiv, document.body.nextSibling);
        }

        target.classList.add('paragraph-highlight');

        this.speedReader = new SpeedReader({
            target: this.speedReaderDiv,
            props: {
                words: words,
                wordsPerMinute: this.settings.WORDS_PER_MINUTE,
                textSize: this.settings.TEXT_SIZE,
                isExpanded: false,
                offsetColor: '255, 69, 0',
                onPopupIn: () => this.popupIn(),
                onPopupOut: () => this.popupOut()
            }
        });

        console.log('SpeedReader component created:', this.speedReader);

        this.positionSpeedReader();

        target.addEventListener('mouseleave', () => this.debouncedHandleParagraphLeave());
    }

    private hidePopup(reason: string): void {
        console.log('hidePopup called', { reason });
        if (this.speedReader) {
            this.speedReader.$destroy();
            this.speedReader = null;
        }
        if (this.speedReaderDiv) {
            this.speedReaderDiv.remove();
            this.speedReaderDiv = null;
        }
        if (this.currentElement) {
            this.currentElement.classList.remove('paragraph-highlight', 'expanded');
            this.currentElement = null;
        }
        this.removalTimeout = null;
    }

    private expandSpeedReader(): void {
        console.log('Expanding SpeedReader');
        if (this.speedReader && this.speedReaderDiv) {
            this.speedReader.$set({ isExpanded: true });
            if (this.currentElement) {
                this.currentElement.classList.add('expanded');
            }
            console.log('blurBackground:', this.blurBackground);
            if (this.blurBackground) {
                this.toggleBackgroundBlur(true);
            }
        }
    }

    private shrinkSpeedReader(): void {
        console.log('Shrinking SpeedReader');
        if (this.speedReader && this.speedReaderDiv) {
            this.speedReaderDiv.style.width = `${APP_CONSTANTS.SMALL_SIZE}px`;
            this.speedReaderDiv.style.height = `${APP_CONSTANTS.SMALL_SIZE}px`;
            this.speedReader.$set({ isExpanded: false });
            if (this.currentElement) {
                this.currentElement.classList.remove('expanded');
            }
            this.toggleBackgroundBlur(false);
        }
    }

    private popupIn(): void {
        console.log('Popup in');
        speedReaderState.update(state => ({
            ...state,
            isExpanded: true,
            isOverPopup: true,
        }));
        this.expandSpeedReader();
    }

    private popupOut(): void {
        console.log('Popup out');
        speedReaderState.update(state => ({
            ...state,
            isOverPopup: false,
        }));
        this.shrinkSpeedReader();
    }

    private handleParagraphLeave(): void {
        console.log('Paragraph left (debounced)', ' isOverPopup:', this.isOverPopup());
        if (!this.isOverPopup()) {
            this.initiatePopupRemoval();
        }
    }

    private isOverPopup(): boolean {
        let isOver = false;
        speedReaderState.update(state => {
            isOver = state.isOverPopup;
            return state;
        });
        console.log('isOverPopup:', isOver);
        return isOver;
    }

    private initiatePopupRemoval(): void {
        console.log('Initiating popup removal');
        this.stopRemovalCountdown('because im starting a new one');
        this.removalTimeout = window.setTimeout(() => this.hidePopup('timeout'), APP_CONSTANTS.HIDE_DELAY);
    }

    private stopRemovalCountdown(reason: string): void {
        console.log('Stopping removal countdown:', { reason });
        if (this.removalTimeout !== null) {
            clearTimeout(this.removalTimeout);
            this.removalTimeout = null;
        }
    }

    private updateSpeedReaderPosition(): void {
        console.log('Updating speed reader position');
        if (this.speedReaderDiv) {
            const left = this.lastMousePosition.x + APP_CONSTANTS.CURSOR_OFFSET_X;
            const top = this.lastMousePosition.y + APP_CONSTANTS.CURSOR_OFFSET_Y;

            // Calculate the distance moved
            const dx = left - parseFloat(this.speedReaderDiv.style.left);
            const dy = top - parseFloat(this.speedReaderDiv.style.top);
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only update position if moved more than 5 pixels (adjust as needed)
            if (distance > APP_CONSTANTS.MIN_DISTANCE_TO_MOVE) {
                // Add 'moving' class before updating position
                this.speedReaderDiv.classList.add('moving');

                this.setSpeedReaderPosition(left, top);

                // Remove 'moving' class after animation completes
                setTimeout(() => {
                    this.speedReaderDiv?.classList.remove('moving');
                }, ANIMATION_DURATIONS.POPUP_MOVEMENT); // matches the transition duration
            }
        }
    }

    private setSpeedReaderPosition(left: number, top: number): void {
        if (this.speedReaderDiv) {
            this.speedReaderDiv.style.left = `${Math.max(0, left)}px`;
            this.speedReaderDiv.style.top = `${Math.max(0, top)}px`;
            this.speedReaderDiv.style.transition = `left ${ANIMATION_DURATIONS.POPUP_MOVEMENT}ms ease-in, top ${ANIMATION_DURATIONS.POPUP_MOVEMENT}ms ease-in`;
        }
    }

    private positionSpeedReader(): void {
        if (this.speedReaderDiv) {
            const left = this.lastMousePosition.x + APP_CONSTANTS.CURSOR_OFFSET_X;
            const top = this.lastMousePosition.y + APP_CONSTANTS.CURSOR_OFFSET_Y;
            this.setSpeedReaderPosition(left, top);
            this.speedReaderDiv.style.position = 'fixed';
            this.speedReaderDiv.style.overflow = 'visible';
            this.speedReaderDiv.style.transition = `width ${ANIMATION_DURATIONS.POPUP_MOVEMENT}ms, height ${ANIMATION_DURATIONS.POPUP_MOVEMENT}ms, left ${ANIMATION_DURATIONS.POPUP_MOVEMENT}ms ease-in, top ${ANIMATION_DURATIONS.POPUP_MOVEMENT}ms ease-in`;
        }
    }

    private debouncedShowPopup = debounce((target: HTMLElement, words: string[]) => {
        this.showPopup(target, words);
    }, APP_CONSTANTS.SHOW_DELAY);

    private toggleBackgroundBlur(blur: boolean): void {
        if (blur) {
            document.body.style.filter = 'blur(3px)';
            
            document.body.style.transition = `filter ${ANIMATION_DURATIONS.BACKGROUND_BLUR}ms ease-in`;

        } else {
            document.body.style.filter = 'none';
        }
    }

    handleScroll(e: Event): void {
        console.log('Scroll event detected');
        this.hidePopup('scroll')
        // Placeholder for scroll handling logic
    }
}
