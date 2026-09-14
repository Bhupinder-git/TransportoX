---
name: Enterprise Logistics Logistics UI
colors:
  surface: '#fcf9ef'
  surface-dim: '#dcdad0'
  surface-bright: '#fcf9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f4ea'
  surface-container: '#f1eee4'
  surface-container-high: '#ebe8de'
  surface-container-highest: '#e5e2d9'
  on-surface: '#1c1c16'
  on-surface-variant: '#594139'
  inverse-surface: '#31312a'
  inverse-on-surface: '#f4f1e7'
  outline: '#8d7168'
  outline-variant: '#e1bfb4'
  surface-tint: '#ab3600'
  primary: '#a73400'
  on-primary: '#ffffff'
  primary-container: '#cc4811'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59c'
  secondary: '#615e59'
  on-secondary: '#ffffff'
  secondary-container: '#e8e1db'
  on-secondary-container: '#68645f'
  tertiary: '#00628c'
  on-tertiary: '#ffffff'
  tertiary-container: '#007cb0'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822700'
  secondary-fixed: '#e8e1db'
  secondary-fixed-dim: '#cbc5c0'
  on-secondary-fixed: '#1d1b18'
  on-secondary-fixed-variant: '#494642'
  tertiary-fixed: '#c8e6ff'
  tertiary-fixed-dim: '#87ceff'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#004c6d'
  background: '#fcf9ef'
  on-background: '#1c1c16'
  surface-variant: '#e5e2d9'
typography:
  headline-xl:
    fontFamily: Google Sans
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-lg:
    fontFamily: Google Sans
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  headline-md:
    fontFamily: Google Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  headline-sm:
    fontFamily: Google Sans
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
  body-lg:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Roboto
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Roboto
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-md:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  label-sm:
    fontFamily: Roboto
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  mono-data:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes a high-density, highly functional environment tailored for complex enterprise logistics and supply-chain operations. The brand personality is grounded, precise, and authoritative. It evokes absolute reliability, operational transparency, and systematic efficiency. 

The aesthetic style is rooted in a pragmatic, flat structural framework. It relies on crisp spatial organization, low-contrast structural outlines, and sharp data presentation rather than decorative flourishes. There are no gradients, neon accents, or heavy surface elevations. Visual hierarchy is established strictly through typography weight, surface contrast, and crisp borders.

## Colors

The color palette is calibrated for extended data-entry and monitoring sessions, minimizing eye strain while maintaining stark readability. 

- **Primary Accent (`#EB5E28` - Spicy Paprika):** Deployed sparingly for critical call-to-actions, active state indicators, and high-priority exception alerts.
- **Secondary / Navigation (`#403D39` - Charcoal Brown):** Used for persistent navigation panels, secondary text, active icons, and structural anchors.
- **Primary Text & Headings (`#252422` - Carbon Black):** High-contrast neutral ensuring optimal legibility for critical manifests, metrics, and numerical data.
- **Borders & Dividers (`#CCC5B9` - Dust Grey):** Forms the foundational grid lines, table cell boundaries, and container partitions.
- **Background (`#FFFCF2` - Floral White):** A warm, low-fatigue off-white canvas that replaces harsh clinical white for the primary application background.

## Typography

Typography is treated as a dense, utilitarian instrument optimized for rapid scanning of tabular data, manifests, and system metrics. 

- **Titles, Numbers, and Metrics:** Google Sans provides clean, geometric character forms that maintain exceptional legibility at larger display sizes and present numerical quantities with distinct clarity.
- **Body, Tables, and Labels:** Roboto acts as the workhorse typeface across all UI controls, data tables, and dense metadata fields. Its neutral humanist grotesque character ensures maximum legibility at small point sizes (11px–13px).

## Layout & Spacing

The layout model relies on a dense, fixed-to-fluid 12-column grid optimized for desktop enterprise monitoring stations. Padding and structural gaps are tightly budgeted to maximize information density per square inch without causing cognitive overload.

- **Gutters & Margins:** Tight 12px (`0.75rem`) column gutters and 16px (`1rem`) outer canvas margins ensure maximum screen utilization for complex data tables and map/list split-views.
- **Component Spacing:** Spacing scales favor compact padding (`0.25rem` to `0.75rem`), reducing whitespace in favor of immediate data visibility.

## Elevation & Depth

This design system rejects heavy drop shadows, tonal layering, and glassmorphism in favor of a strictly flat structure. 

- **Low-Contrast Outlines:** Visual boundaries are delineated entirely via 1px solid borders using Dust Grey (`#CCC5B9`). 
- **Surface Separation:** Depth is communicated through subtle shifts in background enclosure rather than Z-axis elevation. Modals and floating panels utilize high-contrast borders and solid backdrops to cleanly sever themselves from underlying data grids.

## Shapes

A strict sharp shape language (`0px` roundedness) is enforced across all UI elements. 

- **Geometry:** Buttons, inputs, tables, cards, and containers feature orthogonal 90-degree corners. This reinforces the precise, mechanical, and architectural nature of enterprise logistics operations, eliminating decorative softness.

## Components

Components are engineered for high-frequency interactions, bulk data management, and rapid keyboard navigation.

- **Buttons:** Sharp-cornered rectangles with solid fills. Primary actions use Spicy Paprika (`#EB5E28`) with Carbon Black text; secondary actions use transparent backgrounds with Charcoal Brown borders and text.
- **Chips & Tags:** Compact status indicators featuring thin Dust Grey borders, flat neutral backgrounds, and uppercase 11px text for tracking statuses (e.g., *IN TRANSIT*, *CUSTOMS HOLD*, *DELIVERED*).
- **Lists & Data Tables:** The core of the system. Feature persistent 1px horizontal dividers (`#CCC5B9`), compact row heights (28px–36px), zebra-striping via subtle contrast shifts, and left-aligned text with right-aligned numerical quantities.
- **Checkboxes & Radio Controls:** Crisp 14x14px square checkboxes and circular radio inputs with sharp 1px borders, avoiding soft iOS/Android styling.
- **Input Fields:** Flat text inputs featuring a 1px Dust Grey border, Floral White background, and Charcoal Brown placeholder text. Focus states transition immediately to a 1px Spicy Paprika border.
- **Cards & Containers:** Flat rectangular panels bounded by 1px borders, utilizing internal header bars for clear section segregation.
- **Additional Enterprise Components:** Includes persistent multi-column filter bars, collapsible split-pane viewports for map/manifest coordination, and high-density status ticker bars.