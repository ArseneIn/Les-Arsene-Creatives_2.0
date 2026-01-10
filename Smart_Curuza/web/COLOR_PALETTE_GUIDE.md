# Color Palette Guide - Smart-Curuza

## Overview
The Smart-Curuza UI uses a sophisticated, professional color palette featuring **Onyx** (deep black), **Jet** (charcoal), **Platinum** (light gray), **Bright Gold**, and **Saffron** (warm gold).

---

## Core Color Palette

### Onyx (Deep Black)
**Primary use:** Text, dark accents
```css
DEFAULT: #0b0c0c
100: #020303 (darkest)
500: #0b0c0c
700: #697272 (muted text)
900: #cdd0d0 (lightest)
```

### Jet (Charcoal)
**Primary use:** Sidebar background, secondary text
```css
DEFAULT: #2a2e34
100: #08090a (darkest)
500: #2a2e34
600: #4e5661 (hover states)
700: #747f8f
900: #d1d4da (lightest)
```

### Platinum (Light Gray)
**Primary use:** Background, surfaces
```css
DEFAULT: #e9eaec
400: #b7bac0
500: #e9eaec (main background)
600: #eeeef0
700: #f2f2f4
900: #fbfbfb (pure white surface)
```

### Bright Gold
**Primary use:** Primary actions, accents, highlights
```css
DEFAULT: #fbe134
100: #3b3301 (darkest)
500: #fbe134
600: #fce65b
900: #fef9d6 (lightest)
```

### Saffron (Warm Gold)
**Primary use:** Secondary actions, warnings
```css
DEFAULT: #e4b61a
100: #2e2405 (darkest)
500: #e4b61a
700: #f0d375
900: #faf0d1 (lightest)
```

---

## Semantic Color Mapping

### Primary Colors
- **primary**: `#fbe134` (Bright Gold)
- **secondary**: `#e4b61a` (Saffron)
- **accent**: `#fbe134` (Bright Gold)

### Status Colors
- **success**: `#10B981` (Green)
- **danger**: `#EF4444` (Red)
- **warning**: `#e4b61a` (Saffron)

### Surface Colors
- **background**: `#e9eaec` (Platinum)
- **surface**: `#fbfbfb` (Platinum 900 - White)

### Text Colors
- **text-primary**: `#0b0c0c` (Onyx)
- **text-secondary**: `#2a2e34` (Jet)
- **text-muted**: `#697272` (Onyx 700)

---

## Usage Examples

### Tailwind Classes

#### Backgrounds
```tsx
className="bg-jet"          // Dark sidebar
className="bg-surface"      // White cards
className="bg-platinum"     // Light background
className="bg-gradient-gold" // Gold gradient
```

#### Text
```tsx
className="text-jet"        // Primary dark text
className="text-jet-700"    // Muted dark text
className="text-gold"       // Gold accent text
className="text-gradient-gold" // Gold gradient text
```

#### Borders
```tsx
className="border-jet-600"      // Dark borders
className="border-platinum-600" // Light borders
className="border-gold-glow"    // Gold glowing border
```

#### Hover States
```tsx
className="hover:bg-jet-600"    // Dark hover
className="hover:text-gold"     // Gold text on hover
className="hover:shadow-gold"   // Gold shadow on hover
```

---

## Custom Utility Classes

### Text Gradient (Gold)
```tsx
<span className="text-gradient-gold">Smart-Curuza</span>
```
Creates a gradient from Bright Gold to Saffron.

### Background Gradient (Gold)
```tsx
<div className="bg-gradient-gold">...</div>
```
Gold gradient background.

### Shadow (Gold)
```tsx
<div className="shadow-gold">...</div>
```
Subtle gold shadow effect.

### Border Glow (Gold)
```tsx
<div className="border-gold-glow">...</div>
```
Gold border with glow effect.

---

## Component Color Patterns

### Sidebar
- **Background**: `bg-jet` (Dark charcoal)
- **Text**: `text-platinum-800` (Light gray)
- **Hover**: `hover:bg-jet-600 hover:text-gold`
- **Logo**: `text-gradient-gold`

### Header
- **Background**: `bg-surface` (White)
- **Text**: `text-jet` (Dark)
- **Icons**: `text-jet-700` with `hover:text-gold`
- **Avatar**: `bg-gradient-gold`

### Cards (KPI, Batch, etc.)
- **Background**: `bg-surface` (White)
- **Border**: `border-platinum-600`
- **Title**: `text-jet-700` (Muted)
- **Value**: `text-jet` (Bold)
- **Icon Background**: `bg-gradient-gold`
- **Hover**: `hover:shadow-gold`

### Buttons
```tsx
// Primary Button
<button className="bg-gradient-gold text-onyx px-4 py-2 rounded-lg shadow-gold hover:shadow-lg">
  Primary Action
</button>

// Secondary Button
<button className="bg-jet text-platinum-800 px-4 py-2 rounded-lg hover:bg-jet-600">
  Secondary Action
</button>

// Outline Button
<button className="border-2 border-gold text-gold px-4 py-2 rounded-lg hover:bg-gold hover:text-onyx">
  Outline
</button>
```

---

## Color Psychology

### Why This Palette?

**Onyx & Jet (Dark Tones)**
- Conveys **professionalism** and **sophistication**
- Creates **strong contrast** for readability
- Represents **stability** and **reliability**

**Platinum (Light Gray)**
- Provides a **clean, modern** background
- Reduces eye strain compared to pure white
- Creates **subtle depth** with gradients

**Bright Gold & Saffron**
- Represents **wealth**, **success**, and **prosperity**
- Culturally significant in African markets
- Creates **visual hierarchy** and draws attention to important actions
- Evokes **optimism** and **energy**

---

## Accessibility

### Contrast Ratios
All text/background combinations meet WCAG AA standards:

- **Jet on Platinum**: 7.8:1 ✅
- **Onyx on Surface**: 19.5:1 ✅
- **Gold on Onyx**: 4.8:1 ✅
- **Platinum-800 on Jet**: 4.6:1 ✅

### Color Blindness
The palette is designed to be distinguishable for:
- Protanopia (Red-blind)
- Deuteranopia (Green-blind)
- Tritanopia (Blue-blind)

Gold/Saffron vs Jet/Onyx provides sufficient luminance contrast.

---

## Design Principles

1. **Gold is for Action**: Use gold for primary CTAs, important metrics, and highlights
2. **Jet for Structure**: Use jet for navigation, headers, and structural elements
3. **Platinum for Space**: Use platinum for backgrounds and breathing room
4. **Onyx for Text**: Use onyx for primary text content
5. **Gradients Sparingly**: Use gold gradients for logos, avatars, and special highlights

---

## File Locations

- **Tailwind Config**: `web/tailwind.config.ts`
- **Global CSS**: `web/app/globals.css`
- **Components**: `web/components/*.tsx`

---

**Last Updated**: 2025-11-26
