# CourseKit — Conventions for CSS, Layout, Theming, and Accessibility

**Status:** Approved design conventions; implementation may be pending  
**Applies to:** CourseKit framework, installed modules, visual components, course/site styles, and generated CSS  
**Normative language:** **MUST**, **SHOULD**, **MAY** (see below)  
**Baseline:** Current modular CourseKit repository supplied October 2026

> **Purpose.** This document is the common reference for all future human- or AI-authored changes to CourseKit. It records decisions approved for the framework. It does **not** claim that every decision is already implemented. Specific component dimensions, proportions, or artwork remain in their respective component stylesheets, not in this specification.

## 0. Status and interpretation

- **MUST** denotes an obligatory CourseKit rule, subject only to an explicitly documented permitted exception and applicable accessibility requirements.
- **SHOULD** denotes a strong recommendation; exceptions require a concrete, documented reason.
- **MAY** denotes a permitted choice.
- A **framework convention** is not automatically a WCAG requirement. WCAG conformance must be evaluated against the actual rendered interface and applicable success criteria.
- Example CSS illustrates an architectural approach; it is not necessarily a drop-in patch or an existing selector.
- **Approved target** means agreed behavior or value. **Current implementation** means behavior verified in the repository snapshot. **Pending** means implementation or validation work remains.

### 0.1 Verified baseline and pending work

In the supplied Git snapshot:

- `framework/styles/tokens.css` defines global palette, font-family, spacing and layout tokens, but its spacing values do **not yet match** the revised scale in §2.
- `framework/styles/reset.css` already applies global `box-sizing: border-box`; it does **not** explicitly set `html { font-size: 100%; }`.
- `example-course/course.json` configures `theme.palette` with seven palette entries and includes `resources.fonts`.
- `framework/scripts/style-loader.js` applies `theme.palette` values as root inline custom properties. The dual-theme resolver, derived dark palette, explicit dark overrides and user mode switch are **not yet implemented** in that file.
- `surface`, `surface-muted`, and the semantic color roles are **approved additions**, not assumed to exist in the current CSS.

Implementers MUST distinguish approved design from current behavior and update the relevant schema, loader, tokens, and component styles together when introducing a new configuration contract.

## 1. Units and typography — TYPO / UNITS

### 1.1 Screen versus print

| Context | Units | Rule |
|---|---|---|
| Root screen font size | `%` | MUST preserve browser font-size preferences; target `html { font-size: 100%; }` |
| Screen font sizes | `rem` | MUST use `rem` for defined typographic sizes, not `pt` or `px` |
| Contextual text-relative dimensions | `em` | MAY use when intentionally relative to the local font |
| Standard screen spacing / dimensions | `rem` | SHOULD draw from global spacing scale |
| Parent-relative dimensions | `%`, `fr` | MAY use as appropriate to layout |
| Reading width | `ch` | Approved maximum for main prose: `70ch` |
| Container-responsive dimensions | `cqi` | SHOULD be preferred when the component's available inline space matters |
| Viewport-responsive dimensions | `vw`, `dvh` | MAY be used for page-level layout |
| Fine visual detail | `px` | MAY be used for borders and technical exceptions, not routine screen font sizes |
| Print typography | `pt` | MUST use for printed font sizes |
| Print physical layout | `mm` | MUST use for print margins, padding, spacing and physical dimensions |

For screen styles, **points (`pt`) are reserved for print**, not used to specify screen typography. `px` represents CSS pixels rather than guaranteed physical display pixels. Use `@media print` for print-specific rules. At a 16-CSS-pixel reference root, `1rem = 16px = 12pt`; this is a reference conversion, not a fixed physical size or a guarantee when user preferences change.

### 1.2 Approved text roles

| Role | Token | Font size | Equivalent if 1rem = 16px | Unitless line-height |
|---|---|---|---|---|
| Footnote / minimum informative text | `--ck-font-footnote` | `0.75rem` | 12px / 9pt | `1.4` |
| Box/panel body text | `--ck-font-box-size` | `0.875rem` | 14px / 10.5pt | `1.5` |
| Main section text | `--ck-font-body-size` | `1rem` | 16px / 12pt | `1.6` |

The matching line-height tokens are `--ck-leading-footnote`, `--ck-leading-box`, and `--ck-leading-body`.

**MUST:** No informative or interactive text is intentionally set below `0.75rem` as a CourseKit default. This is a **CourseKit design minimum**, *not* a WCAG minimum font-size requirement. Fonts, browser preferences, zoom and visual tests affect actual readability.

