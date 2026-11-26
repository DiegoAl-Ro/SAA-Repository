# Proposal

## Why

Add a light mode (modo claro) to the AeroGraff AI web application to improve accessibility and user comfort in well-lit environments. The current dark-only theme (`--bg-dark: #0a0b10`) can cause eye strain during extended use in bright conditions, and light mode is a commonly expected accessibility feature.

## What Changes

- Add CSS variables for light mode color scheme
- Implement CSS `prefers-color-scheme` media query support
- Add a toggle button in the navbar to switch between light and dark modes
- Update the `<html>` root element to use the `data-theme` attribute
- Ensure all existing components adapt gracefully to the new color scheme

## Capabilities

### New Capabilities

- `ui/light-mode`: Provides theme switching between light and dark modes with system preference detection and manual toggle. This capability owns the CSS variables, media queries, and UI controls for theme management.

### Modified Capabilities

- None — no existing capability requirements are changing; only new theme infrastructure is being added.

## Impact

- **CSS**: New variables for light mode in `frontend/styles.css`
- **HTML**: `<html>` element will use `data-theme="light"|"dark"` attribute
- **JavaScript**: Theme toggle logic in `frontend/app.js`
- **Accessibility**: Improved contrast options, respects `prefers-color-scheme`
- **No breaking changes** — all existing layouts and functionality remain identical; only color values change

---

*This proposal establishes the "why" and "what" for the light mode feature. Implementation details belong in design.md.*