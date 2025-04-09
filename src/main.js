import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';

const term = new Terminal({
  theme: {
    background: '#000000',
    foreground: '#00FF00',
    cursor: '#00FF00',
    selection: '#005500'
  },
  fontFamily: 'Courier New, monospace',
  fontSize: 14,
  cursorBlink: true,
  cursorStyle: 'block',
  scrollback: 1000,
});

term.open(document.getElementById('terminal'));
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
fitAddon.fit();

let commandBuffer = '';
let commandHistory = [];
let historyIndex = -1;

// Basic fake filesystem
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

function triggerScanline() {
  const scanline = document.getElementById('scanline');
  scanline.style.animation = 'none';
  scanline.offsetHeight;  // Force a reflow to restart the animation
  scanline.style.animation = 'scanline-move 2s linear';  // Set the animation

  setTimeout(() => {
    triggerScanline();
  }, Math.random() * 8000 + 5000);
}

triggerScanline();

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

function prompt() {
  term.write("\r\nuser@SBC_1:/" + currentPath.join('/') + "$ ");
}

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
    prompt();  // Ensure prompt is shown for the next command
    return;  // Stop further execution if "ifconfig" is typed
  }

  // Handle other commands like 'help', 'clear', 'ls', etc.
  if (command === 'help') {
    term.writeln('Available commands: help, clear, ls, cd, cat');
  } else if (command === 'clear') {
    term.clear();
  } else if (command === 'ls') {
    term.writeln(Object.keys(dir.contents).join('    '));
  } else if (command === 'cd') {
    if (args.length < 2) {
      term.writeln('Usage: cd <directory>');
    } else if (args[1] === '..') {
      if (currentPath.length > 0) currentPath.pop();
    } else if (dir.contents[args[1]] && dir.contents[args[1]].type === 'dir') {
      currentPath.push(args[1]);
    } else {
      term.writeln('No such directory: ' + args[1]);
    }
  } else if (command === 'cat') {
    if (args.length < 2) {
      term.writeln('Usage: cat <file>');
    } else if (dir.contents[args[1]] && dir.contents[args[1]].type === 'file') {
      term.writeln(dir.contents[args[1]].content);
    } else {
      term.writeln('No such file: ' + args[1]);
    }
  } else {
    term.writeln(`Command not found: ${command}`);
  }

  prompt();  // Return to the prompt for the next command
}

term.onKey(e => {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.keyCode === 13) {  // Enter key pressed
    if (commandBuffer.trim() !== '') {
      commandHistory.push(commandBuffer);
      historyIndex = commandHistory.length;
    }
    term.writeln('');
    runCommand(commandBuffer);  // Call the function here
    commandBuffer = '';  // Reset commandBuffer after running the command
  } else if (domEvent.keyCode === 8) {  // Backspace key pressed
    if (commandBuffer.length > 0) {
      commandBuffer = commandBuffer.slice(0, -1);
      term.write('\b \b');
    }
  } else if (printable) {
    commandBuffer += key;
    term.write(key);  // Write the key to the terminal
  }
});

term.writeln("Welcome to HackSim.\n");
term.writeln("Operatives from your organization successfully breached the physical security perimeter of the target.\n");
term.writeln("Multiple covert single-board computers (SBCs) were deployed into the network infrastructure, but you currently have access to only one.\n");
term.writeln("Using social engineering and stealth, initial access was obtained.\n");
term.writeln("You are now connected remotely to one of these devices.\n");
term.writeln("Your mission:");
term.writeln("  - Enumerate the local network.");
term.writeln("  - Identify and profile high-value targets.");
term.writeln("  - Move laterally through the organization's internal systems.");
term.writeln("  - Escalate privileges where possible.");
term.writeln("  - Exfiltrate sensitive information without detection.\n");
term.writeln("Proceed with caution. The environment is monitored. Every action counts.\n");

prompt();
</script>
</body>
</html>
