# node.zero - Changelog

## [Unreleased]

### Added
- Full CRT flicker overhaul with low/medium/high intensity tiers
- Scanline opacity and movement scaled to flicker intensity
- Menu overlay fully wired to all controls with `.selected` state logic
- Audio and skip boot checkboxes wired to persistent settings
- Text speed control synced to typing engine with instant mode
- `visualFXManager.js` created to centralize all CRT visual logic
- `outputManager.js`, `filesystemManager.js`, and `inputManager.js` reviewed and confirmed stable
- Menu `X` close button repositioned for better UX targeting
- README.dev.md and project documentation updated with new architecture and visuals
- Defensive state loading in `settings.js` for localStorage persistence

### Changed
- `styles.css` cleaned and restructured with clear sections and comments
- Menu button visuals normalized with fallback styles for unselected state
- Theme selector removed from menu UI; logic preserved for future use
- Fallout theme officially disabled (xterm color override not cooperating)
- Confirmed continued use of switch-based command routing (no dispatcher)

### Fixed
- Bug where menu buttons appeared visually broken without `.selected`
- Terminal background color not applying due to xterm DOM separation

---

## [Previous Commits]

### 0.1.0 - Initial working build
- Login screen with username/password entry
- Commands implemented: ls, cd, cat, help, clear
- Basic fake SSH system with network node switch
- Intro narrative wired in (early stage)
- Initial menu overlay added with working open/close
- Early CRT visuals (static flicker, basic glow)
