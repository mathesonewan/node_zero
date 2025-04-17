# RESET.md — Session Handshake for node.zero

This file is used to carry essential project context into a clean chat session. Paste or reference this file when resetting context with ChatGPT.

---

## 🔍 Project Identity
- Project name: `node.zero`
- System-safe name: `node_zero`
- Project type: CRT-style fake terminal sim, built on `xterm.js`
- Development environment: HTML, JavaScript, CSS, no build step
- Current status: **modular**, **stable**, **actively evolving**

---

## 🔫 Core Design Principles
- Simulates a Linux-style terminal (not just emulated)
- CRT visual effects: noise, flicker, scanline, glow
- Modular command structure (`/commands/`) — explicit routing only
- Persistent user settings via `localStorage`
- Realistic UX: typed prompts, login, SSH simulation
- Designed for narrative, training, or game use — with strong UX polish

---

## ⚖️ Visual & UX Systems
- Visual effects handled by `visualFXManager.js`
- Three flicker tiers: low (soft pulse), medium (irregular blink), high (chaotic strobe)
- Scanline and glow adjust with flicker
- Scanline motion uses CSS keyframe animation with `cubic-bezier` easing for smooth vertical sweep
- Each flicker tier modifies scanline animation duration and easing curve for different visual character
- Visual behavior is driven purely by CSS — no JS canvas or DOM draw routines are used
- Theme switching disabled due to xterm.js override conflicts
- Fallout theme logic exists but button is hidden in menu
- Menu buttons styled consistently with `.selected` feedback
- `styles.css` fully cleaned and structured with comments

---

## 📂 File Architecture Highlights
- `main.js` — system boot, prompt flow, module loading
- `settings.js` — loads/saves persistent config (`typingDelay`, `instantText`, `skipBoot`, `audioEnabled`)
- `stateManager.js` — global runtime state
- `menuManager.js` — menu open/close, button hooks, sync to settings
- `visualFXManager.js` — all CRT-related animation logic
- `filesystem.js`, `fsTemplates.js`, `filesystemManager.js` — virtual FS structure and logic
- `inputManager.js` — keyboard input, command parsing, login gatekeeping
- `outputManager.js` — consistent output helpers (`termPrint`, etc)
- `commands/*.js` — modular per-command implementations

---

## 📚 Project Documentation Files

These support files provide full project context. ChatGPT should assume it does **not** have access to these unless they are explicitly uploaded during the current session.

| File                    | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `README.dev.md`         | What is currently implemented — the ground truth for live systems       |
| `projectdocumentation.md` | Detailed breakdowns of implementation decisions, component summaries, and rationale |
| `blackbox.md`           | Deferred ideas, speculative features, future architecture               |
| `RESET.md`              | Session handshake, tone control, formatting rules, model constraints    |
| `tasklist.md`           | Active task tracking, system-level TODOs (maintained manually)          |
| `changelog.md`          | History of completed changes and feature locks                          |

**Note:** ChatGPT must always request relevant files before suggesting changes or referencing implementation details. Do not assume prior content unless it was uploaded this session.

---

## ✅ Recently Locked Features
- Full menu wiring and `.selected` visual state syncing
- Text speed control (`instantText`) + typing delay handling
- Persistent toggles: skip boot, audio enable (placeholder)
- Flicker visuals with tier-based keyframes
- Terminal focus logic cleaned and restored on menu close
- All visual logic centralized via `visualFXManager.js`

---

## 🚫 Known Limits / Disabled Systems
- Theme system is disabled (xterm ignores container styles)
- Fallout button removed from menu (logic remains)
- Dispatcher-based command routing intentionally rejected

---

## 👉 Use This File To:
- Quickly re-establish full project context after a reset
- Remind ChatGPT of the architectural and UX philosophy
- Sync all active system files and implementation decisions
- Avoid re-reviewing files like `menuManager.js` or `visualFXManager.js` unless modified

---

## 👉 Session Safeguards
- Always assume ChatGPT has not seen actual code unless files are re-uploaded during the current session
- Never suggest implementation changes without explicitly requesting the relevant source files first
- RESET.md establishes architecture and design intent — but code logic must be confirmed per-session

---

## 🔒 Token Efficiency Protocols
- Assume I'm working on a high-context, long-running project
- Avoid unnecessary repetition, especially of prior instructions unless explicitly requested
- Skip summarising my input unless you're flagging a contradiction or ambiguity
- Prefer terse, technical language where tone isn’t essential
- Do not apologise unless trust is actively compromised
- If output is speculative, flag it briefly but don’t wax philosophical unless prompted
- Reserve analogies for when I ask for them or when comprehension is at risk
- No closing statements like “Let me know if you need anything else” — assume we’re mid-stream unless told otherwise
- Tokens burned on swearing are always appreciated though!

---

## 📛 Code Output Format Preference
- Always use inline code snippets (triple backtick blocks)
- Do not use or invoke OpenAI's code Canvas editor
- This avoids formatting issues, context loss, and supports user’s manual workflow
- Respect this even if OpenAI enforces Canvas as a default interface

---

**End of RESET.md**