**MUST:** Keep text font-size tokens distinct from font-family tokens already present (`--ck-font-body` and `--ck-font-display`). Do not overwrite a family token with a numerical font size.

### 1.3 Heading scale and line-height

The framework SHOULD provide sensible default heading sizes, but the exact `h1`–`h6` sizes are **not yet approved**. Each component owns its heading styles, and a site MAY adjust them through its CSS. Semantic heading level and visual size MUST remain separate concerns.

Approved unitless heading line-heights:

- Large/page/hero title: **`1.2`**.
- Section and subsection title: **`1.3`**.
- Internal component title: **`1.4`**.

These are defaults, not a requirement to duplicate all heading tokens centrally. Component-only settings MUST remain in the component stylesheet.

### 1.4 Paragraph spacing and reading width

| Context | Space between paragraphs |
|---|---|
| Main prose | `1rem` |
| Inside boxes | `0.75rem` |
| Footnotes | `0.5rem` |

The **main prose paragraph maximum is `70ch`**, with fluid width on narrower containers. This bound applies to reading text, not indiscriminately to tables, figures, media, or other components. Site CSS MAY adjust it.

Paragraph margins MUST NOT generate accidental extra space at the first or last child of an enclosing box; see §3 on ownership of inter-component spacing.

### 1.5 Alignment, weights and tracking

- Default alignment for body text, boxes and headings: **`text-align: start`**. A site MAY adjust heading alignment; short elements (e.g., card labels/captions) MAY be centered.
- Full justification is **not used by default**.
- Automatic hyphenation is **not imposed by default**; any choice must account for document language.
- Approved font weights: **`300`, `400`, `500`, `600`, `700`** (light, regular, medium, semibold, bold). Use real provided faces/weights when practical. Avoid arbitrary `lighter`/`bolder` dependence.
- Default letter spacing: **`normal`**. Intentional overrides SHOULD use `em`; allow user text-spacing adjustments without content loss.

## 2. Global spacing scale — SPACING-02

The following **approved replacements** retain the existing token names:

| Token | rem | Reference px at 16px root |
|---|---:|---:|
| `--ck-space-2xs` | `0.375rem` | 6 |
| `--ck-space-xs` | `0.5625rem` | 9 |
| `--ck-space-sm` | `0.8125rem` | 13 |
| `--ck-space-md` | `1rem` | 16 |
| `--ck-space-lg` | `1.4375rem` | 23 |
| `--ck-space-xl` | `2.4375rem` | 39 |
| `--ck-space-2xl` | `3.75rem` | 60 |

Routine spacings SHOULD use this scale. Component-specific/adaptive values MAY differ when justified by composition or responsive needs. The tokens belong in `framework/styles/tokens.css`; component-owned dimensions MUST NOT be pooled there simply because they exist.

The repository also contains layout-context values such as `--ck-content-padding`, `--ck-content-gap`, `--ck-prose-gap`, and `--ck-subsection-gap`. Their existing formulas are **not automatically approved unchanged** by adoption of the new scale; reconcile them during the corresponding component/layout review.

## 3. Composition, adaptive spacing and symmetry — SPACING-01 / 03 / 04 / 05

1. **One owner per gap (MUST):** a parent/container determines the spacing *between* its direct child components; a component determines its *internal* padding. Avoid competing outer margins.
2. **Visual symmetry (MUST by default):** the top/bottom content-to-boundary space of boxes and central-content, and left/right counterparts, should appear balanced. Equal numeric padding alone may not suffice because child margins, line boxes and borders alter the effective appearance.
3. **Edge cleanup (MUST):** internal first/last elements must not accidentally add unequal outer-looking space. Avoid margin-collapsing surprises or stacked margins.
4. **Adaptivity (SHOULD):** internal component spacing adapts preferably to its available container width (`cqi` with an appropriate query container); page structure can use viewport units. `clamp()` SHOULD impose meaningful minimum and maximum bounds.
5. **Hierarchy (approved reference maxima / targets):**
   - Elements within a section: **`1rem` (16px reference)**.
   - Between subsections: **`1.4375rem` (23px)**.
   - Between main sections: **`2.4375rem` (39px)**.
   These may adapt to available width. The exact `clamp()` coefficients or bounds have **not yet been approved** and MUST be chosen/tested per implementation.
6. A component MUST NOT assume `cqi` measures the component's own size: query units are resolved using an appropriate ancestor query container. Configure and test that ancestry deliberately.

