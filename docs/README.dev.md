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
- `menuManager.js` — UI overlay with speed, theme, and flicker controls

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

- Toggle **text speed**: `slow`, `fast`, `instant`
- Set **CRT flicker**: `low`, `medium`, `high`
- Switch **theme**: `green` or `blue`

Settings are saved via `localStorage` and applied using `settings.js` and `setTypingDelay()`.

Terminal focus is restored when the menu is closed.

---

## 📐 Dev Guidelines

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
- More visual polish: transitions, icons, subtle animations

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
