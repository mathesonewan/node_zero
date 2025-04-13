import narrative from './narrative.js';
import { getTypingDelay } from './terminalHandler.js';
import systems from './systems.js';
import { runCommand } from './filesystemManager.js';

let terminal = null;
let refreshLineFunc = null;
let commandBuffer = '';
let cursorPosition = 0;
let commandHistory = [];
let historyIndex = -1;

export let currentMachine = null;
export let currentUsername = '';
export let currentHostname = '';
export let pendingLogin = '10.10.10.99';
export let pendingUsername = '';
export let awaitingUsername = false;
export let awaitingPassword = false;
export let currentPath = [];
export { commandBuffer, cursorPosition };

export async function initLogin(termInstance, refreshLineInstance) {
  terminal = termInstance;
  refreshLineFunc = refreshLineInstance;
}

export async function outputIntro() {
  await delay(1500);

  for (const line of narrative.intro) {
    await typeNarrativeLine(line);
    await delay(300);
  }

  terminal.writeln("\r\nConnecting to SBC_1...");
  terminal.write("\r\nUsername: ");
  awaitingUsername = true;
}

async function typeNarrativeLine(line) {
  for (const char of line) {
    terminal.write(char);
    if (getTypingDelay() > 0) {
      await delay(getTypingDelay());
    }
  }
  terminal.write('\r\n');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function handleKeyInput(e) {
  const { key, domEvent } = e;
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

  if (domEvent.key === 'Enter') {
    domEvent.preventDefault();
    terminal.write('\r\n');

    if (awaitingUsername) {
      pendingUsername = commandBuffer.trim();
      commandBuffer = '';
      cursorPosition = 0;
      awaitingUsername = false;
      awaitingPassword = true;

      if (refreshLineFunc) {
        refreshLineFunc('password', commandBuffer, currentUsername, currentHostname, currentPath);
      }
    }
    else if (awaitingPassword) {
      const target = systems.find(sys => sys.ip === pendingLogin);

      if (target && pendingUsername === target.username && commandBuffer === target.password) {
        terminal.writeln('\r\nWelcome to ' + target.hostname + '!');
        currentUsername = pendingUsername;
        currentHostname = target.hostname.replace('.local', '');
        currentMachine = "SBC_1"; // Force set currentMachine to SBC_1 after login
        currentPath = [];
        awaitingPassword = false;
      } else {
        terminal.writeln('\r\nAccess Denied.');
        awaitingPassword = false;
        awaitingUsername = true;
        terminal.writeln('\r\nReturning to login...');
      }

      pendingUsername = '';
      pendingLogin = '10.10.10.99';
      commandBuffer = '';
      cursorPosition = 0;

      if (refreshLineFunc) {
        const promptMode = awaitingUsername ? 'username' : 'shell';
        refreshLineFunc(promptMode, commandBuffer, currentUsername, currentHostname, currentPath);
      }
    }
    else {
      if (commandBuffer.trim() !== '') {
        commandHistory.push(commandBuffer);
      }
      historyIndex = commandHistory.length;
      runCommand(commandBuffer);
      commandBuffer = '';
      cursorPosition = 0;

      if (refreshLineFunc) {
        refreshLineFunc('shell', commandBuffer, currentUsername, currentHostname, currentPath);
      }
    }
  }
  else if (printable) {
    domEvent.preventDefault();
    commandBuffer = commandBuffer.slice(0, cursorPosition) + key + commandBuffer.slice(cursorPosition);
    cursorPosition++;

    if (refreshLineFunc) {
      const promptMode = awaitingUsername ? 'username' :
                         awaitingPassword ? 'password' : 'shell';
      refreshLineFunc(promptMode, commandBuffer, currentUsername, currentHostname, currentPath);
    }
  }
  else if (domEvent.key === 'Backspace') {
    domEvent.preventDefault();
    if (cursorPosition > 0) {
      commandBuffer = commandBuffer.slice(0, cursorPosition - 1) + commandBuffer.slice(cursorPosition);
      cursorPosition--;
  
      // Immediately refresh the line after deletion
      if (refreshLineFunc) {
        if (awaitingUsername) {
          refreshLineFunc('username', commandBuffer, currentUsername, currentHostname, currentPath);
        } else if (awaitingPassword) {
          refreshLineFunc('password', commandBuffer, currentUsername, currentHostname, currentPath);
        } else {
          refreshLineFunc('shell', commandBuffer, currentUsername, currentHostname, currentPath);
        }
      }
    }
  }
}  
