// outputManager.js

import state from './stateManager.js';

/**
 * Write a single line to the terminal with a newline.
 */
export function termPrint(text = '') {
  state.terminal.writeln(text);
}

/**
 * Write multiple lines to the terminal, one after the other.
 */
export function termPrintLines(lines = []) {
  lines.forEach(line => state.terminal.writeln(line));
}

/**
 * Clear the terminal screen.
 */
export function termClear() {
  state.terminal.clear();
}

/**
 * Write a line with simulated typing (optional for effect).
 */
export async function termTypeLine(line, delay = 10) {
  console.log('🖋️ termTypeLine called with:', line);

  if (!state.terminal) {
    console.warn('⚠️ termTypeLine: No terminal instance found');
    return;
  }

  for (let char of line) {
    state.terminal.write(char);
    await sleep(delay);
  }
  state.terminal.write('\r\n');
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

