import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';
import narrative from './narrative.js';
import filesystem from './filesystem.js';
import systems from './systems.js'; // <- Add this import at top of main.js



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

const fileSystem = filesystem;

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

  else if (command === 'cd') {
    if (args.length < 2) {
      term.writeln('Usage: cd <directory>');
    } else if (args[1] === '..') {
      if (currentPath.length > 0) currentPath.pop();
    } 
    
    else if (args[1] === '/') {
      currentPath = [];
    }
    
    
    else if (dir.contents[args[1]] && dir.contents[args[1]].type === 'dir') {
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

// --- Capture User Input ---

let commandBuffer = '';
let commandHistory = [];
let historyIndex = -1;

term.onKey(e => {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.key === 'Enter') {
    if (commandBuffer.trim() !== '') {
      commandHistory.push(commandBuffer);
      historyIndex = commandHistory.length;
    }
    term.write('\r\n');
    runCommand(commandBuffer);
    commandBuffer = '';
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
      // Clear current line
      clearCurrentInput();
      commandBuffer = commandHistory[historyIndex] || '';
      term.write(commandBuffer);
    }
  } 
  
  else if (domEvent.key === 'ArrowDown') {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      // Clear current line
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

function clearCurrentInput() {
  // Move cursor back over current input and clear it visually
  for (let i = 0; i < commandBuffer.length; i++) {
    term.write('\b \b');
  }
}
