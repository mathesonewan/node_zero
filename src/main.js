import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';
import narrative from './narrative.js';

// Initialize terminal
const term = new Terminal({
  theme: {
    background: '#001100', // Deep green CRT
    foreground: '#00FF00',
    cursor: '#00FF00'
  },
  fontFamily: 'Courier New, monospace',
  fontSize: 14,
  scrollback: 1000,
  convertEol: true,
  cursorBlink: true,
  disableStdin: false
});

// Add FitAddon
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal'));
fitAddon.fit();
term.focus();

// Re-fit on window resize
window.addEventListener('resize', () => {
  fitAddon.fit();
});

// Simple input handling
let commandBuffer = '';
let overloadCounter = 0;
let overloadTimeout;

function prompt() {
  term.write('user@HackSim:~$ ');
}

// --- Main Keyboard Handler (single clean handler!) ---
term.onKey(e => {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.keyCode === 13) { // Enter
    term.write('\r\n');
    if (commandBuffer.trim() !== '') {
      term.writeln(`You typed: ${commandBuffer}`);
    }
    commandBuffer = '';
    prompt();
  } else if (domEvent.keyCode === 8) { // Backspace
    if (commandBuffer.length > 0) {
      commandBuffer = commandBuffer.slice(0, -1);
      term.write('\b \b');
    }
  } else if (printable) { // Normal characters
    commandBuffer += key;
    term.write(key);

    // --- Typing Overload Detection ---
    overloadCounter++;

    if (overloadCounter > 15) { // Too many keypresses rapidly
      triggerOverloadDistortion();
      overloadCounter = 0;
    }

    clearTimeout(overloadTimeout);
    overloadTimeout = setTimeout(() => {
      overloadCounter = 0;
    }, 1000); // Reset counter after 1 second
  }
});

// Output narrative intro slowly, then prompt

async function outputIntro() {
  // --- 1.5s pause before starting ---
  await delay(1500);

  for (const line of narrative.intro) {
    await typeLine(line);
    await delay(300); // Slightly longer pause between lines
  }

  prompt(); // Show prompt after intro
}

// Typing each character slowly
async function typeLine(line) {
  for (const char of line) {
    term.write(char);
    await delay(20); // Delay between each character (30ms per character)

    // --- Random tiny flicker ---
    if (Math.random() < 0.03) { // 3% chance
      tinyFlicker();
    }
  }
  term.write('\r\n'); // Move to next line after full line typed
}

// Tiny flicker effect
function tinyFlicker() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  terminal.style.opacity = '0.8';
  setTimeout(() => {
    terminal.style.opacity = '1';
  }, 50);
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the intro
outputIntro();



// --- Randomize Scanline Appearance + Movement ---

const scanlineCurves = [
  'ease-in-out',
  'cubic-bezier(0.4, 0, 0.6, 1)',
  'cubic-bezier(0.25, 0.1, 0.25, 1)',
  'cubic-bezier(0.6, 0.05, 0.4, 0.95)',
  'cubic-bezier(0.8, 0, 0.2, 1)',
];

function randomizeScanline() {
  const scanline = document.getElementById('scanline');
  if (!scanline) return;

  // Randomly show or hide
  scanline.style.opacity = Math.random() > 0.5 ? '1' : '0';

  // Randomly pick a timing function
  const randomCurve = scanlineCurves[Math.floor(Math.random() * scanlineCurves.length)];
  scanline.style.animationTimingFunction = randomCurve;

  // Random time until next toggle (7–15 seconds)
  const nextToggle = Math.random() * 8000 + 7000;
  setTimeout(randomizeScanline, nextToggle);
}

randomizeScanline();

// --- Random Voltage Distortion ---

function randomDistortion() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  terminal.classList.add('distort');

  setTimeout(() => {
    terminal.classList.remove('distort');
  }, 300);

  const nextDistort = Math.random() * 15000 + 10000; // 10-25 seconds
  setTimeout(randomDistortion, nextDistort);
}

randomDistortion();

// --- Random Magnetic Pull Distortion ---

function randomMagnetic() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  terminal.classList.add('magnetic');

  setTimeout(() => {
    terminal.classList.remove('magnetic');
  }, 400);

  const nextMagnetic = Math.random() * 30000 + 20000; // 20-50 seconds
  setTimeout(randomMagnetic, nextMagnetic);
}

randomMagnetic();

// --- Random Screen Shake ---

function randomShake() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  terminal.classList.add('shake');

  setTimeout(() => {
    terminal.classList.remove('shake');
  }, 500);

  const nextShake = Math.random() * 30000 + 15000; // 15-45 seconds
  setTimeout(randomShake, nextShake);
}

randomShake();

// --- Overload Distortion (called from typing handler) ---

function triggerOverloadDistortion() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  terminal.classList.add('magnetic');
  terminal.classList.add('shake');

  setTimeout(() => {
    terminal.classList.remove('magnetic');
    terminal.classList.remove('shake');
  }, 500);
}

// --- CRT Burn-In Ghosting ---

function updateBurnIn() {
  const terminal = document.getElementById('terminal');
  const burnin = document.getElementById('burnin');
  if (!terminal || !burnin) return;

  // Capture a "snapshot" of the current terminal state
  burnin.style.backgroundImage = `url(${captureTerminal()})`;
  burnin.style.backgroundSize = 'cover';

  // Update again every 20–40 seconds
  const nextUpdate = Math.random() * 20000 + 20000;
  setTimeout(updateBurnIn, nextUpdate);
}

function captureTerminal() {
  try {
    const canvas = document.createElement('canvas');
    const terminalEl = document.getElementById('terminal');
    const rect = terminalEl.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#001100';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // NOTE: We simulate the capture, real xterm content isn't directly accessible without more tricks.
    // This is a hack to just refresh a subtle ghosty background instead of the real text.

    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error('Burn-in capture failed:', e);
    return '';
  }
}

// Start burn-in updates
updateBurnIn();

// --- Hacker Notes Panel ---
window.addEventListener('load', () => {
  const notesToggle = document.getElementById('notesToggle');
  const notesWrapper = document.getElementById('notesWrapper');

  if (notesToggle && notesWrapper) {
    notesToggle.addEventListener('click', () => {
      notesWrapper.classList.toggle('open');
    });
  }

  const notesArea = document.getElementById('notesArea');
  notesArea.addEventListener('input', () => {
    localStorage.setItem('hackerNotes', notesArea.value);
  });

  if (notesArea) {
    notesArea.value = localStorage.getItem('hackerNotes') || '';
  }
});
