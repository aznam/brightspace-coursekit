# CourseKit — Conventions for CSS, Layout, Theming, and Accessibility

**Status:** Approved design conventions; implementation may be pending  
**Applies to:** Mandatory for CourseKit core and framework-provided modules/components; recommended for site-provided modules and course/site styles; generated CSS follows its target scope  
**Normative language:** **MUST**, **SHOULD**, **MAY** (see below)  
**Baseline:** Current modular CourseKit repository supplied October 2026

> **Purpose.** This document is the common reference for all future human- or AI-authored changes to CourseKit. It records decisions approved for the framework. It does **not** claim that every decision is already implemented. Specific component dimensions, proportions, or artwork remain in their respective component stylesheets, not in this specification.

## 0. Status, Scope, and Interpretation

This document establishes the normative conventions governing the design, implementation, modification, and generation of CourseKit styles and visual components. Its rules apply at different levels of obligation, depending on the ownership of the code.

### 0.1 Scope and applicability

- **CourseKit core framework:** These conventions are mandatory, except where an exception is expressly permitted.
- **Framework visual components:** These conventions are mandatory, except where an exception is expressly permitted.
- **Modules and components provided by the CourseKit framework:** These conventions are mandatory, except where an exception is expressly permitted.
- **Modules and components provided by a site or course:** These conventions are recommendations, not mandatory design restrictions.
- **Course-specific and site-specific stylesheets:** These conventions are **recommendations, not mandatory design restrictions**. A site retains the freedom to override framework conventions to meet its own presentation needs, including the use of broader descendant selectors where appropriate.
- **AI-generated or automatically modified code:** The applicable level of obligation is determined by the code being created or changed. Generating site-specific CSS does not turn recommendations into mandatory framework rules.

Applicable accessibility requirements remain applicable regardless of stylesheet ownership or these design-specific distinctions.

### 0.2 Normative language

- **MUST:** A mandatory requirement for code within the normative scope defined in §0.1. Deviations are permitted only where the relevant rule expressly allows an exception; they MUST NOT violate applicable accessibility requirements.
- **SHOULD:** A strong recommendation. A deviation is permitted for a concrete technical or design reason.
- **MAY:** An explicitly permitted choice.

An illustrative example or a recommended practice does not automatically become a mandatory requirement.

### 0.3 Authority and application

1. New or modified **framework-owned component and module** styles **MUST** be evaluated against the applicable conventions in this document.
2. Code generation and modification **MUST** honor the level of obligation applicable to the target stylesheet. Site-specific rules are recommended rather than automatically mandatory.
3. Existing nonconforming code does not establish an approved precedent for future framework-owned module or component changes.
4. When modifying a framework-owned module or component stylesheet, the effect of its rules on that component and on nested components **MUST** be considered. This does not mean that every unrelated legacy file must be rewritten as part of an isolated change.
5. Permitted exceptions **MUST** follow the conditions stated by the relevant convention.
6. Each component remains responsible for its visual identity and internal implementation unless a cross-cutting convention expressly assigns responsibility elsewhere.

### 0.4 Accessibility and external standards

CourseKit may adopt design requirements stricter than those of external standards. A CourseKit convention **MUST NOT** be described as a WCAG requirement unless the relevant WCAG success criterion supports that claim.

Compliance with this document does not by itself establish WCAG conformance. Applicable accessibility criteria require appropriate static, functional, and rendered-interface verification.

### 0.5 Examples and implementation status

CSS and configuration examples illustrate design intent; they are not necessarily current repository code or complete drop-in patches.

This document specifies **approved conventions independently of their implementation status**. The current state of the repository, outstanding implementation work, migration tasks, and known deviations **SHOULD** be tracked separately rather than incorporated into normative rules.

A change to the codebase does not implicitly modify or supersede the conventions documented here.

### 0.6 CSS Design Token Usage — Cross-cutting Rule

Framework-owned modules and components **MUST use CSS custom properties for standardized design values**, rather than repeating hardcoded design constants in individual property declarations. This applies across typography (including sizes, line heights and font weights), spacing, colors, and animation durations, among other design decisions.

- **MUST:** All approved global design values are represented by shared CSS custom properties in `framework/styles/tokens.css`.
- **MUST:** Framework-owned module and component styles reference the relevant tokens instead of duplicating their literal design values.
- **MUST:** Component-specific design values, defaults, and internal variables belong to the owning component stylesheet, not in the global token file.
- **SHOULD:** Component-specific settings that require site-level customization expose a public CSS custom property, following the public-variable/fallback mechanism described in §5.
- **SHOULD:** Course- and site-specific styles reuse the published tokens when appropriate; as established in §0.1, this is a recommendation, not a mandatory restriction on site styles.
- **MAY:** CSS structural keywords, neutral values such as `0`, and genuine technical constants that do not represent design decisions remain literal. Justified design exceptions must follow the relevant convention.

**Token ownership matters as much as token usage:** global tokens MUST NOT accumulate variables tied to optional components or modules. A token's literal default is declared at its owning level; consuming rules refer to that token instead of copying the default value.

## 1. Units and typography — TYPO / UNITS

### 1.1 CSS Units — Screen and Print

CourseKit distinguishes screen presentation from printed documents. CSS units MUST be selected according to their intended purpose and context of use, rather than used interchangeably.

#### 1.1.1 General Principle — Relative and Absolute Units

CourseKit **MUST prioritize relative CSS units** to ensure adaptability, accessibility, and consistency across different display sizes, browser configurations, and user preferences.

- **MUST:** Use relative units whenever they can appropriately express the intended dimension.
- **MUST:** Use absolute units only when strictly necessary or when a measurement explicitly requires an absolute reference.
- **SHOULD:** Prefer dimensions that adapt naturally to their content, containing element, or available display space.
- **MUST NOT:** Use absolute dimensions solely to reproduce a particular appearance when an appropriate relative measurement can achieve the same result.
- **MAY:** Use absolute units for justified technical requirements, fine graphical details, and print-specific physical measurements, as specified below.

The choice of unit MUST reflect the purpose of the measurement, rather than developer convenience.

#### 1.1.2 Screen Typography

- The root font size MUST be defined as `html { font-size: 100%; }` to preserve the user's browser font-size preference.
- Screen font sizes MUST use `rem`, based on the root font size.
- `px` and `pt` MUST NOT be used for screen font sizes in framework or module component stylesheets.
- `em` MAY be used for measurements intentionally proportional to the local font size. It SHOULD NOT define standard typographic levels, to avoid unintended cumulative scaling in nested components.
- Standard `line-height` multipliers MUST be unitless.

#### 1.1.3 Screen Dimensions and Layout

| Unit | Intended context of use |
|---|---|
| `rem` | Standard spacing, margins, padding, component dimensions and measurements relative to the root typographic scale |
| `em` | Measurements intentionally proportional to the local font size |
| `%` | Dimensions relative to the applicable containing block or reference dimension |
| `fr` | Distribution of available space in CSS Grid |
| `ch` | Text-oriented width constraints, including the approved `70ch` maximum for main prose |
| `cqi` | Responsive dimensions and spacing based on an appropriate query container's inline size; preferred for modular components |
| `vw` | Dimensions and spacing relative to viewport width; primarily for page-level layout |
| `dvh` | Dynamic viewport-relative heights, when the component or page requires them |
| `px` | Fine graphical details, borders and justified technical exceptions; not for routine screen typography |
| `clamp()` | Bounded adaptive measurements combining appropriate units; especially for responsive spacing and dimensions |

**Additional rules:**

- **SHOULD:** Use `rem` and the shared spacing scale for ordinary component dimensions and spacing.
- **SHOULD:** Prefer container-relative units for modular components and viewport-relative units for page-level layouts.
- **MAY:** Combine units using CSS functions such as `clamp()` when adaptive behavior is required.
- **MUST:** Ensure that adaptive measurements preserve accessibility, content reflow and the component's dimensional constraints.

#### 1.1.4 Printed Documents

Printed documents follow a separate unit convention:

| Unit | Intended context of use |
|---|---|
| `pt` | Font sizes and typographic measurements |
| `mm` | Page dimensions, margins, padding, spacing and other physical layout measurements |

- **MUST:** Use `pt` for print font sizes.
- **MUST:** Use `mm` for physical layout measurements in print-specific styles.
- **SHOULD:** Keep print-specific styles in `@media print` or dedicated print stylesheets.
- **MUST:** Keep print-specific physical measurement conventions separate from the screen presentation rules.

The use of absolute units in printed documents is an explicit exception to the general preference for relative units.

#### 1.1.5 Reference Conversions

At a conventional browser root font size of 16 CSS pixels:

| Unit | Equivalent |
|---|---|
| `1rem` | 16 CSS px |
| `1px` | 0.75 pt |
| `1pt` | 1.333333 CSS px |
| `1rem` | 12 pt |

These conversions are provided for reference only. They MUST NOT be interpreted as imposing a fixed physical text size, overriding browser font-size preferences, or disabling zoom and display scaling.

### 1.2 Text Sizes and Line Heights

CourseKit defines three standard typographic roles shared across the framework and its modules.

#### 1.2.1 Standard Text Sizes

| Role | CSS Token | Font Size | Reference px | Reference pt |
|---|---|---|---|---|
| Footnote / Minimum | `--ck-font-footnote` | `0.75rem` | 12px | 9pt |
| Box / Panel Text | `--ck-font-box-size` | `0.875rem` | 14px | 10.5pt |
| Main Body Text | `--ck-font-body-size` | `1rem` | 16px | 12pt |

Reference conversions assume a browser root font size of 16 CSS pixels.

- **MUST:** Text sizes defined by the framework and its modules use these global tokens when corresponding to one of these standard typographic roles.
- **MUST:** Informative and interactive text MUST NOT be intentionally sized below `0.75rem`.
- **SHOULD:** Footnote sizing is reserved for secondary information, annotations, captions and metadata.
- **SHOULD:** Box text sizing applies to contextual panels, informational boxes and compact content regions.
- **SHOULD:** Main body sizing applies to ordinary paragraphs and lists in the main reading content.
- **MAY:** Components define additional typographic sizes when justified by their specific presentation requirements, provided the minimum size is respected.

The minimum text size is a CourseKit design convention, not a minimum imposed by WCAG.

#### 1.2.2 Standard Line Heights

Body-text line heights form a distinct **global typographic scale** from the heading line heights defined in §1.3. They MUST be declared as the following named tokens in `framework/styles/tokens.css`, not duplicated as numeric literals in component declarations.

| Role | CSS Token | Line Height |
|---|---|---|
| Footnote | `--ck-leading-footnote` | `1.4` |
| Box / Panel Text | `--ck-leading-box` | `1.5` |
| Main Body Text | `--ck-leading-body` | `1.6` |

- **MUST:** Standard line-height values use unitless multipliers.
- **MUST:** Components use the corresponding global line-height tokens for these standard text roles.
- **MAY:** Components define specific line heights when their presentation requires them, while preserving readability and accessibility.

#### 1.2.3 Token Ownership and Component Customization

Global text-size and line-height tokens MUST be defined in `framework/styles/tokens.css`. The approved body-text definitions are:

```css
:root {
    --ck-font-footnote: 0.75rem;
    --ck-font-box-size: 0.875rem;
    --ck-font-body-size: 1rem;

    --ck-leading-footnote: 1.4;
    --ck-leading-box: 1.5;
    --ck-leading-body: 1.6;
}
```

These values are the global defaults; component rules MUST consume the named variables rather than hardcoding the values from the tables above.

Component-specific typographic properties MUST remain in the stylesheet of the component that owns them.

Components SHOULD expose public CSS variables when their text sizes or line heights require independent customization by the site.

For example:

```css
.ck-infobox {
    font-size: var(
        --ck-infobox-font-size,
        var(--ck-font-box-size)
    );

    line-height: var(
        --ck-infobox-line-height,
        var(--ck-leading-box)
    );
}
```

The site MAY override these public variables without modifying the component stylesheet.

Font-size tokens MUST remain distinct from font-family tokens such as `--ck-font-body` and `--ck-font-display`.

### 1.3 Heading Typography

#### 1.3.1 Heading Sizes

CourseKit defines a global reference scale for visual heading sizes, independently of HTML semantic heading levels. This scale provides consistent defaults across framework components while preserving their independence and customization. CourseKit components **MUST** provide default heading sizes appropriate to their visual and functional roles. 

| Visual heading level | Global token | Default value | Reference pixels |
|---|---|---|---|
| Heading 1 | `--ck-heading-1-size` | `2rem` | 32px |
| Heading 2 | `--ck-heading-2-size` | `1.5rem` | 24px |
| Heading 3 | `--ck-heading-3-size` | `1.25rem` | 20px |
| Heading 4 | `--ck-heading-4-size` | `1.125rem` | 18px |
| Heading 5 | `--ck-heading-5-size` | `1rem` | 16px |
| Heading 6 | `--ck-heading-6-size` | `0.875rem` | 14px |

Reference pixel values assume a browser root font size of 16 CSS pixels.

- **MUST:** The six global heading-size tokens are defined in `framework/styles/tokens.css` with the default values specified above.
- **MUST:** Framework-owned components use the appropriate global heading-size token as the fallback for standard heading presentations, unless a component-specific size is justified.
- **MUST:** Visual heading levels remain independent of HTML semantic heading levels (`h1`–`h6`).
- **SHOULD:** Framework-owned components use the reference typographic scale for their standard heading presentations.
- **MAY:** Components define different heading sizes when justified by their visual or functional roles.
- **MUST:** Component-specific heading size defaults remain in the stylesheet of the owning component and use CSS custom properties.
- **MUST:** Components use CSS custom properties for heading sizes instead of hardcoded design values in individual declarations; see §0.6.
- **SHOULD:** Components expose public variables allowing sites to customize their heading sizes.
- **MAY:** Components use justified component-specific heading sizes where the global reference scale is unsuitable.
- **MAY:** Sites override the global heading-size tokens to customize the overall typographic scale.
- **MAY:** Sites override component-specific heading-size variables without modifying the global scale.

