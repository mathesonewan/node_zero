import { setTypingDelay } from './terminalHandler.js';
import settings from './settings.js';
import state from './stateManager.js';
import { applyFlicker, applyTheme } from './visualFXManager.js';

export function initializeMenu() {
  const menuButton = document.getElementById('menuButton');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenu = document.getElementById('closeMenu');

  if (menuButton && menuOverlay && closeMenu) {
    menuButton.addEventListener('click', () => {
      menuOverlay.style.display = 'flex';
      menuButton.style.display = 'none';
    });

    closeMenu.addEventListener('click', () => {
      menuOverlay.style.display = 'none';
      menuButton.style.display = 'block';
    
      console.log('Trying to focus terminal...');
      console.log('state.terminal:', state.terminal);
      setTimeout(() => {
        console.log('Focusing after timeout...');
        if (state.terminal) {
          console.log('Terminal found, calling focus()');
          state.terminal.focus();
        } else {
          console.warn('Terminal not ready.');
        }
      }, 0);
      

      // Restore terminal focus
      setTimeout(() => {
        if (state.terminal) {
          state.terminal.focus();
        }
      }, 0);
    });
    
  }

  // --- Text Speed Buttons ---
  const slowButton = document.getElementById('slowNarrativeSpeed');
  const fastButton = document.getElementById('fastNarrativeSpeed');
  const instantButton = document.getElementById('instantNarrativeSpeed');
  
const buttons = {
  slow: slowButton,
  fast: fastButton,
  instant: instantButton
};

function updateSelectedButton(selectedKey) {
  Object.entries(buttons).forEach(([key, el]) => {
    if (el) {
      el.classList.toggle('selected', key === selectedKey);
    }
  });
}

if (slowButton && fastButton && instantButton) {
  slowButton.addEventListener('click', () => {
    settings.instantText = false;
    updateSelectedButton('slow');
    setTypingDelay(40);
    localStorage.setItem('typingDelay', '40');
    localStorage.setItem('instantText', 'false');
  });

  fastButton.addEventListener('click', () => {
    settings.instantText = false;
    updateSelectedButton('fast');
    setTypingDelay(10);
    localStorage.setItem('typingDelay', '10');
    localStorage.setItem('instantText', 'false');
  });

  instantButton.addEventListener('click', () => {
    settings.instantText = true;
    updateSelectedButton('instant');
    setTypingDelay(0);
    localStorage.setItem('typingDelay', '0');
    localStorage.setItem('instantText', 'true');
  });
}

  // --- Flicker Controls ---
const flickerLow = document.getElementById('flickerLow');
const flickerMedium = document.getElementById('flickerMedium');
const flickerHigh = document.getElementById('flickerHigh');

const flickerButtons = {
  low: flickerLow,
  medium: flickerMedium,
  high: flickerHigh
};

function updateFlickerSelected(level) {
  Object.entries(flickerButtons).forEach(([key, el]) => {
    if (el) {
      el.classList.toggle('selected', key === level);
    }
  });
}

if (flickerLow && flickerMedium && flickerHigh) {
  flickerLow.addEventListener('click', () => {
    updateFlickerSelected('low');
    applyFlicker('low');
  });

  flickerMedium.addEventListener('click', () => {
    updateFlickerSelected('medium');
    applyFlicker('medium');
  });

  flickerHigh.addEventListener('click', () => {
    updateFlickerSelected('high');
    applyFlicker('high');
  });

  // Restore selection on load
  updateFlickerSelected(settings.crtFlicker || 'medium');
}


  // --- Theme Controls ---
const themeGreen = document.getElementById('themeGreen');
const themeBlue = document.getElementById('themeBlue');

const themeButtons = {
  green: themeGreen,
  blue: themeBlue
};

function updateThemeSelected(theme) {
  Object.entries(themeButtons).forEach(([key, el]) => {
    if (el) {
      el.classList.toggle('selected', key === theme);
    }
  });
}

if (themeGreen && themeBlue) {
  themeGreen.addEventListener('click', () => {
    updateThemeSelected('green');
    applyTheme('green');
  });

  themeBlue.addEventListener('click', () => {
    updateThemeSelected('blue');
    applyTheme('blue');
  });

  // Restore selection on load
  updateThemeSelected(settings.terminalTheme || 'green');
}


   // --- Apply saved settings on load ---
   const savedDelay = localStorage.getItem('typingDelay');
   const savedInstant = localStorage.getItem('instantText');
 
   if (savedDelay !== null) {
     setTypingDelay(parseInt(savedDelay, 10));
   }
 
   settings.instantText = savedInstant === 'true';
 
   // --- Reflect saved speed in UI ---
   if (savedInstant === 'true') {
     updateSelectedButton('instant');
   } else if (savedDelay === '10') {
     updateSelectedButton('fast');
   } else {
     updateSelectedButton('slow');
   }
  }