## 4. Dimensioning and box model — DIMENSIONS

- **MUST:** Use `box-sizing: border-box` as the framework-wide default. When migrating from the previous content-box-era layout, recalculate *actual outer dimensions*, including padding and borders. Do not mechanically add paddings to CSS Grid track sizes.
- **MUST by default:** components have fluid widths determined by available space.
- **SHOULD:** use `max-inline-size` to impose a meaningful ceiling rather than an unnecessarily rigid width.
- **MUST by default:** text-bearing components grow with their content (`height: auto`, with `min-height` where appropriate), without clipping enlarged text.
- Media MAY use intentional `aspect-ratio`, `object-fit` and size constraints. Technical fixed-size exceptions MUST be justified.
- Grids SHOULD guard against intrinsic minimum overflow (e.g. `minmax(0, 1fr)`, `min-inline-size: 0`) while handling genuinely unbreakable content.
- Specific proportions of `central-content`, sidebars and particular card variants are **component-level design choices**, not global normative dimensions in this document.

## 5. Responsive behavior and overflow — RESPONSIVE

1. **Mobile-first (SHOULD):** base presentation remains useful in narrow spaces; add enhancements with available space.
2. **Container queries (SHOULD)** for independently embedded components; **media queries** for viewport/page-level conditions.
3. **Content-driven breakpoints (SHOULD):** pick breakpoints from actual content constraints rather than an enforced list of device sizes. Breakpoints may differ by component.
4. **Viewport horizontal scroll prohibited by default (MUST):** a page MAY explicitly authorize it as a documented exception.
5. **Prefer reflow before scrolling (MUST):** wrap, resize fluidly or reorganize content wherever practical. If true horizontal overflow is needed, contain its scroll within the relevant component (table, diagram, etc.), not the viewport.
6. **Do not hide errors (MUST):** `overflow-x: hidden` on `body` is not an acceptable blanket fix for layout bugs.
7. **Accessibility (MUST):** test reflow, zoom, long content, keyboard access to scrollable areas, and touch interaction. Avoid shrinking text below the accepted minimum to fit a device.

Aim at the applicable WCAG 2.2 AA reflow, zoom, and spacing success criteria; use the WCAG-defined exceptions for content inherently requiring two-dimensional layout.

## 6. Modular CSS architecture and inheritance — CSS-01 / 02 / 03

### 6.1 Ownership

| Location | Responsibility |
|---|---|
| `framework/styles/tokens.css` | Only cross-component global tokens and shared design primitives |
| `framework/styles/reset.css` | Minimal global reset, box model, and root defaults |
| `framework/visual/<component>/<component>.css` | Styles, defaults, variants and internal properties of the owning visual component |
| `framework/modules/<module>/...` | Styles belonging to that module's components |
| `example-course/styles/course.css` or actual site's CSS | Site-wide/local overrides and composition-specific presentation |
| `course.json` | Site configuration (including palette and fonts) consumed by appropriate managers/loaders |

Styles for a module-only component MUST NOT be moved into the global stylesheet merely to make them accessible. Avoid implicit module-to-module styling dependencies.

### 6.2 Selector scope

- In **component stylesheets**, broad descendant selectors such as `.ck-infobox p` **SHOULD be avoided** because they may affect nested components. Prefer targeting elements owned by the component.
- They are **not categorically forbidden**. The established policy is that broad composition-oriented selectors are **permitted in site CSS**, where their scope SHOULD be limited (e.g. a `data-style-ref` selector).
- Component CSS SHOULD NOT reach inside another component's private DOM/style structure.

### 6.3 Inheritance and variables

- Preserve useful natural inheritance (`font-family`, `color`, `font-size`, `line-height`); don't indiscriminately reset it.
- Global values use `--ck-*` cross-cutting tokens. Component variables use a component-specific namespace such as `--ck-infobox-*`.
- A component MUST NOT rely on another component's private variables merely because CSS custom properties inherit.
- Public configuration variables MUST be documented; internal variables MAY exist but are not stable site-facing APIs.
- **Public variable with fallback:** prefer consuming `var(--ck-infobox-font-size, var(--ck-font-box-size))` without declaring `--ck-infobox-font-size` locally on every component instance. This preserves the ability for a site to set that variable at `:root`.
- **Variant defaults:** when a variant changes a default, a separate internal default variable MAY be used, with the public override taking precedence. Do not duplicate variables unnecessarily in simple components.
- `variant` selects styles supplied by the **component**; `style-ref` points to a customization supplied by the **site**. They are independent mechanisms.