CourseKit defines a reference visual heading-size scale, but does not impose a fixed correspondence between HTML semantic heading levels and visual heading sizes. Components retain ownership of their heading typography and may depart from the reference scale when justified by their presentation. Default heading sizes belong to their respective components; values suggested in examples do not constitute approved universal heading sizes.

**Component example**

```css
.ck-section__title {
    font-size: var(
        --ck-section-title-size,
        var(--ck-heading-2-size)
    );
}
```

The component-specific variable has priority. If it is not defined, the standard global heading-size token supplies the default.

The global scale defines visual typography, not document semantics. Components remain responsible for selecting the visual level appropriate to their presentation.

#### 1.3.2 Heading Line Heights

CourseKit defines three **global heading line-height tokens**, distinct from the body-text line-height tokens in §1.2:

| Heading category | Global token | Unitless value |
|---|---|---|
| Large titles, page titles and hero titles | `--ck-leading-heading-large` | `1.2` |
| Section and subsection titles | `--ck-leading-heading-section` | `1.3` |
| Internal component titles | `--ck-leading-heading-component` | `1.4` |

- **MUST:** These tokens are defined in `framework/styles/tokens.css`.
- **MUST:** Components use the appropriate global token instead of duplicating its numeric value.
- **MUST:** Standard heading line-height multipliers are unitless.
- **MAY:** A component provides a different heading line height when justified by its presentation, using component-owned variables.
- **MAY:** Sites customize standard or component-specific heading line heights through their own CSS.

The global token definitions are:

```css
:root {
    --ck-leading-heading-large: 1.2;
    --ck-leading-heading-section: 1.3;
    --ck-leading-heading-component: 1.4;
}
```

#### 1.3.3 Component Customization

Components **SHOULD** expose public variables for heading properties that require site-level customization. Their default heading-size values remain in their owning component CSS; global heading line-height values remain in `tokens.css`.

For example, in `section.css`:

```css
.ck-section {
    --ck-section-default-title-size: 1.5rem;
}

.ck-section__title {
    font-size: var(
        --ck-section-title-size,
        var(--ck-section-default-title-size)
    );

    line-height: var(
        --ck-section-title-line-height,
        var(--ck-leading-heading-section)
    );
}
```

A site may override the public variable without modifying the component stylesheet:

```css
.ck-section {
    --ck-section-title-size: 1.75rem;
}
```

The numerical values in this example illustrate component-level customization. The reference heading-size scale is defined in §1.3.1.

A component may select its default heading size from that scale or define a justified component-specific size. In either case, the default remains owned by the component, and sites may customize it through public CSS variables.

Reference heading sizes must not be interpreted as a mandatory correspondence between HTML semantic heading levels and visual heading levels. 

The example's locally declared default must not be replaced with a global component-specific token in `tokens.css`.

### 1.4 Paragraph Spacing and Reading Width

#### 1.4.1 Standard Paragraph Spacing

CourseKit defines three standard spacing values between paragraphs, according to their typographic context.

| Context | Global token | Value |
|---|---|---|
| Main body text | `--ck-paragraph-gap-body` | `1rem` |
| Text inside boxes and panels | `--ck-paragraph-gap-box` | `0.75rem` |
| Footnotes and secondary annotations | `--ck-paragraph-gap-footnote` | `0.5rem` |

- **MUST:** These tokens are defined in `framework/styles/tokens.css`.
- **MUST:** Framework-owned components use the corresponding tokens instead of hardcoding the spacing values.
- **SHOULD:** Paragraph spacing follows the typographic context in which the text appears.
- **MAY:** Components expose their own public variables to customize paragraph spacing.
- **MAY:** Site-specific stylesheets override these values when required by their presentation.

Paragraph spacing refers to the visual separation between consecutive paragraphs. It does not define the spacing between independent components, sections, or other structural elements.

#### 1.4.2 Spacing Ownership and Composition

Paragraph spacing MUST respect the general CourseKit composition rules:

- **MUST:** The containing component is responsible for the spacing between its direct child elements.
- **MUST:** Paragraph margins must not accumulate with container gaps to create unintended additional spacing.
- **MUST:** The first and last elements of a content container must not introduce unintended asymmetry between its upper and lower boundaries.
- **SHOULD:** Prefer container-managed spacing, such as `gap`, when the content structure permits it.
- **MAY:** Use paragraph margins when appropriate to the component's layout, provided spacing ownership remains unambiguous.

The resulting spacing must preserve the visual symmetry established by the CourseKit spacing conventions.

#### 1.4.3 Maximum Reading Width

CourseKit defines a global reading-width token:

| Purpose | Global token | Value |
|---|---|---|
| Maximum width of main prose | `--ck-reading-width` | `70ch` |

- **MUST:** `--ck-reading-width` is defined in `framework/styles/tokens.css` with the standard value `70ch`.
- **MUST:** Main prose paragraphs use `var(--ck-reading-width)` unless the component's presentation requires a justified exception.
- **MUST:** Text width remains fluid and must not exceed the available width of its container.
- **MUST:** The reading-width constraint applies to reading text, not indiscriminately to tables, figures, media, diagrams or other components.
- **MAY:** Sites customize the `--ck-reading-width` token through their own CSS.

The maximum reading width does not determine the width of `central-content` or any other enclosing layout component.

#### 1.4.4 Token Definitions and Component Customization

The global values MUST be defined in `framework/styles/tokens.css`:

```css
:root {
    --ck-paragraph-gap-body: 1rem;
    --ck-paragraph-gap-box: 0.75rem;
    --ck-paragraph-gap-footnote: 0.5rem;
    --ck-reading-width: 70ch;
}
```

Components SHOULD expose public variables when paragraph spacing or reading width requires local customization. The following illustrates the mechanism; it is not a drop-in implementation for the current component structure:

```css
/* In the central-content component stylesheet */
.ck-central-content__prose {
    row-gap: var(
        --ck-central-content-paragraph-gap,
        var(--ck-paragraph-gap-body)
    );
}

/* In the paragraph component stylesheet */
.ck-paragraph {
    max-inline-size: var(--ck-reading-width);
}
```

Global design tokens belong to `tokens.css`. Component-specific configuration belongs to the stylesheet of the owning component. Site-specific stylesheets MAY override public variables without modifying the framework.

### 1.5 Text Alignment, Font Weights, and Letter Spacing

#### 1.5.1 Text Alignment

CourseKit uses logical text alignment to support different writing directions and preserve consistent reading behavior.

- **MUST:** Main body text and box/panel text use `text-align: start` by default.
- **SHOULD:** Headings use `text-align: start` by default.
- **MAY:** Components and sites define alternative heading alignments when justified by their presentation.
- **MAY:** Short text elements, such as captions, labels and card headings, use centered alignment where appropriate.
- **MUST NOT:** Apply full text justification by default.
- **MUST NOT:** Impose automatic hyphenation globally.

Hyphenation MAY be enabled in appropriate contexts, taking into account the language of the document and corresponding browser support.

#### 1.5.2 Font Weights

CourseKit defines five standard font weights.

| Role | Global Token | Value | Intended Use |
|---|---|---|---|
| Light | `--ck-font-weight-light` | `300` | Visually light text, decorative typography, selected subtitles |
| Regular | `--ck-font-weight-regular` | `400` | Body text, paragraphs, boxes and footnotes |
| Medium | `--ck-font-weight-medium` | `500` | Important metadata, labels and secondary emphasis |
| Semibold | `--ck-font-weight-semibold` | `600` | Buttons, subtitles and emphasized interface elements |
| Bold | `--ck-font-weight-bold` | `700` | Headings and strong emphasis |

- **MUST:** These five tokens are defined in `framework/styles/tokens.css`.
- **MUST:** Framework-owned components use the appropriate token instead of hardcoding the corresponding numeric font weight.
- **SHOULD:** Font weights reflect the semantic or visual function of the text.
- **SHOULD:** Prefer font files or variable fonts that provide the requested weights.
- **SHOULD NOT:** Rely on contextual `lighter` or `bolder` for standard typographic roles.
- **MAY:** Components expose public variables for independently customizable font weights.
- **MAY:** Sites customize the global weights or component-specific weights through their stylesheets.
- **MAY:** Components use other weight values for justified specialized typography, including intermediate weights supported by variable fonts; such values remain component-owned design tokens.

The standard token definitions are:

```css
:root {
    --ck-font-weight-light:    300;
    --ck-font-weight-regular:  400;
    --ck-font-weight-medium:   500;
    --ck-font-weight-semibold: 600;
    --ck-font-weight-bold:     700;
}
```

#### 1.5.3 Letter Spacing

CourseKit preserves the natural letter spacing of the selected font by default.

- **MUST:** The standard default is the global token `--ck-letter-spacing-normal`, defined as `normal` in `framework/styles/tokens.css`.
- **MUST:** Framework-owned components use this token instead of duplicating `normal` as a design value in component declarations.
- **SHOULD:** Use `em` for intentional letter-spacing adjustments so spacing remains proportional to local font size.
- **MAY:** Components define specific letter spacing for short labels, headings, uppercase text or other justified presentation requirements, using component-owned tokens.
- **SHOULD:** Components expose public CSS variables when letter spacing requires site-level customization.
- **MUST:** Allow user-defined text spacing adjustments without loss of content or functionality, in accordance with applicable accessibility requirements.

WCAG 2.2 Success Criterion 1.4.12 requires content to remain functional when users apply its specified text-spacing overrides, including letter spacing of at least `0.12em`. This is a test condition, not the default letter spacing for CourseKit.

```css
:root {
    --ck-letter-spacing-normal: normal;
}
```

#### 1.5.4 Component Customization

Component-specific typography remains the responsibility of the owning component. For example, in `infobox.css`:

```css
.ck-infobox__title {
    font-weight: var(
        --ck-infobox-title-weight,
        var(--ck-font-weight-semibold)
    );

    letter-spacing: var(
        --ck-infobox-title-letter-spacing,
        var(--ck-letter-spacing-normal)
    );
}
```

Site-specific stylesheets MAY override these public properties without modifying the framework.

Global typographic values MUST remain in `tokens.css`, while component-specific defaults and customization interfaces remain in their owning stylesheets. The component-local values illustrated above are configuration interfaces, not a requirement to add component-specific tokens globally.

## 2. Spacing System

CourseKit establishes a shared spacing system to ensure consistency across framework components while preserving their modularity, adaptability, and independence.

The spacing system distinguishes between:

- **Global spacing tokens**, which establish the common dimensional scale.
- **Functional spacing roles**, which determine how spacing values are used.
- **Adaptive spacing**, which responds to the available layout space.
- **Composition rules**, which determine responsibility for spacing between components.
- **Visual symmetry**, which ensures balanced spacing within and between components.
- **Component-specific spacing**, which remains under the responsibility of the owning component.

### 2.1 Global Spacing Scale

CourseKit defines seven standard spacing tokens.

| Token | Value | Reference Pixels | Intended Use |
|---|---|---|---|
| `--ck-space-2xs` | `0.375rem` | 6px | Very small separations and compact internal details |
| `--ck-space-xs` | `0.5625rem` | 9px | Small gaps between closely related elements |
| `--ck-space-sm` | `0.8125rem` | 13px | Compact internal spacing and component padding |
| `--ck-space-md` | `1rem` | 16px | Standard spacing and ordinary element separation |
| `--ck-space-lg` | `1.4375rem` | 23px | Larger internal spacing and separation between groups |
| `--ck-space-xl` | `2.4375rem` | 39px | Major separation between content regions |
| `--ck-space-2xl` | `3.75rem` | 60px | Large structural spacing |

Reference pixel values assume a browser root font size of 16 CSS pixels.

#### Token Definitions

The seven tokens **MUST** be defined in `framework/styles/tokens.css`:

```css
:root {
    --ck-space-2xs: 0.375rem;
    --ck-space-xs:  0.5625rem;
    --ck-space-sm:  0.8125rem;
    --ck-space-md:  1rem;
    --ck-space-lg:  1.4375rem;
    --ck-space-xl:  2.4375rem;
    --ck-space-2xl: 3.75rem;
}
```

#### Usage Rules

- **MUST:** Framework-owned components use CSS custom properties for spacing values, in accordance with §0.6 — CSS Design Token Usage.
- **SHOULD:** Ordinary margins, paddings and gaps use the global spacing scale.
- **SHOULD:** The selected spacing value reflects the functional relationship between elements.
- **MAY:** Components define additional spacing values where justified by their internal structure, presentation or adaptive behavior.
- **MUST:** Component-specific spacing tokens remain in the stylesheet of the component that owns them.
- **MAY:** Site-specific stylesheets override the global scale or define their own spacing values.

The global spacing scale is a common reference. It does not require every spacing value in CourseKit to be identical across components or restricted to these seven values.

### 2.2 Spacing Roles and Hierarchy

CourseKit defines a standard spacing hierarchy based on the functional relationship between content elements. The hierarchy distinguishes spacing within a section, between subsections, and between main sections.

#### 2.2.1 Standard Spacing Roles

| Functional Role | Global Functional Token | Reference Value | Reference Pixels |
|---|---|---|---|
| Elements within a section | `--ck-prose-gap` | `var(--ck-space-md)` | 16px |
| Between subsections | `--ck-subsection-gap` | `var(--ck-space-lg)` | 23px |
| Between main sections | `--ck-section-gap` | `var(--ck-space-xl)` | 39px |

Reference pixel values assume a browser root font size of 16 CSS pixels. These tokens express reusable functional relationships, rather than the geometry of any particular component.

