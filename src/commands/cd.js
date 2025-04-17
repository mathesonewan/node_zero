import state from '../stateManager.js';
import { termPrint } from '../outputManager.js';

export function cdCommand(args) {
  if (!args[1]) {
    termPrint('Usage: cd <directory>');
    return;
  }

  const inputPath = args[1];
  const parts = inputPath.split('/').filter(Boolean);
  let newPath = inputPath.startsWith('/') ? [] : [...state.currentPath];
  let dir = state.machines[state.currentMachine]?.fs['/'];

  // Traverse to starting point (based on newPath)
  for (const segment of newPath) {
    if (!dir?.contents?.[segment] || dir.contents[segment].type !== 'dir') {
      termPrint(`${segment} is not a directory or doesn't exist`);
      return;
    }
    dir = dir.contents[segment];
  }

  // Now traverse the new parts
  for (const part of parts) {
    if (part === '..') {
      newPath.pop();
      // Reset dir and walk again
      dir = state.machines[state.currentMachine]?.fs['/'];
      for (const segment of newPath) {
        if (!dir?.contents?.[segment] || dir.contents[segment].type !== 'dir') {
          termPrint(`${segment} is not a directory or doesn't exist`);
          return;
        }
        dir = dir.contents[segment];
      }
    } else {
      if (!dir?.contents?.[part] || dir.contents[part].type !== 'dir') {
        termPrint(`${part} is not a directory or doesn't exist`);
        return;
      }
      newPath.push(part);
      dir = dir.contents[part];
    }
  }

  state.currentPath = newPath;
}
