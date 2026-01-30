# Typography

HELGUS Marktplatz uses three font families from Google Fonts.

## Font Families

### DM Sans (Headings)

Used for headings, navigation items, and prominent UI elements.

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Usage:**
```html
<h1 class="font-['DM_Sans'] font-bold">Heading</h1>
```

**Weights:**
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)

### Inter (Body)

Used for body text, descriptions, form labels, and general UI text.

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Usage:**
```html
<p class="font-['Inter']">Body text</p>
```

**Weights:**
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)

### IBM Plex Mono (Code)

Used for code snippets, technical information, and monospaced displays.

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Usage:**
```html
<code class="font-['IBM_Plex_Mono']">code</code>
```

**Weights:**
- 400 (Regular)
- 500 (Medium)

## Combined Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

## Type Scale

### Headings (DM Sans)

| Element | Classes |
|---------|---------|
| Page title | `text-4xl sm:text-5xl font-bold font-['DM_Sans']` |
| Section heading | `text-2xl sm:text-3xl font-bold font-['DM_Sans']` |
| Card heading | `text-xl font-semibold font-['DM_Sans']` |
| Subheading | `text-lg font-semibold font-['DM_Sans']` |

### Body (Inter)

| Element | Classes |
|---------|---------|
| Body text | `text-base font-['Inter']` |
| Small text | `text-sm font-['Inter']` |
| Caption | `text-xs font-['Inter']` |
| Label | `text-sm font-medium font-['Inter']` |

### Special

| Element | Classes |
|---------|---------|
| Price | `text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-500` |
| Badge | `text-xs font-medium` |
| Button | `text-sm font-medium font-['DM_Sans']` or `font-['Inter']` |
| Navigation | `text-sm font-medium font-['Inter']` |
| Logo | `text-2xl font-bold font-['DM_Sans'] text-red-600` |

## Line Height & Spacing

| Use Case | Class |
|----------|-------|
| Tight (headings) | `leading-tight` |
| Normal (body) | `leading-normal` or default |
| Relaxed (long text) | `leading-relaxed` |
| Loose (descriptions) | `leading-loose` |

## Text Colors

See `colors.md` for complete text color usage.

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Heading | `text-slate-900` | `dark:text-white` |
| Body | `text-slate-700` | `dark:text-slate-300` |
| Muted | `text-slate-500` | `dark:text-slate-400` |
| Link | `text-blue-600` | `dark:text-blue-400` |
| Accent | `text-red-600` | `dark:text-red-500` |

## Examples

### Page Header
```html
<h1 class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white font-['DM_Sans']">
  Alle <span class="text-red-600 dark:text-red-500">Produkte</span>
</h1>
<p class="text-lg text-slate-600 dark:text-slate-400 font-['Inter']">
  Durchstöbern Sie unsere große Auswahl an Produkten.
</p>
```

### Card
```html
<h3 class="text-lg font-semibold text-slate-900 dark:text-white font-['DM_Sans']">
  Product Title
</h3>
<p class="text-red-600 dark:text-red-500 text-2xl font-bold">
  299 €
</p>
<p class="text-sm text-slate-600 dark:text-slate-400 font-['Inter']">
  Product description text...
</p>
```

### Form Label
```html
<label class="text-sm font-medium text-slate-700 dark:text-slate-300 font-['Inter']">
  E-Mail
</label>
```
