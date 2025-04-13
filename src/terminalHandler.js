import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';

export let term;
let _typingDelay = 20;
export function setTypingDelay(value) {
  _typingDelay = value;
}
export function getTypingDelay() {
  return _typingDelay;
}

let fitAddon;
let keyInputHandler = null; // <-- New injected input handler

export function setupTerminal() {
  term = new Terminal({
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
    disableStdin: false
  });

  fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  term.open(document.getElementById('terminal'));
  fitAddon.fit();
  term.focus();

  window.addEventListener('resize', () => {
    fitAddon.fit();
  });
}

export function refreshLine(mode, buffer, username, hostname, pathArray) {
    term.write('\x1b[2K\r'); // Clear the line
  
    if (mode === 'username') {
      term.write('Username: ' + buffer);
    } else if (mode === 'password') {
      term.write('Password: ' + '*'.repeat(buffer.length));
    } else {
      term.write(`${username}@${hostname}:/${pathArray.join('/')}$ ${buffer}`);
    }
  }



export function attachTerminalInput(handler) {
  keyInputHandler = handler;
  term.onKey(e => {
    if (keyInputHandler) {
      keyInputHandler(e);
    }
  });
}
