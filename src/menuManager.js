import { setTypingDelay } from './terminalHandler.js';

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
      });
    }
  
    // --- Text Speed Control Buttons ---
    const slowButton = document.getElementById('slowTextSpeed');
    const fastButton = document.getElementById('fastTextSpeed');
    const instantButton = document.getElementById('instantTextSpeed');
  
    if (slowButton && fastButton && instantButton) {
      slowButton.addEventListener('click', () => {
        localStorage.setItem('settypingDelay', '40');
        typingDelay = 40;
      });
  
      fastButton.addEventListener('click', () => {
        localStorage.setItem('settypingDelay', '10');
        typingDelay = 10;
      });
  
      instantButton.addEventListener('click', () => {
        localStorage.setItem('settypingDelay', '0');
        typingDelay = 0;
      });
    }
  
    // --- Flicker Intensity Control Buttons ---
    const flickerLow = document.getElementById('flickerLow');
    const flickerMedium = document.getElementById('flickerMedium');
    const flickerHigh = document.getElementById('flickerHigh');
  
    if (flickerLow && flickerMedium && flickerHigh) {
      flickerLow.addEventListener('click', () => {
        document.getElementById('terminal').style.animationDuration = '12s';
      });
  
      flickerMedium.addEventListener('click', () => {
        document.getElementById('terminal').style.animationDuration = '8s';
      });
  
      flickerHigh.addEventListener('click', () => {
        document.getElementById('terminal').style.animationDuration = '4s';
      });
    }
  
    // --- Theme Color Control Buttons ---
    const themeGreen = document.getElementById('themeGreen');
    const themeBlue = document.getElementById('themeBlue');
  
    if (themeGreen && themeBlue) {
      themeGreen.addEventListener('click', () => {
        document.getElementById('terminal').style.backgroundColor = '#001100';
        document.getElementById('terminal').style.color = '#00FF00';
      });
  
      themeBlue.addEventListener('click', () => {
        document.getElementById('terminal').style.backgroundColor = '#001122';
        document.getElementById('terminal').style.color = '#00FFFF';
      });
    }
  
    // --- Load saved text speed if available on startup ---
    const savedTypingDelay = localStorage.getItem('typingDelay');
    if (savedTypingDelay !== null) {
      typingDelay = parseInt(savedTypingDelay, 10);
    }
  }
  