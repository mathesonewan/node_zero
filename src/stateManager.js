// stateManager.js

import defaultFS from './filesystem.js'; // Optional, in case localhost needs it too

const state = {
  currentUser: null,
  currentMachine: 'localhost',
  currentPath: [],
  commandBuffer: '',
  cursorPosition: 0,
  loginComplete: false,
  terminal: null, // xterm.js instance (assigned at runtime)
  commandHistory: [],
  awaitingUsername: false,
  awaitingPassword: false,

  machines: {
    localhost: {
      fs: defaultFS,
      users: {
        admin: 'password123',
        guest: 'guest'
      }
    }
  }
};

// Helper to initialize session after successful login
export function resetSessionState(username, machineName) {
  state.currentUser = username;
  state.currentMachine = machineName;
  state.currentPath = [];
  state.commandBuffer = '';
  state.cursorPosition = 0;
  state.loginComplete = true;
  state.awaitingUsername = false;
  state.awaitingPassword = false;
}

// Optional: helper to log out/reset session (not used yet)
export function logoutSession() {
  state.currentUser = null;
  state.currentMachine = null;
  state.currentPath = [];
  state.commandBuffer = '';
  state.cursorPosition = 0;
  state.loginComplete = false;
  state.awaitingUsername = false;
  state.awaitingPassword = false;
}

export default state;
