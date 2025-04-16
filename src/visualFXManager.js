console.log("settings import test:", settings);


// visualFXManager.js

import settings from './settings.js';

let terminal = null;
let scanline = null;

export function initVisualFX() {
  terminal = document.getElementById('terminal');
  scanline = document.getElementById('scanline');

  // Apply initial settings from saved state or defaults
  applyFlicker(settings.crtFlicker || 'medium');
  applyTheme(settings.terminalTheme || 'green');
}

// ---- CRT Flicker ----
export function applyFlicker(level) {
    if (!terminal || !scanline) return;
  
    settings.crtFlicker = level;
    localStorage.setItem('crtFlicker', level);
  
    terminal.style.animation = 'none';
    void terminal.offsetWidth; // force reflow
  
    switch (level) {
        case 'low':
            terminal.style.animation = 'flickerLow 12s ease-in-out infinite';
            scanline.style.opacity = '0.2';
            break;
          
          case 'medium':
            terminal.style.animation = 'flickerMed 6s steps(1, end) infinite';
            scanline.style.opacity = '0.4';
            break;
          
          case 'high':
            terminal.style.animation = 'flickerHigh 2s steps(1, end) infinite, terminalSkew 8s linear infinite';
            scanline.style.opacity = '0.7';
            break;
          
      default:
        console.warn(`Unknown flicker level: ${level}`);
    }
  }
  

// ---- Theme ----
export function applyTheme(theme) {
  if (!terminal) return;

  settings.terminalTheme = theme;
  localStorage.setItem('terminalTheme', theme);

  switch (theme) {
    case 'green':
      terminal.style.backgroundColor = '#001100';
      terminal.style.color = '#00FF00';
      break;
    case 'blue':
      terminal.style.backgroundColor = '#001122';
      terminal.style.color = '#00FFFF';
      break;
    default:
      console.warn(`Unknown theme: ${theme}`);
  }
}

// ---- Expansion Hooks (not implemented yet) ----
export function triggerStartupBurst() {
  // For future: flash white/green overlay briefly on load
}

export function pulseDistortion() {
  // For future: add horizontal skew or visual noise on keypress spam
}
