// filesystemManager.js

import state from './stateManager.js';

// Still used if you dynamically assign file systems
export function setFileSystem(fs) {
  state.machines[state.currentMachine].fs = fs;
}

// This stays — modular commands depend on it
export function getCurrentDir() {
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

// Prompt renderer — still needed
export function prompt() {
  if (!Array.isArray(state.currentPath)) {
    console.warn("⚠️ state.currentPath was not an array. Resetting to root.");
    console.trace();
    state.currentPath = [];
  }

  const pathStr = state.currentPath.join('/');
  state.terminal.write(`\r\n${state.currentUser || 'user'}@${state.currentMachine || 'localhost'}:/${pathStr}$ `);
}
