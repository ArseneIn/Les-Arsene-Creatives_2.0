# Local Fonts Setup Guide

## Font Files Needed

Download the following `.woff2` files and place them in `web/public/fonts/`:

### Playfair Display (2 files)
1. `PlayfairDisplay-Regular.woff2` (weight: 400)
2. `PlayfairDisplay-Bold.woff2` (weight: 700)

### Lato (4 files)
3. `Lato-Light.woff2` (weight: 300)
4. `Lato-Regular.woff2` (weight: 400)
5. `Lato-Bold.woff2` (weight: 700)
6. `Lato-Black.woff2` (weight: 900)

### Poppins (4 files)
7. `Poppins-Regular.woff2` (weight: 400)
8. `Poppins-Medium.woff2` (weight: 500)
9. `Poppins-SemiBold.woff2` (weight: 600)
10. `Poppins-Bold.woff2` (weight: 700)

---

## Download Sources

### Option 1: Google Fonts (Recommended)
1. Go to https://fonts.google.com/
2. Search for each font
3. Click "Download family"
4. Extract the ZIP
5. Convert TTF to WOFF2 using: https://cloudconvert.com/ttf-to-woff2

### Option 2: Google Webfonts Helper (Easiest)
1. Go to: https://gwfh.mranftl.com/fonts
2. Search for "Playfair Display"
3. Select weights: 400, 700
4. Click "Download" → Get WOFF2 files
5. Repeat for "Lato" (300, 400, 700, 900)
6. Repeat for "Poppins" (400, 500, 600, 700)

### Option 3: Direct Download (Fastest)
Use these direct links from Google Fonts CDN:

**Playfair Display:**
```
https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.woff2
https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vXDQZNLo_U2r.woff2
```

**Lato:**
```
https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh7USSwaPGR_p.woff2
https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXiWtFCc.woff2
https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwaPGR_p.woff2
https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh50XSwaPGR_p.woff2
```

**Poppins:**
```
https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2
https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2
https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2
https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2
```

---

## Quick Setup (PowerShell)

Run these commands in `web` directory:

```powershell
# Create fonts directory (already done)
# New-Item -ItemType Directory -Force -Path "public\fonts"

# Download Playfair Display
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.woff2" -OutFile "public\fonts\PlayfairDisplay-Regular.woff2"
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vXDQZNLo_U2r.woff2" -OutFile "public\fonts\PlayfairDisplay-Bold.woff2"

# Download Lato
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh7USSwaPGR_p.woff2" -OutFile "public\fonts\Lato-Light.woff2"
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXiWtFCc.woff2" -OutFile "public\fonts\Lato-Regular.woff2"
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwaPGR_p.woff2" -OutFile "public\fonts\Lato-Bold.woff2"
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh50XSwaPGR_p.woff2" -OutFile "public\fonts\Lato-Black.woff2"

# Download Poppins
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2" -OutFile "public\fonts\Poppins-Regular.woff2"
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2" -OutFile "public\fonts\Poppins-Medium.woff2"
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2" -OutFile "public\fonts\Poppins-SemiBold.woff2"
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2" -OutFile "public\fonts\Poppins-Bold.woff2"
```

---

## Verification

After downloading, your folder structure should be:

```
web/
└── public/
    └── fonts/
        ├── PlayfairDisplay-Regular.woff2
        ├── PlayfairDisplay-Bold.woff2
        ├── Lato-Light.woff2
        ├── Lato-Regular.woff2
        ├── Lato-Bold.woff2
        ├── Lato-Black.woff2
        ├── Poppins-Regular.woff2
        ├── Poppins-Medium.woff2
        ├── Poppins-SemiBold.woff2
        └── Poppins-Bold.woff2
```

Total: **10 files** (~300KB total)

---

## Benefits of Local Fonts

✅ **No network dependency** - Works offline  
✅ **Faster loading** - No external requests  
✅ **Privacy** - No Google tracking  
✅ **Reliability** - No timeout errors  
✅ **Performance** - Optimized by Next.js

---

## After Setup

1. Download all 10 font files
2. Place them in `public/fonts/`
3. Restart dev server: `npm run dev`
4. Fonts will load instantly! 🚀

The `app/layout.tsx` is already configured to use these local fonts.
