import { term } from './terminalHandler.js';
import { currentUsername, currentHostname, currentPath} from './loginManager.js';
import systems from './systems.js';

export let fileSystem = {};
export let currentMachine = null;

export function setFileSystem(fs) {
  fileSystem = fs;
}

export function runCommand(input) {
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

  else if (command === 'clear') {
    term.clear();
    prompt();
    return;
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

function getCurrentDir() {
  if (!currentMachine) return fileSystem['/'];
  let dir = fileSystem['/']['contents'][currentMachine];
  for (const part of currentPath) {
    if (!dir.contents || !dir.contents[part]) return null;
    dir = dir.contents[part];
  }
  return dir;
}

function prompt() {
  term.write(`\r\n${currentUsername || 'user'}@${currentHostname || 'SBC_1'}:/${currentPath.join('/')}$ `);
}
