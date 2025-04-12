import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm'; // <- ADD FitAddon

// Initialize terminal
const term = new Terminal({
  theme: {
    background: '#000000',
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

// ADD FitAddon
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

// Open the terminal inside the #terminal div
term.open(document.getElementById('terminal'));

// Fit the terminal to container size
fitAddon.fit();

// Focus immediately
term.focus();

// Also refit the terminal if the window resizes
window.addEventListener('resize', () => {
  fitAddon.fit();
});

// Simple command handling
let commandBuffer = '';

function prompt() {
  term.write('user@HackSim:~$ ');
}

// Handle user input
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

// Fill some lines initially to test scrolling
for (let i = 0; i < 30; i++) {
  term.writeln(`Welcome line ${i + 1}`);
}

prompt();
