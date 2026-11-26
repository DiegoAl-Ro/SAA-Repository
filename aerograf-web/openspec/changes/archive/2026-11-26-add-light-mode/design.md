# Design

## Context

The AeroGraff AI frontend currently ships a single dark cyberpunk theme. All colors are defined once in `:root` of `frontend/styles.css` (`--bg-dark`, `--bg-card`, `--accent-cyan`, etc.), and every component consumes those variables. There is no mechanism to switch themes at runtime or to respect the user's OS-level `prefers-color-scheme`.

The goal is to introduce a light mode that:

- Reuses the existing CSS variable architecture (no rewrite)
- Defaults to the user's OS preference when available
- Offers a manual toggle in the navbar
- Persists the user's choice between visits
- Keeps the dark theme as the default fallback

## Goals / Non-Goals

**Goals:**
- Define a parallel light palette in CSS variables
- Add a `data-theme` attribute switch on `<html>`
- Detect `prefers-color-scheme` and apply the matching theme on first load
- Provide a navbar toggle that flips the theme immediately
- Persist the user's choice in `localStorage` so it survives reloads
- Ensure every existing component (navbar, hero, cards, forms, tables, badges, buttons) renders correctly in both themes

**Non-Goals:**
- Changing any layout, spacing, or animation behavior
- Adding per-component custom themes beyond light/dark
- Backend changes (this is purely a frontend concern)
- Supporting IE11 or browsers without CSS custom properties

## Decisions

### 1. Theme switching via `data-theme` attribute on `<html>`

**Decision**: Use `document.documentElement.setAttribute('data-theme', 'light' | 'dark')` and scope CSS variables under `:root[data-theme='light']`.

**Rationale**: Works with the existing variable-based architecture, requires no class toggling on every component, and is easy to test.

**Alternative considered**: A `.light-mode` class on `<body>`. Rejected because it would require touching every component selector; the `data-theme` attribute keeps the cascade clean.

### 2. Default theme resolution order

**Decision**: On page load, resolve the theme in this order:

1. `localStorage.getItem('aerograff-theme')` (explicit user choice)
2. `window.matchMedia('(prefers-color-scheme: light)').matches` → light
3. Fallback to dark

**Rationale**: Respects the user's manual choice first, then their OS preference, then the existing dark default. No surprises for returning users.

### 3. CSS variable strategy

**Decision**: Keep the existing `:root` variables as the dark palette. Add a second block `:root[data-theme='light']` that overrides only the variables that change:

```css
:root[data-theme='light'] {
  --bg-dark: #f5f7fa;
  --bg-card: #ffffff;
  --bg-input: #f0f2f5;
  --text-main: #1a1d29;
  --text-muted: #5a6478;
  --border-color: #d8dde6;
}
```

Accent colors (`--accent-cyan`, `--accent-magenta`) stay identical in both themes to preserve the brand identity.

**Rationale**: Minimal diff, no component-level changes needed.

**Alternative considered**: Duplicate the entire stylesheet for light mode. Rejected as unmaintainable.

### 4. Toggle UI placement

**Decision**: Add a single button in `.navbar nav` labeled "🌙" / "☀️" that reflects the *current* theme and toggles to the opposite.

**Rationale**: Visible, discoverable, and consistent with the existing nav layout.

### 5. Persistence

**Decision**: Write the chosen theme to `localStorage` under the key `aerograff-theme` on every toggle.

**Rationale**: Users expect their choice to stick. `localStorage` is synchronous, requires no backend, and works offline.

## Risks / Trade-offs

- **[Risk] Some hard-coded colors in `styles.css` (e.g., `#0d0f17` for `.crud-section`, `#1b2238` for hero gradient) will not adapt automatically.** → Mitigation: replace those literals with variables during implementation, or add theme-specific overrides in the `[data-theme='light']` block.
- **[Risk] `prefers-color-scheme` changes while the page is open are not watched.** → Mitigation: out of scope for this change; can be added later with a `matchMedia` listener.
- **[Risk] localStorage unavailable in private browsing.** → Mitigation: wrap in try/catch; fall back to OS preference if storage throws.
- **[Trade-off] Accent colors stay the same in both themes.** → This keeps brand consistency but may need a future tweak for contrast ratios in light mode.

## Migration Plan

No migration required — this is an additive frontend change with no data or API impact. Rollback is simply reverting the three modified files (`styles.css`, `index.html`, `app.js`).

## Open Questions

None — all decisions are resolved at design time.
