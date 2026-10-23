# Implementing `CONVENTIONS.md` in a CourseKit component

This is a **practical workflow** for implementing or refactoring framework-owned CSS. The [complete normative conventions](/CONVENTIONS) remain authoritative: this guide is not a substitute for any MUST/MUST NOT/SHOULD/SHOULD NOT requirement. It also applies to framework-provided modules; course/site styles are generally subject to recommendations rather than the same mandatory framework scope (§0.1), while applicable accessibility obligations remain.

## 1. Start with the actual component contract

Before editing a stylesheet, read its `component.json`, XSD, XSLT template, renderer, JavaScript behavior, parent layout and child components. Identify:

- The component’s CSS root (e.g. `.ck-infobox`) and the selectors that must remain local.
- Its published `data-variant` values, `data-style-ref` usage, theme behavior and site-level overrides.
- Which component owns each gap, margin, padding, font treatment, color, interaction state and stacking layer.
- Existing `--ck-*` declarations and `var()` consumption, classifying each as **global token**, **public component variable** or **internal implementation variable**.

Do not infer that every CSS variable mentioned in the [component inventory](/modules/) is public. Only explicitly documented customization variables are a supported public interface (§5.3).

## 2. Choose where each value belongs

Use this decision sequence for **every design value**:

1. Does `framework/styles/tokens.css` already define the same *semantic role*? **Reference that token**; do not copy its numeric or color value (§0.6, §2.1, §5.3).
2. Is it specific to this component (such as banner geometry, a particular border treatment or an adaptive internal gap)? Define its default **in the owning stylesheet**, not globally (§2.6).
3. Does a site need to customize it? Expose a named public property `--ck-<component>-<property>` with a sensible token-backed fallback (§2.6.2, §5.3.2).
4. Is it an intermediate calculation or a default switched by a variant? Use `--ck-<component>-internal-<property>` and never present it as a public API (§2.6.3, §5.3.3).
5. Is a literal unavoidable? Distinguish a non-design keyword/neutral value (such as `0`) or genuine technical constant from a new design constant. Record any permitted exception and its justification; do **not** invent values or add a global token solely to satisfy one component (§0.6, §10.4).

### Example: public override, internal default and variant

```css
/* Component stylesheet: framework/visual/infobox/infobox.css */
.ck-infobox {
    --ck-infobox-internal-default-padding: var(--ck-space-lg);

    box-sizing: border-box;
    padding-block: var(
        --ck-infobox-padding-block,
        var(--ck-infobox-internal-default-padding)
    );
    padding-inline: var(
        --ck-infobox-padding-inline,
        var(--ck-infobox-internal-default-padding)
    );
    color: var(--ck-infobox-text, var(--ck-text-main));
}

.ck-infobox[data-variant="compact"] {
    --ck-infobox-internal-default-padding: var(--ck-space-sm);
}
```

A course/site stylesheet can override the **public** interface without coupling to internal variables:

```css
/* Site stylesheet */
.ck-infobox[data-style-ref="course-note"] {
    --ck-infobox-padding-block: var(--ck-space-md);
}
```

`variant` is supplied and maintained by the component; `style-ref` is a site-defined customization (§5.3.4). Avoid setting `--ck-infobox-padding-block` on every `.ck-infobox` instance inside the component CSS: that would obstruct inheritance of `:root` overrides. The extra internal-default layer is useful when variants change defaults, **not mandatory for every property**.

> **Example status:** The CSS above demonstrates the normative pattern; it is not claimed to be a drop-in replacement for the current infobox stylesheet. Keep actual supported public variables synchronized with its reference page.

## 3. Implement the layout without shifting ownership

Follow §2.4–§2.6 and §3:

- The parent controls **spacing between sibling components**; a child controls its **internal padding and spacing**. Avoid doubled margins when nested.
- Prefer logical dimensions (`padding-inline`, `margin-block`, etc.) and content-driven sizing; justify fixed geometry when the component really requires it.
- Use `box-sizing: border-box` where appropriate, and verify that border and padding do not alter intended visual proportions.
- Define adaptive component geometry through local variables and approved shared tokens, not unexplained coefficients copied from historical CSS.
- Respect reading width, typography, font-weight and line-height tokens where their roles match (§1).

Historical CSS may document the expected appearance, but its literal values are **not automatically approved current tokens**. Match the rendered behavior while choosing values according to `CONVENTIONS.md`.

