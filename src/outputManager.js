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
export async function termTypeLine(text, delay = 20) {
  for (const char of text) {
    state.terminal.write(char);
    await new Promise(res => setTimeout(res, delay));
  }
  state.terminal.write('\r\n');
}
