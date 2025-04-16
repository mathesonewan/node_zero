const savedInstant = localStorage.getItem('instantText');
const savedDelay = localStorage.getItem('typingDelay');

const settings = {
  skipIntro: localStorage.getItem('skipIntro') === 'true',
  instantText: savedInstant === null ? false : savedInstant === 'true',
  darkMode: false,
  enableCRT: true,
  crtFlicker: localStorage.getItem('crtFlicker') || 'medium',
  terminalTheme: localStorage.getItem('terminalTheme') || 'green',
  audioEnabled: localStorage.getItem('audioEnabled') === 'true'
};

export default settings;
