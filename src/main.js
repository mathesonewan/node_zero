import state from './stateManager.js'; // ✅ add this
import { setupTerminal, refreshLine, attachTerminalInput } from './terminalHandler.js';
import { initLogin, outputIntro } from './loginManager.js';
import { handleKeyInput } from './inputManager.js';
import fs from './filesystem.js';
import { setFileSystem } from './filesystemManager.js';
import { initializeMenu } from './menuManager.js';

initializeMenu(); // 👈 Add this


// 1. Set up the terminal
setupTerminal();

// 2. Attach the key input handler
attachTerminalInput(handleKeyInput);

// 3. Set up the fake file system
setFileSystem(fs);

// 4. Start the login flow
setTimeout(async () => {
  try {
    const { startBootSequence } = await import('./bootSequence.js');
    await startBootSequence();
  } catch (err) {
    console.error("Boot sequence failed:", err);
  }
}, 200);

