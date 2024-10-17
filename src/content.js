import SpeedReader from './SpeedReader.svelte';


const HOVER_DELAY = 300;
const HIDE_DELAY = 1000;
const MIN_WORDS = 10;
const SMALL_SIZE = 20;
const FULL_WIDTH = 300;
const FULL_HEIGHT = 100;

let speedReader;
let currentElement = null;
let hoverTimeout = null;
let hideTimeout = null;
let speedReaderDiv = null;
let isParagraphConsideredHovered = false;

function handleMouseMove(e) {
  console.log('Mouse moved');
  
  if (isOverSpeedReaderOrParagraph(e)) {
    isParagraphConsideredHovered = true;
    clearTimeout(hideTimeout);
    return;
  }

  clearTimeout(hoverTimeout);
  clearTimeout(hideTimeout);

  hoverTimeout = setTimeout(() => {
    console.log('Hover timeout triggered');
    const target = e.target;
    const text = target.innerText;
    const words = text.split(/\s+/);
    
    if (words.length >= MIN_WORDS && target !== currentElement) {
      console.log('Showing SpeedReader');
      currentElement = target;
      isParagraphConsideredHovered = true;
      showSpeedReader(e, target, words);
    } else if (target !== currentElement) {
      console.log('Hiding SpeedReader');
      isParagraphConsideredHovered = false;
      hideSpeedReader();
    }
  }, HOVER_DELAY);
}

function isOverSpeedReaderOrParagraph(e) {
  return (speedReaderDiv && speedReaderDiv.contains(e.target)) || 
         (currentElement && currentElement.contains(e.target));
}

function showSpeedReader(e, target, words) {
  console.log('showSpeedReader called');
  if (speedReader) {
    console.log('Destroying existing SpeedReader');
    speedReader.$destroy();
  }

  const targetRect = target.getBoundingClientRect();
  const left = targetRect.left + (targetRect.width / 2) - (SMALL_SIZE / 2);
  const top = e.clientY - (SMALL_SIZE / 2);

  speedReaderDiv = document.createElement('div');
  document.body.appendChild(speedReaderDiv);

  target.classList.add('paragraph-highlight');

  speedReader = new SpeedReader({
    target: speedReaderDiv,
    props: {
      words: words,
      wordsPerMinute: 400,
      isExpanded: false
    }
  });

  console.log('SpeedReader component created:', speedReader);

  speedReaderDiv.style.position = 'absolute';
  speedReaderDiv.style.left = `${Math.max(0, left)}px`;
  speedReaderDiv.style.top = `${top}px`;
  speedReaderDiv.style.width = `${SMALL_SIZE}px`;
  speedReaderDiv.style.height = `${SMALL_SIZE}px`;
  speedReaderDiv.style.overflow = 'hidden';
  speedReaderDiv.style.transition = 'width 0.3s, height 0.3s';

  speedReaderDiv.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    isParagraphConsideredHovered = true;
    expandSpeedReader();
  });
  speedReaderDiv.addEventListener('mouseleave', handleSpeedReaderLeave);

  target.addEventListener('mouseleave', handleParagraphLeave);
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

function handleParagraphLeave(e) {
  console.log('Paragraph left');
  if (!isOverSpeedReaderOrParagraph(e)) {
    setHideTimeout();
  }
}

function handleSpeedReaderLeave(e) {
  console.log('SpeedReader left');
  if (!isOverSpeedReaderOrParagraph(e)) {
    setHideTimeout();
  }
  shrinkSpeedReader();
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

function setHideTimeout() {
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    console.log('Hide timeout triggered');
    if (!isParagraphConsideredHovered) {
      hideSpeedReader();
    }
  }, HIDE_DELAY);
}

function hideSpeedReader() {
  console.log('hideSpeedReader called');
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
}

document.addEventListener('mousemove', handleMouseMove);

// Clean up
window.addEventListener('unload', () => {
  document.removeEventListener('mousemove', handleMouseMove);
  hideSpeedReader();
});
