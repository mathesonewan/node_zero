# blackbox.md — deferred features + experimental intent

This document contains features, concepts, and systems intentionally kept outside formal documentation. They are:
- Not scheduled
- Not promised
- Not forgotten

These are system ideas that belong to node.zero, but haven’t earned their place yet.

---

## 🎵 Audio: Procedural Sound System (Tone.js)
- [ ] Replace all future `.mp3`/`.wav` sfx with synth-based patches
- [ ] Integrate Tone.js
- [ ] Boot burst = short noise envelope + distortion
- [ ] Keystroke = randomized membrane blip (C1/C2)
- [ ] Output tick = sine ramp, possibly layered
- [ ] Audio setting toggle already exists — logic slot is ready

---

## 🛠️ Visual: Rough.js Network Map Overlay
- [ ] Add new menu tab: `Network Map`
- [ ] As user discovers machines (e.g., via `nmap`), dynamically draw boxes
- [ ] Use Rough.js to sketch connections (lines, circles, labels)
- [ ] Animate new discoveries as they appear: draw lines first, fade in text
- [ ] Integrate with `state.discoveredMachines` or similar
- [ ] Possibly use SVG overlay instead of canvas for easier control

---

## 🚀 Terminal FX: Glitches, Distortion, Startups
- [ ] `triggerStartupBurst()` in `visualFXManager.js` is a stub — implement full-screen CRT zap
- [ ] Add optional CRT drone / background hum (slow LFO synth?)
- [ ] Trigger screen skew or horizontal offset when key-spam detected
- [ ] Possibly tie into `termTypeLine()` or keystroke burst
- [ ] Consider subtle random vibration layer for `Broken Terminal` flicker level

---

## 🎨 Style/Art Intentions
- [ ] Introduce scanline curvature simulation (mild barrel distortion via CSS or SVG mask)
- [ ] Consider ghost trails (RGB shadow splitting on fast flickers)
- [ ] Explore per-character delay on narrative output (already modular)
- [ ] Add option to toggle alternate typefaces (e.g. CRT monospace vs modern)

---

## 📁 Filesystem/Narrative Hooks
- [ ] Ability to uncover hidden files or systems via commands (`strings`, `grep`, etc.)
- [ ] Narrative triggers bound to FS traversal (e.g., reading certain files triggers messages)
- [ ] Optional: reveal parts of the network map via file discovery

---

## 🤖 AI or Simulated Operators
- [ ] Add simulated user sessions (e.g., `who`, `last`, `ps`) for immersion
- [ ] NPCs leaving logs in home dirs (text files written by simulated users)
- [ ] Fake system messages, warnings, service banners

---

## ⚠️ Caution: Implementation Considerations
- CRT audio will need gating or envelope smoothing to avoid sonic fatigue
- Rough.js sketch map may require camera/panning logic for larger networks
- Memory impact of continuous Tone.js synthesis loops must be monitored

---

*Open carefully.*
