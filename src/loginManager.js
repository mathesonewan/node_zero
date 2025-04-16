// loginManager.js

import narrative from './narrative.js';
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

export async function outputIntro() {
  if (!settings.skipIntro) await delay(1500);

  for (const line of narrative.intro) {
    await typeNarrativeLine(line);
    if (!settings.skipIntro) await delay(300);
  }

  state.pendingLogin = '10.10.10.99';
  state.terminal.writeln("\r\nConnecting to SBC_1...");
  state.awaitingUsername = true;
  state.commandBuffer = '';
  state.cursorPosition = 0;
  refreshPrompt('username');
}


async function typeNarrativeLine(line) {
  if (settings.instantText) {
    state.terminal.writeln(line);
    return;
  }

  for (const char of line) {
    state.terminal.write(char);
    if (getTypingDelay() > 0) {
      await delay(getTypingDelay());
    }
  }
  state.terminal.write('\r\n');
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// This function assumes Enter has been pressed
export function handleLoginInput() {
  if (state.awaitingUsername) {
    state.pendingUsername = state.commandBuffer.trim();
    state.commandBuffer = '';
    state.cursorPosition = 0;
    state.awaitingUsername = false;
    state.awaitingPassword = true;

    refreshPrompt('password');
  }

  else if (state.awaitingPassword) {
    const target = systems.find(sys => sys.ip === state.pendingLogin);

    if (target && state.pendingUsername === target.username && state.commandBuffer === target.password) {
      state.terminal.writeln('\r\nWelcome to ' + target.hostname + '!');
      const machineName = target.hostname.replace('.local', '');
      resetSessionState(state.pendingUsername, machineName);

      // Set up the machine's FS if it's a real target
      if (!state.machines[machineName]) {
        state.machines[machineName] = {
          fs: fsTemplates.default(),
          users: {
            [state.pendingUsername]: state.commandBuffer
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
    state.pendingLogin = '10.10.10.99';
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
