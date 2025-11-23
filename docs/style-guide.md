# Repte Pessebre Style Guide

This style guide provides guidelines for maintaining consistent styling across the Repte Pessebre application.

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing](#spacing)
- [Components](#components)
- [Responsive Design](#responsive-design)
- [CSS Variables](#css-variables)

## Color Palette

The application uses a consistent color palette defined as CSS variables:

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-color` | #4285F4 | Primary buttons, links, and accents |
| `--primary-dark` | #3367D6 | Button hover states |
| `--success-color` | #4CAF50 | Success indicators, progress bars |
| `--warning-color` | #FFC107 | Warning indicators |
| `--danger-color` | #F44336 | Error indicators |
| `--light-bg` | #f9f9f9 | Light background for cards and sections |
| `--lighter-bg` | #f5f5f5 | Page background |
| `--dark-text` | #333 | Primary text color |
| `--medium-text` | #444 | Secondary text color |
| `--light-text` | #666 | Tertiary text color |
| `--lighter-text` | #888 | Muted text color |
| `--border-color` | #eee | Border color for separators |

## Typography

The application uses the Roboto font family with fallbacks:

```css
font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Headings

- `h1`: Used for page titles, centered, with bottom margin
- `h2`: Used for section headings, with bottom border
- `h3`: Used for card or subsection headings

## Spacing

Consistent spacing is maintained using CSS variables:

| Variable | Value | Usage |
|----------|-------|-------|
| `--spacing-xs` | 5px | Very small gaps, tight spacing |
| `--spacing-sm` | 10px | Small padding, margins between related elements |
| `--spacing-md` | 15px | Medium spacing, standard padding |
| `--spacing-lg` | 20px | Large spacing, container padding |
| `--spacing-xl` | 30px | Extra large spacing, section margins |

## Components

### Containers

```html
<div class="container">...</div>       <!-- Full-width container (max 1200px) -->
<div class="container-sm">...</div>    <!-- Narrow container (max 800px) -->
```

### Cards

Cards are used to group related content:

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

### Buttons

```html
<button class="btn">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn" disabled>Disabled Button</button>
```

### Progress Bars

```html
<div class="progress-container">
  <div class="progress-bar" [style.width.%]="percentage"></div>
</div>
```

### Status Indicators

```html
<span class="status-unlocked">✓</span>  <!-- For unlocked/completed items -->
<span class="status-locked">🔒</span>   <!-- For locked/incomplete items -->
```

### Text Utilities

```html
<p class="text-center">Centered text</p>
<p class="text-muted">Muted text</p>
<p class="text-italic">Italic text</p>
```

## Responsive Design

The application is designed to be responsive across different screen sizes:

- Desktop: Full layout with sidebars and multi-column content
- Mobile (< 768px): Stacked layout with full-width elements

### Responsive Containers

```html
<div class="flex-container">
  <div class="sidebar">...</div>
  <div class="content">...</div>
</div>
```

On mobile, the `.flex-container` will stack its children vertically.

## CSS Variables

All styles use CSS variables for consistency. Always use these variables instead of hardcoded values:

```css
/* Example of proper usage */
.my-element {
  color: var(--dark-text);
  margin: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--box-shadow-sm);
}
```

## Adding New Components

When creating new components:

1. Use the global styles and CSS variables
2. Add component-specific styles to the component's CSS file
3. Make sure the component is responsive
4. Follow the naming conventions established in this guide

## Example Component Structure

```html
<div class="container-sm">
  <h1>Component Title</h1>

  <div class="section">
    <h2>Section Title</h2>

    <div class="card">
      <h3>Card Title</h3>
      <p>Card content...</p>
      <button class="btn">Action</button>
    </div>
  </div>
</div>
```

## Testing Responsive Design

To ensure your components work well across different screen sizes:

1. Test on desktop (1200px+ width)
2. Test on tablet (768px - 1199px width)
3. Test on mobile (< 768px width)

You can use browser developer tools to simulate different screen sizes:

- Chrome/Firefox: Right-click > Inspect > Toggle device toolbar
- Use the responsive design mode to test different widths
- Test both portrait and landscape orientations on mobile

Key areas to check:

- Text remains readable (not too small, not overflowing)
- UI elements have sufficient spacing for touch targets
- Layout adjusts appropriately (stacking, resizing)
- Images and media are responsive
- Interactive elements are usable on touch devices
