# projectdocumentation.md — node.zero (Golden Copy)

This file serves as a stable implementation reference. Unlike `README.dev.md`, this includes detailed system maps, variable definitions, and technical commentary.

---

## 🎛️ Visual Effects Matrix

| Effect | Status | Notes |
|:------|:------|:------|
| CRT Background | ✅ | #001100 radioactive green |
| Terminal Text Glow | ✅ | Multi-layer green shadows |
| Flicker | ✅ | 3-tier system (low, medium, high) |
| Scanlines | ✅ | Animated vertical sweep, tied to flicker intensity |
| Noise Layer | ✅ | Static + subtle drift overlays |
| Burn-in / Ghosting | ✅ | Text ghosting blend layer |
| Startup Flash | ⏳ | Planned: boot burst pulse |
| Vignette | ⏳ | Planned: dark corners radial gradient |
| RGB Ghosting | ⏳ | Planned: subtle chromatic offset |

---

## 🖥️ Terminal Emulation

| Feature | Status | Notes |
|:--------|:-------|:------|
| xterm.js integration | ✅ | FitAddon enabled |
| Hidden Scrollbar | ✅ | CRT-style UX |
| Responsive Scaling | ✅ | Resizes with window |
| Auto-scroll | ✅ | Default behavior |
| Char Wrapping | ✅ | Native xterm logic |

---

## 🧠 State Variables

| Variable | Purpose |
|:---------|:--------|
| `currentMachine` | Current connected node (IP) |
| `currentUsername` | Logged-in user |
| `currentHostname` | Active machine hostname |
| `pendingLogin` | IP queued for login attempt |
| `pendingUsername` | Temp user input during login |
| `awaitingUsername` | Awaiting username entry |
| `awaitingPassword` | Awaiting password entry |
| `commandBuffer` | Current typed command text |
| `commandHistory` | Array of all previous commands |
| `historyIndex` | Navigation through history |
| `currentPath` | Current working directory |

---

## 📁 File Overview

| File | Purpose |
|:-----|:--------|
| `index.html` | Terminal shell + overlay entrypoint |
| `styles.css` | Core CRT layout + menu styling |
| `main.js` | Boot and top-level init control |
| `filesystem.js` | Filesystem structure base |
| `fsTemplates.js` | Per-node FS templates |
| `filesystemManager.js` | Runtime FS operations |
| `systems.js` | Machine IP and credential map |
| `stateManager.js` | Single truth runtime store |
| `inputManager.js` | Command parsing + routing |
| `outputManager.js` | Output helpers (type, print, clear) |
| `settings.js` | localStorage management |
| `visualFXManager.js` | Flicker/scanline/effects controller |
| `menuManager.js` | UI panel logic, toggle, sync |
| `loginManager.js` | Login logic + post-boot setup |
| `terminalHandler.js` | Prompt refresh + typing delay |
| `bootSequence.js` | Full boot experience manager |

---

## 🗂️ Menu Overlay

| Element | Status | Notes |
|:--------|:-------|:------|
| Menu Button | ✅ | Top right, green border |
| Overlay Panel | ✅ | Full screen, semi-transparent |
| Close Button (X) | ✅ | Accessible via hover or click |
| Audio Toggle | ✅ | Placeholder wiring only |
| Text Speed Select | ✅ | Controls typing pace |
| Skip Boot Checkbox | ✅ | Fully wired, localStorage-backed |
| CRT Flicker Select | ✅ | Cycles intensity tier visually |
| Theme Selector | ❌ | Fallout option removed — xterm override issues |

---

## 🔧 Available Commands

| Command | Status | Notes |
|:--------|:-------|:------|
| `ls` | ✅ | Lists current directory |
| `cd` | ✅ | Handles relative and root paths |
| `cat` | ✅ | Reads text content |
| `clear` | ✅ | Clears screen |
| `ssh` | ✅ | Switches node via auth |
| `nmap` | ✅ | Reveals machine IPs |
| `ping` | ✅ | Fake up/down check |
| `ifconfig` | ✅ | Shows fake device info |
| `help` | ✅ | Lists valid commands |

Note: **No write commands supported** (`mkdir`, `touch`, etc. intentionally omitted).

---

## 🌐 Simulated Network

| Feature | Status | Notes |
|:--------|:-------|:------|
| SSH Login | ✅ | IP + user/password auth |
| Hostname Stripping | ✅ | Removes `.local` for brevity |
| Discovery (nmap) | ✅ | Fake subnet map |
| Ping | ✅ | Returns `up/down` for known machines |

---

## 🧪 Boot Sequence Notes

- Full log sequence includes ~40 lines of `[ OK ]`, `[WARN]`, `[FAIL]`, `[SKIP]`
- Lines typed using `termTypeLine()` with random pacing delays
- Critical lines pause longer (e.g., microcode failure)
- Ends with "SBC_1 ready", then clears to login
- Guarded by `skipIntro` toggle via menu → stored in `settings.js`

---

## 🪵 Known Issues

| Issue | Impact | Notes |
|:------|:-------|:------|
| xterm ignores background CSS | Low | Theme override not working |
| `animations.js` | Unknown | Verify before deletion |
| `narrative.js` | Deprecated | Reserved for future `narrativeManager` system |

---

## 🧭 Internal Naming

| Label | Meaning |
|:------|:--------|
| `node.zero` | Public/project name |
| `node_zero` | Safe version (filepaths, URLs, etc.) |

---

## 🗒️ Dev Notes

- Visual fidelity confirmed across flicker tiers
- Menu reflects full persistent state
- Login/boot system now modular
- File structure is logically grouped by purpose

> This doc reflects implemented behavior. For roadmap/ideas, see `TODO.md` and `blackbox.md`.

