# Nova Trend - Developer Guide

Welcome to the **Nova Trend** codebase. This project is a high-performance, aesthetically premium React application designed for hardware asset management, retail analytics, and support operations.

This guide serves as the definitive reference for the technology stack, architecture, and conventions used throughout the application.

---

## 🛠 Technology Stack

We use a modern, lightweight, and type-safe stack:

- **Core Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Fast HMR, optimized builds)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  - **Animation**: Native CSS animations + `tailwindcss-animate` utility classes (e.g., `animate-in`, `slide-in-from-bottom`).
  - **Design System**: Custom color palette (e.g., `#FF4F00` Nova Orange) defined in utility classes.
- **Icons**: [Lucide React](https://lucide.dev/) (Consistent, stroke-based iconography)
- **Visualization**: [Recharts](https://recharts.org/) (Responsive data visualization)
- **AI Integration**: [Google GenAI SDK](https://github.com/google/generative-ai-js) (Gemini models) for dynamic content generation.
- **Routing**: [React Router DOM](https://reactrouter.com/)

---

## 📂 Project Structure

 The codebase follows a strict **feature-based** organization to separate UI presentation from business logic.

```
/src
├── /components
│   ├── /ui           # Atomic, reusable components (Buttons, Modals, Inputs, Logos)
│   ├── /layout       # Structural components (Sidebar, AppLayout, Header)
│   └── /features     # Complex, domain-specific widgets (OrderManager, ServiceHub, etc.)
│
├── /context          # Global State Management
│   ├── AuthContext.tsx         # User authentication & role management (Admin/Client)
│   ├── CartContext.tsx         # Shopping cart logic + Notification triggers
│   ├── NotificationContext.tsx # Global system logging & toast system
│   ├── ThemeContext.tsx        # Dark/Light mode toggler
│   └── ShopContext.tsx         # Product filtering and search state
│
├── /pages            # Route Views
│   ├── Home.tsx
│   ├── ComparisonTool.tsx
│   ├── Dashboard.tsx (Admin)
│   └── [CategoryPages].tsx
│
├── /services         # Data & External Services
│   ├── aiService.ts            # Google Gemini AI wrappers (Specs, Narrative, Price)
│   ├── mockData.ts             # Static data for demo mode
│   └── notificationService.ts  # Logic for handling system alerts
│
├── /lib
│   └── api.ts        # Supabase client & Data fetching abstraction (switches used by Mock/Real)
│
└── types.ts          # Global TypeScript interfaces (Product, Order, Ticket, etc.)
```

---

## 🧠 Key Systems Architecture

### 1. Global Notification System
The application uses a centralized logging system.
- **Context**: `NotificationContext`
- **Usage**:
  ```tsx
  const { addLog } = useNotification();
  addLog('Category', 'Message Content');
  ```
- **Triggers**: Actions like "Add to Cart", "Order Status Change", "Review Approval", and "Login" properly trigger these logs, which are displayed in the Admin Dashboard's activity feed.

### 2. The "Hybrid" Backend
The application is designed to switch between a **Mock Mode** (Demo) and a **Supabase** backend.
- **Configuration**: Checked via `isSupabaseConfigured` in `/lib/api.ts`.
- **Current State**: Defaults to `mockData.ts` if Supabase keys are missing.
- **Future Work**: To go live, configure `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### 3. AI Intelligence Layer
We utilize Google's Gemini models for the **"Titan Smart-Wizard"** inside `AddProductModal.tsx`.
- **Functions**:
  - `suggestTechnicalSpecs()`: Auto-fills specs based on device name.
  - `generateNarrative()`: Writes marketing copy.
  - `validateMarketPrice()`: Checks entered price against global trends.

### 4. Styling & Aesthetics
- **Philosophy**: "Rich Aesthetics". We prioritize glassmorphism, deep dark modes, and fluid animations.
- **Rules**:
  - Avoid button libraries; use Tailwind utilities for custom controls.
  - Use `backdrop-blur-md` and `bg-opacity` for premium feel.
  - **Nova Orange** (`#FF4F00`) is the primary accent color.

---

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Ensure `.env.local` exists (created automatically or copied from example).
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   GEMINI_API_KEY=...
   ```
   *(Note: App runs in Mock Mode without Supabase keys)*

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

---

## 📝 Contribution Guidelines

1. **New Components**: Place in `components/ui` if generic, or `components/features` if it contains business logic.
2. **Icons**: Always use `lucide-react`.
3. **State**: Prefer Context for global data; local state for UI interactions.
4. **Linting**: Run build verification before committing to ensure no strict type errors remain.
