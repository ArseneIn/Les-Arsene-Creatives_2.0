# Typography System - Smart-Curuza

## Font Stack

### **Playfair Display** (Headings)
**Purpose**: Elegant serif font for main headings and titles  
**Usage**: H1, H2, H3, page titles, section headers  
**Weights**: Regular (400), Bold (700)  
**Character**: Sophisticated, premium, trustworthy

```tsx
className="font-heading" // or font-serif
```

### **Lato** (Body Text)
**Purpose**: Clean, readable sans-serif for body content  
**Usage**: Paragraphs, descriptions, long-form text  
**Weights**: Light (300), Regular (400), Bold (700), Black (900)  
**Character**: Professional, modern, highly readable

```tsx
className="font-body"
```

### **Poppins** (UI Elements)
**Purpose**: Modern sans-serif for buttons, labels, navigation  
**Usage**: Buttons, badges, navigation links, form labels  
**Weights**: Regular (400), Medium (500), Semi-Bold (600), Bold (700)  
**Character**: Friendly, approachable, geometric

```tsx
className="font-sans"
```

---

## Typography Hierarchy

### **Level 1: Page Titles**
```tsx
<h1 className="text-3xl font-bold text-jet font-heading">
  Dashboard Overview
</h1>
```
- Font: **Playfair Display Bold**
- Size: `text-3xl` (30px)
- Color: `text-jet` (dark)
- Use: Main page headings

### **Level 2: Section Headers**
```tsx
<h2 className="text-2xl font-semibold text-jet font-heading">
  Recent Transactions
</h2>
```
- Font: **Playfair Display Semi-Bold**
- Size: `text-2xl` (24px)
- Color: `text-jet`
- Use: Major sections

### **Level 3: Card Titles**
```tsx
<h3 className="text-lg font-semibold text-jet font-heading">
  Low Stock Alerts
</h3>
```
- Font: **Playfair Display Semi-Bold**
- Size: `text-lg` (18px)
- Color: `text-jet`
- Use: Card headers, subsections

### **Body Text**
```tsx
<p className="text-base text-jet-700 font-body">
  Here's what's happening with your shop today
</p>
```
- Font: **Lato Regular**
- Size: `text-base` (16px)
- Color: `text-jet-700` (muted)
- Use: Descriptions, paragraphs

### **Small Text**
```tsx
<span className="text-sm text-jet-700 font-body">
  10 mins ago
</span>
```
- Font: **Lato Regular**
- Size: `text-sm` (14px)
- Color: `text-jet-700`
- Use: Timestamps, captions

### **UI Labels**
```tsx
<span className="text-sm font-medium text-jet font-sans">
  Record Sale
</span>
```
- Font: **Poppins Medium**
- Size: `text-sm` (14px)
- Color: `text-jet`
- Use: Button labels, navigation

### **Badges/Tags**
```tsx
<span className="text-xs font-medium text-success font-sans">
  Cash
</span>
```
- Font: **Poppins Medium**
- Size: `text-xs` (12px)
- Color: Semantic (success, danger, etc.)
- Use: Status badges, tags

---

## Font Pairing Examples

### **Dashboard Header**
```tsx
<div>
  <h1 className="text-3xl font-bold text-jet font-heading">
    Welcome back, Mama Chantal! 👋
  </h1>
  <p className="text-jet-700 mt-1 font-body">
    Here's what's happening with your shop today
  </p>
</div>
```

### **KPI Card**
```tsx
<div>
  <p className="text-sm font-medium text-jet-700 font-sans">
    Today's Sales
  </p>
  <h3 className="text-2xl font-bold text-jet mt-1 font-heading">
    45,000 RWF
  </h3>
</div>
```

### **Button**
```tsx
<button className="px-4 py-2 bg-gradient-gold text-onyx rounded-lg font-sans font-medium">
  New Sale
</button>
```