- Elements within a section remain relatively close together.
- Subsections receive greater separation to distinguish their internal structure.
- Main sections receive the greatest separation to establish clear boundaries between major content regions.

#### 2.2.2 Global Token Definitions

These three **global functional tokens MUST** be defined in `framework/styles/tokens.css` and MUST reference the global spacing scale of §2.1:

```css
:root {
    --ck-prose-gap: var(--ck-space-md);
    --ck-subsection-gap: var(--ck-space-lg);
    --ck-section-gap: var(--ck-space-xl);
}
```

- **MUST:** Framework-owned components use CSS custom properties instead of repeating the numerical design values in their declarations.
- **SHOULD:** The choice of functional spacing reflects the relationship between elements, rather than visual convenience alone.
- **MAY:** Components use additional contextual variables and justified component-specific values.
- **MAY:** Site-specific stylesheets customize these tokens or the way components use them.

#### 2.2.3 Adaptive Hierarchy

The approved references are **16px / 23px / 39px**, with adaptation to available layout space where appropriate.

- **SHOULD:** Components implement adaptive spacing where their layout is affected by the space available to them. Global functional tokens serve as reference values; the owning component determines the effective adaptive formula.
- **MUST:** Where adaptation is used, it preserves the intended visual hierarchy between ordinary elements, subsections, and main sections.
- **MUST:** Adaptive values remain meaningfully bounded and preserve readability, accessibility, and the intended functional relationships.
- **MUST:** Component-specific responsive formulas remain in the component that uses them.

No universal `clamp()` coefficients or bounds have been approved. These MUST be chosen and tested according to the relevant component and layout. General adaptive-spacing rules are specified in §2.3.

#### 2.2.4 Functional Tokens Versus Component Geometry

Global functional spacing tokens are shared references, not specifications of individual component dimensions.

- **MUST:** Component-specific spacing properties, including content padding and layout gaps, are defined and managed by their owning components.
- **MUST NOT:** Component-specific properties be centralized in `tokens.css` merely for convenience.
- **MAY:** These properties reference global spacing-scale or functional-spacing tokens as defaults.
- **MAY:** Components expose public properties for site-specific customization.

In particular, the historical names `--ck-content-padding` and `--ck-content-gap` do **not** represent approved global design tokens. Their ownership, naming, values, and adaptive behavior belong to the relevant layout components and must be reviewed there. They are not equivalent by default to `--ck-prose-gap`, `--ck-subsection-gap`, or `--ck-section-gap`.

Spacing ownership and the prevention of competing margins are specified in §2.4.

### 2.3 Adaptive Spacing

CourseKit uses adaptive spacing to maintain readable, balanced, and consistent layouts across different available display sizes.

Adaptive spacing allows component margins, padding, and gaps to evolve according to the available space while preserving the global spacing scale and the functional hierarchy established in §2.1 and §2.2.

#### 2.3.1 General Principles

- **SHOULD:** Spacing adapt to available space when the component's layout or presentation benefits from it.
- **MUST:** Adaptive spacing use relative CSS units, in accordance with §1.1.
- **MUST:** Adaptive spacing values be expressed through CSS custom properties, in accordance with §0.6.
- **SHOULD:** Adaptive values use the global spacing scale as reference values or bounds.
- **MUST:** Adaptation preserve readability, accessibility, content visibility, and the functional relationships between elements.
- **MUST:** Component-specific adaptive formulas remain in the stylesheet of the component that owns them.

Adaptive spacing does not require every spacing value to change dynamically. Fixed relative values, such as `1rem`, remain appropriate when adaptation is unnecessary.

#### 2.3.2 Container-Relative and Viewport-Relative Adaptation

CourseKit distinguishes two primary adaptive contexts.

| Context | Preferred mechanism | Intended use |
|---|---|---|
| Modular components | Container-relative units (`cqi`) | Adaptation to the actual space allocated to a component |
| Page-level layout | Viewport-relative units (`vw`, etc.) | Adaptation of the overall page structure |

- **SHOULD:** Modular components prefer container-relative adaptation when their layout depends on the space allocated by their parent.
- **SHOULD:** Page-level layout components use viewport-relative units where the viewport is the relevant reference.
- **MAY:** Components use other relative units when they better express the intended behavior.
- **MUST:** Container-relative calculations use an appropriate query container.

A component MUST NOT assume that `cqi` automatically measures its own width. Container query units are resolved using an appropriate ancestor query container.

The required container relationship MUST be established and verified when implementing the component.

#### 2.3.3 Bounded Adaptive Measurements

CourseKit SHOULD use `clamp()` to define adaptive spacing with explicit minimum and maximum values.

The general form is:

```css
clamp(MINIMUM, PREFERRED, MAXIMUM)
```

The minimum and maximum SHOULD reference approved spacing tokens when appropriate.

Example, within a component stylesheet:

```css
.ck-example__content {
    padding-inline: var(
        --ck-example-padding-inline,
        clamp(
            var(--ck-space-sm),
            4cqi,
            var(--ck-space-xl)
        )
    );
}
```

The formula is illustrative. Its coefficients, bounds, and container relationship must be determined for the component concerned.

- **SHOULD:** Adaptive values use meaningful minimum and maximum bounds.
- **MUST:** Bounds prevent excessive compression or expansion that would compromise the component's presentation or usability.
- **MUST NOT:** Treat illustrative `clamp()` coefficients as universal CourseKit standards.
- **MAY:** Components use different adaptive formulas for horizontal and vertical spacing.

#### 2.3.4 Relationship with Functional Spacing

The standard functional spacing references remain:

- `--ck-prose-gap`: `1rem`.
- `--ck-subsection-gap`: `1.4375rem`.
- `--ck-section-gap`: `2.4375rem`.

These values establish the standard spacing hierarchy, not mandatory fixed distances at every available width.

- **SHOULD:** Components adapt functional spacing when available space makes adaptation appropriate.
- **MUST:** Adaptive implementations preserve the intended hierarchy between elements, subsections, and main sections.
- **MUST:** Components determine and own their adaptive formulas rather than modifying global functional tokens to accommodate a local layout.

No universal responsive coefficients or bounds have been approved for these three functional roles.

#### 2.3.5 Component Ownership and Customization

Adaptive spacing is part of a component's presentation and therefore belongs to the component that uses it.

- **MUST:** Component-specific adaptive properties remain in the owning component's stylesheet.
- **MUST NOT:** Component-specific adaptive formulas be centralized in `tokens.css` merely for convenience.
- **SHOULD:** Components expose public custom properties when sites may need to modify the resulting spacing.
- **MAY:** Sites override these properties or provide their own adaptive formulas.
- **MUST:** Adaptive behavior remain compatible with the spacing composition and symmetry rules specified in §2.4 and §2.5.

### 2.4 Spacing Ownership and Composition

CourseKit follows a **single-ownership principle** for spacing between components and content elements.

Every spacing relationship **MUST** have one clearly identified owner. This prevents unintended accumulation of margins, conflicting spacing rules, and inconsistent visual results when components are nested or composed.

#### 2.4.1 Responsibility for Spacing

CourseKit distinguishes three responsibilities:

| Responsibility | Owner | Preferred mechanism |
|---|---|---|
| Spacing between sibling components | Parent container | `gap` or another parent-controlled layout mechanism |
| Spacing inside a component's boundaries | Component itself | `padding` |
| Spacing between internal content elements | Component owning their composition | `gap` or controlled margins |

- **MUST:** Parent containers control the spacing between their direct child components.
- **MUST:** Components control their own internal padding.
- **MUST:** Internal content spacing is managed by the component responsible for composing that content.
- **MUST NOT:** Child components impose competing external margins that interfere with parent-controlled spacing.
- **SHOULD:** Prefer `gap` when the layout structure supports it.
- **MAY:** Use margins when necessary, provided their ownership and interaction with other spacing rules are unambiguous.

The same principles apply recursively to nested components.

#### 2.4.2 Preventing Cumulative Spacing

Spacing between adjacent elements **MUST NOT** increase unintentionally because several independent rules contribute to the same separation.

In particular:

- **MUST:** Prevent unintended accumulation of margins and container gaps.
- **MUST:** Prevent the first and last content elements from introducing unintended additional spacing at the boundaries of their container.
- **SHOULD:** Avoid compensating for competing margins through arbitrary negative margins or subtraction formulas.
- **SHOULD:** Use one consistent spacing mechanism for sibling elements whenever practical.
- **MAY:** Combine margins and gaps when they serve distinct, explicitly identified relationships.

Special attention **MUST** be given to CSS margin collapsing and to differences between normal block flow, Flexbox, and Grid.

#### 2.4.3 Composition and Component Independence

Spacing ownership **MUST** preserve the independence of visual components.

- **MUST:** A parent component must not depend on the private internal structure of its child components to establish their mutual spacing.
- **MUST:** A child component must not assume a particular external spacing imposed by its parent.
- **SHOULD:** Components remain usable in different composition contexts without requiring corrective margin overrides.
- **SHOULD:** Parent containers use their own spacing tokens or public configuration variables.
- **MAY:** Site-specific stylesheets adjust spacing between particular combinations of components.

A component's internal layout remains its responsibility, even when the component is nested inside another component.

#### 2.4.4 Component-Level Implementation

For example, a section composing several child components may define:

```css
.ck-section__content {
    display: flex;
    flex-direction: column;

    gap: var(
        --ck-section-content-gap,
        var(--ck-prose-gap)
    );
}
```

The section controls the separation between its direct children.

Each child component manages its own internal padding without adding competing external margins.

The example illustrates spacing ownership. It does not require every CourseKit container to use Flexbox or prescribe the internal layout of any particular component.

#### 2.4.5 Relationship with Visual Symmetry

Spacing ownership is a prerequisite for visual symmetry.

A container **MUST** account for the effective spacing contributed by its internal content so that the visible distances at its boundaries remain balanced.

The detailed requirements for visual symmetry, including top/bottom and left/right balance, are specified in §2.5.

### 2.5 Visual Symmetry

CourseKit establishes visual symmetry as a default principle for internal spacing and component composition.

Visual symmetry refers to the perceived balance of spacing around content, not merely to equality between CSS property values.

#### 2.5.1 Internal Spacing Symmetry

Components **MUST** preserve balanced spacing between their content and their visible boundaries.

- **MUST:** Upper and lower content-to-boundary spacing must be visually equivalent by default.
- **MUST:** Start and end content-to-boundary spacing must be visually equivalent by default.
- **MUST:** Components account for the effective spacing introduced by their internal elements, including margins, line boxes, and borders.
- **SHOULD:** Use symmetrical `padding-block` and `padding-inline` declarations whenever appropriate.
- **MAY:** Components define intentionally asymmetrical spacing when required by their visual design or functional structure.

Visual symmetry does not require horizontal and vertical padding to have identical values.

#### 2.5.2 Effective Spacing and Content Boundaries

Equal numerical padding values do not necessarily produce visually equivalent spacing.

The effective distance between content and component boundaries may be influenced by:

- Margins of the first and last children.
- Line-height and typographic metrics.
- Borders and decorative elements.
- Nested component padding.
- Layout mechanisms and margin collapsing.

- **MUST:** Evaluate spacing according to the rendered composition, not solely the declared CSS values.
- **MUST:** Prevent unintended margins from disrupting the balance at the beginning or end of a component.
- **SHOULD:** Avoid compensating for spacing problems with arbitrary offsets or negative margins.
- **MAY:** Apply deliberate optical adjustments when justified by the component's design.

#### 2.5.3 Symmetry Between Components

Visual symmetry also applies to the composition of successive components.

- **MUST:** The spacing between sibling components remains consistent with the functional hierarchy defined in §2.2.
- **MUST:** Spacing must not accidentally increase because both the parent and its children contribute competing external margins.
- **SHOULD:** Components of the same structural role follow equivalent spacing relationships within the same composition context.
- **MAY:** A parent container deliberately use different spacing for distinct structural or semantic relationships.

The parent container remains responsible for spacing between its children, as specified in §2.4.

#### 2.5.4 Adaptive Symmetry

Visual symmetry **MUST** be preserved when spacing adapts to the available layout space.

- **MUST:** Responsive spacing changes must not unintentionally introduce unequal opposing margins or padding.
- **MUST:** Components preserve balanced content boundaries when text wraps, grows, or changes because of user font-size preferences.
- **SHOULD:** Adaptive padding on opposing sides use the same variable or equivalent formulas by default.
- **MAY:** A component intentionally change its spacing symmetry as part of a specific responsive layout when justified by its presentation.

#### 2.5.5 Component Responsibility and Verification

Each component owns its internal spacing and is responsible for maintaining its intended visual balance.

- **MUST:** Internal spacing rules remain in the owning component's stylesheet.
- **MUST:** Layout containers remain responsible for spacing between their direct child components.
- **MUST:** Visual symmetry be evaluated with actual rendered content, including nested components, variable-length text, and responsive layouts.
- **SHOULD:** Verify symmetry at different viewport sizes, zoom levels, and text scales.
- **MAY:** Sites intentionally customize the visual balance of components through their own stylesheets.

The specific padding values, proportions, and decorative arrangements of individual components are not defined by this convention. They belong to each component's design and may be customized at site level.

### 2.6 Component-Specific Spacing and Customization

CourseKit components own their internal spacing definitions while relying on the global spacing system whenever appropriate.

Component-specific spacing must remain modular, independently configurable, and compatible with the composition, adaptation, and visual symmetry rules established in §2.1–§2.5.

#### 2.6.1 Ownership of Component-Specific Spacing

