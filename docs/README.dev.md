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
- `filesystemManager.js` — runtime FS logic
- `loginManager.js` — handles login sequence and credential routing
- `menuManager.js` — UI overlay with speed and flicker controls (theming disabled)
- `visualFXManager.js` — CRT visual logic (flicker, scanline, burst)
- `inputManager.js` — terminal input parsing and command matching
- `outputManager.js` — print functions: `termPrint()`, `termTypeLine()`, `termClear()`

---

## 📂 Commands

All commands are defined as separate files in `/commands/`.
Each is a named export and handled manually in the switch logic of `inputManager.js`.

```js
// Example: /commands/ls.js
export function lsCommand(args) {
  // command logic
}
```

### ✅ Implemented Commands
- `ls`
- `cd` — supports full path chaining (`cd etc/network`) and relative (`cd ..`)
- `cat` — supports file vs directory detection
- `clear`
- `help`
- `ssh` — fake network jump to secondary machine
- `nmap` — fake subnet scanner
- `ping` — fake success/fail ping
- `ifconfig` — fake network device readout

### 🔒 Not Implemented (by design)
- `mkdir`, `touch`, `echo`, etc. — read-only simulation
- No dispatcher system like `runCommand()` — command routing is explicit

All command output goes through `termPrint()` or `termTypeLine()`.

---

## 🖥️ Menu / UI Features

The menu overlay includes:
- Text speed toggle: `slow`, `fast`, `instant`
- CRT flicker intensity control: `Stable`, `Signal Interference`, `Broken Terminal`
- Skip Boot Sequence toggle (persists via `localStorage`)
- Audio tick toggle (placeholder only)

All settings persist via `settings.js` and apply instantly.
Terminal focus is restored after closing the menu.

> Theme selector has been **disabled** due to xterm.js DOM layering issues. Fallout button removed from UI, logic retained in code.

---

## 🧪 Boot & Login Flow

- Full boot sequence triggered unless `skipIntro` is set
- Boot includes:
  - Faux Linux log output with `[ OK ]`, `[FAIL]`, `[SKIP]`
  - Delays and randomness for realism
  - `Press any key to continue...` gate
- Final screen clear before login prompt
- Login accepts `user@ip` format or defaults to `pendingLogin`
- If credentials match, terminal session is launched

---

## 🧱 Style & Naming

- Public name: `node.zero`
- Safe folder name: `node_zero`
- Prefer `snake_case` in filenames and variables
- UI text styling is loose — lowercased or themed

---

## 🛠️ Development Tips

- Use Git. Commit often. Feature branches preferred.
- Clarity over cleverness — name things cleanly.
- Every command must be testable in isolation.
- Don’t use global dispatchers.
- State always lives in `stateManager.js` — treat it as truth.

---

## 📦 Project Setup

```bash
# No build tools required
# Just open index.html in a browser
```

---

This project is held together with care, spite, and caffeine.
Use the menu. Break the terminal. Stay weird.
