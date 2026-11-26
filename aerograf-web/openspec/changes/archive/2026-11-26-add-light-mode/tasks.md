# Tasks

## 1. CSS light palette

- [x] 1.1 Add `:root[data-theme='light']` variable block in `frontend/styles.css` overriding `--bg-dark`, `--bg-card`, `--bg-input`, `--text-main`, `--text-muted`, `--border-color` and verify by inspecting the stylesheet: `:root` remains the dark default and the new block exists below it
- [x] 1.2 Replace hard-coded hex colors in `styles.css` (e.g. `#0d0f17`, `#1b2238`, `#0a0b10`) with the corresponding variables and verify no raw background hex remains in component selectors except inside the theme blocks

## 2. Theme toggle UI

- [x] 2.1 Add a theme toggle button inside `.navbar nav` in `frontend/index.html` that shows "🌙" when dark is active and "☀️" when light is active, and verify the button exists in the nav markup

## 3. Theme logic

- [x] 3.1 In `frontend/app.js`, on `DOMContentLoaded` resolve theme in order: `localStorage('aerograff-theme')` → `prefers-color-scheme: light` → dark, then apply via `document.documentElement.setAttribute('data-theme', ...)`, and verify by opening the page with OS light mode enabled and seeing the light palette
- [x] 3.2 Add a click handler on the toggle button that flips `data-theme`, updates the button icon, and persists the choice to `localStorage('aerograff-theme')`, and verify by clicking the button and reloading that the theme stays

## 4. Verification

- [x] 4.1 Manually exercise every section (navbar, hero, services, CRUD form/table, calculator, footer) in both themes and confirm no unreadable text or broken layout
- [x] 4.2 Run `openspec validate add-light-mode --strict` and confirm it passes