- **MUST:** Component-specific spacing tokens and default values are defined in the stylesheet of the component that owns them.
- **MUST NOT:** Component-specific padding, gaps, margins, or adaptive formulas be centralized in `framework/styles/tokens.css` merely for convenience.
- **MUST:** Framework-owned components express their spacing design values through CSS custom properties, in accordance with §0.6.
- **SHOULD:** Component-specific tokens reference global spacing tokens when appropriate.
- **MAY:** Components define additional values when their presentation or responsive behavior requires them.

Global tokens such as `--ck-prose-gap`, `--ck-subsection-gap`, and `--ck-section-gap` are shared references. They do not prescribe the internal geometry of individual components.

Variables describing component geometry, such as content padding or layout gaps, belong to their owning components and are not global design tokens.

#### 2.6.2 Public Customization Variables

Components SHOULD expose public CSS custom properties for spacing values that sites may need to customize.

Public variables MUST use a component-specific namespace, following the pattern:

`--ck-[component]-[property]`

For example:

```css
.ck-infobox {
    padding-block: var(
        --ck-infobox-padding-block,
        var(--ck-space-lg)
    );

    padding-inline: var(
        --ck-infobox-padding-inline,
        var(--ck-space-lg)
    );
}
```

A site can then customize the component globally:

```css
:root {
    --ck-infobox-padding-block: var(--ck-space-md);
}
```

Or customize a specific presentation:

```css
.ck-infobox[data-style-ref="compact-note"] {
    --ck-infobox-padding-block: var(--ck-space-sm);
}
```

The component MUST NOT unnecessarily redefine its public variables locally when doing so would prevent values inherited from `:root` from taking effect.

#### 2.6.3 Internal Variables and Variants

Components MAY define internal variables for implementation-specific spacing calculations.

Internal variables:

- **MUST:** Remain under the responsibility of the owning component.
- **MUST NOT:** Be treated as stable public customization interfaces.
- **SHOULD:** Use a clearly distinguishable naming convention, such as `--ck-[component]-internal-*`.

Component variants MAY define different spacing defaults.

When a variant needs to modify a default while preserving a public override, the component SHOULD distinguish the public configuration variable from its internal default.

For example:

```css
.ck-infobox {
    --ck-infobox-internal-default-padding:
        var(--ck-space-lg);

    padding-block: var(
        --ck-infobox-padding-block,
        var(--ck-infobox-internal-default-padding)
    );
}

.ck-infobox[data-variant="compact"] {
    --ck-infobox-internal-default-padding:
        var(--ck-space-sm);
}
```

This allows a site-defined public value to override the variant's default.

The two-variable mechanism SHOULD be used only when the component's variants or internal behavior require it. Simple properties SHOULD use a direct public variable with a fallback.

#### 2.6.4 Site-Level Customization

Course-specific and site-specific stylesheets MAY customize component spacing by:

- Overriding global spacing tokens.
- Overriding public component variables.
- Applying styles through `data-style-ref`.
- Defining site-specific spacing values or adaptive formulas.
- Targeting particular component compositions when necessary.

The framework MUST preserve the distinction between:

- **`variant`**: a presentation provided and maintained by the component.
- **`style-ref`**: a site-defined presentation customization.

The conventions in this document are recommended for site-owned styles and modules, while remaining mandatory for framework-owned components and modules, subject to their stated exceptions.

#### 2.6.5 Integration and Verification

- **MUST:** Component spacing remain compatible with parent-controlled composition.
- **MUST:** Internal padding and spacing preserve the intended visual symmetry.
- **MUST:** Adaptive spacing remain compatible with the component's dimensional and accessibility constraints.
- **SHOULD:** Verify component spacing with different content lengths, nested components, and responsive layouts.
- **SHOULD:** Confirm that site-level overrides do not require modification of the framework's component stylesheets.

The actual spacing values, proportions, and internal arrangements of individual components are determined by their respective component stylesheets, not by this global convention.

## 3. Dimensioning and Box Model — DIMENSIONS

CourseKit establishes common dimensioning principles to ensure predictable component geometry, responsive layouts, and accessibility while preserving component independence.

The framework defines how dimensions are expressed and managed, not the specific proportions or geometry of individual visual components.

### 3.1 Box Model

CourseKit uses `border-box` as its standard box-sizing model.

- **MUST:** Framework components use `box-sizing: border-box` by default.
- **MUST:** Declared dimensions account for padding and borders included within the border box.
- **MUST:** When migrating components designed with `content-box`, the effective dimensions of the original layout must be considered, including padding and borders.
- **MUST NOT:** Mechanically add element padding to CSS Grid track dimensions without considering the actual layout calculation.
- **MAY:** A component use `content-box` for a specific, justified technical requirement.

The framework-wide default is:

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

### 3.2 Width and Height

CourseKit components must adapt naturally to the space available and the content they contain.

#### Width

- **MUST:** Components use fluid widths by default.
- **SHOULD:** Prefer `max-inline-size` when a maximum width is required.
- **SHOULD:** Avoid unnecessary fixed widths that restrict responsive behavior.
- **MUST:** Dimension constraints must not produce unintended viewport overflow.
- **MAY:** Components impose minimum or maximum widths when required by their function or presentation.

#### Height

- **MUST:** Text-bearing components grow naturally with their content.
- **SHOULD:** Prefer `height: auto` and `min-height` over rigid heights.
- **MUST NOT:** Fixed heights cause text or interactive content to become inaccessible when content expands or text is enlarged.
- **MAY:** Fixed heights be used for media, decorative elements, or other justified technical requirements.

### 3.3 Dimension Units and Tokens

Component dimensions follow the general unit conventions defined in §1.1 and the design token requirements established in §0.6.

- **MUST:** Prefer relative units whenever they appropriately express the intended dimensions.
- **MUST:** Framework component design values use CSS custom properties rather than hardcoded constants.
- **SHOULD:** Standard dimensions reference the global spacing scale when appropriate.
- **MUST:** Component-specific dimensions and their default values remain in the owning component's stylesheet.
- **MAY:** Responsive dimensions use relative units and bounded formulas such as `clamp()`.
- **SHOULD:** Dimensions depending on the space allocated to a modular component use container-relative measurements when appropriate.
- **MAY:** Page-level components use viewport-relative dimensions when the viewport is the relevant reference.

No global dimension token should be introduced merely to centralize a value specific to one component.

### 3.4 Media and Grid Constraints

#### Media

- **SHOULD:** Images and videos preserve their intended proportions using `aspect-ratio` when appropriate.
- **MAY:** Media use `object-fit` to control how content occupies a constrained region.
- **MUST:** Media dimensions adapt to the available space unless a fixed dimension is functionally required.
- **MUST:** Constraints must not cause unintended viewport overflow.

#### Grid and Flex Layouts

- **SHOULD:** Grid tracks account for intrinsic minimum-size constraints.
- **SHOULD:** Use techniques such as `minmax(0, 1fr)` and `min-inline-size: 0` where appropriate.
- **MUST:** Long or non-breaking content must not cause unintended viewport overflow.
- **MAY:** Components provide local scrolling for content that cannot reasonably be reorganized.

The general rules for horizontal overflow and responsive behavior are specified in §4.

### 3.5 Component Ownership and Customization

Specific dimensions, proportions, and internal arrangements belong to the components that use them.

- **MUST:** Each framework component defines its specific dimensions and proportions within its own stylesheet.
- **MUST NOT:** Dimensions specific to `central-content`, sidebars, cards, or other components be imposed as global design conventions.
- **SHOULD:** Components expose public CSS variables for dimensions that sites may need to customize.
- **MUST:** Public variables remain compatible with the customization and inheritance rules established by the CourseKit CSS architecture.
- **MAY:** Sites customize component dimensions and proportions through their own stylesheets.
- **MUST:** Component-specific dimensioning remains compatible with the general accessibility and responsive requirements.

For example, a component can expose a configurable maximum width:

```css
.ck-example {
    --ck-example-internal-default-max-width: 60rem;
    max-inline-size: var(
        --ck-example-max-width,
        var(--ck-example-internal-default-max-width)
    );
}
```

The `60rem` value is illustrative, not an approved CourseKit dimension. The component owns its internal default; the site may override the public variable without modifying the component stylesheet.

The actual proportions of the main content area, sidebars, and specialized cards must be established and verified when reviewing their respective components, not prescribed by this section.

## 4. Responsive Behavior and Overflow — RESPONSIVE

CourseKit follows a responsive design approach that prioritizes content accessibility, adaptability, and component independence.

Responsive behavior MUST preserve content, functionality, and readability across different viewport dimensions, container sizes, browser configurations, and user preferences.

### 4.1 Mobile-First Design

- **SHOULD:** Components adopt a mobile-first approach, starting with layouts suitable for constrained spaces and progressively introducing more complex arrangements as space becomes available.
- **MUST:** Essential content and functionality remain available regardless of the layout configuration.
- **MUST:** Responsive behavior must not reduce informative or interactive text below the minimum typography size established in §1.2.
- **SHOULD:** Components adapt their arrangement rather than reduce text sizes merely to fit available space.
- **MAY:** Components use alternative responsive strategies when their presentation or functional requirements justify them.

Mobile-first does not impose a specific visual arrangement or breakpoint on every component.

#### Orientation-Aware Layout and Stacking

CourseKit uses orientation-aware layout adaptation for mobile presentations.

- **MUST:** In mobile portrait orientation, the framework stacks layout regions vertically by default.
- **MUST:** In mobile landscape orientation, the framework preserves a horizontal arrangement when the available space allows the content to be displayed correctly.
- **MUST:** In mobile landscape orientation, layout regions stack when their horizontal arrangement cannot be maintained without compromising content visibility, readability, or usability.
- **MUST:** The decision to stack in landscape mode is based on the actual space and content constraints, not on orientation alone.
- **MAY:** Individual components define different arrangements when required by their functionality or presentation.

These requirements apply to the framework's layout composition. They do not require every component's internal content to be vertically stacked.

### 4.2 Container Queries and Media Queries

CourseKit distinguishes between component-level and page-level responsive behavior.

| Context | Preferred mechanism | Purpose |
|---|---|---|
| Modular components | Container queries | Adapt presentation to the space allocated to the component |
| Page-level structure | Media queries | Adapt the overall layout according to viewport conditions |

- **SHOULD:** Modular components prefer container queries when their presentation depends on their containing space.
- **SHOULD:** Page-level layouts use media queries when viewport conditions are relevant.
- **MAY:** Components use media queries or other appropriate mechanisms when container queries are not suitable.
- **MUST:** Container queries reference an appropriate query container.
- **MUST:** Responsive behavior preserve the component's functionality when embedded in different layout contexts.

Responsive dimensions and spacing MUST follow the relative-unit conventions established in §1.1 and §2.3.

### 4.3 Breakpoint Selection

CourseKit does not impose universal device-based breakpoints.

- **SHOULD:** Breakpoints be determined by actual content and layout constraints.
- **MAY:** Different components use different breakpoints according to their individual requirements.
- **MUST NOT:** Component behavior depend solely on an assumed device category when the actual available space may differ.
- **MUST:** Breakpoint-specific design values follow the design-token conventions established in §0.6.

Breakpoint values and their responsive effects belong to the components or page-level layouts that use them.

#### Standard Reference Breakpoints

CourseKit provides a set of named reference breakpoints for developer convenience and consistency. These references indicate common device-width categories but do not impose responsive thresholds on framework components.

| Reference name | Reference threshold | Indicative category |
|---|---|---|
| `mobile-sm` | `30rem` (480 CSS px at the default root size) | Small mobile |
| `mobile` | `40rem` (640 CSS px) | Mobile |
| `tablet` | `48rem` (768 CSS px) | Tablet |
| `tablet-lg` | `64rem` (1024 CSS px) | Large tablet |
| `desktop` | `80rem` (1280 CSS px) | Desktop |
| `desktop-lg` | `96rem` (1536 CSS px) | Large desktop |

The corresponding proposed named references are `--ck-bp-mobile-sm`, `--ck-bp-mobile`, `--ck-bp-tablet`, `--ck-bp-tablet-lg`, `--ck-bp-desktop`, and `--ck-bp-desktop-lg`. Their thresholds are reference values, not definitions of physical device types.

- **MUST:** The framework provide a documented set of named standard reference breakpoints.
- **MAY:** Components and sites reuse these standard breakpoints.
- **MAY:** Components define their own breakpoints according to content and layout constraints.
- **MUST NOT:** Standard reference breakpoints be treated as mandatory thresholds for all components.
- **SHOULD:** Components prefer content-driven breakpoints and container queries when appropriate.

**Implementation deferred:** CSS custom properties declared on `:root` cannot be substituted directly into media-query conditions using `var()`. The representation, exposure, and resolution of these names (including any possible preprocessing or loader integration) will be decided separately. This document establishes the approved names, reference values, and intended semantics, not an implemented CSS resolution mechanism.

### 4.4 Horizontal Overflow and Viewport Scrolling

**The viewport MUST NOT display horizontal scrolling by default.**

A page MAY explicitly authorize viewport-level horizontal scrolling when its presentation or functionality requires it.

- **MUST:** Components prevent unintended horizontal overflow of the viewport.
- **MUST:** Prefer content reflow, wrapping, fluid resizing, or layout reorganization wherever practical.
- **MUST:** When horizontal scrolling is genuinely necessary, contain it within the component responsible for the overflowing content, unless the page explicitly authorizes viewport-level scrolling.
- **MUST:** Avoid using `overflow-x: hidden` on `body` or the root element as a blanket workaround for layout defects.
- **MUST:** Preserve access to all relevant content and interactive elements.
- **MAY:** Tables, diagrams, code blocks, or other content that cannot reasonably be reorganized use component-level horizontal scrolling.

The absence of a visible horizontal scrollbar is not sufficient evidence of compliance if content has been clipped or made inaccessible.

### 4.5 Accessible Scrolling and Reflow

