// loginManager.js

import { getTypingDelay } from './terminalHandler.js';
import systems from './systems.js';
import state, { resetSessionState } from './stateManager.js';
import fsTemplates from './fsTemplates.js';
import settings from './settings.js';
import { initVisualFX } from './visualFXManager.js';
initVisualFX();

let refreshLineFunc = null;

export async function initLogin(termInstance, refreshLineInstance) {
  state.terminal = termInstance;
  refreshLineFunc = refreshLineInstance;
}

export async function outputIntro(targetIP = null) {
  // If provided, simulate network login
  if (targetIP) {
    state.pendingLogin = targetIP;
    state.terminal.writeln(`\r\nConnecting to ${targetIP}...`);
  } else {
    state.pendingLogin = null;
    state.terminal.writeln(`\r\nWelcome to SBC_1`);
  }

  state.awaitingUsername = true;
  state.commandBuffer = '';
  state.cursorPosition = 0;

  refreshPrompt('username');

  // 🔽 Ensure a new line is printed so the prompt is visible
  state.terminal.write('\r\n');
}


// This function assumes Enter has been pressed
export function handleLoginInput() {
  const input = state.commandBuffer.trim();

  if (state.awaitingUsername) {
    if (!input) {
      state.terminal.writeln('Login error: username required.');
      refreshPrompt('username');
      return;
    }

    state.pendingUsername = input;
    state.commandBuffer = '';
    state.cursorPosition = 0;
    state.awaitingUsername = false;
    state.awaitingPassword = true;

    refreshPrompt('password');
  }

  else if (state.awaitingPassword) {
    const target = systems.find(sys => sys.ip === state.pendingLogin);

    if (target && state.pendingUsername === target.username && input === target.password) {
      state.terminal.writeln('\r\nWelcome to ' + target.hostname + '!');
      const machineName = target.hostname.replace('.local', '');
      resetSessionState(state.pendingUsername, machineName);

      if (!state.machines[machineName]) {
        state.machines[machineName] = {
          fs: fsTemplates.default(),
          users: {
            [state.pendingUsername]: input
          }
        };
      }
    } else {
      state.terminal.writeln('\r\nAccess Denied.');
      state.awaitingPassword = false;
      state.awaitingUsername = true;
      state.terminal.writeln('\r\nReturning to login...');
    }

    // Now clear, after everything
    state.pendingUsername = '';
    state.pendingLogin = null;
    state.commandBuffer = '';
    state.cursorPosition = 0;

    const promptMode = state.awaitingUsername ? 'username' : 'shell';
    refreshPrompt(promptMode);
  }
}

function refreshPrompt(mode) {
  if (refreshLineFunc) {
    refreshLineFunc(mode, state.commandBuffer, state.currentUser, state.currentMachine, state.currentPath);
  }
}
