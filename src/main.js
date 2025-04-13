import { setupTerminal, attachTerminalInput, term, refreshLine } from './terminalHandler.js';
import { initLogin, handleKeyInput, outputIntro } from './loginManager.js';
import { initializeMenu } from './menuManager.js';
import { startAnimations } from './animations.js';
import fs from './filesystem.js';
import { setFileSystem } from './filesystemManager.js';

// Filesystem must be loaded BEFORE setupTerminal()
setFileSystem(fs);

setupTerminal();
initLogin(term, refreshLine);
attachTerminalInput(handleKeyInput);
outputIntro();
initializeMenu();
startAnimations();
