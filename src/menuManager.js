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

      setTimeout(() => {
        if (state.terminal) {
          state.terminal.focus();
        } else {
          console.warn('Terminal not ready.');
        }
      }, 0);
    });
  }

  // --- Narrative Speed Buttons ---
  const slowButton = document.getElementById('slowNarrativeSpeed');
  const fastButton = document.getElementById('fastNarrativeSpeed');
  const instantButton = document.getElementById('instantNarrativeSpeed');

  const speedButtons = {
    slow: slowButton,
    fast: fastButton,
    instant: instantButton
  };

  function updateSpeedSelected(selectedKey) {
    Object.entries(speedButtons).forEach(([key, el]) => {
      if (el) {
        el.classList.toggle('selected', key === selectedKey);
      }
    });
  }

  if (slowButton && fastButton && instantButton) {
    slowButton.addEventListener('click', () => {
      settings.instantText = false;
      updateSpeedSelected('slow');
      setTypingDelay(40);
      localStorage.setItem('typingDelay', '40');
      localStorage.setItem('instantText', 'false');
    });

    fastButton.addEventListener('click', () => {
      settings.instantText = false;
      updateSpeedSelected('fast');
      setTypingDelay(10);
      localStorage.setItem('typingDelay', '10');
      localStorage.setItem('instantText', 'false');
    });

    instantButton.addEventListener('click', () => {
      settings.instantText = true;
      updateSpeedSelected('instant');
      setTypingDelay(0);
      localStorage.setItem('typingDelay', '0');
      localStorage.setItem('instantText', 'true');
    });
  }

  // --- Flicker Intensity Buttons ---
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

    updateFlickerSelected(settings.crtFlicker || 'medium');
  }

  // --- Theme Buttons ---
  const themeMatrix = document.getElementById('themeGreen');
  const themeFallout = document.getElementById('themeYellow');

  const themeButtons = {
    green: themeMatrix,
    yellow: themeFallout
  };

  function updateThemeSelected(theme) {
    Object.entries(themeButtons).forEach(([key, el]) => {
      if (el) el.classList.toggle('selected', key === theme);
    });
  }

  if (themeMatrix && themeFallout) {
    themeMatrix.addEventListener('click', () => {
      applyTheme('green');
      updateThemeSelected('green');
    });

    themeFallout.addEventListener('click', () => {
      applyTheme('yellow');
      updateThemeSelected('yellow');
    });

    updateThemeSelected(settings.terminalTheme || 'green');
  }

  // --- Checkboxes ---
  function bindCheckbox(id, settingKey) {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.checked = settings[settingKey] || false;
      checkbox.addEventListener('change', () => {
        settings[settingKey] = checkbox.checked;
        localStorage.setItem(settingKey, checkbox.checked);
      });
    }
  }

  bindCheckbox('audioToggle', 'audioEnabled');
  bindCheckbox('skipBoot', 'skipIntro');

  // --- Apply saved settings ---
  const savedDelay = localStorage.getItem('typingDelay');
  const savedInstant = localStorage.getItem('instantText');

  if (savedDelay !== null) {
    setTypingDelay(parseInt(savedDelay, 10));
  }

  settings.instantText = savedInstant === 'true';

  if (savedInstant === 'true') {
    updateSpeedSelected('instant');
  } else if (savedDelay === '10') {
    updateSpeedSelected('fast');
  } else {
    updateSpeedSelected('slow');
  }
}