Scrollable components MUST remain usable through appropriate interaction methods.

- **MUST:** Scrollable content remain accessible through keyboard navigation when applicable.
- **MUST:** Horizontal scrolling remain operable through touch and other relevant input mechanisms.
- **MUST:** Focusable elements must not become inaccessible because of clipping or overflow constraints.
- **SHOULD:** Scrollable regions provide an appropriate visual indication when additional content is available outside the visible area.
- **MUST:** Responsive layouts support text enlargement, text-spacing adjustments, and content growth without unintended loss of information or functionality.

CourseKit targets WCAG 2.2 Level AA, including the applicable requirements concerning text resizing, reflow, and text spacing.

Exceptions recognized by WCAG for content requiring two-dimensional layout remain applicable.

### 4.6 Component Responsibility and Validation

Each component is responsible for its own responsive behavior.

- **MUST:** Component-specific responsive rules remain in the stylesheet of the component that owns them.
- **MUST:** Components preserve their independence when embedded in different page layouts or other components.
- **MUST:** Responsive design values follow the CSS custom-property conventions established in §0.6, except for conditions that cannot directly use custom properties (such as CSS media-query conditions).
- **SHOULD:** Components expose public variables when sites may need to customize responsive dimensions or behavior.
- **MUST:** Responsive behavior be verified using actual rendered layouts, not solely through inspection of CSS declarations.
- **SHOULD:** Validation include narrow containers, large viewports, zoom, enlarged text, long content, nested components, keyboard interaction, and touch interaction.
- **MAY:** Sites customize responsive rules and explicitly authorize viewport-level horizontal scrolling for particular pages.

This section establishes general responsive requirements. Specific breakpoints, column proportions, and layout arrangements remain implementation decisions owned by individual components.

## 5. Modular CSS Architecture and Inheritance — CSS-01 / 02 / 03

CourseKit follows a modular CSS architecture in which global styles define shared conventions and individual components retain responsibility for their own presentation.

The architecture MUST preserve component independence, natural CSS inheritance, predictable customization, and the distinction between framework-provided styles and site-specific overrides.

### 5.1 Stylesheet Ownership

Each stylesheet has a defined responsibility.

| Location | Responsibility |
|---|---|
| `framework/styles/tokens.css` | Global design tokens and shared design primitives |
| `framework/styles/reset.css` | Minimal global reset, box model, and root defaults |
| `framework/visual/<component>/<component>.css` | Presentation, defaults, variants, and internal properties of the owning visual component |
| `framework/modules/<module>/...` | Styles belonging to the module and its components |
| Site or course stylesheets | Site-wide customization, local overrides, and composition-specific presentation |
| `course.json` | Site configuration, including palette and fonts, consumed by the relevant managers and loaders |

- **MUST:** Framework-owned visual components define their presentation in their respective component stylesheets.
- **MUST:** Framework-provided modules own the styles specific to their functionality and visual components.
- **MUST:** Global design tokens remain limited to values shared across the framework.
- **MUST NOT:** Component-specific or module-specific design values be placed in global stylesheets merely for convenience.
- **MUST NOT:** Styles for module-only components be moved into global stylesheets merely to make them available.
- **SHOULD:** Avoid implicit styling dependencies between independently defined modules and components.
- **MAY:** Sites define additional stylesheets and override framework presentation according to their needs.

Stylesheet ownership follows the responsibilities established in §0.6, §2.6, and §3.5.

### 5.2 Selector Scope and Component Isolation

Framework component styles SHOULD target the elements and presentation responsibilities owned by the component.

- **SHOULD:** Avoid broad descendant selectors that may unintentionally affect nested components.
- **SHOULD:** Prefer selectors targeting the component's own structure or explicitly defined presentation elements.
- **SHOULD NOT:** Component CSS reach into another component's private DOM structure or override its internal presentation.
- **MUST:** When a framework component deliberately styles nested content, the effect on independently defined child components must be considered.
- **MAY:** A component use descendant selectors when required by its structure or intended composition.

For example, a selector such as:

```css
.ck-infobox p {
    margin-block: 0;
}
```

may affect paragraphs belonging to nested components.

A selector targeting an element explicitly owned by the infobox is generally preferable:

```css
.ck-infobox__content {
    margin-block: 0;
}
```

These conventions do not prohibit descendant selectors categorically.

Site-specific stylesheets MAY use broader composition-oriented selectors when needed. Their scope SHOULD remain appropriately constrained, for example through a `data-style-ref` selector.

Component isolation MUST NOT prevent useful natural CSS inheritance.

### 5.3 Inheritance and CSS Custom Properties

CourseKit preserves natural CSS inheritance wherever it supports consistent and maintainable presentation.

Properties such as `font-family`, `color`, `font-size`, and `line-height` SHOULD inherit when appropriate.

- **SHOULD:** Avoid unnecessarily resetting inherited properties in every component.
- **MUST:** Global design values use shared CSS custom properties defined at the appropriate global level.
- **MUST:** Component-specific variables use a component-specific namespace, such as `--ck-infobox-*`.
- **MUST NOT:** A component depend on another component's private variables merely because CSS custom properties inherit through the DOM.
- **MUST:** Public customization variables be documented.
- **MAY:** Components use internal variables for implementation-specific calculations and variant defaults.
- **MUST NOT:** Internal variables be treated as stable public customization interfaces unless explicitly documented as such.

#### 5.3.1 CSS Variable Naming Convention

CourseKit CSS custom properties use lowercase, hyphen-separated names with the `--ck-` prefix. The name MUST identify the owning scope and the purpose of the value.

| Scope | Naming pattern | Examples |
|---|---|---|
| Global, shared design tokens | `--ck-<role>` or `--ck-<category>-<role>` | `--ck-accent`, `--ck-space-lg`, `--ck-font-body-size`, `--ck-prose-gap` |
| Component public customization | `--ck-<component>-<property>` | `--ck-infobox-font-size`, `--ck-infobox-padding-block` |
| Component internal implementation | `--ck-<component>-internal-<property>` | `--ck-infobox-internal-default-padding` |
| Module-specific properties | `--ck-<module>-<property>` (or a component-specific prefix within the module) | `--ck-quest-content-gap` |

- **MUST:** Use names that reflect the semantic role or owned property, rather than an unrelated implementation detail.
- **MUST:** Keep component and module variable names within their owner's namespace to avoid collisions.
- **MUST:** Reserve the `internal` segment for variables not intended as stable site-facing interfaces.
- **SHOULD:** Use CSS logical-property terminology such as `padding-inline` and `padding-block` when the value represents a logical dimension.
- **MUST NOT:** Create a new global token solely because a component needs a local value.

This convention applies to CSS custom properties. It does not mandate a particular naming scheme for every CSS class or require BEM.

#### 5.3.2 Public Variables and Fallbacks

Public variables SHOULD be consumed with appropriate fallback values.

```css
.ck-infobox {
    font-size: var(
        --ck-infobox-font-size,
        var(--ck-font-box-size)
    );
}
```

A site may then define:

```css
:root {
    --ck-infobox-font-size: var(--ck-font-body-size);
}
```

Components MUST NOT unnecessarily define the same public variable on every component instance when doing so would prevent inherited site-level values from taking effect.

#### 5.3.3 Variant Defaults

When a component variant changes a default value, an internal default variable MAY be used to preserve public override precedence.

```css
.ck-infobox {
    --ck-infobox-internal-default-padding:
        var(--ck-space-lg);

    padding: var(
        --ck-infobox-padding,
        var(--ck-infobox-internal-default-padding)
    );
}

.ck-infobox[data-variant="compact"] {
    --ck-infobox-internal-default-padding:
        var(--ck-space-sm);
}
```

The mechanism SHOULD be used when necessary, rather than introducing redundant internal variables for every property.

#### 5.3.4 Variant and Style Reference

CourseKit distinguishes two independent presentation mechanisms:

- **`variant`** selects a presentation supplied and maintained by the owning component.
- **`style-ref`** identifies a presentation customization supplied by the site.

A component MAY expose multiple variants. A site MAY customize the component independently of the selected variant.

### 5.4 Cascade, Precedence, and Site Customization

CourseKit follows the intended presentation hierarchy:

1. Framework-wide defaults and shared design primitives.
2. Component and module presentation.
3. Site-specific customization.

This hierarchy describes the intended customization model; it does not replace the actual rules of the CSS cascade.

- **MUST:** Framework styles be organized so that site-level customization remains possible without editing framework-owned stylesheets.
- **MUST:** Implementations account for the actual cascade, including selector specificity, inheritance, source order, and inline styles.
- **SHOULD:** Avoid unnecessarily high selector specificity in framework-owned styles.
- **MUST NOT:** Framework-owned styles use `!important` as a mechanism for enforcing presentation or overriding other styles.
- **SHOULD:** Site-specific styles avoid `!important` and resolve conflicts through appropriate selectors, custom properties, or cascade order where possible.
- **MAY:** Site-specific styles use `!important` when necessary to enforce an intentional site-level override that cannot be achieved reliably through the normal customization interfaces.
- **MUST:** Verify that public customization variables retain their intended precedence over component and variant defaults.
- **MAY:** Cascade layers be introduced with an explicit compatibility and migration plan.
- **MAY:** Sites use their own selectors, custom properties, and stylesheets to modify framework presentation.

The framework MUST NOT assume that stylesheet loading order alone guarantees the intended precedence.

Changes to CSS loading or injection mechanisms MUST preserve the documented customization behavior.

## 6. Colors, Semantic Roles and Themes — COLOR-01 through COLOR-05

CourseKit uses a role-based color system to support consistent presentation, site customization, accessible color combinations, and automatic or manually selected visual themes.

Global color roles belong to the framework's design token system. Individual components retain responsibility for their own presentation, semantic variants, and component-specific color properties.

### 6.1 Global Palette and Color Ownership

#### 6.1.1 Global Palette

CourseKit defines nine globally available palette roles, configurable through `course.json`.

| Palette key (`course.json`) | CSS token | Purpose |
|---|---|---|
| `accent` | `--ck-accent` | Brand accents, links, actions, and prominent interactive highlights |
| `accent-light` | `--ck-accent-light` | Subtle accent backgrounds and highlights |
| `structure` | `--ck-structure` | Navigation, structural regions, and major visual boundaries |
| `text-main` | `--ck-text-main` | Main reading text |
| `text-dark` | `--ck-text-dark` | Headings and stronger-emphasis text |
| `border` | `--ck-border` | Neutral borders and separators |
| `bg-base` | `--ck-bg-base` | Overall page background |
| `surface` | `--ck-surface` | Standard content and container backgrounds |
| `surface-muted` | `--ck-surface-muted` | Secondary and visually subdued surfaces |

These names identify semantic roles, not fixed visual appearances. For example, `text-dark` continues to identify its established typographic role in dark mode even if its resolved color is light.

- **MUST:** The framework provides the nine global color roles.
- **MUST:** Global colors be available through their documented CSS custom properties.
- **MUST:** The site may configure global palette roles through `course.json`.
- **MUST:** Framework-owned components reference color tokens rather than hardcoding ordinary design colors.
- **SHOULD:** Components use the most appropriate semantic color role.
- **MAY:** Components define their own color properties and variants when their presentation requires them.

#### 6.1.2 Color Ownership

Global color values belong to the shared design token and theme resolution system.

Component-specific colors belong to the components that use them.

- **MUST:** Framework-owned components express component-specific color values through CSS custom properties, consistent with §0.6 and §5.3.
- **MUST NOT:** Component-specific color properties be centralized in `tokens.css` merely for convenience.
- **SHOULD:** Components expose public color variables where site-level customization is useful.
- **MAY:** Sites override global or public component color properties.
- **MAY:** Components define alternative semantic or decorative color treatments through their own variants.

The variable naming and inheritance requirements established in §5 apply to color properties.

### 6.2 Semantic Status Colors

CourseKit provides four reusable semantic status roles:

- `info`
- `warning`
- `error`
- `success`

These roles represent meaning shared across the framework, while their particular visual treatments belong to individual components.

- **MUST:** The framework provides reusable global color roles for all four statuses.
- **MUST:** Semantic status colors participate in light/dark theme resolution.
- **MAY:** Sites customize the global status colors through their configuration.
- **MAY:** Components expose additional foreground, background, border, or accent properties for their status variants.
- **MUST:** Status meaning must not be conveyed through color alone.
- **SHOULD:** Components accompany status colors with suitable textual labels, icons, or other non-color indicators.

The exact set of foreground, background, and border tokens for each status, their default values, and their derivation rules remain implementation decisions to be defined and verified.

#### Semantic Roles and Component Variants

The four global semantic roles (`info`, `warning`, `error`, and `success`) MAY be exposed as named component variants when the component supports semantic status presentations.

For example:

```html
<ck-infobox data-variant="warning">
    ...
</ck-infobox>
```

- **MUST:** When a component exposes a semantic status as a variant, its variant name corresponds to the applicable global semantic role.
- **MUST:** The variant's default presentation reference the corresponding semantic color tokens.
- **MAY:** Different components implement different visual treatments for the same semantic role.
- **MUST NOT:** Every component be required to implement all four semantic variants when they are not relevant to its functionality.
- **MAY:** Sites customize a semantic variant through public component variables or `style-ref`, without changing the variant's semantic meaning.

A semantic role defines the meaning and shared color reference. A component variant defines how that meaning is visually represented.

### 6.3 Theme Resolution and Customization

#### 6.3.1 Theme Modes

CourseKit supports three theme modes:

| Mode | Behavior |
|---|---|
| `light` | Apply the effective light palette |
| `dark` | Apply the effective dark palette |
| `auto` | Follow the user's system color-scheme preference |

