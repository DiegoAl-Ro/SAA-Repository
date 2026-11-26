# ui/light-mode Specification

## Purpose

Provides a Light Mode (modo claro) UI option for AeroGraff AI so users can view the application in a lighter color scheme, improving comfort in well-lit environments and meeting accessibility standards.

## Requirements

### Requirement: Theme switch from navigation bar
The navbar SHALL contain a toggle button that switches the page between light and dark themes when clicked.

#### Scenario: Click the theme toggle while dark mode is active
- **WHEN** user clicks the navbar theme toggle button while the page is in dark mode
- **THEN** the document element gets `data-theme="light"` and the button icon changes to indicate light mode is active.

### Requirement: Resolve system preference as default
The system SHALL default to the light theme when the browser reports a light color-scheme preference and no explicit choice was saved.

#### Scenario: User has OS light mode enabled with no saved preference
- **WHEN** browser reports `prefers-color-scheme: light` and no saved theme exists
- **THEN** the `<html>` root gets `data-theme="light"` on page load.

### Requirement: Dark mode remains available via manual toggle
Users SHALL be able to manually select dark mode at any time, and that choice SHALL persist across page reloads.

#### Scenario: User toggles to dark mode and reloads
- **WHEN** user clicks the navbar theme toggle until dark mode is active, then reloads the page
- **THEN** the document element retains `data-theme="dark"` and the dark palette variables are used.

### Requirement: All UI elements adapt to both themes
Every component (navbar, hero, cards, forms, tables, buttons) SHALL render readable text and retain its layout in both light and dark palettes.

#### Scenario: Page renders in light mode
- **WHEN** the page is in light mode
- **THEN** backgrounds, text colors and borders use the light palette values and all text remains readable.
