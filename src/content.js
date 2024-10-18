import SpeedReader from './SpeedReader.svelte';


const HOVER_DELAY = 300;
const HIDE_DELAY = 1000;
const MIN_WORDS = 10;
const SMALL_SIZE = 30;
const FULL_WIDTH = 300;
const FULL_HEIGHT = 100;
const SHOW_DELAY = 500; // New constant for the 1-second delay before showing
const CURSOR_OFFSET_X = 10; // Offset to the right of the cursor
const CURSOR_OFFSET_Y = -10; // Offset above the cursor

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function isOverSpeedReaderOrParagraph(e) {
  return (speedReaderDiv && speedReaderDiv.contains(e.target)) || 
         (currentElement && currentElement.contains(e.target));
}

let speedReader;
let currentElement = null;
let speedReaderDiv = null;
let isParagraphConsideredHovered = false;
let isOverPopup = false;
let lastMousePosition = { x: 0, y: 0 };
let removalTimeout = null;

function handleMouseMove(e) {
  console.log('Mouse moved');
  
  if (isOverPopup) {
    debugger;
    isParagraphConsideredHovered = true;
    stopRemovalCountdown('because im not over the paragraph');
  } else {
    console.log('Initiating popup removal');
    initiatePopupRemoval();
  }

  lastMousePosition = { x: e.clientX, y: e.clientY };
  const target = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
  const text = target.innerText;
  const words = text.split(/\s+/);
  
  if (words.length >= MIN_WORDS && target !== currentElement) {
    debouncedShowPopup(target, words);
  }

  if (speedReaderDiv) {
    debouncedHidePopup();
  }
}

//create a function that will be called initiate popup removal. this will initiate the countdown to removing the popup. another function stop removal countdown will also be needed.

function initiatePopupRemoval() {
  console.log('Initiating popup removal');
  if (removalTimeout) {
    console.log('Removal countdown already initiated');
    return;
  }
  console.log('>>>>Initiating removal countdown');
  removalTimeout = setTimeout(() => {
    console.log('>>>>Removal countdown complete');
    hidePopup();
  }, HIDE_DELAY); // Use SHOW_DELAY for consistency
}

function stopRemovalCountdown(a) {
  if (removalTimeout) {
    console.log('Stopping removal countdown',a);
    clearTimeout(removalTimeout);
    removalTimeout = null;
  }
  isParagraphConsideredHovered = true;
}
function showPopup(target, words) {
  console.log('showPopup called');
  stopRemovalCountdown('because im showing popup'); // Stop any ongoing removal countdown
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
      wordsPerMinute: 400,
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

function hidePopup() {
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
  removalTimeout = null; // Reset the removal timeout
}

const debouncedShowPopup = debounce((target, words) => {
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

function handleParagraphLeave(e) {
  console.log('Paragraph left');
  if (!isOverSpeedReaderOrParagraph(e)) {
    initiatePopupRemoval();
  }
}

function handleSpeedReaderLeave(e) {
  console.log('SpeedReader left');
  isOverPopup = false;
  shrinkSpeedReader();
}

function positionSpeedReader() {
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

function expandSpeedReader() {
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

function shrinkSpeedReader() {
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
