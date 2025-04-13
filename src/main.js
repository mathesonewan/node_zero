import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';
import narrative from './narrative.js';
import filesystem from './filesystem.js';
import systems from './systems.js';

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

// --- Terminal Setup Complete ---

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

// --- Safe Event Attachments ---
window.addEventListener('load', () => {
  const menuButton = document.getElementById('menuButton');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenu = document.getElementById('closeMenu');
  const audioToggle = document.getElementById('audioToggle');
  const textSpeedInput = document.getElementById('textSpeed');
  const instantTextButton = document.getElementById('instantText');
  const skipBootToggle = document.getElementById('skipBoot');
  const flickerLevelSelect = document.getElementById('flickerLevel');
  const scanlinesToggle = document.getElementById('scanlinesToggle');
  const themeSelect = document.getElementById('themeSelect');

  if (menuButton && menuOverlay && closeMenu) {
    menuButton.addEventListener('click', () => {
      menuOverlay.style.display = 'flex';
      menuButton.style.display = 'none'; // <-- ADD THIS
    });
    
    closeMenu.addEventListener('click', () => {
      menuOverlay.style.display = 'none';
      menuButton.style.display = 'block'; // <-- ADD THIS
    });
    // Just placeholder logs for now
if (audioToggle) {
  audioToggle.addEventListener('change', () => {
    console.log("Audio toggle:", audioToggle.checked);
  });
}

if (textSpeedInput) {
  textSpeedInput.addEventListener('input', () => {
    console.log("Text Speed:", textSpeedInput.value);
  });
}

if (instantTextButton) {
  instantTextButton.addEventListener('click', () => {
    console.log("Instant text mode activated.");
    textSpeedInput.value = 0;
  });
}

if (skipBootToggle) {
  skipBootToggle.addEventListener('change', () => {
    console.log("Skip boot:", skipBootToggle.checked);
  });
}

if (flickerLevelSelect) {
  flickerLevelSelect.addEventListener('change', () => {
    console.log("Flicker level:", flickerLevelSelect.value);
  });
}

if (scanlinesToggle) {
  scanlinesToggle.addEventListener('change', () => {
    console.log("Scanlines toggle:", scanlinesToggle.checked);
  });
}

if (themeSelect) {
  themeSelect.addEventListener('change', () => {
    console.log("Theme selected:", themeSelect.value);
  });
}
  }
});
