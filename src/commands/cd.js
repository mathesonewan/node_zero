import state from '../stateManager.js';
import { termPrint } from '../outputManager.js';

export function cdCommand(args) {
  if (!args[1]) {
    termPrint('Usage: cd <directory>');
    return;
  }

  const parts = args[1].split('/').filter(Boolean); // handles things like "cd /home/user"
  let dir = state.machines[state.currentMachine]?.fs['/'];
  let newPath = [...state.currentPath];

  for (const part of parts) {
    if (part === '/') {
      newPath = [];
      dir = state.machines[state.currentMachine]?.fs['/'];
    } else if (part === '..') {
      if (newPath.length > 0) {
        newPath.pop();
        dir = state.machines[state.currentMachine]?.fs['/'];
        for (const sub of newPath) {
          dir = dir.contents?.[sub];
        }
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
