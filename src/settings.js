// settings.js

const savedInstant = localStorage.getItem('instantText');
const savedDelay = localStorage.getItem('typingDelay');

const settings = {
  skipIntro: true,
  instantText: savedInstant === 'true',
  darkMode: false,
  enableCRT: true
};

if (savedDelay !== null) {
    setTypingDelay(parseInt(savedDelay, 10));
  
    if (savedInstant === 'true') {
      updateSelectedButton('instant');
    } else if (savedDelay === '10') {
      updateSelectedButton('fast');
    } else {
      updateSelectedButton('slow');
    }
  }
  

export default settings;
