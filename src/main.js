import { setupTerminal, attachTerminalInput, term, refreshLine } from './terminalHandler.js';
import { initLogin, handleKeyInput, outputIntro } from './loginManager.js';
import { initializeMenu } from './menuManager.js';
import { startAnimations } from './animations.js';

setupTerminal();
initLogin(term, refreshLine);
attachTerminalInput(handleKeyInput);
outputIntro();
initializeMenu();
startAnimations();
