import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';
import narrative from './narrative.js';

// --- Terminal Setup ---

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
  disableStdin: false
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal'));
fitAddon.fit();
term.focus();

window.addEventListener('resize', () => {
  fitAddon.fit();
});

// --- Fake Filesystem Setup ---

const fileSystem = {
  '/': {
    type: 'dir',
    contents: {
      'bin': { type: 'dir', contents: {} },
      'etc': { type: 'dir', contents: {} },
      'home': {
        type: 'dir',
        contents: {
          'user': {
            type: 'dir',
            contents: {
              'notes.txt': { type: 'file', content: 'Network password might be stored in /etc/shadow.' },
              'credentials.txt': { type: 'file', content: 'admin:SuperSecret123' }
            }
          }
        }
      }
    }
  }
};

let currentPath = [];

function getCurrentDir() {
  let dir = fileSystem['/'];
  for (const part of currentPath) {
    if (dir.type !== 'dir' || !dir.contents[part]) {
      return null;
    }
    dir = dir.contents[part];
  }
  return dir;
}

// --- Prompt Handling ---

function prompt() {
  term.write(`\r\nuser@SBC_1:/${currentPath.join('/')}$ `);
}

// --- Run Command Handling ---

function runCommand(input) {
  input = input.trim();
  const args = input.split(' ').filter(arg => arg.length > 0);
  const command = args[0];

  if (!command) {
    prompt();
    return;
  }

  const dir = getCurrentDir();

  if (!dir) {
    term.writeln('Filesystem error: invalid path');
    prompt();
    return;
  }

  if (command === 'ls') {
    if (dir.type === 'dir') {
      term.writeln(Object.keys(dir.contents).join('    '));
    } else {
      term.writeln('Not a directory.');
    }
  }

  else if (command === 'cd') {
    if (args.length < 2) {
      term.writeln('Usage: cd <directory>');
    } else if (args[1] === '..') {
      if (currentPath.length > 0) currentPath.pop();
    } else if (dir.contents[args[1]] && dir.contents[args[1]].type === 'dir') {
      currentPath.push(args[1]);
    } else {
      term.writeln('No such directory: ' + args[1]);
    }
  }

  else if (command === 'cat') {
    if (args.length < 2) {
      term.writeln('Usage: cat <file>');
    } else if (dir.contents[args[1]] && dir.contents[args[1]].type === 'file') {
      term.writeln(dir.contents[args[1]].content);
    } else {
      term.writeln('No such file: ' + args[1]);
    }
  }

  else if (command === 'clear') {
    term.clear();
    prompt();
    return;
  }

  else {
    term.writeln(`Command not found: ${command}`);
  }

  prompt();
}

// --- Capture User Input ---

let commandBuffer = '';

term.onKey(e => {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.keyCode === 13) { // Enter
    term.write('\r\n');
    runCommand(commandBuffer); // <<< RUN THE COMMAND
    commandBuffer = '';
  } else if (domEvent.keyCode === 8) { // Backspace
    if (commandBuffer.length > 0) {
      commandBuffer = commandBuffer.slice(0, -1);
      term.write('\b \b');
    }
  } else if (printable) {
    commandBuffer += key;
    term.write(key);
  }
});

// --- Output Narrative on Startup ---

async function outputIntro() {
  await delay(1500); // Startup pause

  for (const line of narrative.intro) {
    await typeLine(line);
    await delay(300);
  }

  prompt();
}

async function typeLine(line) {
  for (const char of line) {
    term.write(char);
    await delay(20); // Faster typing speed (your custom setting!)
    if (Math.random() < 0.03) {
      tinyFlicker();
    }
  }
  term.write('\r\n');
}

function tinyFlicker() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  terminal.style.opacity = '0.8';
  setTimeout(() => {
    terminal.style.opacity = '1';
  }, 50);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start intro sequence
outputIntro();

// --- Notes Panel Toggle (Button and Panel Slide Together) ---

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
