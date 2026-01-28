# Technology Stack Recommendations for Ishuri Hub

## Context & Requirements
- **Target Audience**: Rwandan Education System (Schools, Teachers, Parents, Students).
- **Key Constraints**: 
    - Potential for intermittent internet connectivity.
    - Varying levels of device access (Feature phones vs Smartphones).
    - Need for robust, real-time data synchronization.
- **Critical Feature**: **NFC Card Integration** for attendance, payments, and identification.

## Recommended Stack

### 1. Frontend (Web & Mobile)
**Framework**: **Next.js (React)**
- **Why**: Excellent performance, SEO capabilities, and a rich ecosystem. It supports Server-Side Rendering (SSR) for fast initial loads and Static Site Generation (SSG) for informational pages.
- **Styling**: **Tailwind CSS** (Already in use in prototypes). It's highly efficient and customizable.
- **State Management**: **TanStack Query (React Query)** for managing server state and caching, which is crucial for handling spotty connections.

**Mobile Strategy**: **React Native (Expo)**
- **Why**: Allows sharing code/logic with the web frontend. Critical for building a native Android app which is the most reliable way to read NFC cards on mobile devices.

### 2. Backend (API & Logic)
**Runtime**: **Node.js** with **NestJS**
- **Why**: NestJS provides a structured, scalable architecture (similar to Angular) which is great for large enterprise apps like this. It has excellent support for WebSockets (for real-time scan updates) and integrates well with TypeScript.
- **Alternative**: **Python (Django/FastAPI)** if data science/analytics features are a priority later.

### 3. Database
**Primary DB**: **PostgreSQL**
- **Why**: Reliable, open-source relational database. Essential for maintaining structured relationships between Students, Cards, Classes, and Financial Transactions.
- **ORM**: **Prisma** (with Node.js) for type-safe database access.

### 4. NFC Integration Strategy (The Critical Piece)
Given the Rwandan context, you need a hybrid approach:

**A. Classroom/Entry Scanning (High Volume)**
- **Hardware**: Android Tablets/Phones with NFC support running the **Ishuri Hub Mobile App**.
- **Tech**: React Native `react-native-nfc-manager`.
- **Flow**: Teacher/Guard scans card -> App caches data locally (if offline) -> Syncs to backend when online.

**B. Admin/Library Stations (Desktop)**
- **Hardware**: USB NFC Readers (e.g., ACR122U) connected to PC/Laptop.
- **Tech**: WebUSB API (limited) or more reliably, a **Keyboard Wedge** approach (Reader acts as a keyboard, typing the UID into a hidden input field) or a small local background service (Node.js) that talks to the reader and sends data to the web app via WebSocket.

### 5. Offline & Connectivity (Rwandan Context)
- **PWA (Progressive Web App)**: Make the web portal installable and capable of loading basic interfaces offline.
- **Local-First Sync**: Use **RxDB** or **WatermelonDB** on the mobile app to ensure attendance can be taken even without internet, syncing automatically when connection is restored.

### 6. Payments & Notifications
- **Payments**: Integration with **Mobile Money (MTN MoMo, Airtel Money)** is mandatory.
    - **Gateway**: Use aggregators like **Paypack** or **Flutterwave** for easier integration.
- **Notifications**: **SMS** is king for reaching all parents.
    - **Provider**: Integration with local SMS gateways (e.g., **Pindo**, **Hubtel**) to send attendance alerts and fee reminders to feature phones.

## Summary Architecture Diagram
```mermaid
graph TD
    User[User with NFC Card] -->|Scans| MobileApp[Mobile App (Android/NFC)]
    User -->|Scans| USBReader[USB Reader (Desktop)]
    USBReader --> WebApp[Web Portal (Next.js)]
    MobileApp -->|Syncs| API[Backend API (NestJS)]
    WebApp -->|HTTPS| API
    API --> DB[(PostgreSQL)]
    API -->|API| MoMo[Mobile Money Gateway]
    API -->|API| SMS[SMS Gateway]
```
