# TODO.md — node.zero Active Work

This file tracks actual, in-progress development. Use it to coordinate short-term tasks and validate implemented behavior.

---

## 🔧 Immediate Tasks
- [ ] Final boot sequence polish (randomized pacing, fail/warn logic, press-any-key block)
- [ ] Clear screen after boot before login prompt
- [ ] Ensure `skipIntro` logic works cleanly and avoids dupe output
- [ ] Remove all `narrative.js` calls except placeholder import

---

## 🧪 Test & Confirm
- [ ] Typing delays behave correctly across all `termTypeLine` calls
- [ ] Login prompt is always reached after skip OR full boot
- [ ] Menu toggle for boot skip reflects persistent state
- [ ] `refreshPrompt()` doesn't silently fail — safe fallback logic works

---

## 🧼 Cleanup / Refactors
- [ ] Strip legacy intro line from `outputIntro()`
- [ ] Drop `typeNarrativeLine()` unless reused
- [ ] Archive or comment-out unused narrative stubs
- [ ] Sanity-check `settings.js` default loading logic

---

## 🪟 Visual / UX Enhancements
- [ ] Add CRT boot burst (flash or flicker spike)
- [ ] Shake effect or vibration pulse on system wake
- [ ] Future: cursor blink toggle or pacing adjustment

---

## 🧭 Future Candidates (short-term)
- [ ] `narrativeManager` stub (file-bound message triggers)
- [ ] Spinner glyph loop support in boot output
- [ ] Soft-disable commands like `mkdir`, `touch`, `echo` (return "read-only FS")
- [ ] Alternate boot flags (`--safe`, `--verbose`) passed via state injection

---

> This replaces stray TODOs from dev logs, README, and blackbox.md.