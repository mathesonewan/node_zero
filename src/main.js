import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';

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

function prompt() {
  term.write('user@HackSim:~$ ');
}

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
  }
});

// Fill some lines initially
for (let i = 0; i < 30; i++) {
  term.writeln(`Welcome line ${i + 1}`);
}

prompt();

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

  // Random time until next toggle (3 to 7 seconds)
  const nextToggle = Math.random() * 4000 + 3000;
  setTimeout(randomizeScanline, nextToggle);
}

// Start randomizing scanline
randomizeScanline();

// --- Random Voltage Distortion ---

function randomDistortion() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  // Randomly distort
  terminal.classList.add('distort');

  // Hold distortion for 300ms then remove
  setTimeout(() => {
    terminal.classList.remove('distort');
  }, 300);

  // Random time until next distortion (10–25 seconds)
  const nextDistort = Math.random() * 15000 + 10000;
  setTimeout(randomDistortion, nextDistort);
}

// Start random voltage distortions
randomDistortion();