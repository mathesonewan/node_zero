# Changelog

## [Initial Brody Commit] - 2024-05-17

### Added
- Full terminal interface with xterm.js and FitAddon
- CRT-style visual effects: flicker, scanlines, burn-in, static noise
- Basic filesystem simulation with ls, cd, cat commands
- SSH login system with username/password authentication
- Dynamic user@hostname prompt updating after SSH
- Fake network tools: nmap, ping, ifconfig
- Boot sequence intro narrative (placeholder)
- Menu overlay system (audio toggle, text speed, skip boot, flicker, scanlines, theme)
- Menu opening/closing fully working

### Known Issues
- Menu settings (audio, text speed, etc.) are visual only, not wired yet
- Narrative needs final writing pass
- Distortion effects removed intentionally for stability

---

**Project is fully stable at this checkpoint.  
Ready for feature expansion.**

---

## [Structural Modularization Staging] - 2024-05-18

### Added
- Created `stateManager.js` for centralized state handling (currently commented, staged for activation).
- Created `inputManager.js` for dedicated terminal input handling (currently commented, staged for activation).

### Changed
- Refactored login and filesystem logic to prepare for cleaner module boundaries.
- Separated core system states from command execution and login handling.
- Identified clear path for incremental activation and stability testing.

### Known Issues
- `stateManager.js` and `inputManager.js` are present but not yet active.
- CD navigation on SBC_1 pending final confirmation.
- Menu settings (audio, flicker level, theme color) still not wired.

**Project remains stable.  
Staged modular upgrades ready for next activation phase.**