- **MUST:** The framework supports `light`, `dark`, and `auto`.
- **MUST:** The system color-scheme preference be followed by default unless the user has explicitly selected another mode.
- **MUST:** Users be able to switch themes manually.
- **SHOULD:** A manually selected preference persist across page navigation and sessions when technically feasible.
- **MUST:** Theme functionality remain available when persistent storage is unavailable.
- **MUST:** Theme switching update the effective global color values so components adapt without each implementing an independent theme system.

Individual components MAY require component-specific light/dark presentation rules.

#### 6.3.2 Light Palette Resolution

The framework provides baseline light-mode palette values.

The site MAY override individual global color roles through `course.json`.

- **MUST:** Resolve the effective light palette from the framework defaults and applicable site overrides.
- **MUST:** Preserve explicit site-defined values unless an explicitly documented configuration rule requires otherwise.
- **MUST:** Make the resulting effective color roles available to components through their shared CSS tokens.

#### 6.3.3 Dark Palette Derivation

When dark-mode values are not explicitly supplied, CourseKit derives them from the applicable color roles.

- **MUST:** Dark palette derivation respect semantic color roles rather than merely invert RGB values.
- **MUST:** Explicit site-defined dark values take precedence over automatically derived values.
- **MUST:** Dependent derived dark values be recalculated from the effective overridden inputs when their dependencies apply.
- **MUST NOT:** Silently replace explicit site overrides with automatically generated alternatives.
- **MUST:** Semantic status colors also participate in dark palette resolution.

For example, if a site explicitly overrides the dark `accent` value but does not override dark `accent-light`, the framework must derive the latter using the effective dark `accent` according to their defined dependency.

An OKLCH-based perceptual approach is proposed for color derivation. The exact algorithm, dependency graph, gamut-clipping rules, and reference outputs have not yet been approved and require implementation and validation.

#### 6.3.4 Theme Configuration and Runtime Integration

Theme configuration and effective CSS color values MUST remain consistent.

- **MUST:** The theme resolution mechanism coordinate with the actual CSS loading and injection behavior.
- **MUST:** Theme switching correctly update values consumed by framework components.
- **MUST:** The implementation account for CSS cascade priority, including inline custom properties applied by runtime loaders.
- **MUST:** Changes to the theme implementation preserve documented site customization behavior.

The configuration schema and runtime mechanism remain subject to technical design.

In particular, the precise JSON representation of light and dark palettes has not yet been approved.

### 6.4 Color Accessibility and Verification

CourseKit targets WCAG 2.2 Level AA for relevant color and contrast requirements.

#### 6.4.1 Contrast Requirements

The applicable contrast requirements normally include:

| Use | Minimum ratio |
|---|---|
| Regular text | 4.5:1 |
| Qualifying large text | 3:1 |
| Non-text visual information covered by WCAG 1.4.11 | 3:1 |

The applicable WCAG exceptions remain valid.

- **MUST:** Verify effective foreground/background combinations against the applicable contrast criteria.
- **MUST:** Verify both light and dark themes.
- **MUST:** Include interactive states and component variants in contrast verification.
- **MUST:** Status meaning and other essential information remain understandable without color alone.
- **SHOULD:** Inadequate contrast introduced by explicit site overrides generate a diagnostic warning.
- **MUST NOT:** Silently modify explicit site colors solely to correct contrast.

#### 6.4.2 Verification Responsibilities

- **MUST:** Framework-provided default palettes meet the applicable accessibility requirements in their intended usage contexts.
- **MUST:** Framework-owned components be tested with effective theme colors and relevant states.
- **SHOULD:** Sites verify customized palette combinations before deployment.
- **MAY:** The framework provide development-time or runtime diagnostics identifying problematic color combinations.

Color accessibility must be evaluated using actual combinations displayed in the interface, not only by inspecting individual palette tokens.

## 7. User Experience — UI-01 / UI-02 / UI-03

CourseKit provides consistent interaction, motion, and layering conventions across its visual components.

User experience requirements MUST preserve functionality, accessibility, predictable interaction, and component independence, regardless of the visual presentation selected by a component or site.

### 7.1 Interactive States and Input Methods

#### 7.1.1 Interactive States

Interactive components MUST support and visually communicate the states relevant to their functionality.

The standard state vocabulary includes:

| State | Purpose |
|---|---|
| `default` | Normal presentation |
| `hover` | Pointer hovering over an interactive element |
| `focus-visible` | Visually identifiable keyboard or other non-pointer focus |
| `active` | Activation or pressed interaction |
| `disabled` | Unavailable interaction |
| `expanded` / `collapsed` | Visibility state of controlled content |
| `selected` | Current selection within a set of choices |

- **MUST:** Components implement all states relevant to their functionality.
- **MUST:** Interactive states remain distinguishable where necessary for understanding or operating the component.
- **MUST:** Keyboard focus remain visibly identifiable.
- **MUST NOT:** Remove a visible focus indicator without providing an accessible replacement.
- **MUST:** Functional states be reflected in the component's behavior and exposed through appropriate native or ARIA semantics.
- **MUST:** Disabled and selected states must not be communicated through color alone.
- **MAY:** Components define additional states when required by their functionality.

State-specific styling remains the responsibility of the owning component.

#### 7.1.2 Input Methods

CourseKit interactive functionality MUST NOT depend exclusively on pointer hover.

- **MUST:** Interactive controls remain operable through appropriate keyboard interactions.
- **MUST:** Interactive functionality be accessible through touch when applicable.
- **MUST:** Hover-dependent presentations, including hoverboxes and disclosure widgets, provide suitable alternative interaction mechanisms.
- **MUST:** Opening and closing interactions preserve access to their content and controls.
- **MUST:** Focus handling remain consistent with the component's functionality.
- **SHOULD:** Components support consistent interaction patterns across different input methods.

Not every state must be triggered by every input method. What matters is that the underlying functionality remains accessible through the applicable interaction methods.

#### 7.1.3 States, Variants and Customization

Interactive states and component variants represent different concepts.

- A **state** represents the current functional or interaction condition of a component.
- A **variant** selects a presentation defined and maintained by the component.
- A **style-ref** selects a site-specific presentation customization.

- **MUST:** A visual variant must not replace or interfere with the component's functional state management.
- **MUST:** A component's relevant interaction states remain accessible across its supported variants.
- **SHOULD:** State-related design values reference global tokens or appropriate component-specific variables.
- **MAY:** Sites customize the visual presentation of interactive states.
- **MUST:** Site customization must preserve applicable accessibility requirements.

### 7.2 Animation, Transitions and Motion

#### 7.2.1 Standard Motion Tokens

CourseKit establishes three standard transition durations.

| Token | Value | Typical purpose |
|---|---|---|
| `--ck-motion-fast` | `150ms` | Hover, focus and small visual changes |
| `--ck-motion-normal` | `250ms` | Ordinary transitions, reveal and conceal |
| `--ck-motion-slow` | `350ms` | Drawers and more complex panels |

The standard easing references are:

| Token | Value | Typical purpose |
|---|---|---|
| `--ck-easing-default` | `ease` | Ordinary transitions |
| `--ck-easing-enter` | `ease-out` | Entrance |
| `--ck-easing-exit` | `ease-in` | Exit |

- **MUST:** Approved standard motion values be exposed through shared design tokens in `tokens.css`.
- **SHOULD:** Components use the standard durations and easings when appropriate.
- **MAY:** Components define their own duration and easing properties when justified by their presentation or interaction behavior.
- **MUST:** Component-specific motion values remain in the owning component's stylesheet.
- **SHOULD:** Components expose public motion variables when site customization is useful.

#### 7.2.2 Animation Implementation

- **SHOULD:** Prefer animating `transform` and `opacity` when appropriate.
- **MAY:** Animate layout-affecting properties when required by the intended effect.
- **MUST:** Layout-affecting animations be evaluated for rendering performance and content stability.
- **MUST:** Animation must not make relevant content or controls inaccessible.
- **MUST:** The component's logical interaction state remain independent of animation timing.
- **MUST:** Opening, closing, selection, and other functional transitions remain correct when animation is disabled or interrupted.

Animations provide visual feedback and continuity; they must not be the sole mechanism responsible for implementing a component's behavior.

#### 7.2.3 Reduced Motion

CourseKit MUST respect `prefers-reduced-motion`.

- **MUST:** Components reduce or eliminate nonessential movement when reduced motion is requested.
- **MUST:** Functional interaction remain available when transitions and animations are disabled.
- **MUST:** Components not rely on an animation completing to establish their logical state.
- **MAY:** Essential functional motion remain where appropriate and compatible with applicable accessibility requirements.
- **SHOULD:** Reduced-motion behavior be implemented within the owning component's stylesheet.

### 7.3 Layering, Stacking Contexts and Z-Index

#### 7.3.1 Global Layer Scale

CourseKit establishes a shared global scale for common interface layers.

| Token | Value | Intended layer |
|---|---:|---|
| `--ck-z-base` | `0` | Base content |
| `--ck-z-sticky` | `100` | Sticky navigation |
| `--ck-z-dropdown` | `200` | Dropdowns |
| `--ck-z-popover` | `300` | Hoverboxes and popovers |
| `--ck-z-overlay` | `400` | Overlays and backdrops |
| `--ck-z-modal` | `500` | Modals and dialogs |
| `--ck-z-toast` | `600` | Toasts and notifications |

- **MUST:** Global layer tokens be defined in `tokens.css`.
- **MUST:** Framework components use the appropriate shared layer token when participating in the global stacking hierarchy.
- **MUST NOT:** Use arbitrary excessively large `z-index` values as workarounds for layering defects.
- **MAY:** Components define local stacking indices for their internal elements.
- **SHOULD:** Local stacking indices remain small and within the component's intended stacking context.

The values above are **framework defaults, not a mandatory site-level ordering**. A site MAY override the global layer tokens to change the relative ordering of layers, including assigning different values to the named roles. Framework components MUST continue to reference the tokens rather than hardcoded global indices, so site overrides take effect.

#### 7.3.2 Stacking Contexts and Clipping

A numerical `z-index` value does not by itself guarantee that an element appears above another.

- **MUST:** Components account for stacking contexts created by ancestors and CSS properties.
- **MUST:** Components account for ancestor clipping and overflow behavior.
- **MUST:** Layering problems be corrected at the appropriate layout or stacking-context level rather than through arbitrary increases in `z-index`.
- **SHOULD:** Use suitable native top-layer mechanisms when content must appear above ordinary page stacking contexts.
- **MUST:** Layering decisions preserve access to visible interactive content.

The shared global scale establishes the default relative priority; it does not override CSS stacking-context rules or prevent a site from defining its own priority order.

#### 7.3.3 Layering and Interaction

- **MUST:** Overlaid components preserve appropriate interaction and focus behavior.
- **MUST:** Hidden or inactive overlays must not unintentionally block interaction with accessible content.
- **MUST:** Modals, dialogs, popovers, and overlays implement the interaction semantics appropriate to their behavior.
- **SHOULD:** Components avoid unnecessary creation of stacking contexts that interfere with nested components.
- **MAY:** Sites redefine the global stacking order by overriding the shared layer tokens, provided the resulting interaction, visibility, and accessibility remain correct.

### 7.4 Component Ownership and User Experience Validation

#### 7.4.1 Component Responsibility

- **MUST:** Each component owns its interaction-state styling, transitions, and local layering behavior.
- **MUST:** Shared durations, easings, and global layer values use their approved tokens.
- **MUST:** Component-specific values remain under the ownership of their component.
- **SHOULD:** Public customization variables be provided where sites may need to adjust component presentation.
- **MUST:** Component variants preserve functional and accessible interaction behavior.
- **MAY:** Sites customize appearance, motion, and layering through site-specific CSS.

Component-specific presentation choices MUST remain compatible with the modular architecture established in §5.

#### 7.4.2 Verification

User experience validation MUST examine relevant functional states, input methods, motion preferences, and layering contexts.

Testing SHOULD include:

- Keyboard-only navigation and visible focus.
- Pointer and touch interaction.
- Opening, closing, selecting and disabling controls.
- Nested interactive components.
- Animation enabled, disabled and interrupted.
- Reduced-motion preferences.
- Popovers and overlays within constrained or clipping containers.
- Different viewport and container sizes.
- Site-defined variants, overrides and customizations, including changes to the global layer order.

Framework-provided components MUST meet the applicable WCAG 2.2 Level AA requirements, including focus visibility, non-text contrast, keyboard accessibility, and target-size criteria where relevant.

Automated accessibility checks MAY support verification but MUST NOT replace functional and manual interaction testing.

## 8. Fonts and Loading — FONT-01

CourseKit provides a configurable font system based on two shared font families, reliable fallback behavior, and independent component typography.

Font loading MUST preserve content accessibility and functionality, regardless of font availability or loading state.

### 8.1 Global Font Families

CourseKit defines two global font-family tokens:

| Token | Role |
|---|---|
| `--ck-font-body` | Default family for body text, paragraphs, labels, and general interface content |
| `--ck-font-display` | Family for headings, titles, and display typography |

- **MUST:** The framework exposes both global font-family tokens.
- **SHOULD:** Framework components use these shared families for their standard typography.
- **MAY:** Components and modules use specialized font families when their presentation requires them.
- **MUST:** Specialized font families remain under the responsibility of the owning component or module.
- **MUST NOT:** Introduce additional mandatory global font families merely for the needs of a particular component.

No third global monospace font family has been approved.

Component-specific font choices follow the stylesheet ownership and customization conventions established in §5.

### 8.2 Font Configuration and Resource Loading

CourseKit allows sites to configure font resources through `course.json`, using the `resources.fonts` configuration.

