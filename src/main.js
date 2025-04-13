import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';
import narrative from './narrative.js';
import filesystem from './filesystem.js';
import systems from './systems.js';

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

// --- System Variables ---
const fileSystem = filesystem;
let currentMachine = null;
let pendingLogin = '10.10.10.99';
let pendingUsername = '';
let awaitingUsername = false;
let awaitingPassword = false;
let commandBuffer = '';
let commandHistory = [];
let historyIndex = -1;
let currentPath = [];

// --- Filesystem Functions ---
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

function getDirFromPath(base, pathArray) {
  let current = base;
  for (const part of pathArray) {
    if (!current.contents || !current.contents[part]) return null;
    current = current.contents[part];
  }
  return current;
}

// --- Prompt ---
function prompt() {
  term.write(`\r\nuser@SBC_1:/${currentPath.join('/')}$ `);
}

// --- Command Runner ---
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
    const effectiveDir = getCurrentDir();
    if (currentMachine) {
      const machineNode = fileSystem['/']['contents'][currentMachine];
      const pathNode = getDirFromPath(machineNode, currentPath);
      if (pathNode && pathNode.type === 'dir') {
        term.writeln(Object.keys(pathNode.contents).join('    '));
      } else {
        term.writeln('Not a directory.');
      }
    } else {
      if (effectiveDir.type === 'dir') {
        term.writeln('Available Hosts:');
        term.writeln(Object.keys(effectiveDir.contents).join('    '));
      } else {
        term.writeln('Not a directory.');
      }
    }
  }

  else if (command === 'clear') {
    term.clear();
    prompt();
    return;
  }

  else if (command === 'help') {
    term.writeln('Available Commands:');
    term.writeln('  ls           - List directory contents');
    term.writeln('  clear        - Clear the screen');
    term.writeln('  help         - Show this help message');
    prompt();
    return;
  }

  else {
    term.writeln(`Command not found: ${command}`);
  }

  prompt();
}

// --- Output Intro ---
async function outputIntro() {
  await delay(1500); // Startup pause

  for (const line of narrative.intro) {
    await typeLine(line);
    await delay(300);
  }

  term.writeln("\r\nConnecting to SBC_1...");
  term.write("\r\nUsername: ");
  awaitingUsername = true;
}

async function typeLine(line) {
  for (const char of line) {
    term.write(char);
    await delay(20);
  }
  term.write('\r\n');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearCurrentInput() {
  for (let i = 0; i < commandBuffer.length; i++) {
    term.write('\b \b');
  }
}

// --- Boot the Intro ---
outputIntro();

// --- Terminal Key Input Handler ---
term.onKey(e => {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.key === 'Enter') {
    if (awaitingUsername) {
      pendingUsername = commandBuffer.trim();
      commandBuffer = '';
      awaitingUsername = false;
      awaitingPassword = true;
      term.write('\r\nPassword: ');
    } 
    else if (awaitingPassword) {
      const target = systems.find(sys => sys.ip === pendingLogin);
      if (target && pendingUsername === target.username && commandBuffer === target.password) {
        term.writeln('\r\nWelcome to ' + target.hostname + '!');
        currentMachine = pendingLogin;
        currentPath = [];
      } else {
        term.writeln('\r\nAccess Denied.');
      }
      pendingUsername = '';
      pendingLogin = '10.10.99.1';
      awaitingPassword = false;
      commandBuffer = '';
      prompt();
    } 
    else {
      if (commandBuffer.trim() !== '') {
        commandHistory.push(commandBuffer);
        historyIndex = commandHistory.length;
      }
      term.write('\r\n');
      runCommand(commandBuffer);
      commandBuffer = '';
    }
  }

  else if (domEvent.key === 'Backspace') {
    if (commandBuffer.length > 0) {
      commandBuffer = commandBuffer.slice(0, -1);
      term.write('\b \b');
    }
  }

  else if (domEvent.key === 'ArrowUp') {
    if (historyIndex > 0) {
      historyIndex--;
      clearCurrentInput();
      commandBuffer = commandHistory[historyIndex] || '';
      term.write(commandBuffer);
    }
  }

  else if (domEvent.key === 'ArrowDown') {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      clearCurrentInput();
      commandBuffer = commandHistory[historyIndex] || '';
      term.write(commandBuffer);
    } else {
      historyIndex = commandHistory.length;
      clearCurrentInput();
      commandBuffer = '';
    }
  }

  else if (printable) {
    if (awaitingPassword) {
      commandBuffer += key;
      term.write('*');
    } else {
      commandBuffer += key;
      term.write(key);
    }
  }
});

// --- Scanline Randomized Movement (Reinjected) ---
const scanline = document.getElementById('scanline');

function randomizeScanlineTiming() {
  const curves = [
    'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    'cubic-bezier(0.42, 0, 0.58, 1.0)',
    'cubic-bezier(0.4, 0.0, 1, 1)',
    'cubic-bezier(0.0, 0.0, 0.2, 1)',
    'cubic-bezier(0.5, 1.5, 0.5, 1)',
    'linear'
  ];
  const randomCurve = curves[Math.floor(Math.random() * curves.length)];
  scanline.style.animationTimingFunction = randomCurve;
}

setInterval(randomizeScanlineTiming, 4000);

// --- Menu Button and Overlay Logic ---
window.addEventListener('load', () => {
  const menuButton = document.getElementById('menuButton');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenu = document.getElementById('closeMenu');

  if (menuButton && menuOverlay && closeMenu) {
    menuButton.addEventListener('click', () => {
      menuOverlay.style.display = 'flex';
      menuButton.style.display = 'none';
    });

    closeMenu.addEventListener('click', () => {
      menuOverlay.style.display = 'none';
      menuButton.style.display = 'block';
    });
  }
});
