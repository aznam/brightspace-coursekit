# CSS conventions and customization contracts

The full normative source is **[`CONVENTIONS.md`](/CONVENTIONS)**, copied unchanged from the provided repository into this documentation package. This chapter is an orientation, not a replacement.

For an implementation-focused workflow, see [Implementing `CONVENTIONS.md` in a component](/module-development/implementing-css-conventions).

## Applicability

The source explicitly makes its rules mandatory for framework core, native components, and framework-provided modules, and generally **recommended** for course/site-defined CSS; do not silently elevate recommendations for site owners into universal MUST requirements. Accessibility requirements remain applicable.

## Design invariants for framework-owned CSS

- Reuse already-defined `framework/styles/tokens.css` variables in preference to inventing new global literals.
- Avoid hard-coded styling values where an existing token or controlled component variable provides the role; any necessary exceptions must follow the normative document.
- Expose intentional **public component variables**; use **internal variables** to implement a component, resolving their defaults through the public interface and tokens where appropriate. Do not expose every internal `--ck-*` name automatically.
- Check responsive behavior, text resizing, narrow widths, reduced motion, contrast, printing where relevant, and nested components.
- Preserve distinct responsibilities: global tokens in `tokens.css`, module/component-specific design inside owning stylesheets, and site overrides in site CSS.

## Source references

- `CONVENTIONS.md` is the normative standard.
- `framework/styles/tokens.css` defines shared tokens; its introductory comment lists the intended public families.
- Individual component entries in [Visual XSD catalog](/reference/visual-xsd) list **observed** variables, but variable occurrence is not proof that it is a stable public API.
- [Module CSS inventory](/modules/index) records variable declarations and uses for module stylesheets.
