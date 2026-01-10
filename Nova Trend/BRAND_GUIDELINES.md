# Nova Trend - Brand Identity & Design System

> **Aesthetic Frequency:** Premium. Technical. Elite.
> **Design Language:** "Titan Industrial"

This document defines the visual and tonal standards for the **Nova Trend** platform. Our design language is not just about looks; it is about conveying authority, precision, and state-of-the-art reliability in the hardware registry space.

---

## 🎨 1. Color System

Our palette is high-contrast, utilizing deep voids (blacks/slates) against a hyper-vibrant signal color.

### Primary Signal
The heartbeat of the brand. Use for Call-to-Actions (CTAs), active states, and critical alerts.
- **Nova Orange**: `#FF4F00` (Main Brand Hex)
- **Solar Flare**: `#FF8C00` (Secondary/Gradients)
- **Usage**: Buttons, toggles, active tab indicators, and "LTV Value" highlights.

### The Void (Dark Mode)
We do not use pure black often. We use rich, deep slates to create depth.
- **Deep Space**: `#0F172A` (Slate 900 - Main Background)
- **Obsidian**: `#020617` (Slate 950 - Component Backgrounds)
- **Stroke**: `#1E293B` (Slate 800 - Borders)

### The Clean Room (Light Mode)
Clinical and precise.
- **Lab White**: `#FFFFFF` (Card Backgrounds)
- **Vapor**: `#F8FAFC` (Slate 50 - Page Backgrounds)
- **Ash**: `#64748B` (Slate 500 - Secondary Text)

### Semantic States
- **Success (Green)**: `#059669` (Emerald 600) – Used for "Verified", "In Stock".
- **Critical (Red)**: `#DC2626` (Red 600) – Used for "SLA Breach", "Out of Stock".

---

## 🔠 2. Typography & Text Hierarchy

We treat text as a graphical element.

**Font Family**: `Inter` or `Roboto` (System Sans-Serif stack).

### Styling Rules
1.  **Headings**:
    - **Weight**: `font-black` (900)
    - **Style**: Often `italic` to imply forward motion.
    - **Case**: `UPPERCASE` for authority.
    - *Example*: `TECHNICAL <span class="text-[#FF4F00]">PAYLOAD</span>`

2.  **Micro-Labels**:
    - **Weight**: `font-black` or `font-bold`
    - **Tracking**: `tracking-widest` (0.2em - 0.3em)
    - **Size**: `text-[10px]` or `text-xs`
    - *Usage*: Table headers, data attribute labels, status tags.

3.  **Body Copy**:
    - **Weight**: `font-medium`
    - **Color**: Slate 500/400 (Never pure black/white for body).
    - *Tone*: Clinical and concise.

---

## 💠 3. Logo System

The **Nova Trend** mark is a mathematical 3x3 Grid concept.

- **Structure**: A 9-point grid where specific nodes are connected to form the "N" trajectory.
- **Behavior**:
    - In **Brand Mode**, the nodes adapt: Black nodes become White in dark mode, Orange nodes remain constant.
- **Wordmark**:
    - "NOVA": Large, Tracking `0.18em`
    - "TREND": Small, Tracking `0.45em`, Orange, placed underneath.

---

## 🖥 4. UI/UX Philosophy

### Glassmorphism & Depth
We use advanced layering to show hierarchy.
- **Blur**: `backdrop-blur-md` is standard for modals and sticky headers.
- **Opacity**: Backgrounds are often `bg-white/80` or `bg-slate-900/80`.
- **Shadows**: Deep, diffused shadows (`shadow-2xl`) for floating elements (Cart, Modals).

### "Super-Rounding"
We reject sharp corners. They feel "legacy".
- **Standard Radius**: `rounded-2xl` (16px) or `rounded-3xl` (24px).
- **Container Radius**: `rounded-[40px]` for main dashboards sections.

### Motion Physics
The interface must feel alive.
- **Animate-In**: Use `animate-in fade-in slide-in-from-bottom` for all page loads.
- **Hover**: Semantic zoom (`scale-105`) or glow effects (`shadow-orange-500/20`) on interactive elements.

---

## 📢 5. Voice & Tone

When the system speaks (via AI Service or copy), it uses a specific persona:

- **Audience**: Professional Hardware Procurement in Kigali, Rwanda.
- **Persona**: A Senior Technical Auditor.
- **Adjectives**: Clinical, Dense, Authoritative, Premium.
- **Anti-Patterns**:
    - ❌ "Here is a cool laptop for you!"
    - ✅ "Asset designation verified. Optimised for high-throughput computational workflows."
    - ❌ "Sorry, we are out of stock."
    - ✅ "Supply Chain Node Depleted. Re-stocking algorithm active."

---

## 🛠 6. Component Library Standards

When building new components, strictly adhere to these utility patterns:

| Component | Tailwind Classes |
|-----------|------------------|
| **Primary Button** | `bg-[#FF4F00] text-white font-black uppercase tracking-widest rounded-2xl` |
| **Secondary Button** | `bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase` |
| **Input Field** | `bg-slate-50 border-slate-200 rounded-xl font-bold focus:border-[#FF4F00]` |
| **Card** | `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px]` |
| **Tag/Badge** | `px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest` |
