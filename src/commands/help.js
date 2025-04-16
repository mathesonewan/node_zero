import { termPrint } from '../outputManager.js';

export function helpCommand() {
  const helpText = [
    'Available Commands:',
    '  ls           - List directory contents',
    '  cd <dir>     - Change directory',
    '  cat <file>   - View file contents',
    '  clear        - Clear the screen',
    '  help         - Show this help message',
    // You can add future ones like ssh, nmap, ping here
  ];

  helpText.forEach(line => termPrint(line));
}
