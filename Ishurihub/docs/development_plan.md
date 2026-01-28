# Ishuri Hub Development Plan: Frontend-First Prototype

## Strategy Overview
**Goal**: Build a high-fidelity, interactive prototype that demonstrates all system features (NFC scanning, Student Management, Attendance, Payments) without waiting for a complex backend.
**Approach**: "Frontend First". We will build the complete UI using **Next.js** and **Tailwind CSS**, using **Mock Data** to simulate database interactions. This allows stakeholders to "use" the system immediately.

## Phase 1: Foundation & Setup (Week 1)
**Objective**: Set up the project structure and design system.
1.  **Initialize Project**:
    -   Setup Next.js 14+ (App Router).
    -   Configure Tailwind CSS with the "Inter" font and project colors (Primary Blue: `#1111d4`).
    -   Setup folder structure for `components`, `app` (pages), `lib` (utils), and `data` (mocks).
2.  **Component Library**:
    -   Create reusable UI components based on existing HTML designs:
        -   `Sidebar` (Admin/Teacher variants).
        -   `TopNavbar` (User profile, Notifications).
        -   `Card` (Dashboard widgets).
        -   `Table` (Student lists, Attendance logs).
        -   `Button`, `Input`, `Badge`.

## Phase 2: Core Admin Modules (Week 2)
**Objective**: Enable student and card management.
1.  **Dashboard**:
    -   Implement the main Admin Dashboard with charts (using `recharts` or similar) and summary stats.
2.  **Student Registry**:
    -   **List View**: Searchable/Filterable table of students.
    -   **Profile View**: Detailed student page.
    -   **Add/Edit Student Form**: Complete form validation (React Hook Form).
3.  **Card Management**:
    -   **Card Issuance Flow**: UI for assigning a new NFC card to a student.
    -   **Status Toggle**: UI to mark cards as Lost/Stolen.

## Phase 3: The "Wow" Features (NFC & Attendance) (Week 3)
**Objective**: Simulate the unique selling points.
1.  **Teacher Attendance Interface**:
    -   **Live Scan Mode**: A fullscreen page that simulates scanning.
    -   **Simulation**: Add a hidden keyboard listener. When a key is pressed (simulating an NFC reader input), trigger a "Success" animation and show a random student's profile from the mock data.
    -   **Manual Entry**: A backup list view for manual attendance marking.
2.  **Library & Finance**:
    -   **Library**: Simple checkout UI.
    -   **Wallet**: Top-up screen simulation.

## Phase 4: Mobile App Prototype (Parallel or Week 4)
**Objective**: Demonstrate the mobile experience.
1.  **Expo (React Native) Setup**: Initialize the mobile project.
2.  **Key Screens**:
    -   Login Screen.
    -   Student ID Card (Digital version).
    -   Parent Dashboard (View attendance/grades).

## Phase 5: Review & Polish
1.  **Interactivity**: Ensure all buttons click, links navigate, and hover states work.
2.  **Demo Script**: Write a script for presenting the prototype to stakeholders, highlighting the "NFC" simulation.

## Technical Recommendation for Prototype
-   **Framework**: Next.js (for easy deployment to Vercel/Netlify).
-   **State**: React Context (to hold "global" state like current user or recent scans during the demo session).
-   **Data**: Static JSON files or a simple in-memory store (Zustand) so changes persist while the tab is open.

## Next Immediate Steps
1.  Initialize the Next.js project in the root directory.
2.  Port the `admin_unified_sidebar` and `student_&_card_management` HTML into React components.
