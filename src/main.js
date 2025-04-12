import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';

// Initialize terminal
const term = new Terminal({
  theme: {
    background: '#0A1F14',
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

// Add FitAddon to resize automatically
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
