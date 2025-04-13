export function startAnimations() {
    const scanline = document.getElementById('scanline');
  
    function randomizeScanlineTiming() {
      const curves = [
        'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'cubic-bezier(0.42, 0, 0.58, 1.0)',
        'cubic-bezier(0.4, 0.0, 1, 1)',
        'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'cubic-bezier(0.5, 1.5, 0.5, 1)',
        'linear'
      ];
      const randomCurve = curves[Math.floor(Math.random() * curves.length)];
      if (scanline) {
        scanline.style.animationTimingFunction = randomCurve;
      }
    }
  
    setInterval(randomizeScanlineTiming, 4000);
  }
  