## 4. Make responsiveness part of the implementation

Design mobile-first (§4). Use available space rather than assuming a screen width, select container queries where the component should react to its **container**, and media queries when the **viewport** genuinely governs the behavior. Do not introduce unapproved breakpoint constants without a documented reason (§4.2–§4.3).

At minimum, **render and inspect** the component:

- At narrow and wide widths, and in portrait and landscape orientation when relevant.
- At 200% browser zoom and 320 CSS px reflow where applicable.
- With long strings, larger text and varied content lengths; check horizontal overflow, clipping and scroll accessibility.
- Alone, inside parents, with sibling components, and with its variants and site overrides.
- In light and dark themes; in print when it is part of a printable document.

Passing a stylesheet lint check is not a substitute for these rendering tests (§10.2.2).

## 5. Handle interactive and visual states deliberately

Use role-appropriate theme variables instead of fixed light-mode colors (§6). Verify effective contrast. If interactive, check hover, `:focus-visible`, disabled/expanded states, keyboard navigation, focus order, pointer and touch behavior, and motion preferences (§7, §10.2.3).

```css
.ck-infobox__toggle {
    transition-duration: var(--ck-motion-fast);
}

@media (prefers-reduced-motion: reduce) {
    .ck-infobox__toggle {
        transition-duration: 0s;
    }
}
```

This is illustrative; select actual motion tokens and behavior appropriate to the component. Ensure functional interactions still work with animations disabled. Check stacked overlays for clipping and stacking-context issues; use the project's layering roles (§7.3).

## 6. Document the public CSS API, not the implementation details

For each component, add or update its documentation with this template:

| Field | What to document |
| --- | --- |
| Owner | Component ID and stylesheet path |
| Public variable | `--ck-<component>-<property>` |
| Purpose | User-visible property controlled |
| Fallback | Exact `var()` chain, preferably ending in an approved token |
| Scope | Global/site override, instance selector, inherited behavior |
| Variant | How `data-variant` changes the default without overriding the public variable |
| `style-ref` | Example site-specific customization |
| Limits | Constraints, compatibility or responsive considerations |

Internals with `-internal-` may be explained to maintainers, but should not appear as recommended site override points. Cross-check the [module CSS inventory](/modules/) and [visual component reference](/reference/visual-xsd) against **what the stylesheet actually implements**.

## 7. Verify before delivering a change

Use three independent passes (§10–§11):

| Pass | Required work | Evidence to record |
| --- | --- | --- |
| Static | Check the full applicable conventions, token existence, hardcoded design constants, ownership, selector scope, public/private variable names, `!important` and dependencies | Source paths and specific rule references |
| Visual / responsive | Test layout, theme, variants, nested composition, overflow, text growth, zoom, reflow and print if applicable | Screenshots or repeatable test cases with dimensions |
| Interaction / accessibility | Test keyboard, focus, touch/pointer, contrast, reduced motion and the applicable WCAG requirements | Steps performed, outcomes and unresolved issues |

Before replacing an existing CSS file, diff it against the **latest source**, preserve unrelated corrections, and verify the parent/child templates and renderer output. Keep the edit limited to the requested files; document exceptions and unresolved checks instead of claiming compliance by inspection alone (§11).

### Review checklist

- [ ] Relevant clauses and permitted exceptions of `CONVENTIONS.md` checked, not just this tutorial.
- [ ] No duplicated global design literals where an approved token already exists.
- [ ] Component-owned values defined in the component, with public overrides and internal implementation values clearly separated.
- [ ] Public names/fallbacks and variant/style-ref behavior documented and tested.
- [ ] Parent and child spacing responsibilities checked; no cumulative layout regression.
- [ ] Narrow/wide, zoom/reflow, nested composition, themes and print (when relevant) verified.
- [ ] Keyboard, focus, interaction states, contrast and reduced-motion behavior verified when applicable.
- [ ] Tests, exceptions and remaining uncertainties recorded; no unverified conformance claims.

## Related documents

- [Normative `CONVENTIONS.md`](/CONVENTIONS)
- [Conventions reference](/reference/css-conventions)
- [Module public CSS inventories](/modules/)
- [Module development tutorial](/module-development/tutorial)
- [Maintainer documentation](/maintainers/)