- **MUST:** The font loading mechanism support site-configured font resources.
- **MUST:** Both locally hosted and remotely hosted font resources be supported.
- **MUST:** Font resources be loaded and resolved through the framework's established resource-loading mechanisms.
- **MUST:** Font loading not prevent essential content from being displayed or used.
- **SHOULD:** Font loading avoid unnecessary rendering delays and redundant resource requests.
- **MAY:** Sites use system font stacks without requiring downloadable web fonts.

The exact representation of font resources in `course.json` and the internal responsibilities of `FontLoader` are implementation concerns. This section does not introduce a new configuration schema.

### 8.3 Font Fallbacks and Availability

Global font-family definitions MUST include reliable fallback stacks.

- **MUST:** Text remain readable when a configured font is unavailable.
- **MUST:** Font-loading failures not prevent access to content or interactive functionality.
- **MUST:** Font fallbacks preserve the intended generic family category where practical.
- **SHOULD:** Fallback families be selected to limit disruptive differences in text metrics and line wrapping.
- **SHOULD:** Layouts tolerate metric changes when the final font becomes available.
- **MUST:** Components accommodate text wrapping and content growth without unintended clipping or loss of functionality.

When CourseKit controls `@font-face` declarations, `font-display: swap` is the proposed default strategy, subject to the loading context and specific implementation requirements.

The use of `font-display: swap` does not eliminate the need to verify layouts with both fallback and final fonts.

### 8.4 Font Weights and Rendering

CourseKit uses the standard font-weight scale established in §1.5:

| Weight | Global token |
|---|---|
| 300 | `--ck-font-weight-light` |
| 400 | `--ck-font-weight-regular` |
| 500 | `--ck-font-weight-medium` |
| 600 | `--ck-font-weight-semibold` |
| 700 | `--ck-font-weight-bold` |

- **MUST:** Framework components reference the approved weight tokens for standard typographic roles.
- **SHOULD:** Font resources provide the actual weights required by their intended usage.
- **SHOULD:** Prefer real font-weight files or variable-font axes over synthesized weights where available.
- **MAY:** Specialized components use additional supported weights when justified by their design.
- **MUST:** Component-specific typographic choices remain compatible with the accessibility requirements established in §1.

The framework MUST NOT assume that every configured font provides all five standard weights.

### 8.5 Component Ownership and Customization

Font-family configuration, component typography, and site-level customization have distinct responsibilities.

- **MUST:** Shared font-family tokens remain global.
- **MUST:** Component-specific typography remain within the owning component's stylesheet.
- **SHOULD:** Components inherit global font-family values unless their presentation requires an explicit choice.
- **SHOULD:** Components expose public font-family variables when site-level customization is useful.
- **MUST:** Public component typography variables respect the inheritance and precedence conventions established in §5.
- **MAY:** Sites override the global body and display font families.
- **MAY:** Sites customize font families used by particular components.
- **MAY:** Site-provided modules define their own font configurations and specialized font resources.

Font-family tokens and font-size tokens MUST remain distinct.

For example:

- `--ck-font-body` identifies a font family.
- `--ck-font-body-size` identifies a font size.

The use of shared families does not impose a universal font size or heading scale on every component.

### 8.6 Verification

Font behavior MUST be verified in the contexts relevant to CourseKit deployment.

Validation SHOULD include:

- Successful loading of local and remote font resources.
- Unavailable or failed font resources.
- Rendering with fallback and final fonts.
- Font-weight availability and synthesized-weight behavior.
- Text wrapping and changes in content dimensions.
- Zoom, enlarged text, and responsive layouts.
- Light and dark theme presentation.
- Nested components and site-specific font overrides.

Framework-provided components MUST preserve the typography and accessibility requirements established in §1, including minimum informative text sizes, readable line heights, and compatibility with user text-spacing adjustments.

Font-loading failures MUST NOT compromise essential content or functionality.

## 9. Compatibility and Progressive Enhancement — COMPAT-01

CourseKit targets modern web browsers and follows a progressive enhancement approach that prioritizes accessibility, functionality, and maintainability.

Compatibility requirements apply to the framework's rendering, styling, and interaction mechanisms, whether CourseKit is deployed inside D2L Brightspace or hosted as an independent website.

### 9.1 Browser Support Policy

CourseKit targets current stable browser releases based on the three major rendering engines:

| Rendering engine | Representative browsers |
|---|---|
| Chromium | Chrome, Edge, and other Chromium-based browsers |
| Gecko | Firefox |
| WebKit | Safari |

- **MUST:** CourseKit support the current mainstream stable releases of these browser families on relevant desktop and mobile platforms.
- **MUST:** When used within D2L Brightspace, CourseKit remain compatible with the browsers officially supported by the target Brightspace environment.
- **MUST:** Framework functionality remain usable when hosted independently of Brightspace.
- **SHOULD:** Maintenance and compatibility testing focus approximately on the two most recent major stable browser releases.
- **MAY:** Older browser versions receive additional support when justified by deployment requirements.

The approximate two-version maintenance target is not a permanent commitment to specific browser version numbers.

Compatibility does not require identical rendering across different engines, operating systems, or historical browser versions.

### 9.2 Modern CSS and Progressive Enhancement

CourseKit MAY use modern CSS features supported by its target environments, including:

- CSS Grid and Flexbox.
- `clamp()` and other modern CSS calculations.
- Container queries and container-relative units.
- Logical properties.
- CSS custom properties.
- Modern color functions and other supported presentation features.

- **MUST:** Essential content, navigation, and interaction remain available in supported deployment environments.
- **SHOULD:** Prefer native browser capabilities when they provide an appropriate, interoperable solution.
- **MAY:** Use newer features when their limitations are understood and suitable compatibility measures are provided.
- **MUST:** Provide an appropriate fallback when the absence of a feature would make essential content or functionality inaccessible.
- **MAY:** Allow decorative effects and nonessential visual refinements to degrade gracefully.

Progressive enhancement does not require a pixel-identical fallback.

Additional compatibility styles SHOULD NOT be introduced without a functional, accessibility, or justified deployment requirement.

### 9.3 Fallbacks and Component Ownership

Compatibility fallbacks follow the same ownership principles as other CourseKit styles.

- **MUST:** Component-specific fallback rules remain under the responsibility of the owning component or module.
- **MUST:** Fallbacks preserve the component's essential content and interaction behavior.
- **MUST:** Fallbacks remain compatible with the framework's accessibility requirements.
- **SHOULD:** Fallback implementations avoid unnecessary duplication of the component's normal presentation rules.
- **SHOULD:** Fallbacks preserve available site customization mechanisms.
- **MAY:** A component use a simpler presentation when its preferred implementation is unavailable.

Shared compatibility mechanisms MAY be implemented at framework level when they serve multiple components.

Component-specific fallback values MUST NOT be centralized as global design tokens merely for convenience.

### 9.4 Runtime Processing and Compatibility

CourseKit MAY provide framework-managed processing when a required capability cannot be used directly across its supported browsers.

Such processing may include resolving configuration values, transforming supported stylesheet syntax, or preparing resources before they are applied.

- **MUST:** Framework-managed transformations produce output compatible with the target browsers.
- **MUST:** Processing preserve the intended CSS cascade, component isolation, and site customization behavior.
- **MUST:** Processing errors must not silently leave essential content or interaction inaccessible.
- **SHOULD:** Prefer standard browser-compatible output over requiring browser-specific behavior.
- **MUST:** Non-native stylesheet conventions be documented with their required resolution mechanism.
- **MUST:** The implementation distinguish between a convention approved for CourseKit and a feature already supported by the runtime.

For example, the framework's approved named breakpoint references require an appropriate resolution mechanism if their syntax is not supported across the targeted browsers.

The exact implementation of that mechanism remains to be determined. This convention does not prescribe a CSS preprocessor, build system, or particular runtime resolver.

### 9.5 Compatibility Verification

Compatibility MUST be evaluated through actual browser behavior, not solely through feature support tables or CSS parsing results.

- **SHOULD:** Tests cover Chromium, Firefox/Gecko, and Safari/WebKit.
- **MUST:** Essential functionality be verified in the browsers required by the target deployment.
- **SHOULD:** Tests cover responsive layout, typography, font loading, themes, interactive states, layering, and scrolling.
- **SHOULD:** Verify component behavior with nested components and site-defined styles.
- **MUST:** Compatibility validation include relevant accessibility and interaction requirements.
- **MAY:** Automated tests and feature detection assist verification.

CSS feature detection using `@supports` MAY be used where appropriate, but successful parsing or feature detection does not guarantee the absence of rendering or behavioral defects.

Known compatibility limitations SHOULD be documented together with their impact and applicable fallback behavior.

## 10. Conformance and Verification — VALIDATION-01 / 02

CourseKit uses complementary verification methods to ensure that its conventions are applied consistently and that framework components remain functional, accessible, customizable, and maintainable.

Conformance applies to the implementation, not merely to the presence of compliant-looking CSS declarations.

### 10.1 Conformance Scope and Normative Levels

The normative scope established in §0 applies to this section.

- **MUST:** Framework-owned components and framework-provided modules comply with the applicable mandatory conventions.
- **SHOULD:** Site-owned styles, components, and modules follow the same conventions unless their specific requirements justify another approach.
- **MUST:** Applicable accessibility requirements be preserved independently of whether the styles originate from the framework or the site.

The normative levels are interpreted as follows:

| Level | Interpretation |
|---|---|
| **MUST / MUST NOT** | Mandatory requirement or prohibition within the applicable normative scope |
| **SHOULD / SHOULD NOT** | Recommended practice; deviations require a documented rationale |
| **MAY** | Permitted option, subject to applicable mandatory requirements |

- **MUST:** A failed mandatory requirement is considered a conformance failure unless the rule explicitly authorizes an exception.
- **MUST:** An authorized exception preserve all applicable accessibility requirements.
- **SHOULD:** Deviations from recommendations be documented and justified.
- **MUST NOT:** An implementation be declared conformant solely because automated checks pass.

### 10.2 Verification Methods

CourseKit uses three complementary verification approaches.

#### 10.2.1 Static Verification

Static verification examines source files, declarations, configuration, and stylesheet organization.

Checks SHOULD cover:

- Screen typography units and minimum informative text sizes.
- Correct usage of global and component-specific design tokens.
- CSS variable naming, ownership, and public/private separation.
- Unexplained hardcoded design values.
- Selector scope and unintended styling dependencies.
- Unjustified `!important` declarations in framework styles.
- Responsive syntax and supported CSS features.
- Reduced-motion declarations where applicable.
- Component-specific spacing and dimension ownership.

- **MUST:** Static conformance verification be included in the framework's validation objectives.
- **SHOULD:** Automate repeatable checks whenever practical.
- **MAY:** Use Stylelint with CourseKit-specific rules.
- **MUST NOT:** Assume that a particular validation tool is installed or configured without verifying the actual development environment.

Static verification cannot establish visual correctness or functional accessibility by itself.

#### 10.2.2 Visual and Responsive Verification

Visual verification examines the actual rendered presentation.

Tests SHOULD include:

- Narrow and wide layouts.
- Zoom at 200%.
- Reflow at 320 CSS px where applicable under WCAG.
- Absence of unintended viewport horizontal overflow.
- Responsive stacking and mobile orientation behavior.
- Content growth and long or unbreakable text.
- Nested components.
- Effective spacing and visual symmetry.
- Light and dark themes.
- Fallback fonts and font loading.
- Component variants and site-specific overrides.
- Layering, clipping, and interactive overlays.

- **MUST:** Relevant visual and responsive behavior be verified in the rendered interface.
- **MUST:** Unintended clipping or inaccessible content be treated as a defect.
- **SHOULD:** Compare migrated components against the reference framework's rendered appearance when visual preservation is required.
- **MUST:** When preserving legacy geometry, account for differences between `content-box` and `border-box`.

Visual verification MUST consider both the component in isolation and its behavior in relevant composition contexts.

#### 10.2.3 Accessibility and Interaction Verification

CourseKit targets WCAG 2.2 Level AA.

Verification MUST include applicable accessibility requirements and SHOULD cover:

- Keyboard-only interaction.
- Focus visibility and focus management.
- Touch and pointer interaction.
- Disclosure, selection, disabled, and expanded states.
- Accessible scrolling regions.
- Target size.
- Text resizing, text spacing, and reflow.
- Text and non-text contrast.
- Reduced-motion behavior.
- Functional operation when animations are disabled or interrupted.
- Theme and variant accessibility.

- **MUST:** Applicable WCAG requirements be satisfied by framework-provided components.
- **MUST:** Relevant interaction behavior be tested manually.
- **MAY:** Automated tools such as axe-core assist verification.
- **MUST NOT:** Automated accessibility checks replace manual interaction and visual verification.

### 10.3 Component and Integration Verification

CourseKit components MUST remain independently usable and compatible with the framework's composition and customization mechanisms.

Verification SHOULD distinguish three contexts:

| Context | Verification objective |
|---|---|
| Standalone component | Validate the component's own presentation and behavior |
| Nested or composed component | Detect styling leakage, layout conflicts, and unexpected interactions |
| Site-customized component | Verify public variables, variants, `style-ref`, and theme overrides |

- **MUST:** Framework component changes preserve documented public customization behavior.
- **MUST:** Relevant component variants preserve functional and accessible interaction states.
- **MUST:** Component-specific variables not unintentionally interfere with unrelated components.
- **MUST:** Theme switching preserve the correct effective color references.
- **SHOULD:** Test site overrides to verify that public variables retain their intended precedence.
- **SHOULD:** Test fallback behavior when fonts, resources, or optional presentation features are unavailable.
- **MUST:** Framework-managed CSS transformations preserve the cascade, component independence, and supported customization mechanisms.

No particular automated test framework is prescribed by this section.

### 10.4 Exceptions, Diagnostics and Traceability

Exceptions and conformance failures must be distinguishable from deliberate implementation decisions.

#### 10.4.1 Exceptions

