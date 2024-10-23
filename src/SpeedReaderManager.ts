import SpeedReader from './SpeedReader.svelte';
import { debounce, isOverElement } from './utils';
import { splitWords } from './utils/stringUtils';
import { writable } from 'svelte/store';
import { APP_CONSTANTS, DEFAULT_SETTINGS } from './readerConfig';
//import './global.css';

export const speedReaderState = writable({
  isExpanded: false,
  currentWord: '',
  progress: 0,
  isOverPopup: false,
  isParagraphConsideredHovered: false,
});

export class SpeedReaderManager {
    private speedReader: SpeedReader | null = null;
    private currentElement: HTMLElement | null = null;
    private speedReaderDiv: HTMLDivElement | null = null;
    private lastMousePosition = { x: 0, y: 0 };
    private removalTimeout: number | null = null;
    private settings: typeof DEFAULT_SETTINGS;
    private debouncedHandleParagraphLeave: () => void;

    constructor() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.loadSettings();
        this.debouncedHandleParagraphLeave = debounce(this.handleParagraphLeave.bind(this), 100);
    }

    public handleMouseMove(e: MouseEvent): void {
        this.lastMousePosition = { x: e.clientX, y: e.clientY };
        const target = e.target as HTMLElement;
        
        if (target.tagName === 'P' && target.textContent) {
            const words = splitWords(target.textContent);
            if (words.length >= this.settings.MIN_WORDS) {
                this.debouncedShowPopup(target, words);
            }
        } else if (!this.isOverSpeedReaderOrParagraph()) {
            this.initiatePopupRemoval();
        }
    }

    public updateSettings(changes: Record<string, any>): void {
        for (const [key, value] of Object.entries(changes)) {
            if (key in this.settings) {
                this.settings[key] = value;
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
        this.hidePopup();
    }

    private loadSettings(): void {
        chrome.storage.sync.get(['wordsPerMinute', 'minWords', 'textSize'], (result) => {
            this.settings.WORDS_PER_MINUTE = result.wordsPerMinute || DEFAULT_SETTINGS.WORDS_PER_MINUTE;
            this.settings.MIN_WORDS = result.minWords || DEFAULT_SETTINGS.MIN_WORDS;
            this.settings.TEXT_SIZE = result.textSize || DEFAULT_SETTINGS.TEXT_SIZE;
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
            document.body.appendChild(this.speedReaderDiv);
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

    private hidePopup(): void {
        console.log('hidePopup called');
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
        speedReaderState.update(state => ({
            ...state,
            isParagraphConsideredHovered: false,
            isOverPopup: false,
        }));
        this.removalTimeout = null;
    }

    private expandSpeedReader(): void {
        console.log('Expanding SpeedReader');
        if (this.speedReader && this.speedReaderDiv) {
            this.speedReader.$set({ isExpanded: true });
            if (this.currentElement) {
                this.currentElement.classList.add('expanded');
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
        }
    }

    private popupIn(): void {
        console.log('Popup in');
        speedReaderState.update(state => ({
            ...state,
            isExpanded: true,
            isOverPopup: true,
            isParagraphConsideredHovered: true,
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
        console.log('Paragraph left (debounced)');
        if (!this.isOverSpeedReaderOrParagraph()) {
            this.initiatePopupRemoval();
        }
    }

    private isOverSpeedReaderOrParagraph(): boolean {
        let isOver = false;
        speedReaderState.update(state => {
            isOver = state.isOverPopup || state.isParagraphConsideredHovered;
            return state;
        });
        return isOver;
    }

    private initiatePopupRemoval(): void {
        console.log('Initiating popup removal');
        speedReaderState.update(state => ({
            ...state,
            isParagraphConsideredHovered: false,
        }));
        this.stopRemovalCountdown('because im starting a new one');
        this.removalTimeout = window.setTimeout(() => this.hidePopup(), APP_CONSTANTS.HIDE_DELAY);
    }

    private stopRemovalCountdown(reason: string): void {
        console.log('Stopping removal countdown:', reason);
        if (this.removalTimeout !== null) {
            clearTimeout(this.removalTimeout);
            this.removalTimeout = null;
        }
    }

    private positionSpeedReader(): void {
        if (this.speedReaderDiv) {
            const left = this.lastMousePosition.x + APP_CONSTANTS.CURSOR_OFFSET_X;
            const top = this.lastMousePosition.y + APP_CONSTANTS.CURSOR_OFFSET_Y;

            this.speedReaderDiv.style.left = `${Math.max(0, left)}px`;
            this.speedReaderDiv.style.top = `${Math.max(0, top)}px`;
            this.speedReaderDiv.style.position = 'fixed';
            this.speedReaderDiv.style.overflow = 'visible';
            this.speedReaderDiv.style.transition = 'width 0.3s, height 0.3s';
        }
    }

    private debouncedShowPopup = debounce((target: HTMLElement, words: string[]) => {
        console.log('Debounced show popup');
        speedReaderState.update(state => ({
            ...state,
            isParagraphConsideredHovered: true,
        }));
        this.showPopup(target, words);
    }, APP_CONSTANTS.SHOW_DELAY);
}