### **Transaction Item**
```tsx
<div>
  <p className="font-medium text-jet font-body">Jean Pierre</p>
  <p className="text-sm text-jet-700 font-body">10 mins ago</p>
</div>
```

---

## Font Loading Strategy

### **Display Swap**
All fonts use `display: 'swap'` to prevent FOIT (Flash of Invisible Text):
```typescript
const playfair = Playfair_Display({ 
    display: 'swap', // Show fallback font immediately
});
```

### **Fallback Fonts**
Each font has system fallbacks:
- **Playfair Display** → Georgia → serif
- **Lato** → system-ui → sans-serif
- **Poppins** → system-ui → sans-serif

---

## Usage Guidelines

### **DO**
✅ Use **Playfair Display** for all headings (H1, H2, H3)  
✅ Use **Lato** for body text, descriptions, paragraphs  
✅ Use **Poppins** for UI elements, buttons, navigation  
✅ Maintain consistent font weights (avoid too many variations)  
✅ Use `font-heading`, `font-body`, `font-sans` classes

### **DON'T**
❌ Mix fonts within the same element  
❌ Use Playfair Display for long paragraphs (hard to read)  
❌ Use too many font weights (stick to 3-4 per font)  
❌ Use custom font sizes (use Tailwind's scale)  
❌ Forget to specify font family class

---

## Accessibility

### **Readability**
- **Minimum size**: 14px (text-sm) for body text
- **Line height**: 1.5 for body, 1.2 for headings
- **Contrast**: All text meets WCAG AA standards

### **Font Weights**
- **Light (300)**: Only for large text (24px+)
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: UI labels, emphasized text
- **Bold (700)**: Headings, important values
- **Black (900)**: Special emphasis (rare)

---

## Performance

### **Font Subsetting**
Only Latin characters loaded:
```typescript
subsets: ["latin"]
```

### **Weights Loaded**
Only necessary weights:
- Playfair: 400, 700
- Lato: 300, 400, 700, 900
- Poppins: 400, 500, 600, 700

### **Total Font Size**
- Playfair Display: ~40KB
- Lato: ~60KB
- Poppins: ~50KB
- **Total**: ~150KB (acceptable for web fonts)

---

## Examples in Components

### **Sidebar**
```tsx
<span className="text-2xl font-bold text-gradient-gold font-heading">
  Smart-Curuza
</span>
```

### **Header**
```tsx
<h2 className="text-xl font-semibold text-jet font-heading">
  Control Tower
</h2>
```

### **KPI Card**
```tsx
<p className="text-sm font-medium text-jet-700 font-sans">Total Revenue</p>
<h3 className="text-2xl font-bold text-jet mt-1 font-heading">2.4M RWF</h3>
```

### **Button**
```tsx
<button className="font-sans font-medium">
  New Sale
</button>
```

### **Body Text**
```tsx
<p className="text-base text-jet-700 font-body">
  This is a description of the feature...
</p>
```

---

## Migration Checklist

### **Updated Files**
- ✅ `app/layout.tsx` - Font imports
- ✅ `tailwind.config.ts` - Font family definitions
- ✅ Components automatically inherit via Tailwind classes

### **Component Updates Needed**
Most components already use:
- `font-heading` for headings
- `font-body` for descriptions
- `font-sans` for UI elements

No manual updates needed! 🎉

---

## Visual Impact

### **Before** (Open Sans + Poppins)
- Generic, safe font pairing
- Minimal personality
- Standard web look

### **After** (Playfair Display + Lato + Poppins)
- **Sophisticated** serif headings (Playfair)
- **Professional** body text (Lato)
- **Modern** UI elements (Poppins)
- **Premium** feel
- **Better hierarchy**

---

**Font Stack**: Playfair Display + Lato + Poppins  
**Character**: Sophisticated, Professional, Modern  
**Status**: ✅ Implemented  
**Performance**: Optimized with font-display: swap
