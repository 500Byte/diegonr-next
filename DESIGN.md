# Design System: Diego NR — Swiss-Brutalist Philosophy

This document serves as the **source of truth** for the visual identity and structural logic of the project. It synthesizes the **International Typographic Style (Swiss Design)** of Josef Müller-Brockmann with the raw, uncompromising aesthetic of **Digital Brutalism**.

## 1. Core Philosophy: Digital Müller-Brockmann
The project follows a "Grid-First" philosophy where every element is an architectural unit within a strict coordinate system.
- **Objective Clarity**: Design is functional and structural, not decorative.
- **Utilitarian Brutalism**: Use of absolute binary contrast (Black/White), industrial elements (Barcodes, Monospace), and unsoftened edges.
- **Swiss Precision**: Layouts are governed by a 12-column modular grid with consistent gutters and margins.

## 2. Atmosphere & Texture
- **Atmosphere**: Utilitarian, technical, "Cold-Modernist."
- **Density**: High-impact headlines contrasted with expansive negative space.
- **Texture**: A global **Grain/Noise Overlay** (opacity 0.03) is applied via a fixed full-screen SVG filter in `index.css` to add a physical, printed-matter quality to the digital black.

## 3. Color Palette: The Absolute Binary
The system utilizes a strictly limited palette to enforce hierarchy through contrast, not color.

| Name | Hex Code | Functional Role |
| :--- | :--- | :--- |
| **Absolute Black** | `#000000` | The void. Primary background for dark mode. Solid, deep, non-reflective. |
| **Pure White** | `#FFFFFF` | The mark. Primary content color. Used for high-impact typography. |
| **Swiss Gray (Dark)** | `#666666` | Secondary metadata and low-priority technical labels. |
| **Swiss Gray (Light)**| `#999999` | Muted descriptions and secondary text in light mode context. |
| **Technical Line** | `rgba(255,255,255,0.1)` | Structural guides, grid lines, and section delimiters. |

## 4. Typography: Type as Architecture
Typography is treated as a structural material, not just a carrier of information.

### Headlines (H1-H6)
- **Family**: Sans-serif (Helvetica-inspired).
- **Attributes**: `font-black`, `uppercase`, `tracking-tighter`.
- **Scaling**: Aggressive responsive scaling (e.g., `12vw` or `10vw`). Headlines are encouraged to "bleed" or desborder containers to emphasize scale.
- **Rationale**: Following Müller-Brockmann's "objective typography," headers are bold blocks that define the layout's weight.

### Body & Descriptive Text
- **Attributes**: `font-medium`, `leading-relaxed`.
- **Contrast**: Often at `opacity-80` or `opacity-60` to create a depth hierarchy against the Absolute Black background.

### Technical Metadata
- **Family**: Monospace.
- **Attributes**: `text-xs`, `tracking-widest`, `uppercase`.
- **Visual Pattern**: Frequently enclosed in brackets (e.g., `[ 01 — VISION ]`).

## 5. The Swiss Grid: Modular Logic
Layouts are governed by the `SwissGrid` and `SwissContainer` components.
- **Columns**: 12-column layout.
- **Modular Unit**: `60px` base unit for background grid patterns and spacing multipliers.
- **Asymmetry**: Content is weighted heavily toward the edges (Left/Right). Centered text is strictly prohibited for main narrative sections.
- **Vertical Rhythm**: Massive vertical spacing (`py-32`) between sections to provide "breathing room" in the industrial density.

## 6. Component Guidelines
*   **Buttons**: Sharp edges (`rounded-none`). Interaction involves a literal "color inversion" (Black to White) rather than subtle gradients.
*   **Navigation**: Hidden during down-scroll, revealed during up-scroll. Typography-led with minimal icons.
*   **Interactive Cursor**: A small circular dot using `mix-blend-difference` that reacts to the background and scales on hover targets.
*   **Marquees**: Infinite horizontal scrolling text strips used as secondary structural elements (speed `60-80`).

## 7. Motion & Interaction
- **GSAP Logic**: Animations must be "mechanical." Avoid "bouncy" or "organic" eases. Use linear or power eases (`power4.out`, `expo.out`).
- **Smooth Scroll**: Enabled via **Lenis** to provide a consistent, liquid feel to the rigid grid transitions.
- **Motion Reduction**: All animations must wrap in `prefers-reduced-motion` checks or equivalent CSS media queries.

---
*Inspired by: Josef Müller-Brockmann — "Grid Systems in Graphic Design"*