### 6.4 Precedence

The intended customization order is: framework defaults → component/module presentation → site customization. Implementers MUST check the real stylesheet loading/cascade behavior; do not assume file order alone resolves specificity or inline-style conflicts. Consider cascade layers only with an explicit migration/compatibility plan. Avoid unwarranted `!important` escalation.

## 7. Colors, semantic roles and themes — COLOR-01 through 05

### 7.1 Global palette roles

The existing seven tokens remain site-configurable through `course.json`, with two additions:

| Palette key (`course.json`) | CSS token | Purpose |
|---|---|---|
| `accent` | `--ck-accent` | Brand/action accents, links, prominent interactive highlights |
| `accent-light` | `--ck-accent-light` | Subtle accent backgrounds/highlights |
| `structure` | `--ck-structure` | Structural regions, navigation, major visual boundaries |
| `text-main` | `--ck-text-main` | Main reading text |
| `text-dark` | `--ck-text-dark` | Headings or stronger-emphasis text (role persists in dark mode; value may become light) |
| `border` | `--ck-border` | Neutral borders and separators |
| `bg-base` | `--ck-bg-base` | Overall page background |
| `surface` | `--ck-surface` | Standard content/container background — **new** |
| `surface-muted` | `--ck-surface-muted` | Secondary/subtle surface — **new** |

Components SHOULD use colors by semantic role rather than by opportunistic hard-coded literal. Component-owned color variants and site overrides remain permitted.

### 7.2 Semantic status colors

The framework MUST offer reusable optional semantic roles **`info`, `warning`, `error`, `success`**; their semantic meaning belongs globally, while their visual presentation and variants belong to the component. The exact full set of foreground/background/border tokens for each state, and their default hexadecimal values, remain **implementation design work**, not previously approved numeric values.

Site configuration MAY override these roles. The dark-mode color resolution MUST include these roles. Meaning MUST NOT be conveyed by color alone: pair with suitable label, icon or other non-color cue.

### 7.3 Light/dark resolution

**Approved behavior, pending implementation:**

1. CourseKit supports `light`, `dark` and `auto`, with **system preference by default** and **manual user switching**.
2. The framework supplies baseline light colors; the site can override colors in `course.json`.
3. The effective light palette is resolved first. The dark palette is then derived where unspecified, using **semantic roles**, rather than naïve RGB inversion.
4. A site MAY override any dark token individually. **Dependent derived dark colors MUST be recalculated using the overridden dark inputs** where their dependency applies (e.g. dark `accent-light` derived from the explicitly overridden dark `accent`). Explicit overrides themselves take priority and are not silently replaced.
5. An OKLCH-based perceptual approach is **proposed** for derivation; a precise algorithm, dependency graph, clipping policy and tested output values are still to be implemented and verified.
6. Theme switching MUST update effective values so components using tokens adapt without implementing theme logic independently. Component-specific semantic variants MAY require their own dark treatment in their own CSS.
7. User manual selection SHOULD persist appropriately across page navigation/sessions when feasible; behavior when storage is unavailable must remain functional.
8. The application MUST check effective foreground/background combinations against relevant WCAG contrast criteria in both modes. Explicit site colors SHOULD generate warnings if inadequate; they are not silently mutated.

**Do not assume** that a root CSS dark-mode rule overrides `StyleLoader.applyTheme()` inline custom properties. Theme resolution/loading requires coordinated implementation (including the `course.json` schema and runtime). The precise future JSON shape (`palettes.light/dark`, `palette` plus `dark`, etc.) has **not yet been agreed**; do not present an illustrative shape as finalized.

### 7.4 Accessibility of color

Target **WCAG 2.2 AA**: normally 4.5:1 for regular text, 3:1 for qualifying large text, and 3:1 for non-text visual information when the applicable criterion requires it. Test actual pairings, interactive states and both themes. Decorative or exempt content follows the criteria's actual exceptions.

## 8. Interaction and accessibility — UI-01

Interactive components MUST provide appropriate handling for **default, hover, focus-visible, active, disabled, expanded/collapsed and selected** states where applicable.

