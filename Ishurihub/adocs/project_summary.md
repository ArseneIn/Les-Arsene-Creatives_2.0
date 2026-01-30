# Ishuri Hub Project Summary

## Project Overview
Ishuri Hub is a comprehensive School Management System designed to digitize and streamline various educational and administrative processes. A core feature of the system is the integration of **NFC (Near Field Communication) cards**, which serve as a primary method for student identification, attendance tracking, and potentially cashless payments within the school ecosystem.

The existing prototypes indicate a modern, user-friendly interface built with web technologies (HTML/Tailwind CSS), catering to multiple user roles including Administrators, Teachers, Parents, Librarians, and Security personnel.

## Interface Analysis
The project is structured into several distinct portals and modules, each serving a specific function:

### 1. Administration & Management
- **`admin_unified_sidebar`**: The central navigation hub for school administrators, providing access to all administrative modules.
- **`student_&_card_management`**: A critical module for registering students and managing their NFC cards. Features include:
    - Listing students with their Card UIDs.
    - Monitoring card status (Active, Pending, Inactive/Lost).
    - Issuing new cards.
- **`timetable_builder_admin`**: Tools for creating and managing class schedules and timetables.
- **`security_&_compliance_panel`**: Likely a dashboard for monitoring school security, possibly tracking entry/exit logs via NFC scans.

### 2. Attendance System
- **`teacher_attendance_live_scan_v2`**: A real-time interface designed for the classroom or entry points.
    - Visual feedback for card scans (Student photo, Name, Status).
    - "Verified Present" confirmation.
    - History of recent scans.
- **`teacher_attendance_dashboard_v1`**: Analytics and reports on student attendance for teachers.
- **`attendance_history_&_setup_v3`**: Historical data view and configuration settings for attendance rules.

### 3. Finance & Payments
- **`finance_&_wallet_dashboard`**: A financial overview for the school, likely tracking fee payments and wallet balances.
- **`parent_wallet_&_top_up_screen`**: An interface for parents to load funds onto their child's NFC card (e.g., for canteen or library fines).

### 4. Library Management
- **`library_circulation_desk`**: Interface for librarians to check books in and out, likely using the student's NFC card for identification.
- **`library_inventory_manager`**: Tools for managing the book catalog and stock levels.

### 5. Portals (User Specific)
- **`parent_portal_dashboard`**: A dedicated view for parents to monitor their child's academic progress, attendance, and financial status.
- **`student_profile_&_tracker_view`**: A detailed view of an individual student's performance, behavior, and history.
- **`teacher_assignment_manager`**: Tools for teachers to assign homework, projects, and grade submissions.
- **`teacher_unified_sidebar`**: Navigation menu tailored for teacher access.

## Key Observations
- **NFC Centric**: The system relies heavily on physical cards for identity and interaction (attendance, library, payments).
- **Modern UI**: The designs use a clean, "Inter" font-based aesthetic with Tailwind CSS, supporting both Light and Dark modes.
- **Role-Based Access**: Clear separation of concerns between Admin, Teacher, Parent, and specialized roles (Library, Finance).
