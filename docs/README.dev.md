# node.zero — Developer README

Welcome to the dev side of `node.zero`: a modular, CRT-styled terminal simulation built in JavaScript using `xterm.js`. This isn't a toy — it's a fake system that acts like a real one. Modular commands, persistent settings, login flow, fake filesystem. No bullshit.

---

## 🧠 Project Philosophy

`node.zero` should feel alive, responsive, and internally consistent. It’s not a "simulator" — it’s a modular environment that mimics a real terminal. Everything is built for extensibility.

---

## ⚙️ Core Architecture

**Frontend:** HTML / CSS / JS with `xterm.js` for terminal emulation.

**Core Modules:**
- `stateManager.js` — global runtime state store
- `settings.js` — persistent config (e.g., `instantText`, `typingDelay`)
- `filesystem.js` — base filesystem structure
- `fsTemplates.js` — cloned templates for per-machine FS
- `loginManager.js` — handles intro, login, and prompt boot
- `menuManager.js` — UI overlay with speed and flicker controls (theming temporarily disabled)
- `visualFXManager.js` — controls CRT visuals like flicker, scanline, skew

---

## 📂 Commands

All commands are implemented as named exports inside `/commands/`. For example:

<!--
Note: Code block formatting below is commented out to prevent markdown rendering issues
in some preview engines. Edit with caution.
-->

//```js
// export function lsCommand(args) { ... }
// export function cdCommand(args) { ... }
//```

**Implemented commands:**
- `ls`
- `cd` — supports multi-level paths (e.g., `cd home/user`)
- `cat` — includes file/dir detection
- `clear`
- `help`

Commands **do not** use a global dispatcher like `runCommand()`. Routing is **explicitly mapped** from input.

All output is printed using `termPrint()` for consistency.

---

## 🖥️ Menu / UI Features

The menu overlay allows users to:

- Toggle **narrative text speed**: `slow`, `fast`, `instant`
- Set **CRT flicker intensity**: `Stable CRT`, `Signal Interference`, `Broken Terminal`
- Enable/disable **boot sequence**
- Toggle **audio click sounds** (placeholder only)

Settings are saved via `localStorage` and applied using `settings.js`, `setTypingDelay()`, and `visualFXManager.js`.

Terminal focus is restored after the menu closes. Visual feedback (`.selected`) is applied consistently.

**Note:** Theme support is temporarily disabled due to xterm.js limitations. Button removed from UI, logic retained.

---

## 🖐️ Dev Guidelines

- Use Git. Commit often. Branch for features.
- Clarity > Cleverness. Name things properly.
- Keep commands modular — **one file per command**.
- `stateManager.js` is the source of runtime truth.
- `settings.js` holds **only** persistent user prefs.
- New commands should be testable in isolation and explicitly registered.

---

## 🧱 Style & Naming

- Public name: `node.zero`
- System-safe repo/folder name: `node_zero`
- Internal naming: prefer `snake_case`
- UI text: lowercase or stylized casing is fine

---

## 🔮 Roadmap

- Splash screen: “Press any key to continue”
- Simulated Linux boot sequence
- New commands: `mkdir`, `touch`, `ssh`, `ping`, etc.
- Dummy networked nodes (some real, some faked)
- Visual polish: startup flicker burst, noise variation, RGB ghosting
- Keypress-triggered distortion events
- Scanline and vignette refinements
- Future reimplementation of theme system using `xterm.setOption('theme', {...})`

---

## 🚀 Getting Started

1. Clone the repo
2. Open in VS Code or your browser of choice
3. Run `index.html` locally or deploy via GitHub Pages
4. Open the terminal, click the menu, tweak settings
5. Start hacking

---

This thing’s held together with **care** and **chaos**.  
Welcome aboard.
