import SpeedReader from './SpeedReader.svelte';

let speedReader;
let currentElement = null;
let hoverTimeout = null;
let hideTimeout = null;

const HOVER_DELAY = 300;
const HIDE_DELAY = 1000;
const MIN_WORDS = 10;

function handleMouseMove(e) {
  if (speedReader && speedReader.$$.fragment && speedReader.$$.fragment.contains(e.target)) return;

  clearTimeout(hoverTimeout);
  clearTimeout(hideTimeout);

  hoverTimeout = setTimeout(() => {
    const target = e.target;
    const text = target.innerText;
    const words = text.split(/\s+/);
    
    if (words.length >= MIN_WORDS && target !== currentElement) {
      currentElement = target;
      showSpeedReader(e, target, words);
    } else if (target !== currentElement) {
      hideSpeedReader();
    }
  }, HOVER_DELAY);
}

function handleMouseLeave(e) {
  if (e.target === currentElement) {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      hideSpeedReader();
    }, HIDE_DELAY);
  }
}

function showSpeedReader(e, target, words) {
  if (speedReader) {
    speedReader.$destroy();
  }

  const targetRect = target.getBoundingClientRect();
  const left = targetRect.left + (targetRect.width / 2) - 150; // 300px / 2
  const top = e.clientY;

  const div = document.createElement('div');
  document.body.appendChild(div);

  speedReader = new SpeedReader({
    target: div,
    props: {
      words: words,
      wordsPerMinute: 400 // You can make this configurable
    }
  });

  div.style.position = 'absolute';
  div.style.left = `${Math.max(0, left)}px`;
  div.style.top = `${top}px`;

  target.addEventListener('mouseleave', handleMouseLeave);
}

function hideSpeedReader() {
  if (speedReader) {
    speedReader.$destroy();
    speedReader = null;
  }
  if (currentElement) {
    currentElement.removeEventListener('mouseleave', handleMouseLeave);
    currentElement = null;
  }
}

document.addEventListener('mousemove', handleMouseMove);

// Clean up
window.addEventListener('unload', () => {
  document.removeEventListener('mousemove', handleMouseMove);
  if (currentElement) {
    currentElement.removeEventListener('mouseleave', handleMouseLeave);
  }
  if (speedReader) {
    speedReader.$destroy();
  }
});

