# TODO.md — node.zero Active Work

This file tracks actual, in-progress development. Use it to coordinate short-term tasks and validate implemented behavior.

---

## ✅ Completed This Session
- [x] Final boot sequence polish (randomized pacing, fail/warn logic, press-any-key block)
- [x] Clear screen after boot before login prompt
- [x] Ensure `skipIntro` logic works cleanly and avoids dupe output
- [x] Add CRT boot burst (flash effect)
- [x] Fix terminal visibility after blackout (removed opacity traps)
- [x] Confirm terminal output via `termTypeLine()` is live
- [x] Clean `bootSequence.js` — self-contained, stable
- [x] Spinner glyph loop support in boot output

---

## 🔧 Immediate Tasks
- [ ] Implement commands for working at the network layer (e.g. `traceroute`, `whois`, `netstat`)
- [ ] Begin building the initial mission logic

---

## 🧪 Test & Confirm
- [ ] Login prompt is always reached after skip OR full boot
- [ ] Menu toggle for boot skip reflects persistent state
- [ ] `refreshPrompt()` doesn't silently fail — safe fallback logic works

---

## 🧼 Cleanup / Refactors
- [ ] Remove all `narrative.js` calls except placeholder import
- [ ] Strip legacy intro line from `outputIntro()`
- [ ] Drop `typeNarrativeLine()` unless reused
- [ ] Archive or comment-out unused narrative stubs
- [ ] Sanity-check `settings.js` default loading logic

---

## 🪟 Visual / UX Enhancements (on hold)
- [ ] Shake effect or vibration pulse on system wake
- [ ] Future: cursor blink toggle or pacing adjustment
- [ ] Migrate scanline, flicker, and boot burst effects to `fx-layer` canvas for cleaner CRT simulation
  - `fx-layer` is visual-only and stacked above `#terminal`
  - Intended for refraction, distortion, glow, and polished glass effects
  - Will replace DOM-based scanlines and flicker overlays


---

## 🧭 Future Candidates (short-term)
- [ ] `narrativeManager` stub (file-bound message triggers)
- [ ] Soft-disable commands like `mkdir`, `touch`, `echo` (return "read-only FS")
- [ ] Alternate boot flags (`--safe`, `--verbose`) passed via state injection

---

> Visual work is paused — focus is now on network systems and mission framework.

