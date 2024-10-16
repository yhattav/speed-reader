import SpeedReader from './SpeedReader.svelte';

let speedReader;
let currentElement = null;
let hoverTimeout = null;

function handleMouseMove(e) {
  if (speedReader && speedReader.$$.fragment && speedReader.$$.fragment.contains(e.target)) return;

  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => {
    const target = e.target;
    const text = target.innerText;
    const words = text.split(/\s+/);
    
    if (words.length >= 10 && target !== currentElement) {
      currentElement = target;
      showSpeedReader(e, target, words);
    } else if (target !== currentElement && (!speedReader || !speedReader.$$.fragment.contains(target))) {
      hideSpeedReader();
    }
  }, 300);
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
}

function hideSpeedReader() {
  if (speedReader) {
    speedReader.$destroy();
    speedReader = null;
  }
  currentElement = null;
}

document.addEventListener('mousemove', handleMouseMove);

// Clean up
window.addEventListener('unload', () => {
  document.removeEventListener('mousemove', handleMouseMove);
  if (speedReader) {
    speedReader.$destroy();
  }
});