# HackSim Web Terminal - Project Documentation (Golden Copy)

---

## 📜 Visual Effects

| Effect | Status | Notes |
|:------|:------|:------|
| CRT Green Background | ✅ | #001100 dark radioactive green |
| Terminal Text Glow | ✅ | Multiple green glow layers |
| Flicker Animation | ✅ | Tiered intensity: low (smooth), medium (irregular), high (chaotic) |
| Scanlines | ✅ | Vertical sweep with brightness scaling by intensity |
| Noise Layer (Static + Moving) | ✅ | Two overlapping noise layers, drift included |
| Burn-in Layer | ✅ | Subtle ghosting overlay |
| Distortion Pulse | ⏳ | Planned: triggered by key-spam or random event |
| Startup Flash / Burst | ⏳ | Planned: one-time CRT flash during boot |
| Vignette/Dark Corners | ⏳ | Planned: radial gradient overlay |
| RGB Ghosting | ⏳ | Planned: text shadow smearing at high intensity |

---

## 💻 Terminal Behavior

| Feature | Status | Notes |
|:--------|:-------|:------|
| Full xterm.js Integration | ✅ | FitAddon enabled |
| Scrollbar Hidden | ✅ | Pure CRT aesthetic |
| Responsive Resizing | ✅ | Terminal resizes with browser window |
| Auto-scroll to Bottom | ✅ | Default xterm.js behavior |
| Character Wrapping | ✅ | Default (not per-word) |

---

## 🧐 System Variables

| Variable | Purpose |
|:---------|:--------|
| `currentMachine` | Tracks current SSH machine IP |
| `currentUsername` | Tracks logged-in username |
| `currentHostname` | Tracks connected machine hostname (stripped `.local`) |
| `pendingLogin` | IP address pending login |
| `pendingUsername` | Username pending login |
| `awaitingUsername` | Waiting for username input |
| `awaitingPassword` | Waiting for password input |
| `commandBuffer` | Current command input |
| `commandHistory` | Array of previous commands |
| `historyIndex` | Index for cycling command history |
| `currentPath` | Filesystem navigation path |

---

## 📂 File Structure

| File | Purpose |
|:-----|:--------|
| `index.html` | Core layout: Terminal + Visual Layers + Menu |
| `styles.css` | CRT theming, menu styling, animations |
| `main.js` | Terminal setup, boot, menu init |
| `narrative.js` | (Unreviewed) Intro narrative text engine |
| `filesystem.js` | Base filesystem structure |
| `fsTemplates.js` | Per-machine filesystem cloning |
| `filesystemManager.js` | ✅ | Modular FS logic, safe fallback handling |
| `systems.js` | (Unreviewed) Machine credentials/IP registry |
| `stateManager.js` | ✅ | Central runtime state store |
| `inputManager.js` | ✅ | Raw input + command parsing, stable structure |
| `outputManager.js` | ✅ | `termPrint`, `termClear`, typing system |
| `settings.js` | ✅ | Persistent state handling via localStorage |
| `visualFXManager.js` | ✅ | Flicker tiers, theming (disabled), scanlines |
| `menuManager.js` | ✅ | UI overlay logic, `.selected` sync, checkbox handlers |
| `loginManager.js` | ✅ | Boot + login logic |
| `terminalHandler.js` | ✅ | Typing delay + prompt helper |
| `animations.js` | (Unreviewed) unknown purpose — likely CRT/narrative |

---

## 🗂️ Menu (Overlay)

| Element | Status | Notes |
|:--------|:-------|:------|
| Menu Button (top right) | ✅ | Green themed, fixed position |
| Menu Overlay | ✅ | Full screen, semi-transparent black |
| Close (X) Button | ✅ | Repositioned for easier click-back from MENU |
| Audio Toggle | ✅ | Wired, setting persisted (placeholder only) |
| Text Speed Setting | ✅ | Fully wired with localStorage persistence |
| Skip Boot Sequence | ✅ | Fully wired with persistence |
| CRT Flicker Intensity Buttons | ✅ | Fully wired, visually distinct tiers |
| Theme Color Selector | ❌ | Feature disabled, Fallout button hidden (logic preserved) |

---

## 🔧 Commands Implemented

| Command | Status | Notes |
|:--------|:-------|:------|
| `ls` | ✅ | Lists contents of current directory |
| `cd <dir>` | ✅ | Change into subdirectory |
| `cd ..` | ✅ | Move up one directory |
| `cd /` | ✅ | Reset to root |
| `cat <file>` | ✅ | Display file contents |
| `clear` | ✅ | Clears the terminal screen |
| `ssh user@ip` | ✅ | SSH into a remote machine |
| `nmap subnet` | ✅ | Fake network scan |
| `ping ip` | ✅ | Fake ping response |
| `ifconfig` | ✅ | Fake network adapter config |
| `help` | ✅ | Lists available commands |

**Note:** Project will not support fake write ops like `mkdir`. Command routing will remain explicit.

---

## 📻 Network Simulation

| Feature | Status | Notes |
|:--------|:-------|:------|
| SSH Connections | ✅ | User/pass authentication |
| Hostname Handling | ✅ | `.local` stripped for prompt clarity |
| System Discovery (nmap) | ✅ | Subnet scanning |
| Fake Ping | ✅ | Up/down detection |

---

## ⛔️ Known Issues

| Issue | Impact | Notes |
|:------|:------|:------|
| Theme switching broken in xterm | Low | `#terminal` color ignored by xterm rendering engine |
| Boot Narrative Text | Low | Needs full customization pass |
| `animations.js` | Unknown | Possibly unused; verify before clean-up |

---

# 📋 Notes

- Visual polish now matches design intent
- Menu system is fully operational
- Flicker and CRT effects upgraded for realism
- Theming logic retained but UI disabled
- Input, output, and file logic reviewed and stable

---

# 📋 Additional Updates (2024-05-18+)

## 📦 Structural Modularization & Preparation

| Change | Status | Notes |
|:-------|:-------|:------|
| Created `stateManager.js` | ✅ | Centralized state management module |
| Created `inputManager.js` | ✅ | Dedicated terminal input handler |
| Refactored login and filesystem logic | ✅ | Modular, isolated logic per concern |
| Separated local vs remote machine logic | ✅ | Handles networked node simulation |
| Added `visualFXManager.js` | ✅ | CRT flicker/scanline/delay management |
| Menu fully wired | ✅ | Buttons, checkboxes, and settings now fully interactive |

**System is modular and stable. Next phase: boot sequence, splash animation, glitch enhancements, and narrative refinement.**
