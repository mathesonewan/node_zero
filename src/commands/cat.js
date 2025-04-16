import state from '../stateManager.js';
import { termPrint } from '../outputManager.js';

export function catCommand(args) {
  if (!args[1]) {
    termPrint('Usage: cat <file>');
    return;
  }

  let dir = state.machines[state.currentMachine]?.fs['/'];
  for (const part of state.currentPath) {
    if (!dir?.contents?.[part]) {
      termPrint('Invalid path.');
      return;
    }
    dir = dir.contents[part];
  }

  const file = dir.contents?.[args[1]];

  if (file?.type === 'file') {
    termPrint(file.content);
  } else {
    termPrint(`No such file: ${args[1]}`);
  }
}
