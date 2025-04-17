// refreshPrompt.js

import state from './stateManager.js';
import { prompt } from './filesystemManager.js';

export function refreshPrompt(forcedUser = null) {
  if (forcedUser) {
    state.currentUser = forcedUser;
  }
  prompt();
}
