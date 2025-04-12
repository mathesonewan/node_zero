import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';
import narrative from './narrative.js';
import filesystem from './filesystem.js';
import systems from './systems.js';

// --- Globals ---
let currentMachine = null;
let pendingLogin = '10.10.10.99'; // SBC IP
let pendingUsername = '';
let awaitingUsername = false;
let awaitingPassword = false;
let commandBuffer = '';
let commandHistory = [];
let historyIndex = -1;
let currentPath = [];

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

// --- Filesystem Setup ---
const fileSystem = filesystem;

// --- Prompt ---
function prompt() {
  if (currentMachine) {
    const machine = systems.find(sys => sys.ip === currentMachine);
    term.write(`\r\n${machine ? machine.hostname : 'machine'}:/${currentPath.join('/')}$ `);
  } else {
    term.write(`\r\nuser@Network:/$ `);
  }
}

// --- Get Directory ---
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

// --- Clear Current Input ---
function clearCurrentInput() {
  for (let i = 0; i < commandBuffer.length; i++) {
    term.write('\b \b');
  }
}

// --- Run Command ---
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

  else if (command === 'cd') {
    if (!currentMachine) {
      term.writeln('You must be connected to a machine to use cd.');
    } else {
      if (args.length < 2) {
        term.writeln('Usage: cd <directory>');
      } else {
        const machineNode = fileSystem['/']['contents'][currentMachine];
        const pathNode = getDirFromPath(machineNode, currentPath);

        if (args[1] === '/') {
          currentPath = [];
        } else if (args[1] === '..') {
          if (currentPath.length > 0) currentPath.pop();
        } else if (pathNode && pathNode.contents && pathNode.contents[args[1]] && pathNode.contents[args[1]].type === 'dir') {
          currentPath.push(args[1]);
        } else {
          term.writeln('No such directory: ' + args[1]);
        }
      }
    }
  }

  else if (command === 'cat') {
    if (!currentMachine) {
      term.writeln('You must be connected to a machine to use cat.');
    } else if (args.length < 2) {
      term.writeln('Usage: cat <file>');
    } else {
      const machineNode = fileSystem['/']['contents'][currentMachine];
      const pathNode = getDirFromPath(machineNode, currentPath);

      if (pathNode && pathNode.contents && pathNode.contents[args[1]] && pathNode.contents[args[1]].type === 'file') {
        term.writeln(pathNode.contents[args[1]].content);
      } else {
        term.writeln('No such file: ' + args[1]);
      }
    }
  }

  else if (command === 'nmap') {
    if (args.length < 2) {
      term.writeln('Usage: nmap <subnet>');
    } else {
      const subnet = args[1].split('/')[0].split('.').slice(0, 3).join('.') + '.';
      term.writeln(`Starting Nmap scan on ${subnet}0/24`);
      let found = false;
      systems.forEach(system => {
        if (system.ip.startsWith(subnet)) {
          term.writeln(`Host ${system.ip} (${system.hostname}) is up`);
          found = true;
        }
      });
      if (!found) {
        term.writeln('No hosts found.');
      }
    }
    prompt();
    return;
  }

  else if (command === 'ping') {
    if (args.length < 2) {
      term.writeln('Usage: ping <ip>');
    } else {
      const targetIp = args[1];
      const target = systems.find(system => system.ip === targetIp);
      if (target) {
        term.writeln(`Pinging ${targetIp} (${target.hostname})... Success!`);
      } else {
        term.writeln(`Pinging ${targetIp}... No response.`);
      }
    }
    prompt();
    return;
  }

  else if (command === 'ssh') {
    if (args.length < 2 || !args[1].includes('@')) {
      term.writeln('Usage: ssh username@ip');
    } else {
      const [username, ip] = args[1].split('@');
      const target = systems.find(sys => sys.ip === ip);
      if (target && target.username === username) {
        pendingLogin = ip;
        pendingUsername = username;
        awaitingPassword = true;
        term.write('\r\nPassword: ');
      } else {
        term.writeln('No such host or invalid username.');
        prompt();
      }
    }
  }

  else if (command === 'clear') {
    term.clear();
    prompt();
    return;
  }

  else if (command === 'ifconfig') {
    term.writeln('eth0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500');
    term.writeln('        inet 192.168.1.2  netmask 255.255.255.0  broadcast 192.168.1.255');
    term.writeln('        ether b8:27:eb:ad:2b:0e  txqueuelen 1000  (Ethernet)');
    term.writeln('        RX packets 12345  bytes 6789012 (6.7 MB)');
    term.writeln('        TX packets 2345  bytes 123456 (123.4 KB)');
    term.writeln('        inet6 fe80::ba27:ebff:fead:2b0e  prefixlen 64  scopeid 0x20<link>');
    prompt();
    return;
  }

  else if (command === 'help') {
    term.writeln('Available Commands:');
    term.writeln('  ls           - List directory contents');
    term.writeln('  cd <dir>     - Change directory');
    term.writeln('  cd ..        - Go up a directory');
    term.writeln('  cat <file>   - View file contents');
    term.writeln('  clear        - Clear the screen');
    term.writeln('  ifconfig     - View network settings');
    term.writeln('  help         - Show this help message');
    prompt();
    return;
  }

  else {
    term.writeln(`Command not found: ${command}`);
  }

  prompt();
}

// --- Input Handling ---
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
    } else if (awaitingPassword) {
      const target = systems.find(sys => sys.ip === pendingLogin);
      if (target && pendingUsername === target.username && commandBuffer === target.password) {
        term.writeln('\r\nWelcome to ' + target.hostname + '!');
        currentMachine = pendingLogin;
        currentPath = [];
      } else {
        term.writeln('\r\nAccess Denied.');
      }
      pendingUsername = '';
      pendingLogin = '10.10.99.1'; // Reset to default SBC
      awaitingPassword = false;
      commandBuffer = '';
      prompt();
    } else {
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

// --- Boot Sequence ---
async function outputIntro() {
  await delay(1500);
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
    if (Math.random() < 0.03) tinyFlicker();
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

outputIntro();

// --- Notes Panel ---
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
