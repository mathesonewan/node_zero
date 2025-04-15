// filesystemManager.js

import state from './stateManager.js';
import systems from './systems.js';

export function setFileSystem(fs) {
  state.machines[state.currentMachine].fs = fs;
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
    state.terminal.writeln('Filesystem error: invalid path');
    prompt();
    return;
  }

  switch (command) {
    case 'ls':
      if (dir.type === 'dir') {
        state.terminal.writeln(Object.keys(dir.contents).join('    '));
      } else {
        state.terminal.writeln('Not a directory.');
      }
      break;

    case 'cd':
      if (state.currentMachine !== 'SBC_1' && !state.machines[state.currentMachine]) {
        state.terminal.writeln('You must be connected to a machine to use cd.');
      } else if (args.length < 2) {
        state.terminal.writeln('Usage: cd <directory>');
      } else if (args[1] === '..') {
        if (state.currentPath.length > 0) state.currentPath.pop();
      } else if (args[1] === '/') {
        state.currentPath = [];
      } else if (dir.contents && dir.contents[args[1]] && dir.contents[args[1]].type === 'dir') {
        state.currentPath.push(args[1]);
      } else {
        state.terminal.writeln('No such directory: ' + args[1]);
      }
      break;

    case 'cat':
      if (!state.currentMachine) {
        state.terminal.writeln('You must be connected to a machine to use cat.');
      } else if (args.length < 2) {
        state.terminal.writeln('Usage: cat <file>');
      } else if (dir.contents && dir.contents[args[1]] && dir.contents[args[1]].type === 'file') {
        state.terminal.writeln(dir.contents[args[1]].content);
      } else {
        state.terminal.writeln('No such file: ' + args[1]);
      }
      break;

    case 'clear':
      state.terminal.clear();
      prompt();
      return;

    case 'nmap':
      if (args.length < 2) {
        state.terminal.writeln('Usage: nmap <subnet>');
      } else {
        const subnet = args[1].split('/')[0].split('.').slice(0, 3).join('.') + '.';
        state.terminal.writeln(`Starting Nmap scan on ${subnet}0/24`);
        let found = false;
        systems.forEach(system => {
          if (system.ip.startsWith(subnet)) {
            state.terminal.writeln(`Host ${system.ip} (${system.hostname}) is up`);
            found = true;
          }
        });
        if (!found) {
          state.terminal.writeln('No hosts found.');
        }
      }
      break;

    case 'ping':
      if (args.length < 2) {
        state.terminal.writeln('Usage: ping <ip>');
      } else {
        const targetIp = args[1];
        const target = systems.find(system => system.ip === targetIp);
        if (target) {
          state.terminal.writeln(`Pinging ${targetIp} (${target.hostname})... Success!`);
        } else {
          state.terminal.writeln(`Pinging ${targetIp}... No response.`);
        }
      }
      break;

    case 'ifconfig':
      state.terminal.writeln('eth0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500');
      state.terminal.writeln('        inet 192.168.1.2  netmask 255.255.255.0  broadcast 192.168.1.255');
      state.terminal.writeln('        ether b8:27:eb:ad:2b:0e  txqueuelen 1000  (Ethernet)');
      state.terminal.writeln('        RX packets 12345  bytes 6789012 (6.7 MB)');
      state.terminal.writeln('        TX packets 2345  bytes 123456 (123.4 KB)');
      state.terminal.writeln('        inet6 fe80::ba27:ebff:fead:2b0e  prefixlen 64  scopeid 0x20<link>');
      prompt();
      return;

    case 'help':
      state.terminal.writeln('Available Commands:');
      state.terminal.writeln('  ls           - List directory contents');
      state.terminal.writeln('  cd <dir>     - Change directory');
      state.terminal.writeln('  cat <file>   - View file contents');
      state.terminal.writeln('  clear        - Clear the screen');
      state.terminal.writeln('  ssh user@ip  - Connect to a machine');
      state.terminal.writeln('  nmap subnet  - Scan network for machines');
      state.terminal.writeln('  ping ip      - Ping a host');
      state.terminal.writeln('  ifconfig     - View network settings');
      state.terminal.writeln('  help         - Show this help message');
      prompt();
      return;

    default:
      state.terminal.writeln(`Command not found: ${command}`);
  }

  prompt();
}

function getCurrentDir() {
  if (!Array.isArray(state.currentPath)) {
    console.error("DEBUG: currentPath is not an array");
    return null;
  }

  const machine = state.machines[state.currentMachine];
  if (!machine) {
    console.error(`DEBUG: Invalid currentMachine: ${state.currentMachine}`);
    return null;
  }

  let dir = machine.fs['/'];
  for (const part of state.currentPath) {
    dir = dir?.contents?.[part];
    if (!dir) {
      console.error(`DEBUG: Directory not found: ${part}`);
      return null;
    }
  }

  return dir;
}









function prompt() {
  if (!Array.isArray(state.currentPath)) {
    console.warn("⚠️ state.currentPath was not an array. Resetting to root.");
    console.trace();
    state.currentPath = [];
  }

  const pathStr = state.currentPath.join('/'); // 👈 this is the missing bit
  state.terminal.write(`\r\n${state.currentUser || 'user'}@${state.currentMachine || 'localhost'}:/${pathStr}$ `);
}
