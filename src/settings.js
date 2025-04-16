const savedInstant = localStorage.getItem('instantText');
const savedDelay = localStorage.getItem('typingDelay');

const settings = {
  skipIntro: true,
  instantText: savedInstant === 'true',
  darkMode: false,
  enableCRT: true,
  crtFlicker: localStorage.getItem('crtFlicker') || 'medium',
  terminalTheme: localStorage.getItem('terminalTheme') || 'green'
};
export default settings;
