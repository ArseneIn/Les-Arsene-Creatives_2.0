# Ishuri Hub Development Plan: Multi-Tenant Prototype

## Strategy Overview
**Goal**: Build a high-fidelity, interactive prototype that demonstrates a **Multi-Tenant System**.
**Roles**:
1.  **Super Admin (Les Arsene Creatives)**: Manages Institutions (Schools).
2.  **School Admin**: Manages their specific school (Students, Cards, Attendance).

## Phase 1: Foundation & Setup (Completed)
-   [x] Next.js 14+ Setup.
-   [x] Tailwind CSS & Design System.
-   [x] Basic Components (Sidebar, Layout).

## Phase 2: School Admin Features (Completed)
-   [x] School Dashboard.
-   [x] Student Registry (List & Add).
-   [x] Attendance Simulation (NFC).

## Phase 3: Super Admin Architecture (New Focus)
**Objective**: Implement the "Platform Owner" view.
1.  **Restructure Routes**:
    -   Move existing school pages to `/school/[id]/...` or a generic `/demo-school/...` route.
    -   Create `/` (Root) as the **Super Admin Dashboard**.
2.  **Super Admin Features**:
    -   **Institutions List**: View all registered schools.
    -   **Onboarding**: "Add New School" form.
    -   **Global Stats**: Total schools, active students system-wide.
3.  **Navigation Flow**:
    -   Login -> Super Admin Dashboard.
    -   Click "View Dashboard" on a School -> Enter School Admin Context.

## Phase 4: Mobile App Prototype (Future)
-   Expo (React Native) setup for the scanning app.

## Technical Recommendation
-   **Route Groups**:
    -   `(super-admin)`: Layout for platform management.
    -   `(school-admin)`: Layout for the school-specific view (existing sidebar).
-   **Mock Data**:
    -   `institutions.ts`: List of schools.

## Phase 5: Academic Logic Implementation (In Progress)
-   [x] **Academic Years & Terms**: Hierarchy setup (Year -> Term) and "Active" state logic.
-   [x] **Class Management**: Refactored to link classes to Academic Years.
-   [ ] **Attendance Refactor**: Moving from simple "present" to "Term-based, Class-based" registers.
-   [ ] **Report Cards**: Term-based assessment generation.
