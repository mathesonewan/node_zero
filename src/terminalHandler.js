// terminalHandler.js

import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';
import state from './stateManager.js';

let _typingDelay = 20;

export function setTypingDelay(value) {
  _typingDelay = value;
}

export function getTypingDelay() {
  return _typingDelay;
}

let fitAddon;
let keyInputHandler = null;

export function setupTerminal() {
  const term = new Terminal({
    theme: {
      background: '#001100',
      foreground: '#00FF00',
      cursor: '#00FF00'
    },
    fontFamily: 'Courier New, monospace',
    fontSize: 14,
    scrollback: 1000,
    convertEol: true,
    cursorBlink: true,
    disableStdin: true
  });

  fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  term.open(document.getElementById('terminal'));
  fitAddon.fit();
  term.focus();

  // Save terminal reference to global state
  state.terminal = term;

  window.addEventListener('resize', () => {
    fitAddon.fit();
  });
}

export function refreshLine(mode, buffer, username, hostname, pathArray) {
  if (!state.terminal) return;

  state.terminal.write('\x1b[2K\r'); // Clear line

  if (mode === 'username') {
    state.terminal.write('Username: ' + sanitize(buffer));
  } else if (mode === 'password') {
    state.terminal.write('Password: ' + '*'.repeat(buffer.length));
  } else {
    const prompt = `${username}@${hostname}:/${pathArray.join('/')}$ `;
    state.terminal.write(prompt + sanitize(buffer));
  }
}

// 👇 Helper: strip illegal control characters
function sanitize(str) {
  return str.replace(/[\x00-\x1F\x7F]/g, '');
}


export function attachTerminalInput(handler) {
  keyInputHandler = handler;
  state.terminal?.onKey(e => {
    if (keyInputHandler) {
      handler(e);
    }
  });
}
