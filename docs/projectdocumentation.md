# HackSim Web Terminal - Project Documentation (Golden Copy)

---

## 📜 Visual Effects

| Effect | Status | Notes |
|:------|:------|:------|
| CRT Green Background | ✅ | #001100 dark radioactive green |
| Terminal Text Glow | ✅ | Multiple green glow layers |
| Flicker Animation | ✅ | Smooth opacity flicker every 8s |
| Scanlines | ✅ | Randomized movement, cubic-bezier curves |
| Noise Layer (Static + Moving) | ✅ | Strong CRT static noise |
| Burn-in Layer | ✅ | Subtle ghosting overlay |

---

## 🖥️ Terminal Behavior

| Feature | Status | Notes |
|:--------|:-------|:------|
| Full xterm.js Integration | ✅ | FitAddon enabled |
| Scrollbar Hidden | ✅ | Pure CRT aesthetic |
| Responsive Resizing | ✅ | Terminal resizes with browser window |
| Auto-scroll to Bottom | ✅ | Default xterm.js behavior |
| Character Wrapping | ✅ | Default (not per-word) |

---

## 🧠 System Variables

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
| `main.js` | Terminal logic, SSH login, filesystem handling |
| `narrative.js` | Intro narrative text |
| `filesystem.js` | Virtual file tree for machines |
| `systems.js` | IPs, hostnames, usernames, passwords database |

---

## 🗂️ Menu (Overlay)

| Element | Status | Notes |
|:--------|:-------|:------|
| Menu Button (top right) | ✅ | Green themed, fixed position |
| Menu Overlay | ✅ | Full screen, semi-transparent black |
| Close (X) Button | ✅ | Dismisses overlay |
| Audio Toggle | ✅ | Visual only (no wired function yet) |
| Text Speed Setting | ✅ | Visual only |
| Skip Boot Sequence | ✅ | Visual only |
| CRT Flicker Intensity Dropdown | ✅ | Visual only |
| Scanlines Toggle | ✅ | Visual only |
| Theme Color Selector | ✅ | Visual only |

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

---

## 🛜 Network Simulation

| Feature | Status | Notes |
|:--------|:-------|:------|
| SSH Connections | ✅ | User/pass authentication |
| Hostname Handling | ✅ | `.local` stripped for prompt clarity |
| System Discovery (nmap) | ✅ | Subnet scanning |
| Fake Ping | ✅ | Up/down detection |

---

## 🛑 Known Issues

| Issue | Impact | Notes |
|:------|:------|:------|
| Menu Settings not wired | Low | Audio, Flicker Level, Theme Color, etc. |
| Distortion Visual Effects Removed | Low | Deliberate for stability |
| Boot Narrative Text | Low | Needs full customization pass |

---

# 📋 Notes

- Project is now stable.
- Visuals and Terminal behavior fully matched to early design goals.
- Ready for new feature expansions (e.g., audio, real settings, ASCII animations).

