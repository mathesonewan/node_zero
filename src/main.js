import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';  // xterm.js library
import narrative from './narrative.js';  // Import the narrative content

// Initialize the terminal
const term = new Terminal({
  theme: {
    background: '#000000',  // Black background
    foreground: '#00FF00',  // Green text
    cursor: '#00FF00',      // Green cursor
    selection: '#005500'    // Darker green selection highlight
  },
  fontFamily: 'Courier New',  // Font family
  fontSize: 14,
  cursorBlink: true,
  cursorStyle: 'block',
  scrollback: 1000,
  screenKeys: true,
  convertEol: true,
  disableStdin: false
});

// Open the terminal inside the element with id "terminal"
term.open(document.getElementById('terminal'));

// Initialize the command buffer and history
let commandBuffer = '';
let commandHistory = [];
let historyIndex = -1;

// Basic fake filesystem structure
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

// Function to get the current directory in the fake filesystem
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

// Function to display the prompt in the terminal
function prompt() {
  term.write("\r\nuser@SBC_1:/" + currentPath.join('/') + "$ ");
}

// Function to run the user's command
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

  // Simulate ifconfig output
  if (command === 'ifconfig') {
    term.writeln('eth0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500');
    term.writeln('        inet 192.168.1.2  netmask 255.255.255.0  broadcast 192.168.1.255');
    term.writeln('        inet6 fe80::ba27:ebff:fead:2b0e  prefixlen 64  scopeid 0x20<link>');
    term.writeln('        ether b8:27:eb:ad:2b:0e  txqueuelen 1000  (Ethernet)');
    term.writeln('        RX packets 12345  bytes 6789012 (6.7 MB)');
    term.writeln('        TX packets 2345  bytes 123456 (123.4 KB)');
    term.writeln('...');
    prompt();
    return;
  }

  // Handle 'ls' command: List directory contents
  if (command === 'ls') {
    if (dir.type === 'dir') {
      term.writeln(Object.keys(dir.contents).join('    '));
    } else {
      term.writeln('Not a directory.');
    }
  }

  // Handle 'cd' command: Change directories
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

  // Handle 'cat' command: Display file contents
  else if (command === 'cat') {
    if (args.length < 2) {
      term.writeln('Usage: cat <file>');
    } else if (dir.contents[args[1]] && dir.contents[args[1]].type === 'file') {
      term.writeln(dir.contents[args[1]].content);
    } else {
      term.writeln('No such file: ' + args[1]);
    }
  }

  // Handle 'clear' command: Clear the terminal screen
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

// Capture user input from the terminal
term.onKey(e => {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.keyCode === 13) {  // Enter key pressed
    if (commandBuffer.trim() !== '') {
      commandHistory.push(commandBuffer);
      historyIndex = commandHistory.length;
    }
    term.writeln('');
    runCommand(commandBuffer);
    commandBuffer = '';
  } else if (domEvent.keyCode === 8) {  // Backspace key pressed
    if (commandBuffer.length > 0) {
      commandBuffer = commandBuffer.slice(0, -1);
      term.write('\b \b');
    }
  } else if (printable) {
    commandBuffer += key;
    term.write(key);
  }
});

// Display the narrative text line by line
narrative.intro.forEach(line => {
  term.writeln(line);
});

// Display the prompt after the narrative and focus on the terminal for input
