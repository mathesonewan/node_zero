// inputManager.js

import state from './stateManager.js';
import { refreshLine } from './terminalHandler.js';
import { runCommand } from './filesystemManager.js';
import { handleLoginInput } from './loginManager.js';

// Handles all key events from terminal
export function handleKeyInput(e) {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  // Prevent xterm from doing anything on its own
  domEvent.preventDefault();

  // Handle Enter key
  if (domEvent.key === 'Enter') {
    state.terminal.write('\r\n');

    if (state.loginComplete) {
      if (state.commandBuffer.trim() !== '') {
        state.commandHistory.push(state.commandBuffer);
      }
      state.historyIndex = state.commandHistory.length;
      runCommand(state.commandBuffer);
      state.commandBuffer = '';
      state.cursorPosition = 0;
    } else {
        handleLoginInput();
      
        // 🔧 Clear the buffer AFTER handling username step
        if (state.awaitingPassword && !state.loginComplete) {
          state.commandBuffer = '';
          state.cursorPosition = 0;
        }
      }
    refreshLine(getPromptMode(), state.commandBuffer, state.currentUser, state.currentMachine, [state.currentPath]);
    return;
  }

  // Handle Backspace
  if (domEvent.key === 'Backspace') {
    if (state.cursorPosition > 0) {
      state.commandBuffer = state.commandBuffer.slice(0, state.cursorPosition - 1) + state.commandBuffer.slice(state.cursorPosition);
      state.cursorPosition--;
    }
    refreshLine(getPromptMode(), state.commandBuffer, state.currentUser, state.currentMachine, [state.currentPath]);
    return;
  }

  // Handle Arrow Up / Down for history
  if (domEvent.key === 'ArrowUp') {
    if (state.commandHistory.length > 0 && state.historyIndex > 0) {
      state.historyIndex--;
      state.commandBuffer = state.commandHistory[state.historyIndex];
      state.cursorPosition = state.commandBuffer.length;
      refreshLine(getPromptMode(), state.commandBuffer, state.currentUser, state.currentMachine, [state.currentPath]);
    }
    return;
  }

  if (domEvent.key === 'ArrowDown') {
    if (state.historyIndex < state.commandHistory.length - 1) {
      state.historyIndex++;
      state.commandBuffer = state.commandHistory[state.historyIndex];
    } else {
      state.historyIndex = state.commandHistory.length;
      state.commandBuffer = '';
    }
    state.cursorPosition = state.commandBuffer.length;
    refreshLine(getPromptMode(), state.commandBuffer, state.currentUser, state.currentMachine, [state.currentPath]);
    return;
  }

  // Handle printable character input
  if (printable && key.length === 1) {
    state.commandBuffer = state.commandBuffer.slice(0, state.cursorPosition) + key + state.commandBuffer.slice(state.cursorPosition);
    state.cursorPosition++;
    refreshLine(getPromptMode(), state.commandBuffer, state.currentUser, state.currentMachine, [state.currentPath]);
  }
}

function getPromptMode() {
    if (state.awaitingUsername) return 'username';
    if (state.awaitingPassword && !state.loginComplete) return 'password';
    return 'shell';
  }
  
