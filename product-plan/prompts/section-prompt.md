# Section Implementation Prompt Template

Use this template when implementing HELGUS Marktplatz section by section.

---

## Prompt for [SECTION NAME]

You are implementing the **[SECTION NAME]** section of HELGUS Marktplatz, a regional online marketplace for buying and selling everyday items.

### Context Files

Please read these files first:

1. `product-plan/product-overview.md` - Overall product context
2. `product-plan/design-system/` - Design tokens (colors, typography)
3. `product-plan/instructions/incremental/[XX]-[section-id].md` - This section's instructions
4. `product-plan/sections/[section-id]/` - Types, sample data, and tests
5. `product-plan/sections/[section-id]/components/` - Component implementations

### Before You Start

Please confirm:
1. What framework/tooling has already been set up?
2. Is the foundation (design tokens, types, routing) in place?
3. Which sections have already been implemented?

### Requirements

- Use the existing design system (red primary, blue secondary, slate neutral)
- Follow the component props interfaces in `types.ts`
- Test against the sample data in `data.json`
- Validate using test cases in `tests.md`
- Support both light and dark modes
- Ensure mobile responsiveness

### Implementation

Build all components listed in the milestone instructions, ensuring they:
- Accept all props as defined in the types
- Handle all user interactions via callbacks
- Match the UI specifications
- Pass all test scenarios

---

## Section Quick Reference

| Section | Milestone File | Section Folder |
|---------|---------------|----------------|
| Foundation | `01-foundation.md` | N/A |
| Shell | `02-shell.md` | `shell/` |
| Produktkatalog & Suche | `03-produktkatalog-suche.md` | `produktkatalog-suche/` |
| Produktdetails & Verhandlung | `04-produktdetails-verhandlung.md` | `produktdetails-verhandlung/` |
| Verkäufer-Dashboard | `05-verkaeufer-dashboard.md` | `verkaeufer-dashboard/` |
| Nutzerverwaltung | `06-nutzerverwaltung.md` | `nutzerverwaltung/` |

---

## Example Usage

### Implementing the Shell

```
You are implementing the **Application Shell** section of HELGUS Marktplatz.

Please read:
1. product-plan/product-overview.md
2. product-plan/design-system/
3. product-plan/instructions/incremental/02-shell.md
4. product-plan/shell/

Build the AppShell, MainNav, and UserMenu components as described.
```

### Implementing Produktkatalog

```
You are implementing the **Produktkatalog & Suche** section of HELGUS Marktplatz.

Please read:
1. product-plan/product-overview.md
2. product-plan/design-system/
3. product-plan/instructions/incremental/03-produktkatalog-suche.md
4. product-plan/sections/produktkatalog-suche/

Build ProductCatalog, FilterSidebar, and ProductCard components.
Test with the sample data provided.
```
