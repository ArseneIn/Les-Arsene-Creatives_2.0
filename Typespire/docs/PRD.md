# Product Requirements Document (PRD)
**Project Name:** Typespire (Multi-Tenant Typing Progress Tracker)
**Version:** 1.2
**Status:** Draft
**Last Updated:** 2026-01-12

---

## Document Control
| Version | Date | Author | Description of Changes |
| :--- | :--- | :--- | :--- |
| 1.0 | 2026-01-12 | [Original Author] | Initial Draft |
| 1.1 | 2026-01-12 | Antigravity | Refined structure, added functional details and non-functional requirements |
| 1.2 | 2026-01-12 | Antigravity | Updated scope for Multi-tenancy (SaaS model) |

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for "Typespire," a multi-tenant SaaS platform designed to manage and evaluate student typing performance. The system allows academic institutions (e.g., Kepler College) to sign up, manage their own cohorts, and track student progress independently.

### 1.2 Scope
The system will be a **Desktop Web Application** serving multiple institutions.
- **Platform Scope:** Manages institution onboarding, global billing (future), and system health.
- **Institution Scope:** Each institution manages its own Students, Facilitators, Intakes, and Testing Data in an isolated environment.

### 1.3 Definitions
- **Tenant/Institution:** A client organization (e.g., a specific university or school) using the platform.
- **WPM:** Words Per Minute.
- **Intake:** A cohort of students within a specific institution.
- **Section:** A subdivision of an Intake.
- **Trial:** A single attempt at a typing test.

---

## 2. Product Overview

### 2.1 Vision
To create a scalable, multi-tenant typing assessment platform where any educational institution can standardize their typing curriculum, automate grading, and visualize student growth without building their own infrastructure.

### 2.2 High-Level Goals
1.  **Scalability:** Support multiple institutions simultaneously with strict data isolation.
2.  **Standardization:** Provide a consistent testing framework (e.g., 50 WPM benchmark) configurable by institution.
3.  **Efficiency:** Automate administrative tasks for facilitators across all tenant organizations.

### 2.3 Success Metrics
- **Onboarding:** New institutions can be provisioned by a Platform Admin in under 10 minutes.
- **Isolation:** Zero data leakage between institutions.
- **Adoption:** 100% of students in an onboarded intake have their data centralized.

---

## 3. User Personas

### 3.1 Platform Administrator (Super Admin)
- **Role:** SaaS Owner / Technical Support.
- **Goals:** Onboard new institutions, monitor global system health.
- **Needs:** Dashboard to view all registered institutions, tools to suspend/activate tenants.

### 3.2 Institution Administrator
- **Role:** School Manager / Head of Department (e.g., at Kepler College).
- **Goals:** Configure school settings, manage staff accounts, oversee all intakes.
- **Needs:** Ability to customize grading benchmarks (optional), manage facilitator access.

### 3.3 Facilitator (Instructor)
- **Role:** Teacher within a specific Institution.
- **Goals:** Monitor student progress, manage class sections, administer tests.
- **Needs:** Tools to publish tests, view reports for their assigned sections.

### 3.4 Student
- **Role:** Learner within a specific Institution.
- **Goals:** Improve typing speed, pass assessments.
- **Needs:** Access to tests, personal progress dashboard.

---

## 4. Functional Requirements

### 4.1 Multi-Tenancy & Institution Management
- **FR-00 Institution Onboarding:** Platform Admins can create new Institution profiles (Name, Domain/Slug, Contact Info).
- **FR-01 Data Isolation:** All student data, staff accounts, and test records must be logically separated by `InstitutionID`. Users from Institution A cannot see data from Institution B.
- **FR-02 Custom Branding (Future):** Ability for institutions to upload their own logo (optional).

### 4.2 Authentication & User Management
- **FR-03 Context-Aware Login:** Users log in to a specific institution context (e.g., via `school-name.typespire.com` or selecting their school at login).
- **FR-04 Student Login:** Students access via unique StudentID (scoped to their institution).
- **FR-05 Staff Login:** Facilitators and Institution Admins log in with email/password.
- **FR-06 Role-Based Access Control (RBAC):**
    - **Platform Level:** Platform Admin.
    - **Institution Level:** Institution Admin, Facilitator, Student.

### 4.3 Academic Structure Management (Per Institution)
- **FR-07 Intake Management:** Institution Admins/Facilitators can create Intakes (e.g., "Jan 2025").
- **FR-08 Section Management:** Intakes can be divided into Sections.
- **FR-09 Student Mobility:** Students can be moved between sections within the same institution without data loss.

### 4.4 Testing Module
- **FR-10 Supervised Sessions:** Tests are hidden by default. A facilitator must "Publish" a test for their institution's students.
- **FR-11 1-Minute Test Interface:** Standardized typing interface.
- **FR-12 Trial Management:** Default limits (e.g., 2 trials) configurable per test by the facilitator.
- **FR-13 "Home Row" Grace Period:** Early data flagged as "Familiarization".

### 4.5 Progress Evaluation & Grading
- **FR-14 Automatic Grading:** WPM and Accuracy calculated immediately.
- **FR-15 Proficiency Levels:** Default benchmarks (50 WPM) defined globally but can be overridden by Institution Admins if needed (future scope).
- **FR-16 Pass/Fail Logic:** Automatic flagging based on benchmarks.

### 4.6 Dashboards & Reporting
- **FR-17 Institution Overview:** Admin view of all intakes and overall performance.
- **FR-18 Facilitator Snapshot:** Section-level progress reports.
- **FR-19 Student Tracker:** Individual progress history and charts.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Scalability:** Architecture must support horizontal scaling to handle new institutions.
- **Concurrency:** Support simultaneous testing peaks across multiple time zones.

### 5.2 Reliability
- **Data Persistence:** Immediate write consistency for test results.
- **Backups:** Automated backups with point-in-time recovery, tagged by institution.

### 5.3 Security
- **Tenant Isolation:** Strict database-level or application-level filtering to prevent cross-tenant data access.
- **Privacy:** Compliance with data protection standards (relevant to the regions of client institutions).

---

## 6. UI/UX Guidelines

### 6.1 Brand Colors (Default)
- **Primary Navy Blue:** `#134E6F`
- **Emerald Green:** `#3BB46D`
- **Golden Yellow:** `#FFC107`
*Note: Future versions may allow institutions to override these.*

### 6.2 Design Principles
- **Clean & Professional:** Suitable for academic environments.
- **Responsive:** Desktop-first for testing, mobile-friendly for viewing reports.

---

## 7. Technical Architecture (Proposed)

### 7.1 Stack
- **Frontend:** React.js.
- **Backend:** Python (Django) or Node.js.
- **Database:** PostgreSQL.

### 7.2 Multi-Tenancy Strategy
- **Logical Separation:** Single database with `institution_id` column on all major tables (Users, Intakes, Trials).
- **Middleware:** Application middleware to enforce tenant scoping on every request.

### 7.3 Deployment
- **Cloud:** AWS/GCP/Azure.
- **CI/CD:** Automated pipelines for testing and deployment.

---

## 8. Future Scope
- **Billing & Subscriptions:** Automated invoicing for institutions.
- **LMS Integration:** LTI support for Canvas/Moodle/Blackboard.
- **Custom Subdomains:** `school.typespire.com`.