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
$1

---

## 💣 Terminal Payload: Fake Encryption Sequence
$1

---

## 🧮 Audio Sequencing: Pattern Generation + Tracker Logic
$1

---

## 🌀 Wreckage Mode: Generative System Fusion
- [ ] Inspired by 65daysofstatic's Wreckage Systems
- [ ] Tie system state (node integrity, login status, system compromise) to audio synthesis
- [ ] Allow degradation of visual fidelity to bleed into pitch modulation, envelope distortion, and FX warping
- [ ] Let discovered nodes introduce new audio layers or modulations
- [ ] Use Tone.js Transport and sequencing to build evolving, non-looping sonic behavior
- [ ] Simulate system 'personality drift' through slow modulation of all audiovisual layers
- [ ] Final state may be irreversible system collapse — musical, visual, and mechanical---

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
$1

---

## 🧰 Framework / Reuse Potential
$1

---

## 🕳️ Shell Engine Extraction (for Future Projects)
$1

---

## 🧨 CLI Horror Game (Post-node.zero)
- [ ] Build psychological horror experience fully within a terminal interface
- [ ] Inspired by: Doki Doki Literature Club, Stories Untold, GlitchHiker
- [ ] Use system behavior as narrative (prompts glitching, outputs lying, files rewriting)
- [ ] No jumpscares — dread comes from meta disobedience
- [ ] System watches user, interrupts flow, breaks fourth wall
- [ ] Filesystem used as narrative device: you explore it, it explores back
- [ ] Build atop node.zero shellEngine but with stripped-down UI and tighter control of pacing

**Note:** Parked here to avoid distraction. DO NOT start until node.zero is complete and sealed.---

## 🧭 Design Rule of Thumb
> **Does this feature make the system more *alive*, or just more *complete*?**
>
> If it’s **alive** → belongs in core.
> If it’s just **complete** → keep it blackboxed or kill it.

---

*Open carefully.*