- Functionality MUST NOT depend on pointer hover alone. Support keyboard and touch interactions, especially hoverboxes, drawers and disclosure widgets.
- Keyboard focus MUST remain visibly identifiable; do not remove the outline unless replacing it with an accessible indicator.
- State MUST be functional and exposed to assistive technology where appropriate, not purely visual.
- Disabled and selected states MUST be distinguishable without color alone.
- Component CSS owns its interaction states; site CSS MAY customize them.
- Verify relevant WCAG 2.2 AA criteria, including focus visibility, non-text contrast and target sizes where applicable.

## 9. Animation and motion — UI-02

| Standard duration | Value | Typical role |
|---|---|---|
| Fast | `150ms` | Hover, focus, color changes |
| Normal | `250ms` | Routine reveal/conceal and transitions |
| Slow | `350ms` | Drawers or more complex panels |

Standard easings: `ease` (ordinary), `ease-out` (entrance), `ease-in` (exit). Components MAY override justified cases.

- SHOULD prefer `transform` and `opacity` for appropriate motion; animating layout properties is allowed when necessary but assess reflow/performance.
- MUST respect `prefers-reduced-motion`, reducing or removing motion as appropriate.
- MUST ensure content and interaction remain available when transitions/animations are disabled; animation timing must not determine logical open/closed state.

## 10. Layering and z-index — UI-03

### 10.1 Shared global scale

| Token | Value | Layer |
|---|---:|---|
| `--ck-z-base` | `0` | Base |
| `--ck-z-sticky` | `100` | Sticky navigation |
| `--ck-z-dropdown` | `200` | Dropdowns |
| `--ck-z-popover` | `300` | Hoverboxes/popovers |
| `--ck-z-overlay` | `400` | Overlays/backdrops |
| `--ck-z-modal` | `500` | Modals/dialogues |
| `--ck-z-toast` | `600` | Toasts/notifications |

These tokens belong globally in `tokens.css`. Components MAY maintain small local stacking indices within an appropriate isolated stacking context.

- MUST avoid arbitrary huge `z-index` values as a workaround.
- MUST account for stacking contexts and clipping/overflow ancestors: no numerical scale can force a descendant outside an ancestor stacking context.
- SHOULD use suitable native top-layer facilities when truly above-page presentation is needed.
- Site CSS MAY customize global order, with corresponding interaction and accessibility testing.

## 11. Fonts and loading — FONT-01

- CourseKit globally exposes **two families**: `--ck-font-body` and `--ck-font-display`. **No third global monospace family was approved**; specialized families MAY be owned by individual components/modules.
- Sites configure font resources through `course.json` / `resources.fonts`; both local and online sources are permitted.
- Reliable fallback font stacks are **mandatory**. A font failing to load MUST NOT prevent content display or interaction.
- Components SHOULD use shared body/display families by default; module-specific faces stay local, not forced on all sites.
- Use available actual weights for the approved `300`–`700` scale when feasible; avoid avoidable synthetic weights.
- Fonts loaded asynchronously may alter metrics and line wraps: test with fallback and final fonts, and avoid layout breakage. `font-display: swap` is the proposed default when controlling `@font-face`, subject to the particular loading method and context.
- Do not confuse font family names (`--ck-font-body`) with size tokens (`--ck-font-body-size`).

## 12. Compatibility and progressive enhancement — COMPAT-01

- Target current stable mainstream **Chromium, Gecko and WebKit** browsers, including desktop and mobile versions used in the target environment. Keep compatibility with browsers D2L Brightspace officially supports when used there, while supporting ordinary web hosting independently.
- Recent stable releases are the maintenance focus; the previously proposed policy is approximately the **two most recent major stable releases**, without pinning permanently stale numbers in this document.
- Modern CSS (Grid, Flexbox, `clamp()`, container queries, logical properties) is permitted.
- Use a meaningful fallback where missing support would make essential content, navigation or interaction inaccessible. A pixel-identical historical fallback is **not required**.
- Cosmetic effects may degrade gracefully. Do not add excessive fallback CSS without a functional or accessibility justification.
- Tests SHOULD cover Chromium, Firefox/Gecko and Safari/WebKit. Feature parsing checks (`@supports`) do not prove a feature is bug-free.
- Component-specific fallbacks remain within the owning component/module.

## 13. Conformance and verification — VALIDATION-01 / 02

### 13.1 Three complementary verification levels

**Static CSS checks (MUST as a validation objective):** detect inappropriate screen font units, default informative text below minimum, scale/token drift, overly broad component selectors, wrong component ownership of variables, unexplained hard-coded colors, unjustified `!important`, and missing reduced-motion handling. Stylelint with CourseKit-specific rules is the proposed tooling, not an already installed guarantee.

