# Academic Logic & Time Hierarchy

## Overview
Ishuri Hub uses a strict hierarchical structure to organize data across time. This ensures that historical data (e.g., student grades from 2024) remains distinct from current data (e.g., student grades in 2025).

## 1. The Hierarchy
The system is organized as follows:
*   **School** (Root Entity)
    *   **Academic Year** (e.g., "2025")
        *   **Term** (e.g., "Term 1", "Term 2")

## 2. The "Active" Context
To simplify daily operations, the system enforces an **Active State**:
*   **Active Academic Year**: Only one year can be active at a time (e.g., "2025").
*   **Active Term**: Only one term within that active year can be active (e.g., "Term 1").

### How it works:
When a user performs an action (e.g., marking attendance), the system **automatically** tags that record with the currently **Active Term ID**.
*   **Benefit**: Users do not need to manually select the year or term for daily tasks.
*   **Safety**: This prevents accidental data entry into past or future terms.

## 3. Data Association Strategy
Data is linked to this hierarchy based on its lifecycle:

### A. Organizational Data (Linked to Academic Year)
Entities that persist for the duration of a year are linked to `academicYearId`.
*   **Classes**: A class (e.g., "S1 Stream A") is specific to a year.
    *   *Example*: "S1 A (2024)" is a different record from "S1 A (2025)".
*   **Enrollments**: Students are enrolled into these year-specific classes.

### B. Transactional Data (Linked to Term)
High-frequency data is linked to `termId`.
*   **Attendance**: Daily registers are stamped with the active term.
*   **Discipline**: Conduct points are tracked per term.
*   **Grades**: Assessment scores are aggregated by term for report cards.

## 4. Workflows

### Starting a New Year
1.  **Create Year**: Admin creates "2026".
2.  **Set Active**: Admin marks "2026" as active. This deactivates "2025".
3.  **Result**: All new Class creations and Student enrollments will now attach to "2026".

### Changing Terms
1.  **Manage Terms**: Admin opens the active year (e.g., "2026").
2.  **Create/Activate Term**: Admin creates "Term 2" and marks it active.
3.  **Result**: All new Attendance and Discipline records will now attach to "Term 2".