- **MUST:** Exceptions to mandatory rules be explicitly permitted by the relevant rule.
- **MUST:** Exceptions preserve applicable accessibility obligations.
- **SHOULD:** Document the owner, affected component or stylesheet, rationale, and verification performed.
- **SHOULD:** Record deviations from recommended practices when they may affect maintenance, compatibility, or component integration.

For example:

- A site-level broad descendant selector is permitted, but SHOULD be scoped.
- A comparable selector in framework component CSS SHOULD generally be avoided.
- Viewport-level horizontal scrolling requires explicit authorization by the page.
- A component-specific fixed dimension requires the justification established by §3.

An exception for one component does not automatically establish a new global convention.

#### 10.4.2 Diagnostics

- **SHOULD:** Validation tools provide diagnostics identifying the rule, affected file or component, and observed problem.
- **SHOULD:** Diagnostics distinguish mandatory failures from recommendations and informational observations.
- **MAY:** Framework tooling detect token misuse, missing customization variables, inadequate contrast, or unsupported stylesheet syntax.
- **MUST NOT:** Diagnostics silently alter explicitly configured site values to conceal a conformance problem.

#### 10.4.3 Traceability and Maintenance

- **SHOULD:** Changes to framework components identify the affected conventions and corresponding verification.
- **MUST:** Changes to approved conventions be reflected in this document.
- **MUST NOT:** Treat an unimplemented convention as an already available framework capability.
- **SHOULD:** Keep implementation decisions and compatibility limitations traceable to their owning components, modules, or framework services.

Conformance verification is intended to detect deviations from approved conventions without preventing justified component-specific design choices or site-level customization.

## 11. Requirements for All Future CourseKit Changes

All future modifications to CourseKit MUST respect the conventions established in this document.

These requirements apply to modifications performed manually or generated with automated or AI-assisted tools. Their normative force follows the scope defined in §0.

The purpose of this section is to preserve the framework's architecture, component independence, visual consistency, customization mechanisms, and maintainability throughout its evolution.

### 11.1 Scope and Prior Verification

Before modifying CourseKit styles, components, modules, or related configuration mechanisms:

- **MUST:** Consult the applicable conventions in this document.
- **MUST:** Examine the existing implementation and relevant component contracts.
- **MUST:** Identify which parts of the framework are affected by the requested change.
- **MUST NOT:** Assume that a documented convention has already been implemented.
- **MUST:** Distinguish existing implementation behavior from approved design requirements.
- **MUST:** Apply the normative scope established in §0, distinguishing framework-owned code from site-owned code.
- **SHOULD:** Identify dependencies and potential effects on components that consume the modified functionality.

When the current implementation differs from the approved conventions, the difference MUST be identified rather than silently treated as an intentional design decision.

### 11.2 Ownership and Minimal Changes

Every change MUST respect the ownership of the affected elements.

- **MUST:** Identify whether each affected value or behavior belongs to global design tokens, framework styles, a component, a module, site styles, or `course.json` configuration.
- **MUST:** Make component-specific changes in the appropriate owning component or module.
- **MUST NOT:** Move component-specific design values into global stylesheets merely for convenience.
- **MUST:** Preserve component independence and prevent unintended style leakage into nested components.
- **MUST:** Preserve existing unrelated content, presentation, and behavior.
- **MUST NOT:** Rewrite, simplify, remove, or reorganize unrelated components or styles without an explicit requirement.
- **SHOULD:** Prefer targeted modifications over broad replacements.
- **SHOULD:** Identify the exact affected files and scope of a proposed change.

A modification to one component MUST NOT be used as justification for unrelated architectural or visual changes.

### 11.3 Preservation of Contracts and Customization

CourseKit modifications MUST preserve documented framework contracts unless changing those contracts is explicitly part of the approved work.

- **MUST:** Preserve documented public CSS variables and their intended override precedence.
- **MUST:** Preserve the distinction between component `variant` and site-defined `style-ref`.
- **MUST:** Preserve the ability of sites to customize exposed component styles without editing framework-owned stylesheets.
- **MUST:** Respect the stylesheet ownership and CSS inheritance rules established in §5.
- **MUST:** Preserve relevant configuration and resource-loading contracts.
- **MUST:** Preserve the functional and accessible behavior of component interactions.
- **SHOULD:** Assess compatibility consequences before changing publicly exposed component interfaces.
- **MAY:** Introduce new public customization properties when justified by component requirements.

Changes to public APIs, configuration schemas, or rendering contracts MUST be explicitly identified and documented.

### 11.4 Implementation and Verification

A change is not considered verified solely because the resulting source code is syntactically valid.

- **MUST:** Verify relevant behavior against the conventions in §§1–10.
- **MUST:** Preserve applicable typography, spacing, responsive, interaction, theme, and accessibility requirements.
- **MUST:** Verify changes in the contexts affected by the modification.
- **SHOULD:** Test components independently and within relevant nested compositions.
- **SHOULD:** Verify site customization and public variable overrides when relevant.
- **SHOULD:** Compare migrated components against the reference framework's rendered geometry when visual preservation is required.
- **MUST:** When migrating from `content-box` to `border-box`, account for effective outer dimensions rather than mechanically transferring numerical values.
- **MUST NOT:** Claim that an implementation is functional, visually equivalent, or conformant without appropriate verification.
- **MUST:** Identify relevant tests that were not performed and limitations that remain unresolved.

Verification methods and conformance criteria are defined in §10.

### 11.5 Convention Updates and Unresolved Decisions

CourseKit distinguishes between approved conventions, implementation decisions, and proposals that have not yet been validated.

- **MUST NOT:** Treat unapproved numerical values, algorithms, or implementation mechanisms as established global conventions.
- **MUST:** Preserve approved design decisions unless an explicit change is authorized.
- **MUST:** Update this document when an approved convention is modified.
- **MUST:** Identify the rules affected by an approved convention change and its implementation consequences.
- **MUST NOT:** Silently modify existing conventions to accommodate a particular implementation.
- **SHOULD:** Record unresolved technical decisions separately from approved normative requirements.
- **MAY:** Propose alternative implementations, provided they are clearly distinguished from approved conventions.

Examples of decisions that remain implementation-specific or unresolved include:

- Exact component-specific heading dimensions.
- The final algorithm for deriving dark-mode colors.
- Adaptive spacing coefficients for individual components.
- The proportions of `central-content`, sidebars, and specialized cards.
- The technical mechanism used to resolve named reference breakpoints.

The existence of an approved convention does not, by itself, establish that the corresponding functionality has already been implemented.

Future implementation work MUST continue to distinguish between what CourseKit requires, what it currently provides, and what remains to be developed.

---

## Appendix A — Approved Token Targets (Consolidated Reference)

This appendix aggregates **approved global design tokens** from §§1–8. It is an inventory of target declarations, **not** a replacement for the existing `framework/styles/tokens.css`. Integrate missing declarations into the existing stylesheet without discarding or rewriting unrelated tokens. An approved target does not imply that its implementation has already been verified.

### A.1 Approved global values

```css
:root {
    /* Typography: sizes (§1.2) */
    --ck-font-footnote: 0.75rem;
    --ck-font-box-size: 0.875rem;
    --ck-font-body-size: 1rem;

    /* Typography: line heights (§1.2–1.3) */
    --ck-leading-footnote: 1.4;
    --ck-leading-box: 1.5;
    --ck-leading-body: 1.6;
    --ck-leading-heading-large: 1.2;
    --ck-leading-heading-section: 1.3;
    --ck-leading-heading-component: 1.4;

    /* Typography: paragraph spacing and reading width (§1.4) */
    --ck-paragraph-gap-body: 1rem;
    --ck-paragraph-gap-box: 0.75rem;
    --ck-paragraph-gap-footnote: 0.5rem;
    --ck-reading-width: 70ch;

    /* Typography: weight and letter spacing (§1.5) */
    --ck-font-weight-light: 300;
    --ck-font-weight-regular: 400;
    --ck-font-weight-medium: 500;
    --ck-font-weight-semibold: 600;
    --ck-font-weight-bold: 700;
    --ck-letter-spacing-normal: normal;

    /* Global spacing scale (§2.1) */
    --ck-space-2xs: 0.375rem;
    --ck-space-xs: 0.5625rem;
    --ck-space-sm: 0.8125rem;
    --ck-space-md: 1rem;
    --ck-space-lg: 1.4375rem;
    --ck-space-xl: 2.4375rem;
    --ck-space-2xl: 3.75rem;

    /* Global functional spacing references (§2.2) */
    --ck-prose-gap: var(--ck-space-md);
    --ck-subsection-gap: var(--ck-space-lg);
    --ck-section-gap: var(--ck-space-xl);

    /* Motion and easing (§7.2) */
    --ck-motion-fast: 150ms;
    --ck-motion-normal: 250ms;
    --ck-motion-slow: 350ms;
    --ck-easing-default: ease;
    --ck-easing-enter: ease-out;
    --ck-easing-exit: ease-in;

    /* Default global layer scale (§7.3); sites may reorder */
    --ck-z-base: 0;
    --ck-z-sticky: 100;
    --ck-z-dropdown: 200;
    --ck-z-popover: 300;
    --ck-z-overlay: 400;
    --ck-z-modal: 500;
    --ck-z-toast: 600;
}
```

### A.2 Approved global tokens without a newly approved literal value

The following token names and roles have been approved, but their literal defaults depend on existing stylesheet values, site configuration, or the theme-resolution implementation. **Do not invent replacement values to complete this appendix.**

- **Font-family tokens (§8.1):** `--ck-font-body` and `--ck-font-display`. Their values are font-family stacks configured and resolved by CourseKit; they are distinct from font-size tokens.
- **Nine palette roles (§6.1):** `--ck-accent`, `--ck-accent-light`, `--ck-structure`, `--ck-text-main`, `--ck-text-dark`, `--ck-border`, `--ck-bg-base`, `--ck-surface`, `--ck-surface-muted`.
- **Semantic color roles (§6.2):** `info`, `warning`, `error`, and `success`. Their precise CSS token inventory (including any foreground/background/border derivatives) is not yet fixed by §6.2.
- **Light/dark themes (§6.3):** global palette roles must resolve in the effective theme, respecting site overrides; the dark-mode derivation algorithm and configuration details remain unresolved.

The root font-size rule `html { font-size: 100%; }` belongs in the reset/root styling, not inside this token declaration block.

### A.3 Named breakpoint references — separate from CSS design tokens

Section 4.3 approves these **reference names and thresholds**, for developer convenience:

| Reference | Threshold |
|---|---|
| `--ck-bp-mobile-sm` | `30rem` (480 CSS px at default root size) |
| `--ck-bp-mobile` | `40rem` (640 CSS px) |
| `--ck-bp-tablet` | `48rem` (768 CSS px) |
| `--ck-bp-tablet-lg` | `64rem` (1024 CSS px) |
| `--ck-bp-desktop` | `80rem` (1280 CSS px) |
| `--ck-bp-desktop-lg` | `96rem` (1536 CSS px) |

These are **not** mandatory responsive thresholds. Their representation and resolution remain an implementation decision. In particular, declaring them as ordinary `:root` custom properties would **not** make `var(--ck-bp-tablet)` usable inside a CSS `@media` condition. They are therefore intentionally excluded from the CSS declaration block above.

### A.4 Ownership exclusions

Component-specific variables, including content padding, layout gaps, dimensions, variant defaults, and adaptive formulas, belong to the owning component and **must not** be added to the global token inventory solely for convenience. The historical names `--ck-content-padding` and `--ck-content-gap` are not approved global tokens (§2.2).

## Appendix B — Normative Standards and Technical References

This appendix distinguishes **normative standards** (principally W3C Recommendations and their applicable conformance criteria) from **informative technical documentation** (including W3C Understanding documents and MDN references). CourseKit-specific tokens, breakpoint values, layering priorities, and component conventions are internal policies, not requirements imposed by W3C or MDN.

### B.1 Accessibility — W3C Standards and Guidance

**Normative standard**

- [W3C — Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) — applicable Level AA conformance criteria.

**Informative guidance for the applicable criteria**

- [Resize Text (1.4.4)](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [Reflow (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Text Spacing (1.4.12)](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [Contrast (Minimum) (1.4.3)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Non-text Contrast (1.4.11)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

### B.2 Interaction and Focus — W3C Guidance

- [Keyboard (2.1.1)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [Focus Visible (2.4.7)](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [Focus Not Obscured (Minimum) (2.4.11)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [Target Size (Minimum) (2.5.8)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

**Level distinction:** Focus Not Obscured (Minimum) (2.4.11) and Target Size (Minimum) (2.5.8) are Level AA; **Focus Appearance (2.4.13) is Level AAA**, not an additional CourseKit AA requirement. See [W3C — What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

### B.3 Responsive CSS — Technical Documentation

- [MDN — CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN — CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries)
- [MDN — CSS Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)

### B.4 CSS Architecture and Cascade — Technical Documentation

- [MDN — Using CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)
- [MDN — CSS Cascading and Inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade)
- [MDN — CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)

### B.5 Motion — Technical Documentation

- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN — CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions)

### B.6 Layering — Technical Documentation

- [MDN — Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)
- [MDN — `z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
- [MDN — CSS Top Layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer)

### B.7 Typography and Font Loading — Technical Documentation

- [MDN — `@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [MDN — `font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [MDN — CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API)

### B.8 Colors and Themes — Technical Documentation

- [MDN — CSS Colors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors)
- [MDN — `color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [MDN — `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

These references document platform behavior and accessibility criteria. **They do not replace CourseKit's own approved values, tokens, component contracts, or normative scope.**

**Document maintenance:** This document records approved policy. An implementation change should separately specify modified source files, revised contracts, tests and deviations; the policy document is not itself a substitute for those changes.
