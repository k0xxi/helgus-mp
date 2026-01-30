# HELGUS Marktplatz - Implementation Package

This package contains everything needed to implement the HELGUS Marktplatz application.

## Quick Start

### Option 1: One-Shot Implementation

Use the prompt in `prompts/one-shot-prompt.md` to implement the complete application in one session. This prompt will guide an AI coding assistant through the entire build.

### Option 2: Incremental Implementation

Implement section by section using `prompts/section-prompt.md` as a template. Work through the milestones in order:

1. **Foundation** (`instructions/incremental/01-foundation.md`)
2. **Shell** (`instructions/incremental/02-shell.md`)
3. **Produktkatalog & Suche** (`instructions/incremental/03-produktkatalog-suche.md`)
4. **Produktdetails & Verhandlung** (`instructions/incremental/04-produktdetails-verhandlung.md`)
5. **Verkäufer-Dashboard** (`instructions/incremental/05-verkaeufer-dashboard.md`)
6. **Nutzerverwaltung** (`instructions/incremental/06-nutzerverwaltung.md`)

## Package Contents

```
product-plan/
├── README.md                    # This file
├── product-overview.md          # Product summary and features
│
├── prompts/
│   ├── one-shot-prompt.md       # Prompt for full implementation
│   └── section-prompt.md        # Template for incremental implementation
│
├── instructions/
│   ├── one-shot-instructions.md # Complete implementation guide
│   └── incremental/             # Step-by-step instructions
│       ├── 01-foundation.md
│       ├── 02-shell.md
│       ├── 03-produktkatalog-suche.md
│       ├── 04-produktdetails-verhandlung.md
│       ├── 05-verkaeufer-dashboard.md
│       └── 06-nutzerverwaltung.md
│
├── design-system/
│   ├── tokens.css               # Design token documentation
│   ├── colors.md                # Color palette guide
│   └── typography.md            # Typography guide
│
├── data-model/
│   └── data-model.md            # Entity descriptions and relationships
│
├── shell/
│   ├── README.md                # Shell documentation
│   └── components/              # Shell component implementations
│       ├── AppShell.tsx
│       ├── MainNav.tsx
│       └── UserMenu.tsx
│
└── sections/
    ├── produktkatalog-suche/
    │   ├── README.md            # Section documentation
    │   ├── types.ts             # TypeScript interfaces
    │   ├── data.json            # Sample data
    │   ├── tests.md             # Test specifications
    │   └── components/          # Component implementations
    │
    ├── produktdetails-verhandlung/
    │   ├── README.md
    │   ├── types.ts
    │   ├── data.json
    │   ├── tests.md
    │   └── components/
    │
    ├── verkaeufer-dashboard/
    │   ├── README.md
    │   ├── types.ts
    │   ├── data.json
    │   ├── tests.md
    │   └── components/
    │
    └── nutzerverwaltung/
        ├── README.md
        ├── types.ts
        ├── data.json
        ├── tests.md
        └── components/
```

## Technology Stack

| Requirement | Recommendation |
|-------------|----------------|
| Framework | React 18+ with TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Routing | React Router or Next.js |
| Fonts | Google Fonts (DM Sans, Inter, IBM Plex Mono) |

## Design System

| Token | Value |
|-------|-------|
| Primary | `red` (Tailwind) |
| Secondary | `blue` (Tailwind) |
| Neutral | `slate` (Tailwind) |
| Heading Font | DM Sans |
| Body Font | Inter |
| Mono Font | IBM Plex Mono |

## Key Principles

1. **Props-Based Components**: All components receive data and callbacks via props
2. **No Direct Data Imports**: Components never import data directly
3. **Dark Mode Support**: Use `dark:` variants for all colors
4. **Mobile Responsive**: Use Tailwind responsive prefixes
5. **German Language**: All UI text in German (Austrian market)
6. **Tailwind v4**: No tailwind.config.js file

## Testing

Each section includes a `tests.md` file with TDD-style test specifications. Use these to validate your implementation:

- Component rendering tests
- Interaction tests
- Integration/flow tests
- Accessibility tests
- Responsive tests

## Questions?

Before implementing, the prompts will guide you to clarify:

- Tech stack preferences (CRA, Vite, Next.js)
- State management approach
- Backend/authentication method
- Deployment target

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
