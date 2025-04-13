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
let currentUsername = '';
let currentHostname = '';
let pendingLogin = '10.10.10.99';
let pendingUsername = '';
let awaitingUsername = false;
let awaitingPassword = false;
let commandBuffer = '';
let commandHistory = [];
let historyIndex = -1;
let currentPath = [];
let typingDelay = 20; // Default typing speed (ms per character)


// --- Filesystem Functions ---
function getCurrentDir() {
  if (!currentMachine) return fileSystem['/'];
  let dir = fileSystem['/']['contents'][currentMachine];
  for (const part of currentPath) {
    if (!dir.contents || !dir.contents[part]) return null;
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
  term.write(`\r\n${currentUsername || 'user'}@${currentHostname || 'SBC_1'}:/${currentPath.join('/')}$ `);
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
    if (dir.type === 'dir') {
      term.writeln(Object.keys(dir.contents).join('    '));
    } else {
      term.writeln('Not a directory.');
    }
  }

  else if (command === 'cd') {
    if (!currentMachine) {
      term.writeln('You must be connected to a machine to use cd.');
    } else {
      if (args.length < 2) {
        term.writeln('Usage: cd <directory>');
      } else if (args[1] === '..') {
        if (currentPath.length > 0) currentPath.pop();
      } else if (args[1] === '/') {
        currentPath = [];
      } else if (dir.contents && dir.contents[args[1]] && dir.contents[args[1]].type === 'dir') {
        currentPath.push(args[1]);
      } else {
        term.writeln('No such directory: ' + args[1]);
      }
    }
  }

  else if (command === 'cat') {
    if (!currentMachine) {
      term.writeln('You must be connected to a machine to use cat.');
    } else if (args.length < 2) {
      term.writeln('Usage: cat <file>');
    } else {
      if (dir.contents && dir.contents[args[1]] && dir.contents[args[1]].type === 'file') {
        term.writeln(dir.contents[args[1]].content);
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
    term.writeln('  cat <file>   - View file contents');
    term.writeln('  clear        - Clear the screen');
    term.writeln('  ssh user@ip  - Connect to a machine');
    term.writeln('  nmap subnet  - Scan network for machines');
    term.writeln('  ping ip      - Ping a host');
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
    await delay(typingDelay);
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
        currentUsername = pendingUsername;
        const fullHost = target.hostname || 'unknown.local';
        currentHostname = fullHost.replace('.local', '');
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

// --- Scanline Randomized Movement ---
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
  // --- Text Speed Control Buttons ---
const slowButton = document.getElementById('slowTextSpeed');
const fastButton = document.getElementById('fastTextSpeed');
const instantButton = document.getElementById('instantTextSpeed');

if (slowButton && fastButton && instantButton) {
  slowButton.addEventListener('click', () => {
    typingDelay = 40; // Slower typing
  });

  fastButton.addEventListener('click', () => {
    typingDelay = 10; // Faster typing
  });

  instantButton.addEventListener('click', () => {
    typingDelay = 0; // Instant typing
  });
}

// --- Flicker Intensity Control Buttons ---
const flickerLow = document.getElementById('flickerLow');
const flickerMedium = document.getElementById('flickerMedium');
const flickerHigh = document.getElementById('flickerHigh');

if (flickerLow && flickerMedium && flickerHigh) {
  flickerLow.addEventListener('click', () => {
    document.getElementById('terminal').style.animationDuration = '12s'; // Low flicker
  });

  flickerMedium.addEventListener('click', () => {
    document.getElementById('terminal').style.animationDuration = '8s'; // Medium flicker
  });

  flickerHigh.addEventListener('click', () => {
    document.getElementById('terminal').style.animationDuration = '4s'; // High flicker
  });
}

// --- Theme Color Control Buttons ---
const themeGreen = document.getElementById('themeGreen');
const themeBlue = document.getElementById('themeBlue');

if (themeGreen && themeBlue) {
  themeGreen.addEventListener('click', () => {
    document.getElementById('terminal').style.backgroundColor = '#001100';
    document.getElementById('terminal').style.color = '#00FF00';
  });

  themeBlue.addEventListener('click', () => {
    document.getElementById('terminal').style.backgroundColor = '#001122';
    document.getElementById('terminal').style.color = '#00FFFF';
  });
}


});