**Visual and responsive tests:** examine narrow and wide layouts, 200% zoom, 320px CSS reflow conditions where applicable, absence of viewport horizontal overflow, content growth, nested components, upper/lower padding symmetry, light/dark, fallback fonts, and previous-framework reference appearance where migration requires it.

**Accessibility tests:** aim for WCAG 2.2 AA; include keyboard-only access, visible focus, disclosure state semantics, accessible scroll areas, target size, text spacing, contrast, responsive/reflow and reduced motion. Automated tooling such as axe-core MAY assist, but MUST NOT substitute for manual interaction and visual checks.

### 13.2 Rule enforcement and exceptions

- **MUST**: failures are blocking unless the documented rule explicitly permits an exception and relevant accessibility obligations are preserved.
- **SHOULD**: exceptions require a documented rationale.
- **MAY**: approved optional mechanism, subject to relevant MUST rules.
- A site-level broad descendant selector is **permitted**, but SHOULD be scoped. A comparable selector in component CSS SHOULD be avoided.
- Any intentional viewport horizontal scroll MUST be explicitly authorized by the page.
- Documentation of an exception SHOULD identify its owner, rationale and relevant testing.

## 14. Requirements for all future CourseKit changes

When generating or editing CSS/JS/schema/configuration for CourseKit:

1. **MUST** consult these conventions before creating or changing a stylesheet or theme API.
2. **MUST** identify the owner of each value: global token, component/module CSS, site CSS, or `course.json` configuration.
3. **MUST NOT** assume a design target has already been implemented; inspect the current repository and reconcile it with this document.
4. **MUST** preserve module independence and avoid accidental style leakage into nested components.
5. **MUST** respect the text minimum, unit conventions, responsive behavior, and accessibility tests.
6. **MUST** preserve the ability for course/site CSS to customize exposed component styling.
7. **SHOULD** show the exact owning CSS file and scoped changes for component visual modifications, rather than replacing unrelated styles.
8. **SHOULD** compare migrated components against the original framework's *rendered geometry*, taking `content-box` versus `border-box` into account; preserve desired appearance without blindly copying obsolete values.
9. **MUST NOT** treat unapproved numeric defaults (e.g. exact heading font-size scale, dark palette generation algorithm, adaptive spacing coefficients, individual sidebar/central-content proportions) as settled global conventions.
10. **MUST** update this document when an approved convention is changed, explicitly identifying changed rules and implementation consequences.

---

## Appendix A — Approved token targets (illustrative aggregation)

These declarations illustrate approved global values to be integrated with the **existing** `:root` in `framework/styles/tokens.css`; they must **not** replace the original file wholesale.

```css
:root {
    /* Type sizes — distinct from font-family variables */
    --ck-font-footnote: 0.75rem;
    --ck-font-box-size: 0.875rem;
    --ck-font-body-size: 1rem;
    --ck-leading-footnote: 1.4;
    --ck-leading-box: 1.5;
    --ck-leading-body: 1.6;

    /* Revised global spacing */
    --ck-space-2xs: 0.375rem;
    --ck-space-xs: 0.5625rem;
    --ck-space-sm: 0.8125rem;
    --ck-space-md: 1rem;
    --ck-space-lg: 1.4375rem;
    --ck-space-xl: 2.4375rem;
    --ck-space-2xl: 3.75rem;

    /* Cross-component z-index scale */
    --ck-z-base: 0;
    --ck-z-sticky: 100;
    --ck-z-dropdown: 200;
    --ck-z-popover: 300;
    --ck-z-overlay: 400;
    --ck-z-modal: 500;
    --ck-z-toast: 600;
}
```

The `html { font-size: 100%; }` root rule belongs in the global reset/root styling. The palette's two new surfaces and semantic status colors require meaningful defaults and light/dark treatment; they are deliberately not assigned unapproved hard-coded values here.

## Appendix B — Main normative references

- [W3C — WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [W3C — Understanding Resize Text (1.4.4)](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [W3C — Understanding Reflow (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C — Understanding Text Spacing (1.4.12)](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [W3C — Understanding Contrast (Minimum) (1.4.3)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — Understanding Non-text Contrast (1.4.11)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [MDN — CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)
- [MDN — CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)

**Document maintenance:** This document records approved policy. An implementation change should separately specify modified source files, revised contracts, tests and deviations; the policy document is not itself a substitute for those changes.
