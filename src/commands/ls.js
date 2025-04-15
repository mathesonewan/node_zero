// commands/ls.js
import state from '../stateManager.js';
import { termPrint } from '../outputManager.js';

export function lsCommand() {
  let dir = state.machines[state.currentMachine]?.fs['/'];
  for (const part of state.currentPath) {
    if (!dir?.contents?.[part]) {
      termPrint('No such directory.');
      return;
    }
    dir = dir.contents[part];
  }

  if (dir.type !== 'dir') {
    termPrint('Not a directory.');
    return;
  }

  const entries = Object.keys(dir.contents || {});
  termPrint(entries.join('    ') || '[empty]');
}
