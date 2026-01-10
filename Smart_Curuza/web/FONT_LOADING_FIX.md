# Font Loading Fix

## Issue
Fonts (Playfair Display, Lato, Poppins) not appearing in the UI.

## Root Cause
Next.js caches Google Fonts on first load. When fonts are changed, the dev server needs to be restarted to clear the cache and fetch new fonts.

## Solution

### Step 1: Restart the Frontend Dev Server
```bash
# Stop the current dev server (Ctrl+C in the terminal)
# Then restart it:
cd web
npm run dev
```

### Step 2: Hard Refresh the Browser
After the server restarts:
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### Step 3: Clear Browser Cache (if needed)
If fonts still don't load:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## Verification

### Check if Fonts Loaded
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "font"
4. Refresh the page
5. You should see:
   - `Playfair_Display_...woff2`
   - `Lato_...woff2`
   - `Poppins_...woff2`

### Inspect Element
1. Right-click any heading
2. Select "Inspect"
3. Check **Computed** tab
4. Look for `font-family`
5. Should show: `"Playfair Display", Georgia, serif`

## What Was Changed

### Files Modified
1. **`app/layout.tsx`**
   - Imported `Playfair_Display`, `Lato`, `Poppins`
   - Removed `Open_Sans`
   - Added font variables to body

2. **`tailwind.config.ts`**
   - Updated `fontFamily` configuration:
     - `heading`: Playfair Display
     - `body`: Lato
     - `sans`: Poppins

3. **`app/globals.css`**
   - Added CSS variables for fonts
   - Ensures fallback fonts work

## Expected Result

After restart, you should see:
- **Headings** (h1, h2, h3): Elegant serif font (Playfair Display)
- **Body text**: Clean sans-serif (Lato)
- **Buttons/UI**: Modern sans-serif (Poppins)

## Troubleshooting

### Fonts Still Not Loading?

**1. Check Console for Errors**
```
DevTools > Console
```
Look for font loading errors.

**2. Verify Font Files**
```
DevTools > Network > Filter: "font"
```
All fonts should return `200 OK`.

**3. Check CSS Variables**
```
DevTools > Elements > <html> > Styles
```
Should see:
```css
--font-playfair: ...
--font-lato: ...
--font-poppins: ...
```

**4. Nuclear Option: Delete .next Folder**
```bash
cd web
rm -rf .next
npm run dev
```

## Font Usage in Components

Most components already use the correct classes:
- `font-heading` → Playfair Display
- `font-body` → Lato
- `font-sans` → Poppins

No component changes needed! 🎉

---

**Status**: Configuration Complete ✅  
**Action Required**: Restart dev server  
**Expected Time**: 30 seconds
